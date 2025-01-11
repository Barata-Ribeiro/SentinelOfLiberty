package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.sentinelofliberty.repositories.CommentRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.LONG_LOREM_IPSUM;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
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
    @Order(1)
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
    @Order(2)
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

    @Test
    @Order(3)
    @DisplayName("Get article comments tree with valid article ID")
    void getArticleCommentsTreeWithValidArticleId() throws Exception {
        mockMvc.perform(get(BASE_URL + "/1").headers(userAuthHeader()).contentType(MediaType.APPLICATION_JSON))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();

                   assertTrue(responseBody.contains("You have successfully retrieved the comments tree"));
                   assertTrue(responseBody.contains("data"));

                   List<Integer> rootsIds = JsonPath.read(responseBody, "$.data[*].id");
                   assertEquals(1, rootsIds.size(), "There should be only one root comment");
                   assertEquals(createdCommentId, Long.parseLong(rootsIds.getFirst().toString()),
                                "The root comment ID should match the created comment ID");

                   List<Integer> childrenOfRoot = JsonPath.read(responseBody, "$.data[0].children[*].id");
                   assertEquals(1, childrenOfRoot.size(), "There should be only one reply to the root comment");
                   assertEquals(createdReplyId, Long.parseLong(childrenOfRoot.getFirst().toString()),
                                "The reply ID should match the created reply ID");
               });

    }

    @Test
    @Order(4)
    @DisplayName("Delete comment with valid comment ID and an authenticated user attempts to delete its own comment")
    void testDeleteOwnComment() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/1/%d".formatted(createdCommentId)).headers(userAuthHeader())
                                                                              .contentType(MediaType.APPLICATION_JSON))
               .andExpect(status().isNoContent())
               .andDo(print())
               .andExpect(jsonPath("$.message").value("You have successfully deleted the comment"));

        assertEquals(0, commentRepository.countDistinctByArticle_Id(1L), "There should be no comments left, as the " +
                "root comment was deleted.");
    }


    @ParameterizedTest
    @CsvSource({
            "'', 'must not be blank'",
            "'   ', 'must not be blank'",
            "'1234', 'Comment body must be between 5 and 400 characters'",
            LONG_LOREM_IPSUM + ", 'Comment body must be between 5 and 400 characters'"
    })
    @DisplayName("Create comment with invalid request body")
    void createCommentWithInvalidRequestBody(String body, String expectedErrorMessage) throws Exception {
        mockMvc.perform(post(BASE_URL + "/1")
                                .headers(userAuthHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                         {
                                             "body": "%s"
                                         }
                                         """.formatted(body)))
               .andExpect(status().isBadRequest())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   assertTrue(responseBody.contains(expectedErrorMessage));
                   assertInstanceOf(MethodArgumentNotValidException.class, result.getResolvedException());
               });
    }

    @Test
    @DisplayName("Delete comment with invalid comment ID")
    void deleteCommentWithInvalidCommentId() throws Exception {
        mockMvc.perform(delete(BASE_URL + "/1/9999").headers(userAuthHeader())
                                                    .contentType(MediaType.APPLICATION_JSON))
               .andExpect(status().isBadRequest())
               .andDo(print())
               .andExpect(result -> {
                   String responseBody = result.getResponse().getContentAsString();
                   assertTrue(responseBody.contains("Comment not found or you are not the author"));
                   assertInstanceOf(IllegalRequestException.class, result.getResolvedException());
               });
    }
}