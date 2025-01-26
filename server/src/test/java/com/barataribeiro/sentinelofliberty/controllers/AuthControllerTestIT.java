package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.InvalidCredentialsException;
import com.barataribeiro.sentinelofliberty.repositories.TokenRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.barataribeiro.sentinelofliberty.utils.ConcurrencyTestUtil;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.concurrent.atomic.AtomicReference;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.VALID_LOGIN_PAYLOAD;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class AuthControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/auth";

    private final MockMvcTester mockMvcTester;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;

    @Test
    @DisplayName("Test login with valid request body and an existing user attempts to login with valid credentials")
    void testLoginWithValidCredentials() {
        mockMvcTester.post().uri(BASE_URL + "/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content(VALID_LOGIN_PAYLOAD)
                     .assertThat().hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("You have successfully logged in",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertEquals("testuser", JsonPath.read(jsonContent.getJson(), "$.data.user.username"));
                     });
    }

    @Test
    @DisplayName("Test login with valid request body and an existing user attempts to login with invalid credentials")
    void testLoginWithInvalidCredentials() {
        mockMvcTester.post().uri(BASE_URL + "/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content("""
                                {
                                    "username": "testuser",
                                    "password": "wrongpassword",
                                    "rememberMe": true
                                }
                              """)
                     .assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.UNAUTHORIZED)
                     .failure().isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    @DisplayName("Test login scenarios where user does not exist; the body is empty; or the boolean value is invalid")
    void testInvalidLoginScenarios() {
        mockMvcTester.post().uri(BASE_URL + "/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content("""
                                {
                                    "username": "test",
                                    "password": "test",
                                    "rememberMe": "true"
                                }
                              """).assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.NOT_FOUND)
                     .failure().isInstanceOf(EntityNotFoundException.class);

        mockMvcTester.post().uri(BASE_URL + "/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content("{}")
                     .assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(MethodArgumentNotValidException.class);

        mockMvcTester.post().uri(BASE_URL + "/login")
                     .contentType(MediaType.APPLICATION_JSON)
                     .content("""
                                {
                                    "username": "test",
                                    "password": "test",
                                    "rememberMe": "test"
                                }
                              """).assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(HttpMessageNotReadableException.class);
    }

    @Test
    @DisplayName("Test registration where high-concurrency is expected and the user is registered only once")
    void testRegistrationWithConcurrency(@Autowired @NotNull MockMvc mockMvc) {
        ConcurrencyTestUtil.doAsyncAndConcurrently(10, () -> mockMvc
                .perform(post(BASE_URL + "/register")
                                 .contentType(MediaType.APPLICATION_JSON)
                                 .content("""
                                          {
                                            "username": "jasonbourne",
                                            "email": "jasonbourne@cia.com",
                                            "password": "q@7$eEMvmVz7!fDn",
                                            "displayName": "Jason Bourne"
                                          }
                                          """))
                .andExpect(status().isCreated())
                .andDo(print()));

        Long userCount = userRepository.countByUsername(("jasonbourne"));
        assertEquals(1, userCount, "Only one instance of the user should exist in the database");
    }

    @Test
    @DisplayName("Test token refresh flow with both valid and invalid refresh tokens")
    void testTokenRefreshFlow() {
        mockMvcTester.post().uri(BASE_URL + "/refresh-token")
                     .header("X-Refresh-Token", "invalid-token")
                     .assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.UNAUTHORIZED)
                     .failure().isInstanceOf(InvalidCredentialsException.class);

        mockMvcTester.post().uri(BASE_URL + "/login").contentType(MediaType.APPLICATION_JSON)
                     .content(VALID_LOGIN_PAYLOAD).assertThat().hasStatusOk()
                     .bodyJson().extractingPath("$.data")
                     .satisfies(data -> {
                         assertNotNull(JsonPath.read(data, "$.accessToken"));
                         assertNotNull(JsonPath.read(data, "$.refreshToken"));
                         String refreshToken = JsonPath.read(data, "$.refreshToken");

                         mockMvcTester.post().uri(BASE_URL + "/refresh-token")
                                      .header("X-Refresh-Token", refreshToken)
                                      .assertThat().hasStatusOk()
                                      .bodyJson()
                                      .extractingPath("$.data")
                                      .satisfies(newData -> {
                                          assertNotNull(JsonPath.read(newData, "$.accessToken"));
                                          assertNull(JsonPath.read(newData, "$.refreshToken"),
                                                     "Refresh token not be returned");
                                      });
                     });
    }

    @Test
    @DisplayName("Test logout with valid refresh token")
    void logoutWithValidRefreshToken() {
        AtomicReference<String> refreshToken = new AtomicReference<>();

        mockMvcTester.post().uri(BASE_URL + "/login").contentType(MediaType.APPLICATION_JSON)
                     .content(VALID_LOGIN_PAYLOAD).assertThat().hasStatusOk()
                     .bodyJson().extractingPath("$.data")
                     .satisfies(data -> {
                         assertNotNull(JsonPath.read(data, "$.accessToken"));
                         assertNotNull(JsonPath.read(data, "$.refreshToken"));
                         refreshToken.set(JsonPath.read(data, "$.refreshToken"));
                     });

        mockMvcTester.delete().uri(BASE_URL + "/logout")
                     .header("X-Refresh-Token", refreshToken.get())
                     .assertThat().hasStatus2xxSuccessful().hasStatus(HttpStatus.NO_CONTENT)
                     .bodyJson()
                     .satisfies(jsonContent -> assertEquals("You have successfully logged out",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));

        assertEquals(1, tokenRepository.countDistinctByTokenValue(refreshToken.get()),
                     "The refresh token should be invalidated after logout");
    }

    @Test
    @DisplayName("Test logout with invalid refresh token")
    void logoutWithInvalidRefreshToken() {
        mockMvcTester.delete().uri(BASE_URL + "/logout")
                     .header("X-Refresh-Token", "invalid-refresh-token")
                     .assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.UNAUTHORIZED)
                     .failure().isInstanceOf(InvalidCredentialsException.class);
    }
}