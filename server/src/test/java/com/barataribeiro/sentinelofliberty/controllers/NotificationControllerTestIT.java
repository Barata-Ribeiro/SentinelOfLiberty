package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class NotificationControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/notifications";

    private final MockMvc mockMvc;

    @Test
    @DisplayName("Test where the authenticated user gets the latest notifications successfully")
    void testGetLatestNotification() throws Exception {
        mockMvc.perform(get(BASE_URL + "/latest")
                                .headers(authHeader()))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data").isArray())
               .andExpect(result -> assertEquals(5,
                                                 (Integer) JsonPath.read(result.getResponse().getContentAsString(),
                                                                         "$.data.length()")));
    }

    @Test
    @DisplayName("Test where the authenticated user gets all notifications, paginated, successfully")
    void testGetAllNotifications() throws Exception {
        mockMvc.perform(get(BASE_URL)
                                .headers(authHeader())
                                .param("page", "0")
                                .param("perPage", "10")
                                .param("direction", "DESC")
                                .param("orderBy", "createdAt"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data.content").isArray())
               .andExpect(result -> assertTrue(
                       (Integer) JsonPath.read(result.getResponse().getContentAsString(),
                                               "$.data.totalElements") > 10));
    }
}