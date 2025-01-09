package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.models.entities.NotificationDTO;
import com.barataribeiro.sentinelofliberty.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendNotificationThroughWebsocket(String username, NotificationDTO notification) {
        log.atInfo().log("Sending WS notification to user {}, with payload {}", username, notification);
        messagingTemplate.convertAndSendToUser(username, "/notifications", notification);
    }
}
