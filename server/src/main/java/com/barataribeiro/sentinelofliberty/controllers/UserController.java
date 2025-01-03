package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.ProfileUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserAccountDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import com.barataribeiro.sentinelofliberty.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "User", description = "User endpoints", extensions = {})
public class UserController {
    private final UserService userService;

    @Operation(summary = "Get user profile",
               description = "This endpoint allows an user to retrieve the profile of any user by providing their " +
                       "username.")
    @GetMapping("/public/profile/{username}")
    public ResponseEntity<ApplicationResponseDTO<UserProfileDTO>> getUserProfile(@PathVariable String username) {
        UserProfileDTO response = userService.getUserProfile(username);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "User profile retrieved successfully", response));
    }

    @Operation(summary = "Get own profile",
               description = "This endpoint allows an user to retrieve their own profile, along with other " +
                       "information such as statistics")
    @GetMapping("/me")
    public ResponseEntity<ApplicationResponseDTO<UserAccountDTO>> getOwnProfile(Authentication authentication) {
        UserAccountDTO response = userService.getOwnProfile(authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "Account info retrieved successfully", response));
    }

    @Operation(summary = "Update own account",
               description = "This endpoint allows an user to update their own profile.")
    @PatchMapping("/me")
    public ResponseEntity<ApplicationResponseDTO<UserProfileDTO>> updateUserProfile(
            @RequestBody @Valid ProfileUpdateRequestDTO body,
            Authentication authentication) {
        UserProfileDTO response = userService.updateUserProfile(body, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "User profile updated successfully", response));
    }

    @Operation(summary = "Delete own account",
               description = "This endpoint allows an user to delete their own account.")
    @DeleteMapping("/me")
    public ResponseEntity<ApplicationResponseDTO<Void>> deleteUserProfile(Authentication authentication) {
        userService.deleteUserProfile(authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "User profile deleted successfully", null));
    }
}
