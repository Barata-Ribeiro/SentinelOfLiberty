package com.barataribeiro.sentinelofliberty.services.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.barataribeiro.sentinelofliberty.models.entities.User;

import java.time.Instant;
import java.util.Map;

public interface TokenService {
    Map.Entry<String, Instant> generateAccessToken(User user);

    Map.Entry<String, Instant> generateRefreshToken(User user, Boolean rememberMe);

    DecodedJWT validateToken(String token);
}
