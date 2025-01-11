package com.barataribeiro.sentinelofliberty.dtos.user;

import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO for {@link User}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserProfileDTO implements Serializable {
    UUID id;
    String username;
    String email;
    Roles role;
    String displayName;
    String fullName;
    String avatarUrl;
    String biography;
    LocalDate birthDate;
    String location;
    String website;
    Boolean isPrivate;
    Boolean isVerified;
    Instant createdAt;
    Instant updatedAt;
    private String socialMedia;
    private String videoChannel;
    private String streamingChannel;
}