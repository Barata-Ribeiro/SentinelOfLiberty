package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CommentRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.ADMIN_UPDATE_PROFILE_PAYLOAD;
import static org.junit.jupiter.api.Assertions.assertEquals;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class UserControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/users";

    private final MockMvcTester mockMvcTester;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;

    @Test
    @Order(1)
    @DisplayName("Test get user public profile with valid username")
    void testGetUserPublicProfile() {
        mockMvcTester.get().uri(BASE_URL + "/public/profile/{username}", "testuser")
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .extractingPath("$.data.username")
                     .isEqualTo("testuser");
    }

    @Test
    @Order(2)
    @DisplayName("Test get own profile for both logged admin and user")
    void getOwnProfile() {
        mockMvcTester.get().uri(BASE_URL + "/me")
                     .headers(authHeader())
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .extractingPath("$.data")
                     .satisfies(data -> {
                         assertEquals("testadmin", JsonPath.read(data, "$.username"));
                         assertEquals((int) articleRepository.countDistinctByAuthor_Username("testadmin"),
                                      (int) JsonPath.read(data, "$.articlesCount"));
                     });

        mockMvcTester.get().uri(BASE_URL + "/me")
                     .headers(userAuthHeader())
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .extractingPath("$.data")
                     .satisfies(data -> {
                         assertEquals("testuser", JsonPath.read(data, "$.username"));
                         assertEquals((int) commentRepository.countDistinctByUser_Username("testuser"),
                                      (int) JsonPath.read(data, "$.commentsCount"));
                     });
    }

    @Test
    @DisplayName("Test get user public profile with invalid username")
    void testGetUserPublicProfileWithInvalidUsername() {
        mockMvcTester.get().uri(BASE_URL + "/public/profile/{username}", "invalidusername")
                     .assertThat().hasFailed().hasStatus4xxClientError().failure().isInstanceOf(
                             EntityNotFoundException.class);
    }

    @Test
    @Order(9)
    @DisplayName("Test update user profile with valid data")
    void updateUserProfileWithValidData() {
        mockMvcTester.patch().uri(BASE_URL + "/me")
                     .contentType(MediaType.APPLICATION_JSON)
                     .headers(authHeader())
                     .content(ADMIN_UPDATE_PROFILE_PAYLOAD)
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .extractingPath("$.data")
                     .satisfies(data -> {
                         assertEquals("testadminupdated", JsonPath.read(data, "$.username"));
                         assertEquals("testadminnewemail@example.com", JsonPath.read(data, "$.email"));
                         assertEquals("New Admin", JsonPath.read(data, "$.displayName"));
                     });
    }

    @ParameterizedTest
    @CsvSource({
            "'{\"currentPassword\": \"testpassword\", \"email\": \"invalidemail\", \"newPassword\": " +
                    "\"NewPassword123!\"}'",
            "'{\"currentPassword\": \"testpassword\", \"newPassword\": \"short\"}'",
            "'{\"username\": \"newusername\", \"newPassword\": \"NewPassword123!\"}'"
    })
    @DisplayName("Test update user profile with invalid data")
    void updateUserProfileWithInvalidData(String payload) {
        mockMvcTester.patch().uri(BASE_URL + "/me").contentType(MediaType.APPLICATION_JSON)
                     .content(payload)
                     .headers(authHeader())
                     .assertThat()
                     .hasFailed()
                     .hasStatus4xxClientError()
                     .failure().isInstanceOf(MethodArgumentNotValidException.class);
    }

    @Test
    @Order(10)
    @DisplayName("Test logged in user deletes their own account")
    void deleteUserProfile() {
        mockMvcTester
                .delete()
                .uri(BASE_URL + "/me")
                .headers(userAuthHeader())
                .assertThat()
                .hasStatus2xxSuccessful()
                .hasStatus(HttpStatus.NO_CONTENT)
                .bodyJson()
                .satisfies(jsonContent -> assertEquals("User profile deleted successfully",
                                                       JsonPath.read(jsonContent.getJson(), "$.message")));


        assertEquals(0, userRepository.countByUsername("testuser"));
    }
}