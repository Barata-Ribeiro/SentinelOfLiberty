package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.models.entities.NotificationDTO;
import com.barataribeiro.sentinelofliberty.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Notification", description = "Notification endpoints")
public class NotificationController {
    private final NotificationService notificationService;

    @Operation(summary = "Get the latest notification",
               description = "This endpoint allows an authenticated user to get the latest notifications sent to them.")
    @GetMapping("/latest")
    public ResponseEntity<ApplicationResponseDTO<List<NotificationDTO>>> getLatestNotification(
            Authentication authentication) {
        List<NotificationDTO> response = notificationService.getLatestNotification(authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved the latest notification",
                                                              response));
    }
}
