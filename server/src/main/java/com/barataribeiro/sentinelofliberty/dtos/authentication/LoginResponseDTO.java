package com.barataribeiro.sentinelofliberty.dtos.authentication;

import com.barataribeiro.sentinelofliberty.dtos.user.UserSecurityDTO;
import jakarta.annotation.Nullable;

import java.io.Serializable;
import java.time.Instant;

public record LoginResponseDTO(UserSecurityDTO user,
                               String accessToken,
                               Instant accessTokenExpiresAt,
                               @Nullable String refreshToken,
                               @Nullable Instant refreshTokenExpiresAt) implements Serializable {}
