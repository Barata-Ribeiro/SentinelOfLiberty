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
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private AuthorDTO recipient;
    private Boolean isRead;
    private Instant createdAt;
    private Instant updatedAt;
}