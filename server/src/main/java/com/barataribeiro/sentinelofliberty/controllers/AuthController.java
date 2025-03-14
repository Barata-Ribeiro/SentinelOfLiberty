package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.authentication.LoginRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.authentication.LoginResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.authentication.RegistrationRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserSecurityDTO;
import com.barataribeiro.sentinelofliberty.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Auth", description = "Authentication endpoints")
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "Register a new user",
               description = "This endpoint allows a person to register by providing their username, email, password," +
                       " and a display name. Upon successful registration, the user is returned with their security " +
                       "credentials.")
    @PostMapping("/register")
    public ResponseEntity<ApplicationResponseDTO<UserSecurityDTO>> register(@RequestBody
                                                                            @Valid
                                                                            RegistrationRequestDTO body) {
        UserSecurityDTO response = authService.register(body);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApplicationResponseDTO<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                                "You have successfully registered", response));
    }

    @Operation(summary = "Authenticate user with username and password",
               description = "This endpoint allows an user to authenticate by providing their username along with " +
                       "their password. Upon successful authentication, an access token and a refresh token are " +
                       "returned.")
    @PostMapping("/login")
    public ResponseEntity<ApplicationResponseDTO<LoginResponseDTO>> login(@RequestBody @Valid LoginRequestDTO body) {
        LoginResponseDTO response = authService.login(body);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully logged in", response));
    }

    @Operation(summary = "Refresh access token",
               description = "This endpoint allows a logged in user to refresh their access token by providing their" +
                       " valid refresh token.")
    @PostMapping("/refresh-token")
    public ResponseEntity<ApplicationResponseDTO<LoginResponseDTO>> refreshToken(@RequestHeader("X-Refresh-Token")
                                                                                 String refreshToken) {
        LoginResponseDTO response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully refreshed your token", response));
    }

    @Operation(summary = "Logout user",
               description = "This endpoint allows a logged in user to logout by providing their valid refresh token.")
    @DeleteMapping("/logout")
    public ResponseEntity<ApplicationResponseDTO<Void>> logout(@RequestHeader("X-Refresh-Token") String refreshToken) {
        authService.logout(refreshToken);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new ApplicationResponseDTO<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                                "You have successfully logged out", null));
    }
}
