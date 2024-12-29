package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class UserControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/users";

    private final MockMvc mockMvc;

    @Test
    @DisplayName("Test get user public profile with valid username")
    void testGetUserPublicProfile() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/public/profile/testuser"))
               .andExpect(MockMvcResultMatchers.status().isOk())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(result -> assertEquals("testuser",
                                                 JsonPath.read(result.getResponse().getContentAsString(),
                                                               "$.data.username")));
    }

    @Test
    @DisplayName("Test get user public profile with invalid username")
    void testGetUserPublicProfileWithInvalidUsername() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/public/profile/invalidusername"))
               .andExpect(MockMvcResultMatchers.status().isNotFound())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(result -> assertInstanceOf(EntityNotFoundException.class,
                                                     result.getResolvedException()));
    }
}