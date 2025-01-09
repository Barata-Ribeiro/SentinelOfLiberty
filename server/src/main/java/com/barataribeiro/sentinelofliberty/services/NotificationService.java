package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.models.entities.NotificationDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface NotificationService {
    void sendNotificationThroughWebsocket(String username, NotificationDTO notification);

    List<NotificationDTO> getLatestNotification(Authentication authentication);
}
