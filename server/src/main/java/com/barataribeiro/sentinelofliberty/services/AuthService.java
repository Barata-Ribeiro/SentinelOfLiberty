package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.authentication.LoginRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.authentication.LoginResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.authentication.RegistrationRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserSecurityDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO body);

    UserSecurityDTO register(RegistrationRequestDTO body);
}
