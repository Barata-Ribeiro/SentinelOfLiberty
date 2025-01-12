package com.barataribeiro.sentinelofliberty.builders;

import com.barataribeiro.sentinelofliberty.dtos.notification.NotificationDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Notification;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NotificationMapper {
    private final ModelMapper modelMapper;

    public NotificationDTO toNotificationDTO(Notification notification) {
        return modelMapper.map(notification, NotificationDTO.class);
    }

    public List<NotificationDTO> toNotificationDTOList(@NotNull List<Notification> notifications) {
        return notifications.parallelStream().map(this::toNotificationDTO).toList();
    }
}
