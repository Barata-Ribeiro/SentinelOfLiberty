package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class AuthControllerTestIT {
    private static final String BASE_URL = "/api/v1/auth";
    private final MockMvc mockMvc;

    @BeforeAll
    public static void createTestingUser(@Autowired @NotNull PasswordEncoder passwordEncoder,
                                         @Autowired @NotNull UserRepository userRepository) {
        User user = User.builder()
                        .username("testuser")
                        .email("testuser@example.com")
                        .password(passwordEncoder.encode("testpassword"))
                        .role(Roles.USER)
                        .displayName("Test User")
                        .build();
        userRepository.save(user);
    }

    @Test
    void testLoginWithValidRequestBodyAndValidUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(
                                                      "{\"username\": \"testuser\", \"password\": \"testpassword\", " +
                                                              "\"rememberMe\": true}"))
               .andExpect(MockMvcResultMatchers.status().isOk())
               .andDo(MockMvcResultHandlers.print());
    }

    @Test
    void testLoginWithValidRequestBodyAndInvalidUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(
                                                      "{\"username\": \"testuser\", \"password\": \"wrongpassword\", " +
                                                              "\"rememberMe\": true}"))
               .andExpect(MockMvcResultMatchers.status().isUnauthorized())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.jsonPath("$.detail")
                                               .value("Login failed; Wrong username or password."));
    }

    @Test
    void testLoginWithValidRequestBody() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(
                                                      "{\"username\": \"test\", \"password\": \"test\", " +
                                                              "\"rememberMe\": true}"))
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    void testLoginWithEmptyRequestBody() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content("{}"))
               .andExpect(MockMvcResultMatchers.status().isBadRequest())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers
                                  .jsonPath("$.invalid-params[?(@.fieldName == 'username')].reason")
                                  .value("must not be blank"))
               .andExpect(MockMvcResultMatchers
                                  .jsonPath("$.invalid-params[?(@.fieldName == 'password')].reason")
                                  .value("must not be blank"));
    }

    @Test
    void testLoginWithInvalidBooleanValue() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                                .post(BASE_URL + "/login")
                                .contentType("application/json")
                                .content("{\"username\": \"test\", \"password\": \"test\", \"rememberMe\": \"test\"}"))
               .andExpect(MockMvcResultMatchers.status().isBadRequest())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.jsonPath("$.detail")
                                               .value("Invalid boolean value, expected 'true' or 'false' but got: " +
                                                              "test"));
    }
}