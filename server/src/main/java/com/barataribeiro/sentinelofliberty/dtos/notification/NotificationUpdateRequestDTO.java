package com.barataribeiro.sentinelofliberty.dtos.notification;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationUpdateRequestDTO {
    @NotNull
    private List<Long> notificationIds;
}
