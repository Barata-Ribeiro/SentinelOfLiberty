package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.ADMIN_UPDATE_PROFILE_PAYLOAD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class UserControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/users";

    private final MockMvc mockMvc;
    private final UserRepository userRepository;

    @Test
    @DisplayName("Test get user public profile with valid username")
    void testGetUserPublicProfile() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public/profile/testuser"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> assertEquals("testuser",
                                                 JsonPath.read(result.getResponse().getContentAsString(),
                                                               "$.data.username")));
    }

    @Test
    @DisplayName("Test get user public profile with invalid username")
    void testGetUserPublicProfileWithInvalidUsername() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public/profile/invalidusername"))
               .andExpect(status().isNotFound())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(EntityNotFoundException.class,
                                                     result.getResolvedException()));
    }

    @Test
    @DisplayName("Update user profile with valid data")
    void updateUserProfileWithValidData() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/me")
                                .contentType("application/json")
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
    @DisplayName("Update user profile with invalid data")
    void updateUserProfileWithInvalidData(String payload) throws Exception {
        mockMvc.perform(patch(BASE_URL + "/me")
                                .contentType("application/json")
                                .content(payload)
                                .headers(authHeader()))
               .andExpect(status().isBadRequest())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(MethodArgumentNotValidException.class,
                                                     result.getResolvedException()));
    }

    @Test
    @DisplayName("Logged in user deletes their own account")
    void deleteUserProfile() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/me")
                                .headers(userAuthHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> assertEquals("User profile deleted successfully",
                                                 JsonPath.read(result.getResponse().getContentAsString(),
                                                               "$.message")));

        assertEquals(0, userRepository.countByUsername("testuser"));
    }
}