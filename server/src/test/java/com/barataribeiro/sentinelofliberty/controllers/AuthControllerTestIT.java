package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.utils.ConcurrencyTestUtil;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
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

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.VALID_LOGIN_PAYLOAD;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class AuthControllerTestIT {
    private static final String BASE_URL = "/api/v1/auth";
    private final MockMvc mockMvc;
    @Autowired private UserRepository userRepository;

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
    @DisplayName("Test login with valid request body and an existing user attempts to login with valid credentials")
    void testLoginWithValidCredentials() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(VALID_LOGIN_PAYLOAD))
               .andExpect(MockMvcResultMatchers.status().isOk())
               .andDo(MockMvcResultHandlers.print());
    }

    @Test
    @DisplayName("Test login with valid request body and an existing user attempts to login with invalid credentials")
    void testLoginWithInvalidCredentials() throws Exception {
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
    @DisplayName("Test login scenarios where user does not exist; the body is empty; or the boolean value is invalid")
    void testInvalidLoginScenarios() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(
                                                      "{\"username\": \"test\", \"password\": \"test\", " +
                                                              "\"rememberMe\": true}"))
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.status().isNotFound());

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

    @Test
    @DisplayName("Test registration where high-concurrency is expected and the user is registered only once")
    void testRegistrationWithConcurrency() {
        ConcurrencyTestUtil.doAsyncAndConcurrently(10, () -> mockMvc
                .perform(MockMvcRequestBuilders.post(BASE_URL + "/register")
                                               .contentType("application/json")
                                               .content("{\"username\": \"jasonbourne\", " +
                                                                "\"email\": \"jasonbourne@cia.com\", " +
                                                                "\"password\": \"q@7$eEMvmVz7!fDn\", " +
                                                                "\"displayName\": \"Jason Bourne\"}"))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andDo(MockMvcResultHandlers.print()));

        Long userCount = userRepository.countByUsername(("jasonbourne"));
        assertEquals(1, userCount, "Only one instance of the user should exist in the database");
    }

    @Test
    @DisplayName("Test token refresh flow with both valid and invalid refresh tokens")
    void testTokenRefreshFlow() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/refresh-token")
                                              .header("X-Refresh-Token", "invalid-token"))
               .andExpect(MockMvcResultMatchers.status().isUnauthorized())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.jsonPath("$.detail")
                                               .value("The token provided is invalid."));

        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(VALID_LOGIN_PAYLOAD))
               .andExpect(MockMvcResultMatchers.status().isOk())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.jsonPath("$.data.accessToken").exists())
               .andExpect(MockMvcResultMatchers.jsonPath("$.data.refreshToken").exists())
               .andDo(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   String refreshToken = JsonPath.read(responseBody, "$.data.refreshToken");
                   mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/refresh-token")
                                                         .header("X-Refresh-Token", refreshToken))
                          .andExpect(MockMvcResultMatchers.status().isOk())
                          .andDo(MockMvcResultHandlers.print())
                          .andExpect(MockMvcResultMatchers.jsonPath("$.data.accessToken").exists())
                          .andExpect(MockMvcResultMatchers.jsonPath("$.data.refreshToken").doesNotExist());
               });
    }
}