package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.repositories.NoticeRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.NEW_NOTICE_PAYLOAD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

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
                                  .andExpect(MockMvcResultMatchers.status().isCreated())
                                  .andDo(MockMvcResultHandlers.print())
                                  .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        createdNoticeId = Long.parseLong(JsonPath.read(responseBody, "$.data.id").toString());

        assertEquals("Test Notice", JsonPath.read(responseBody, "$.data.title"));
        assertTrue(noticeRepository.existsById(createdNoticeId));
    }
}