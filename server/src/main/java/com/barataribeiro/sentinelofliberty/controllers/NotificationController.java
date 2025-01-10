package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.NotificationDTO;
import com.barataribeiro.sentinelofliberty.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    @Operation(summary = "Get all notifications paginated",
               description = "This endpoint allows an authenticated user to get all notifications sent to them " +
                       "paginated.")
    @GetMapping
    public ResponseEntity<ApplicationResponseDTO<Page<NotificationDTO>>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            Authentication authentication) {
        Page<NotificationDTO> response = notificationService
                .getAllOwnNotifications(page, perPage, direction, orderBy, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved all notifications",
                                                              response));
    }

    @Operation(summary = "Change the notification status",
               description = "This endpoint allows an authenticated user to change the status of a notification.")
    @PatchMapping("/{notifId}/status")
    public ResponseEntity<ApplicationResponseDTO<NotificationDTO>> changeNotificationStatus(
            @PathVariable Long notifId,
            @RequestParam Boolean isRead,
            Authentication authentication) {
        NotificationDTO response = notificationService.changeNotificationStatus(notifId, isRead, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully changed the notification status",
                                                              response));
    }
}
