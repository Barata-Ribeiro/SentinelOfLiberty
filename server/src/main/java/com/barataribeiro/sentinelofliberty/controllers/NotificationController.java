package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.notification.NotificationDTO;
import com.barataribeiro.sentinelofliberty.dtos.notification.NotificationUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
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

    @Operation(summary = "Change the notification status in bulk",
               description = "This endpoint allows an authenticated user to change the status of multiple " +
                       "notifications.")
    @PatchMapping("/status")
    public ResponseEntity<ApplicationResponseDTO<List<NotificationDTO>>> changeNotificationStatusInBulk(
            @RequestBody NotificationUpdateRequestDTO body,
            @RequestParam Boolean isRead,
            Authentication authentication) {
        log.atInfo().log("Changing the status of multiple notifications");
        log.atInfo().log("Request body: {}", body);
        List<NotificationDTO> response = notificationService
                .changeNotificationStatusInBulk(body, isRead, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully changed the notification status",
                                                              response));
    }

    @Operation(summary = "Delete a notification",
               description = "This endpoint allows an authenticated user to delete a notification.")
    @DeleteMapping("/{notifId}")
    public ResponseEntity<ApplicationResponseDTO<Void>> deleteNotification(
            @PathVariable Long notifId,
            Authentication authentication) {
        notificationService.deleteNotification(notifId, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new ApplicationResponseDTO<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                                "You have successfully deleted the notification",
                                                                null));
    }

    @Operation(summary = "Delete a notification in bulk",
               description = "This endpoint allows an authenticated user to delete multiple notifications.")
    @DeleteMapping
    public ResponseEntity<ApplicationResponseDTO<Void>> deleteNotificationInBulk(@RequestParam List<Long> ids,
                                                                                 Authentication authentication) {
        notificationService.deleteNotificationInBulk(ids, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new ApplicationResponseDTO<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                                "You have successfully deleted the notifications",
                                                                null));
    }
}
