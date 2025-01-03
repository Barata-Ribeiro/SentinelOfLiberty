package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.UserMapper;
import com.barataribeiro.sentinelofliberty.dtos.user.ProfileUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserAccountDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.UserService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String username) {
        return userMapper.toUserProfileDTO(
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()))
        );
    }

    @Override
    @Transactional
    public UserProfileDTO updateUserProfile(@NotNull ProfileUpdateRequestDTO body,
                                            @NotNull Authentication authentication) {
        User userToUpdate = userRepository.findByUsername(authentication.getName())
                                          .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        verifyIfRequestingUserIsAuthorizedToUpdateAccount(body, userToUpdate);

        verifyIfBodyExistsThenUpdateProperties(body, userToUpdate);

        return userMapper.toUserProfileDTO(userRepository.saveAndFlush(userToUpdate));
    }

    @Override
    @Transactional(readOnly = true)
    public UserAccountDTO getOwnProfile(@NotNull Authentication authentication) {
        return userMapper.toUserAccountDTO(
                userRepository.findByUsername(authentication.getName())
                              .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()))
        );
    }

    @Override
    @Transactional
    public void deleteUserProfile(@NotNull Authentication authentication) {
        long wasDeleted = userRepository.deleteByUsername(authentication.getName());

        if (wasDeleted == 0) {
            throw new IllegalRequestException("Account deletion failed; Account not found or not authorized.");
        }
    }

    @Override
    @Transactional
    public UserProfileDTO adminUpdateAnUser(String username, @NotNull ProfileUpdateRequestDTO body,
                                            @NotNull Authentication authentication) {
        User userToUpdate = userRepository.findByUsername(username)
                                          .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        User admin = userRepository.findByUsername(authentication.getName())
                                   .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        if (!passwordEncoder.matches(body.getCurrentPassword(), admin.getPassword())) {
            throw new InvalidCredentialsException("Authorization failed; Wrong credentials.");
        }

        if (body.getNewPassword() != null) {
            throw new IllegalRequestException("Admins cannot change user passwords.");
        }

        verifyIfBodyExistsThenUpdateProperties(body, userToUpdate);

        return userMapper.toUserProfileDTO(userRepository.saveAndFlush(userToUpdate));
    }

    @Override
    @Transactional
    public UserProfileDTO adminBanOrUnbanAnUser(String username, @NotNull String action) {
        User userToUpdate = userRepository.findByUsername(username)
                                          .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Roles newRole = action.equalsIgnoreCase("ban") ? Roles.BANNED : Roles.USER;
        userToUpdate.setRole(newRole);

        return userMapper.toUserProfileDTO(userRepository.saveAndFlush(userToUpdate));
    }

    @Override
    @Transactional
    public void adminDeleteAnUser(@NotNull String username, @NotNull Authentication authentication) {
        if (username.equals(authentication.getName())) {
            throw new IllegalRequestException("Admins cannot delete their own accounts through this resource.");
        }

        long wasDeleted = userRepository.deleteByUsername(username);

        if (wasDeleted == 0) {
            throw new IllegalRequestException("Account deletion failed; Account not found or something went wrong.");
        }
    }

    private void verifyIfRequestingUserIsAuthorizedToUpdateAccount(@NotNull ProfileUpdateRequestDTO body,
                                                                   @NotNull User userToUpdate) {
        boolean passwordMatches = passwordEncoder.matches(body.getCurrentPassword(), userToUpdate.getPassword());
        boolean userBannedOrNone =
                userToUpdate.getRole().equals(Roles.BANNED) || userToUpdate.getRole().equals(Roles.NONE);

        if (!passwordMatches && userBannedOrNone) {
            throw new InvalidCredentialsException("Authorization failed; Wrong credentials or account has a problem.");
        }
    }

    private void verifyIfBodyExistsThenUpdateProperties(@NotNull ProfileUpdateRequestDTO body,
                                                        @NotNull User userToUpdate) {
        Optional.ofNullable(body.getUsername()).ifPresent(s -> {
            if (s.equals(userToUpdate.getUsername())) {
                throw new IllegalRequestException("Account already uses this username.");
            }

            if (userRepository.existsByUsernameOrEmailAllIgnoreCase(s, null)) {
                throw new IllegalRequestException("Username already in use.");
            }

            userToUpdate.setUsername(s);
        });

        Optional.ofNullable(body.getEmail()).ifPresent(s -> {
            if (s.equals(userToUpdate.getEmail())) {
                throw new IllegalRequestException("Account already uses this email.");
            }

            if (userRepository.existsByUsernameOrEmailAllIgnoreCase(null, s)) {
                throw new IllegalRequestException("Email already in use.");
            }

            userToUpdate.setEmail(s);
        });

        Optional.ofNullable(body.getDisplayName()).ifPresent(userToUpdate::setDisplayName);
        Optional.ofNullable(body.getFullName()).ifPresent(userToUpdate::setFullName);
        Optional.ofNullable(body.getAvatarUrl()).ifPresent(userToUpdate::setAvatarUrl);
        Optional.ofNullable(body.getBiography()).ifPresent(userToUpdate::setBiography);
        Optional.ofNullable(body.getLocation()).ifPresent(userToUpdate::setLocation);
        Optional.ofNullable(body.getWebsite()).ifPresent(userToUpdate::setWebsite);
        Optional.ofNullable(body.getNewPassword()).ifPresent(s -> userToUpdate.setPassword(passwordEncoder.encode(s)));
    }
}
