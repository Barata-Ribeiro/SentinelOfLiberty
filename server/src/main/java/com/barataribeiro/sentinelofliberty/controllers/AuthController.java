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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
