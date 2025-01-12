package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.notification.NotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface NotificationService {
    void sendNotificationThroughWebsocket(String username, NotificationDTO notification);

    List<NotificationDTO> getLatestNotification(Authentication authentication);

    Page<NotificationDTO> getAllOwnNotifications(int page, int perPage, String direction, String orderBy,
                                                 Authentication authentication);

    NotificationDTO changeNotificationStatus(Long notifId, Boolean isRead, Authentication authentication);

    List<NotificationDTO> changeNotificationStatusInBulk(List<Long> ids, Boolean isRead, Authentication authentication);

    void deleteNotification(Long notifId, Authentication authentication);
}
