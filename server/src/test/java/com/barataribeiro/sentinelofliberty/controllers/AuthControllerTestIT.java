package com.barataribeiro.sentinelofliberty.controllers;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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

    @Test
    void testLoginWithValidRequestBody() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/login")
                                              .contentType("application/json")
                                              .content(
                                                      "{\"username\": \"test\", \"password\": \"test\", " +
                                                              "\"rememberMe\": true}"))
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.status().isOk());
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