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
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.util.List;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.LONG_LOREM_IPSUM;
import static org.junit.jupiter.api.Assertions.*;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class CommentControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/comments";

    private static Long createdCommentId;
    private static Long createdReplyId;

    private final MockMvcTester mockMvcTester;
    private final CommentRepository commentRepository;

    @Test
    @Order(1)
    @DisplayName("Test create comment with valid request body and an authenticated user attempts to create a comment")
    void testCreateComment() {
        String newCommentPayload = """
                                   {
                                       "body": "This is a test comment."
                                   }
                                   """;

        mockMvcTester.post().uri(BASE_URL + "/{articleId}", 1).contentType(MediaType.APPLICATION_JSON)
                     .headers(userAuthHeader()).content(newCommentPayload).assertThat().hasStatus2xxSuccessful()
                     .hasStatus(HttpStatus.CREATED).bodyJson().satisfies(jsonContent -> {
                         String expectedBody = JsonPath.read(newCommentPayload, "$.body");

                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data.id"));
                         assertEquals("You have successfully created a comment",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));

                         createdCommentId = Long.parseLong(JsonPath.read(jsonContent.getJson(),
                                                                         "$.data.id").toString());

                         assertEquals(expectedBody, JsonPath.read(jsonContent.getJson(), "$.data.content"));
                         assertEquals(1L,
                                      ((Number) JsonPath.read(jsonContent.getJson(), "$.data.articleId")).longValue());
                     });
    }

    @Test
    @Order(2)
    @DisplayName("Test create reply with valid request body and an authenticated user attempts to create a reply")
    void testReplyToComment() {
        String newReplyPayload = """
                                 {
                                     "body": "This is a test reply.",
                                     "parentId": %d
                                 }
                                 """;
        mockMvcTester.post().uri(BASE_URL + "/{articleId}", 1).contentType(MediaType.APPLICATION_JSON)
                     .headers(userAuthHeader()).content(newReplyPayload.formatted(createdCommentId)).assertThat()
                     .hasStatus2xxSuccessful().hasStatus(HttpStatus.CREATED).bodyJson().satisfies(jsonContent -> {
                         String expectedBody = JsonPath.read(newReplyPayload.formatted(createdCommentId), "$.body");

                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data.id"));
                         assertEquals("You have successfully created a comment",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));

                         createdReplyId = Long.parseLong(JsonPath.read(jsonContent.getJson(), "$.data.id").toString());

                         assertEquals(expectedBody, JsonPath.read(jsonContent.getJson(), "$.data.content"));
                         assertEquals(createdCommentId,
                                      ((Number) JsonPath.read(jsonContent.getJson(), "$.data.parentId")).longValue());
                     });

        assertEquals(2, commentRepository.countDistinctByArticle_Id(1L));
    }

    @Test
    @Order(3)
    @DisplayName("Get article comments tree with valid article ID")
    void getArticleCommentsTreeWithValidArticleId() {
        mockMvcTester.get().uri(BASE_URL + "/{articleId}", 1).contentType(MediaType.APPLICATION_JSON)
                     .headers(userAuthHeader()).assertThat().hasStatusOk().bodyJson().satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved the comments tree",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data"));

                         List<Integer> rootsIds = JsonPath.read(jsonContent.getJson(), "$.data[*].id");
                         assertEquals(1, rootsIds.size(), "There should be only one root comment");
                         assertEquals(createdCommentId, Long.parseLong(rootsIds.getFirst().toString()),
                                      "The root comment ID should match the created comment ID");

                         List<Integer> childrenOfRoot = JsonPath.read(jsonContent.getJson(),
                                                                      "$.data[0].children[*].id");
                         assertEquals(1, childrenOfRoot.size(), "There should be only one reply to the root comment");
                         assertEquals(createdReplyId, Long.parseLong(childrenOfRoot.getFirst().toString()),
                                      "The reply ID should match the created reply ID");
                     });
    }

    @Test
    @Order(4)
    @DisplayName("Delete comment with valid comment ID and an authenticated user attempts to delete its own comment")
    void testDeleteOwnComment() {
        mockMvcTester.delete().uri(BASE_URL + "/{articleId}/{commentId}", 1, createdCommentId)
                     .contentType(MediaType.APPLICATION_JSON).headers(userAuthHeader()).assertThat()
                     .hasStatus2xxSuccessful().hasStatus(HttpStatus.NO_CONTENT).bodyJson()
                     .satisfies(jsonContent -> assertEquals("You have successfully deleted the comment",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));

        assertEquals(0, commentRepository.countDistinctByArticle_Id(1L),
                     "There should be no comments left, as the root comment was deleted.");
    }


    @ParameterizedTest
    @CsvSource({
            "'', 'must not be blank'",
            "'   ', 'must not be blank'",
            "'1234', 'Comment body must be between 5 and 400 characters'",
            LONG_LOREM_IPSUM + ", 'Comment body must be between 5 and 400 characters'"
    })
    @DisplayName("Create comment with invalid request body")
    void createCommentWithInvalidRequestBody(String body, String expectedErrorMessage) {
        String newCommentPayload = """
                                   {
                                       "body": "%s"
                                   }
                                   """;

        mockMvcTester
                .post()
                .uri(BASE_URL + "/{articleId}", 1)
                .contentType(MediaType.APPLICATION_JSON)
                .headers(userAuthHeader())
                .content(newCommentPayload.formatted(body))
                .assertThat()
                .hasStatus4xxClientError()
                .hasStatus(HttpStatus.BAD_REQUEST)
                .failure()
                .isInstanceOf(org.springframework.web.bind.MethodArgumentNotValidException.class)
                .satisfies(throwable -> assertTrue(throwable.getMessage().contains(expectedErrorMessage)));
    }

    @Test
    @DisplayName("Delete comment with invalid comment ID")
    void deleteCommentWithInvalidCommentId() {
        mockMvcTester
                .delete()
                .uri(BASE_URL + "/{articleId}/{commentId}", 1, 9999)
                .contentType(MediaType.APPLICATION_JSON)
                .headers(userAuthHeader())
                .assertThat()
                .hasStatus4xxClientError()
                .hasStatus(HttpStatus.BAD_REQUEST)
                .failure()
                .isInstanceOf(IllegalRequestException.class);
    }
}