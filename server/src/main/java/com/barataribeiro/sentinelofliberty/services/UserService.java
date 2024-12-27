package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;

public interface UserService {
    UserProfileDTO getUserProfile(String username);
}
