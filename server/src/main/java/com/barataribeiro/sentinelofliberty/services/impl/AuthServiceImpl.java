package com.barataribeiro.sentinelofliberty.services.impl;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.barataribeiro.sentinelofliberty.builders.UserMapper;
import com.barataribeiro.sentinelofliberty.dtos.authentication.LoginRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.authentication.LoginResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.authentication.RegistrationRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserSecurityDTO;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityAlreadyExistsException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.AuthService;
import com.barataribeiro.sentinelofliberty.services.security.impl.TokenServiceImpl;
import lombok.RequiredArgsConstructor;
import org.apache.commons.text.StringEscapeUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenServiceImpl tokenService;
    private final UserMapper userMapper;

    @Override
    public LoginResponseDTO login(@NotNull LoginRequestDTO body) {
        User user = userRepository.findByUsername(body.getUsername())
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        boolean passwordMatches = passwordEncoder.matches(body.getPassword(), user.getPassword());
        boolean userBannedOrNone = user.getRole().equals(Roles.BANNED) || user.getRole().equals(Roles.NONE);

        if (userBannedOrNone) {
            throw new IllegalRequestException("Account is banned or has a problem. Please contact support.");
        }

        if (!passwordMatches) {
            throw new InvalidCredentialsException("Login failed; Wrong username or password.");
        }

        Map.Entry<String, Instant> accessToken = tokenService.generateAccessToken(user);
        Map.Entry<String, Instant> refreshToken = tokenService.generateRefreshToken(user, body.getRememberMe());

        return new LoginResponseDTO(userMapper.toUserSecurityDTO(user), accessToken.getKey(), accessToken.getValue(),
                                    refreshToken.getKey(), refreshToken.getValue());
    }

    @Override
    @Transactional
    public UserSecurityDTO register(@NotNull RegistrationRequestDTO body) {
        String username = StringEscapeUtils.escapeHtml4(body.getUsername().toLowerCase().strip());
        String displayName = StringEscapeUtils.escapeHtml4(body.getDisplayName().strip());
        String email = StringEscapeUtils.escapeHtml4(body.getEmail().strip());

        if (userRepository.existsByUsernameOrEmailAllIgnoreCase(username, email)) {
            throw new EntityAlreadyExistsException(User.class.getSimpleName());
        }

        User user = User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode(body.getPassword()))
                        .displayName(displayName)
                        .build();

        return userMapper.toUserSecurityDTO(userRepository.saveAndFlush(user));
    }

    @Override
    @Transactional
    public LoginResponseDTO refreshToken(String refreshToken) {
        DecodedJWT decodedJWT = tokenService.validateToken(refreshToken);

        if (decodedJWT == null) {
            throw new InvalidCredentialsException("The token provided is invalid.");
        }

        String username = decodedJWT.getSubject();
        User user = userRepository.findByUsername(username)
                                  .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Map.Entry<String, Instant> accessTokenEntry = tokenService.generateAccessToken(user);

        return new LoginResponseDTO(userMapper.toUserSecurityDTO(user), accessTokenEntry.getKey(),
                                    accessTokenEntry.getValue(), null, null);
    }
}
