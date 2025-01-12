package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.barataribeiro.sentinelofliberty.utils.ConcurrencyTestUtil;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.VALID_LOGIN_PAYLOAD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class AuthControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/auth";
    private final MockMvc mockMvc;
    @Autowired private UserRepository userRepository;

    @Test
    @DisplayName("Test login with valid request body and an existing user attempts to login with valid credentials")
    void testLoginWithValidCredentials() throws Exception {
        mockMvc.perform(post(BASE_URL + "/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(VALID_LOGIN_PAYLOAD))
               .andExpect(status().isOk())
               .andDo(print());
    }

    @Test
    @DisplayName("Test login with valid request body and an existing user attempts to login with invalid credentials")
    void testLoginWithInvalidCredentials() throws Exception {
        mockMvc.perform(post(BASE_URL + "/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        "{\"username\": \"testuser\", \"password\": \"wrongpassword\", " +
                                                "\"rememberMe\": true}"))
               .andExpect(status().isUnauthorized())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(InvalidCredentialsException.class, result.getResolvedException()));
    }

    @Test
    @DisplayName("Test login scenarios where user does not exist; the body is empty; or the boolean value is invalid")
    void testInvalidLoginScenarios() throws Exception {
        mockMvc.perform(post(BASE_URL + "/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        "{\"username\": \"test\", \"password\": \"test\", " +
                                                "\"rememberMe\": true}"))
               .andDo(print())
               .andExpect(status().isNotFound())
               .andExpect(result -> assertInstanceOf(EntityNotFoundException.class, result.getResolvedException()));

        mockMvc.perform(post(BASE_URL + "/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{}"))
               .andExpect(status().isBadRequest())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(MethodArgumentNotValidException.class,
                                                     result.getResolvedException()));

        mockMvc.perform(post(BASE_URL + "/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"username\": \"test\", \"password\": \"test\", \"rememberMe\": \"test\"}"))
               .andExpect(status().isBadRequest())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(HttpMessageNotReadableException.class,
                                                     result.getResolvedException()));
    }

    @Test
    @DisplayName("Test registration where high-concurrency is expected and the user is registered only once")
    void testRegistrationWithConcurrency() {
        ConcurrencyTestUtil.doAsyncAndConcurrently(10, () -> mockMvc
                .perform(post(BASE_URL + "/register")
                                 .contentType(MediaType.APPLICATION_JSON)
                                 .content("{\"username\": \"jasonbourne\", " +
                                                  "\"email\": \"jasonbourne@cia.com\", " +
                                                  "\"password\": \"q@7$eEMvmVz7!fDn\", " +
                                                  "\"displayName\": \"Jason Bourne\"}"))
                .andExpect(status().isCreated())
                .andDo(print()));

        Long userCount = userRepository.countByUsername(("jasonbourne"));
        assertEquals(1, userCount, "Only one instance of the user should exist in the database");
    }

    @Test
    @DisplayName("Test token refresh flow with both valid and invalid refresh tokens")
    void testTokenRefreshFlow() throws Exception {
        mockMvc.perform(post(BASE_URL + "/refresh-token")
                                .header("X-Refresh-Token", "invalid-token"))
               .andExpect(status().isUnauthorized())
               .andDo(print())
               .andExpect(jsonPath("$.detail")
                                  .value("The token provided is invalid."));

        mockMvc.perform(post(BASE_URL + "/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(VALID_LOGIN_PAYLOAD))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data.accessToken").exists())
               .andExpect(jsonPath("$.data.refreshToken").exists())
               .andDo(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   String refreshToken = JsonPath.read(responseBody, "$.data.refreshToken");
                   mockMvc.perform(post(BASE_URL + "/refresh-token")
                                           .header("X-Refresh-Token", refreshToken))
                          .andExpect(status().isOk())
                          .andDo(print())
                          .andExpect(jsonPath("$.data.accessToken").exists())
                          .andExpect(jsonPath("$.data.refreshToken").doesNotExist());
               });
    }
}