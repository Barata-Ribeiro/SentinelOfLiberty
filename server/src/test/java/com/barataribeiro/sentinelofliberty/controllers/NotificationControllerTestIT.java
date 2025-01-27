package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.util.LinkedList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class NotificationControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/notifications";

    private final MockMvcTester mockMvcTester;
    private List<Long> notificationsIds = new LinkedList<>();

    @Test
    @Order(1)
    @DisplayName("Test where the authenticated user gets the latest notifications successfully")
    void testGetLatestNotification() {
        mockMvcTester.get().uri(BASE_URL + "/latest").headers(authHeader()).assertThat()
                     .hasStatusOk().bodyJson().extractingPath("$.data").satisfies(data -> {
                         assertInstanceOf(List.class, data);
                         assertEquals(5, ((List<?>) data).size());
                     });
    }

    @Test
    @Order(2)
    @DisplayName("Test where the authenticated user gets all notifications, paginated, successfully")
    void testGetAllNotifications() {
        mockMvcTester.get().uri(BASE_URL)
                     .param("page", "0")
                     .param("perPage", "10")
                     .param("direction", "DESC")
                     .param("orderBy", "createdAt")
                     .headers(authHeader())
                     .assertThat().hasStatusOk().bodyJson().extractingPath("$.data").satisfies(data -> {
                         assertInstanceOf(List.class, JsonPath.read(data, "$.content"));
                         assertTrue((Integer) JsonPath.read(data, "$.totalElements") > 10);
                         assertEquals(10, (int) (Integer) JsonPath.read(data, "$.content.length()"));

                         notificationsIds = JsonPath.read(data, "$.content[*].id");
                     });

        assertFalse(notificationsIds.isEmpty());
        assertEquals(10, notificationsIds.size());
    }

    @Test
    @Order(3)
    @DisplayName("Change notification status successfully")
    void changeNotificationStatus() {
        mockMvcTester.patch().uri(BASE_URL + "/{id}/status", notificationsIds.getLast())
                     .param("isRead", "true")
                     .headers(authHeader())
                     .assertThat()
                     .hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> assertTrue(
                             (Boolean) JsonPath.read(jsonContent.getJson(), "$.data.isRead")));
    }

    @Test
    @Order(4)
    @DisplayName("Change notification status in bulk successfully")
    void changeNotificationStatusInBulk() throws JsonProcessingException {
        mockMvcTester
                .patch()
                .uri(BASE_URL + "/status")
                .param("isRead", "true")
                .contentType(MediaType.APPLICATION_JSON)
                .headers(authHeader())
                .content(new ObjectMapper().writeValueAsString(notificationsIds.subList(0, 3)))
                .assertThat()
                .hasStatusOk()
                .bodyJson()
                .satisfies(jsonContent -> {
                    assertTrue((Boolean) JsonPath.read(jsonContent.getJson(), "$.data[0].isRead"));
                    assertTrue((Boolean) JsonPath.read(jsonContent.getJson(), "$.data[1].isRead"));
                    assertTrue((Boolean) JsonPath.read(jsonContent.getJson(), "$.data[2].isRead"));
                });
    }

    @Test
    @Order(5)
    @DisplayName("Delete notification successfully")
    void deleteNotification() {
        mockMvcTester.delete().uri(BASE_URL + "/{id}", notificationsIds.getFirst()).headers(authHeader()).assertThat()
                     .hasStatus2xxSuccessful().hasStatus(HttpStatus.NO_CONTENT).bodyJson()
                     .satisfies(jsonContent -> assertEquals("You have successfully deleted the notification",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));
    }
}