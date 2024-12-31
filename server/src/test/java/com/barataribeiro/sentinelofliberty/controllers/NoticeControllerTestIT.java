package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.repositories.NoticeRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import net.minidev.json.JSONArray;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.NEW_NOTICE_PAYLOAD;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class NoticeControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/notices";

    private static Long createdNoticeId;
    private final MockMvc mockMvc;

    @Autowired private NoticeRepository noticeRepository;

    @Test
    @Order(1)
    @DisplayName("Test create notice with valid request body and an authenticated admin attempts to create a notice")
    void testCreateNotice() throws Exception {
        MvcResult result = mockMvc.perform(post(BASE_URL)
                                                   .headers(authHeader())
                                                   .contentType(MediaType.APPLICATION_JSON)
                                                   .content(NEW_NOTICE_PAYLOAD))
                                  .andExpect(status().isCreated())
                                  .andDo(print())
                                  .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        createdNoticeId = Long.parseLong(JsonPath.read(responseBody, "$.data.id").toString());

        assertEquals("Test Notice", JsonPath.read(responseBody, "$.data.title"));
        assertTrue(noticeRepository.existsById(createdNoticeId));
    }

    @Test
    @Order(2)
    @DisplayName("Test to get the latest public notices that will be displayed on the homepage")
    void testGetLatestNotice() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public/latest"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   assertEquals("You have successfully retrieved the latest notices",
                                JsonPath.read(responseBody, "$.message"));
                   assertInstanceOf(JSONArray.class, JsonPath.read(responseBody, "$.data"));
                   assertFalse(((List<?>) JsonPath.parse(responseBody)
                                                  .read("$.data[?(@.id == " + createdNoticeId + ")]")).isEmpty());
               });
    }

    @Test
    @DisplayName("Test to get all notices issued by an authenticated admin")
    void testGetAllOwnNotices() throws Exception {
        mockMvc.perform(get(BASE_URL)
                                .headers(authHeader())
                                .param("search", "Test Notice")
                                .param("page", "0")
                                .param("perPage", "10")
                                .param("direction", "ASC")
                                .param("orderBy", "createdAt"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   assertEquals("You have successfully retrieved all of your notices",
                                JsonPath.read(responseBody, "$.message"));
                   assertInstanceOf(JSONArray.class, JsonPath.read(responseBody, "$.data.content"));
                   assertFalse(((List<?>) JsonPath.parse(responseBody)
                                                  .read("$.data.content[?(@.id == " + createdNoticeId + ")]")).isEmpty());
               });
    }

    @Test
    @Order(3)
    @DisplayName("Test update notice with valid request body and an authenticated admin attempts to update a notice")
    void testUpdateNotice() throws Exception {
        String updatedNoticePayload = NEW_NOTICE_PAYLOAD.replace("Test Notice", "Updated Test Notice");
        mockMvc.perform(patch(BASE_URL + "/" + createdNoticeId)
                                .headers(authHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(updatedNoticePayload))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   assertEquals("You have successfully updated the notice", JsonPath.read(responseBody, "$.message"));
                   assertEquals("Updated Test Notice", JsonPath.read(responseBody, "$.data.title"));
               });
    }
}
