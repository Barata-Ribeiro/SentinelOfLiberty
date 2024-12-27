package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import com.barataribeiro.sentinelofliberty.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
