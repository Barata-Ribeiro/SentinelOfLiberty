package com.barataribeiro.sentinelofliberty.dtos.notification;

import com.barataribeiro.sentinelofliberty.models.entities.Notification;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for {@link Notification}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LatestNotificationWithCountDTO {
    private List<NotificationDTO> latestNotifications;
    private Long totalCount;
    private Long totalRead;
    private Long totalUnread;
}
