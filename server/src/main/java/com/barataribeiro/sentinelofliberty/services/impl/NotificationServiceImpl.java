package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.NotificationMapper;
import com.barataribeiro.sentinelofliberty.dtos.NotificationDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Notification;
import com.barataribeiro.sentinelofliberty.repositories.NotificationRepository;
import com.barataribeiro.sentinelofliberty.services.NotificationService;
import com.barataribeiro.sentinelofliberty.utils.ApplicationConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public void sendNotificationThroughWebsocket(String username, NotificationDTO notification) {
        log.atInfo().log("Sending WS notification to user {}, with payload {}", username, notification);
        messagingTemplate.convertAndSendToUser(username, "/notifications", notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getLatestNotification(@NotNull Authentication authentication) {
        List<Notification> notifications = notificationRepository
                .findTop5ByRecipient_UsernameOrderByCreatedAtDesc(authentication.getName());
        return notificationMapper.toNotificationDTOList(notifications);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getAllOwnNotifications(int page, int perPage, String direction, String orderBy,
                                                        @NotNull Authentication authentication) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        return notificationRepository
                .findAllByRecipient_Username(authentication.getName(), pageable)
                .map(notificationMapper::toNotificationDTO);
    }


}
