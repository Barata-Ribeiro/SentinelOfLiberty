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
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.ADMIN_UPDATE_PROFILE_PAYLOAD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class UserControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/users";

    private final MockMvc mockMvc;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;

    @Test
    @Order(1)
    @DisplayName("Test get user public profile with valid username")
    void testGetUserPublicProfile() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public/profile/{username}", "testuser"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> assertEquals("testuser",
                                                 JsonPath.read(result.getResponse().getContentAsString(),
                                                               "$.data.username")));
    }

    @Test
    @Order(2)
    @DisplayName("Test get own profile for both logged admin and user")
    void getOwnProfile() throws Exception {
        mockMvc.perform(get(BASE_URL + "/me")
                                .headers(authHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();

                   assertEquals("testadmin", JsonPath.read(responseBody, "$.data.username"));

                   long articlesCount = articleRepository.countDistinctByAuthor_Username("testadmin");
                   assertEquals((int) JsonPath.read(responseBody, "$.data.articlesCount"), articlesCount);
               });

        mockMvc.perform(get(BASE_URL + "/me")
                                .headers(userAuthHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();

                   assertEquals("testuser", JsonPath.read(responseBody, "$.data.username"));

                   long commentsCount = commentRepository.countDistinctByUser_Username("testuser");
                   assertEquals((int) JsonPath.read(responseBody, "$.data.commentsCount"), commentsCount);
               });
    }

    @Test
    @DisplayName("Test get user public profile with invalid username")
    void testGetUserPublicProfileWithInvalidUsername() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public/profile/{username}", "invalidusername"))
               .andExpect(status().isNotFound())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(EntityNotFoundException.class,
                                                     result.getResolvedException()));
    }

    @Test
    @DisplayName("Test update user profile with valid data")
    void updateUserProfileWithValidData() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/me")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(ADMIN_UPDATE_PROFILE_PAYLOAD)
                                .headers(authHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   assertEquals("testadminupdated",
                                JsonPath.read(result.getResponse().getContentAsString(), "$.data.username"));
                   assertEquals("testadminnewemail@example.com",
                                JsonPath.read(result.getResponse().getContentAsString(), "$.data.email"));
                   assertEquals("New Admin",
                                JsonPath.read(result.getResponse().getContentAsString(), "$.data.displayName"));
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
    void updateUserProfileWithInvalidData(String payload) throws Exception {
        mockMvc.perform(patch(BASE_URL + "/me")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload)
                                .headers(authHeader()))
               .andExpect(status().isBadRequest())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(MethodArgumentNotValidException.class,
                                                     result.getResolvedException()));
    }

    @Test
    @Order(10)
    @DisplayName("Test logged in user deletes their own account")
    void deleteUserProfile() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/me")
                                .headers(userAuthHeader()))
               .andExpect(status().isNoContent())
               .andDo(print())
               .andExpect(jsonPath("$.message").value("User profile deleted successfully"));

        assertEquals(0, userRepository.countByUsername("testuser"));
    }
}