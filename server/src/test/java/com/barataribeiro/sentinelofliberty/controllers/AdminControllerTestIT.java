package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class AdminControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/admin";

    private final MockMvc mockMvc;
    private final UserRepository userRepository;

    @Test
    @DisplayName("Test admin banning and unbanning an user")
    void testAdminBanOrUnbanAnUser() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/users/{username}", "testuser")
                                .param("action", "ban")
                                .headers(authHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseContent = result.getResponse().getContentAsString();
                   String message = JsonPath.read(responseContent, "$.message");
                   assertEquals("You have successfully banned the user", message);
               });

        mockMvc.perform(patch(BASE_URL + "/users/{username}", "testuser")
                                .param("action", "unban")
                                .headers(authHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseContent = result.getResponse().getContentAsString();
                   String message = JsonPath.read(responseContent, "$.message");
                   assertEquals("You have successfully unbanned the user", message);
               });
    }

    @Test
    @DisplayName("Test admin toggling an user's verification status")
    void testAdminToggleVerification() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/users/{username}/toggle-verification", "testuser")
                                .headers(authHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseContent = result.getResponse().getContentAsString();
                   String message = JsonPath.read(responseContent, "$.message");
                   assertEquals("You have successfully verified the user", message);
               });

        mockMvc.perform(patch(BASE_URL + "/users/{username}/toggle-verification", "testuser")
                                .headers(authHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseContent = result.getResponse().getContentAsString();
                   String message = JsonPath.read(responseContent, "$.message");
                   assertEquals("You have successfully unverified the user", message);
               });
    }

    @Test
    @DisplayName("Test where a regular user tries to access the admin endpoint, should return 403")
    void testRegularUserAccessingAdminEndpoint() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/users/{username}", "testuser")
                                .param("action", "ban")
                                .headers(userAuthHeader()))
               .andExpect(status().isForbidden())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(AccessDeniedException.class, result.getResolvedException()));
    }
}