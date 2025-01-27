package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.repositories.NoticeRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.util.List;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.NEW_NOTICE_PAYLOAD;
import static org.junit.jupiter.api.Assertions.*;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class NoticeControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/notices";
    private static Long createdNoticeId;
    private final MockMvcTester mockMvcTester;
    private final NoticeRepository noticeRepository;

    @Test
    @Order(1)
    @DisplayName("Test create notice with valid request body and an authenticated admin attempts to create a notice")
    void testCreateNotice() {
        mockMvcTester.post().uri(BASE_URL).contentType(MediaType.APPLICATION_JSON).headers(authHeader())
                     .content(NEW_NOTICE_PAYLOAD)
                     .assertThat().hasStatus2xxSuccessful().hasStatus(HttpStatus.CREATED)
                     .bodyJson().extractingPath("$.data").satisfies(data -> {
                         String expectedTitle = JsonPath.read(NEW_NOTICE_PAYLOAD, "$.title");
                         String expectedMessage = JsonPath.read(NEW_NOTICE_PAYLOAD, "$.message");

                         assertNotNull(JsonPath.read(data, "$.id"));
                         assertEquals(expectedTitle, JsonPath.read(data, "$.title"));
                         assertEquals(expectedMessage, JsonPath.read(data, "$.message"));

                         createdNoticeId = Long.parseLong(JsonPath.read(data, "$.id").toString());
                     });

        assertTrue(noticeRepository.existsById(createdNoticeId));
    }

    @Test
    @Order(2)
    @DisplayName("Test to get the latest public notices that will be displayed on the homepage")
    void testGetLatestNotice() {
        mockMvcTester.get().uri(BASE_URL + "/public/latest").assertThat().hasStatusOk()
                     .bodyJson().satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved the latest notices",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));

                         assertInstanceOf(List.class, JsonPath.read(jsonContent.getJson(), "$.data"));
                         assertFalse(((List<?>) JsonPath.parse(jsonContent.getJson())
                                                        .read("$.data[?(@.id == " + createdNoticeId + ")]")).isEmpty());
                     });
    }

    @Test
    @DisplayName("Test to get all notices issued by an authenticated admin")
    void testGetAllOwnNotices() {
        mockMvcTester.get().uri(BASE_URL)
                     .param("search", "Test Notice")
                     .param("page", "0")
                     .param("perPage", "10")
                     .param("direction", "ASC")
                     .param("orderBy", "createdAt")
                     .headers(authHeader())
                     .assertThat().hasStatusOk().bodyJson().satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved all of your notices",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertInstanceOf(List.class, JsonPath.read(jsonContent.getJson(), "$.data.content"));
                         assertFalse(((List<?>) JsonPath.parse(jsonContent.getJson())
                                                        .read("$.data.content[?(@.id == " + createdNoticeId + ")]")).isEmpty());
                     });
    }

    @Test
    @Order(3)
    @DisplayName("Test update notice with valid request body and an authenticated admin attempts to update a notice")
    void testUpdateNotice() {
        String updatedNoticePayload = NEW_NOTICE_PAYLOAD.replace("Test Notice", "Updated Test Notice");
        mockMvcTester.patch().uri(BASE_URL + "/{noticedId}", createdNoticeId).contentType(MediaType.APPLICATION_JSON)
                     .headers(authHeader()).content(updatedNoticePayload)
                     .assertThat().hasStatusOk().bodyJson().satisfies(jsonContent -> {
                         assertEquals("You have successfully updated the notice",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertEquals(JsonPath.read(updatedNoticePayload, "$.title"),
                                      (String) JsonPath.read(jsonContent.getJson(), "$.data.title"));
                     });
    }

    @Test
    @Order(4)
    @DisplayName("Test set notice status where an authenticated admin attempts to update its status")
    void testSetNoticeStatus() {
        mockMvcTester.patch().uri(BASE_URL + "/{noticedId}/status", createdNoticeId)
                     .param("isActive", "false").headers(authHeader())
                     .assertThat().hasStatusOk().bodyJson().satisfies(jsonContent -> {
                         assertEquals("You have successfully updated the notice status",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertFalse((Boolean) JsonPath.read(jsonContent.getJson(), "$.data.isActive"));
                     });
    }
}
