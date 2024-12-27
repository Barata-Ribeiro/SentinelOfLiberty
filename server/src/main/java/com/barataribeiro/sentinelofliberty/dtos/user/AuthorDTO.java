package com.barataribeiro.sentinelofliberty.dtos.user;

import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link User}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AuthorDTO implements Serializable {
    UUID id;
    String username;
    String email;
    String displayName;
    String avatarUrl;
    boolean isPrivate = false;
    boolean isVerified = false;
}