package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.user.ProfileUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import org.springframework.security.core.Authentication;

public interface UserService {
    UserProfileDTO getUserProfile(String username);

    UserProfileDTO updateUserProfile(ProfileUpdateRequestDTO body, Authentication authentication);

    void deleteUserProfile(Authentication authentication);
}
