package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.user.DashboardDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.ProfileUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserAccountDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import org.springframework.security.core.Authentication;

public interface UserService {
    UserProfileDTO getUserProfile(String username);

    UserProfileDTO updateUserProfile(ProfileUpdateRequestDTO body, Authentication authentication);

    UserAccountDTO getOwnProfile(Authentication authentication);

    DashboardDTO getOwnDashboardInformation(Authentication authentication);

    void deleteUserProfile(Authentication authentication);

    UserProfileDTO adminUpdateAnUser(String username, ProfileUpdateRequestDTO body, Authentication authentication);

    UserProfileDTO adminBanOrUnbanAnUser(String username, String action);

    UserProfileDTO adminToggleUserVerification(String username, Authentication authentication);

    void adminDeleteAnUser(String username, Authentication authentication);
}
