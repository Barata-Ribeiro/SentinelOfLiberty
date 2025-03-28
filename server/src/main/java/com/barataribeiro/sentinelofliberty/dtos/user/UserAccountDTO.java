package com.barataribeiro.sentinelofliberty.dtos.user;

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
 * DTO for {@link com.barataribeiro.sentinelofliberty.models.entities.User}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserAccountDTO implements Serializable {
    private UUID id;
    private String username;
    private String email;
    private Roles role;
    private String displayName;
    private String fullName;
    private String avatarUrl;
    private String biography;
    private LocalDate birthDate;
    private String location;
    private String website;
    private String socialMedia;
    private String videoChannel;
    private String streamingChannel;
    private Boolean isPrivate;
    private Boolean isVerified;
    private Long commentsCount;
    private Long articlesCount;
    private Long readNotificationsCount;
    private Long unreadNotificationsCount;
    private Instant createdAt;
    private Instant updatedAt;
}