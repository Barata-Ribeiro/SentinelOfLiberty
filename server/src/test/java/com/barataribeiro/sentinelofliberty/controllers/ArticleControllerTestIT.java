package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CategoryRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.barataribeiro.sentinelofliberty.utils.ConcurrencyTestUtil;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.NEW_ARTICLE_PAYLOAD;
import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.UPDATE_ARTICLE_PAYLOAD;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ArticleControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/articles";

    private static Long createdArticleId;
    private final MockMvc mockMvc;

    @Autowired private ArticleRepository articleRepository;
    @Autowired private CategoryRepository categoryRepository;

    @Test
    @Order(1)
    @DisplayName("Test create article with valid request body and an authenticated admin attempts to create an article")
    void testCreateArticle() throws Exception {
        MvcResult result = mockMvc.perform(post(BASE_URL)
                                                   .headers(authHeader())
                                                   .contentType(MediaType.APPLICATION_JSON)
                                                   .content(NEW_ARTICLE_PAYLOAD))
                                  .andExpect(status().isCreated())
                                  .andDo(print())
                                  .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        createdArticleId = Long.parseLong(JsonPath.read(responseBody, "$.data.id").toString());

        assertEquals("Test Article", JsonPath.read(responseBody, "$.data.title"));
        assertTrue(articleRepository.existsById(createdArticleId));
    }

    @Test
    @Order(2)
    @Transactional
    @DisplayName("Test update article with valid request body and an authenticated admin attempts to update an article")
    void testUpdateArticle() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                                                   .patch(BASE_URL + "/{articleId}", createdArticleId)
                                                   .headers(authHeader())
                                                   .contentType(MediaType.APPLICATION_JSON)
                                                   .content(UPDATE_ARTICLE_PAYLOAD))
                                  .andExpect(status().isOk())
                                  .andDo(print())
                                  .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        assertEquals("Updated Test Article", JsonPath.read(responseBody, "$.data.title"));
        assertEquals(1, articleRepository.findByCategories_Name("testing").size());
        assertEquals(1, articleRepository.findByCategories_Name("update").size());
        assertTrue(articleRepository.findByCategories_Name("test").isEmpty());
        assertTrue(categoryRepository.findByName("test")
                                     .map(category -> category.getArticles().isEmpty())
                                     .orElse(false));
    }

    @Test
    @Order(3)
    @DisplayName("Test concurrent creation of multiple requests and only one should exist in the database")
    void testConcurrentCreateArticle() {
        ConcurrencyTestUtil.doAsyncAndConcurrently(10, () -> mockMvc
                .perform(post(BASE_URL)
                                 .headers(authHeader())
                                 .contentType(MediaType.APPLICATION_JSON)
                                 .content(NEW_ARTICLE_PAYLOAD))
                .andExpect(status().isConflict())
                .andDo(print()));

        assertEquals(1, articleRepository.countByTitle("Test Article"),
                     "Only one instance of the article should exist in the database");
    }

    @Test
    @Order(4)
    @DisplayName("Test delete article where an authenticated admin attempts to delete an article")
    void testDeleteArticle() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                                .delete(BASE_URL + "/{articleId}", createdArticleId)
                                .headers(authHeader()))
               .andExpect(status().isNoContent())
               .andDo(print())
               .andExpect(jsonPath("$.message").value("You have successfully deleted the article"));

        assertTrue(articleRepository.findById(createdArticleId).isEmpty());
    }

    @Test
    @DisplayName("Test get all own articles where an authenticated admin attempts to get all of their articles " +
            "paginated")
    void testGetAllOwnArticles() throws Exception {
        mockMvc.perform(get(BASE_URL)
                                .headers(authHeader())
                                .param("page", "0")
                                .param("perPage", "10")
                                .param("direction", "ASC"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("Test get public latest articles where a user attempts to get the latest articles")
    void testGetLatestArticles() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public/latest"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Test get public article where an logged or not user attempts to get an article")
    void testGetArticle() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public/{articleId}", 1))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("Test create article with valid request body, based on a created suggestion, and it is successful")
    void testCreateArticleFromSuggestion() throws Exception {
        mockMvc.perform(post(BASE_URL)
                                .headers(authHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                         {
                                             "suggestionId": %d,
                                             "title": "Test Article from Suggestion",
                                             "subTitle": "Based on a Suggestion",
                                             "content": "This is a test article from a suggestion. It is a very good test article based on a suggestion. This additional text ensures the content is at least 100 characters.",
                                             "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                             "categories": ["test"]
                                         }
                                         """.formatted(getSuggestionIdToBeUsedInTests())))
               .andExpect(status().isCreated())
               .andDo(print())
               .andExpect(jsonPath("$.data.title").value("Test Article from Suggestion"));
    }

    @Test
    @DisplayName("Test create article with invalid request body, based on a created suggestion, and it fails")
    void testCreateArticleFromSuggestionWithInvalidRequestBody() throws Exception {
        mockMvc.perform(post(BASE_URL)
                                .headers(authHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                         {
                                             "suggestionId": 80,
                                             "title": "Test Article from Suggestion",
                                             "subTitle": "Based on a Suggestion",
                                             "content": "This is a test article from a suggestion. It is a very good test article based on a suggestion. This additional text ensures the content is at least 100 characters.",
                                             "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                             "categories": ["test"]
                                         }
                                         """))
               .andExpect(status().isNotFound())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(EntityNotFoundException.class, result.getResolvedException()));
    }
}