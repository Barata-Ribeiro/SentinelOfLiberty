package com.barataribeiro.sentinelofliberty.dtos.notification;

import com.barataribeiro.sentinelofliberty.dtos.user.AuthorDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Notification;
import com.barataribeiro.sentinelofliberty.models.enums.NotificationType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link Notification}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationDTO implements Serializable {
    Long id;
    String title;
    String message;
    NotificationType type;
    AuthorDTO recipient;
    Boolean isRead;
    Instant createdAt;
    Instant updatedAt;
}