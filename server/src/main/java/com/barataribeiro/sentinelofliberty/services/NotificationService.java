package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.models.entities.NotificationDTO;

public interface NotificationService {
    void sendNotificationThroughWebsocket(String username, NotificationDTO notification);
}
