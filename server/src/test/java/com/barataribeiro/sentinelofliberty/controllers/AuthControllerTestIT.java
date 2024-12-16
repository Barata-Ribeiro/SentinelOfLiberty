package com.barataribeiro.sentinelofliberty.controllers;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("development")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class AuthControllerTestIT {
    private static final String BASE_URL = "/api/v1/auth";
    private final MockMvc mockMvc;

    @Test
    void testLoginWithValidRequestBody() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(
                                                      "{\"username\": \"test\", \"password\": \"test\", " +
                                                              "\"rememberMe\": true}"))
               .andExpect(status().isOk());
    }

    @Test
    void testLoginWithEmptyRequestBody() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content("{}"))
               .andExpect(status().isBadRequest())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   assertTrue(responseBody.contains("\"fieldName\":\"username\",\"reason\":\"must not be blank\""));
                   assertTrue(responseBody.contains("\"fieldName\":\"password\",\"reason\":\"must not be blank\""));
               });
    }

    @Test
    void testLoginWithInvalidBooleanValue() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(
                                                      "{\"username\": \"test\", \"password\": \"test\", " +
                                                              "\"rememberMe\": \"test\"}"))
               .andExpect(status().isBadRequest())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   assertTrue(responseBody.contains("Invalid boolean value, expected 'true' or 'false' but got: test"));
               });
    }
}