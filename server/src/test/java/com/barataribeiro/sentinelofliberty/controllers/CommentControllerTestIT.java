package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.repositories.CommentRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class CommentControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/comments";
    private static final String NEW_COMMENT_PAYLOAD = """
                                                      {
                                                          "body": "This is a test comment."
                                                      }
                                                      """;

    private static Long createdCommentId;
    private static Long createdReplyId;
    private final MockMvc mockMvc;

    @Autowired private CommentRepository commentRepository;

    @Test
    @DisplayName("Test create comment with valid request body and an authenticated user attempts to create a comment")
    void testCreateComment() throws Exception {
        mockMvc.perform(post(BASE_URL + "/1")
                                .headers(userAuthHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(NEW_COMMENT_PAYLOAD))
               .andExpect(status().isCreated())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   createdCommentId = Long.parseLong(JsonPath.read(responseBody, "$.data.id").toString());

                   assertNotNull(createdCommentId);
                   assertTrue(responseBody.contains("You have successfully created a comment"));
               });
    }

    @Test
    @DisplayName("Test create reply with valid request body and an authenticated user attempts to create a reply")
    void testReplyToComment() throws Exception {
        mockMvc.perform(post(BASE_URL + "/1")
                                .headers(userAuthHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                         {
                                             "body": "This is a test reply.",
                                             "parentId": %d
                                         }
                                         """.formatted(createdCommentId)))
               .andExpect(status().isCreated())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   createdReplyId = Long.parseLong(JsonPath.read(responseBody, "$.data.id").toString());

                   assertNotNull(createdReplyId);
                   assertTrue(responseBody.contains("You have successfully created a comment"));
                   assertTrue(responseBody.contains("This is a test reply."));
                   assertEquals(createdCommentId,
                                Long.parseLong(JsonPath.read(responseBody, "$.data.parentId").toString()));

               });

        assertEquals(2, commentRepository.countDistinctByArticle_Id(1L));
    }
}