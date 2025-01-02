package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.ProfileUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import com.barataribeiro.sentinelofliberty.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Admin", description = "Admin endpoints")
public class AdminController {
    private final UserService userService;

    @Operation(summary = "Update a user",
               description = "This endpoint allows an admin to update an user's information.")
    @PatchMapping("/users/{username}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<UserProfileDTO>> adminUpdateAnUser(@PathVariable String username,
                                                                                    @RequestBody @Valid
                                                                                    ProfileUpdateRequestDTO body,
                                                                                    Authentication authentication) {
        UserProfileDTO response = userService.adminUpdateAnUser(username, body, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully updated the user", response));
    }

    @Operation(summary = "Ban or Unban an user",
               description = "This endpoint allows an admin to ban or unban an user.")
    @PatchMapping("/users/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<UserProfileDTO>> adminBanOrUnbanAnUser(
            @PathVariable String username,
            @RequestParam(required = true, defaultValue = "ban") String action,
            Authentication authentication) {
        UserProfileDTO response = userService.adminBanOrUnbanAnUser(username, action, authentication);
        String messageAction = action.equals("ban") ? "banned" : "unbanned";
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully " + messageAction + " the user",
                                                              response));
    }
}
