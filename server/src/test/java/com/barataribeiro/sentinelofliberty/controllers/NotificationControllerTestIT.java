package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.util.LinkedList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class NotificationControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/notifications";

    private final MockMvc mockMvc;
    private List<Long> notificationsIds = new LinkedList<>();

    @Test
    @Order(1)
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
    @Order(2)
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
               .andExpect(result -> {
                   assertTrue((Integer) JsonPath.read(result.getResponse().getContentAsString(),
                                                      "$.data.totalElements") > 10);
                   assertEquals(10, (Integer) JsonPath.read(result.getResponse().getContentAsString(),
                                                            "$.data.content.length()"));
               })
               .andDo(result -> notificationsIds = JsonPath.read(result.getResponse().getContentAsString(),
                                                                 "$.data.content[*].id"));

        assertFalse(notificationsIds.isEmpty());
        assertEquals(10, notificationsIds.size());
    }

    @Test
    @Order(3)
    @DisplayName("Change notification status successfully")
    void changeNotificationStatus() throws Exception {
        mockMvc.perform(
                       patch(BASE_URL + "/{id}/status", notificationsIds.getLast())

                               .param("isRead", "true")
                               .headers(authHeader())
               )
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data.isRead").value(true));
    }

    @Test
    @Order(4)
    @DisplayName("Change notification status in bulk successfully")
    void changeNotificationStatusInBulk() throws Exception {
        mockMvc.perform(patch(BASE_URL + "/status")
                                .headers(authHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(new ObjectMapper().writeValueAsString(notificationsIds.subList(0, 3)))
                                .param("isRead", "true"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data[0].isRead").value(true))
               .andExpect(jsonPath("$.data[1].isRead").value(true))
               .andExpect(jsonPath("$.data[2].isRead").value(true));
    }

    @Test
    @Order(5)
    @DisplayName("Delete notification successfully")
    void deleteNotification() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/{id}", notificationsIds.getFirst())
                                .headers(authHeader()))
               .andExpect(status().isNoContent())
               .andDo(print())
               .andExpect(jsonPath("$.message").value("You have successfully deleted the notification"));
    }
}