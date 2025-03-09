package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CategoryRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.barataribeiro.sentinelofliberty.utils.ConcurrencyTestUtil;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.NEW_ARTICLE_PAYLOAD;
import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.UPDATE_ARTICLE_PAYLOAD;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ArticleControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/articles";

    private static Long createdArticleId;

    private final MockMvcTester mockMvcTester;
    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;

    @Test
    @DisplayName("Test get public latest articles where a user attempts to get the latest articles")
    void testGetLatestArticles() {
        mockMvcTester.get().uri(BASE_URL + "/public/latest").assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved the latest articles",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertInstanceOf(List.class, JsonPath.read(jsonContent.getJson(), "$.data"),
                                          "Data should be a list");
                     });
    }

    @Test
    @Order(3)
    @DisplayName("Test get public popular articles where a user attempts to get the popular articles")
    void testGetPopularArticles() {
        mockMvcTester.post().uri("/api/v1/comments/{articleId}", createdArticleId)
                     .contentType(MediaType.APPLICATION_JSON)
                     .header(HttpHeaders.AUTHORIZATION, "Bearer " + userAccessToken)
                     .content("""
                              {
                                  "body": "This is a test comment. It is a very good test comment. This additional text ensures the content is at least 100 characters."
                              }
                              """)
                     .assertThat().hasStatus(HttpStatus.CREATED).hasStatus2xxSuccessful();

        mockMvcTester.get().uri(BASE_URL + "/public/popular").assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved the popular articles",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertInstanceOf(List.class, JsonPath.read(jsonContent.getJson(), "$.data"),
                                          "Data should be a list");

                         List<Integer> articleIds = JsonPath.read(jsonContent.getJson(), "$.data[*].id");
                         assertFalse(articleIds.isEmpty(), "Popular articles list should not be empty");
                         assertEquals(createdArticleId, Long.parseLong(articleIds.getFirst().toString()),
                                      "First popular article should be the one we created");
                     });
    }

    @Test
    @DisplayName("Test get all own articles where an authenticated admin attempts to get all of their articles " +
            "paginated")
    void testGetAllOwnArticles() {
        mockMvcTester.get().uri(BASE_URL)
                     .headers(authHeader())
                     .param("page", "0")
                     .param("perPage", "10")
                     .param("direction", "ASC")
                     .param("orderBy", "createdAt")
                     .assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved all of your articles",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertInstanceOf(LinkedHashMap.class, JsonPath.read(jsonContent.getJson(), "$.data"),
                                          "Data should be a list");
                     });
    }

    @Test
    @DisplayName("Test get all articles by category with valid category name")
    void testGetAllArticlesByCategoryWithValidCategory() {
        mockMvcTester.get().uri(BASE_URL + "/public/category/{category}", "test")
                     .param("page", "0")
                     .param("perPage", "10")
                     .param("direction", "ASC")
                     .param("orderBy", "createdAt")
                     .assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved all articles for the category test",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertInstanceOf(List.class, JsonPath.read(jsonContent.getJson(), "$.data.content"),
                                          "Data should be a list");
                     });
    }

    @Test
    @DisplayName("Test get all articles by category with non-existing category name")
    void testGetAllArticlesByCategoryWithNonExistingCategory() {
        String nonExistingCategory = "nonExistingCategory";
        mockMvcTester.get().uri(BASE_URL + "/public/category/{category}", nonExistingCategory)
                     .param("page", "0")
                     .param("perPage", "10")
                     .param("direction", "ASC")
                     .param("orderBy", "createdAt")
                     .assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved all articles for the category %s"
                                              .formatted(nonExistingCategory),
                                      JsonPath.read(jsonContent.getJson(), "$.message"));

                         List<?> content = JsonPath.read(jsonContent.getJson(), "$.data.content");

                         assertInstanceOf(List.class, content, "Data should be a list");

                         assertTrue(content.isEmpty());
                     });
    }

    @Test
    @DisplayName("Test get all articles by category with invalid pagination parameters")
    void testGetAllArticlesByCategoryWithInvalidPagination() {
        mockMvcTester.get().uri(BASE_URL + "/public/category/{category}", "test")
                     .param("page", "-1")
                     .param("perPage", "-10")
                     .param("direction", "ASC")
                     .param("orderBy", "createdAt")
                     .assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Test get public article where an logged or not user attempts to get an article")
    void testGetArticle() {
        mockMvcTester.get().uri(BASE_URL + "/public/article/{articleId}", 1L).assertThat()
                     .hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> assertEquals(1,
                                                            Long.parseLong(JsonPath.read(jsonContent.getJson(),
                                                                                         "$.data.id").toString())));
    }

    @Test
    @Order(1)
    @DisplayName("Test create article with valid request body and an authenticated admin attempts to create an article")
    void testCreateArticle() {
        mockMvcTester.post().uri(BASE_URL).contentType(MediaType.APPLICATION_JSON).headers(authHeader())
                     .content(NEW_ARTICLE_PAYLOAD)
                     .assertThat().hasStatus2xxSuccessful().hasStatus(HttpStatus.CREATED).bodyJson()
                     .satisfies(jsonContent -> {
                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data.id"));
                         assertEquals("You have successfully created an article",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertEquals(JsonPath.read(NEW_ARTICLE_PAYLOAD, "$.title"),
                                      (String) JsonPath.read(jsonContent.getJson(), "$.data.title"));

                         createdArticleId = Long.parseLong(
                                 JsonPath.read(jsonContent.getJson(), "$.data.id").toString());
                     });

        assertTrue(articleRepository.existsById(createdArticleId));
    }

    @Test
    @Order(2)
    @Transactional
    @DisplayName("Test update article with valid request body and an authenticated admin attempts to update an article")
    void testUpdateArticle() {
        mockMvcTester.patch().uri(BASE_URL + "/{articleId}", createdArticleId).contentType(MediaType.APPLICATION_JSON)
                     .headers(authHeader()).content(UPDATE_ARTICLE_PAYLOAD).assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> {
                         assertNotNull(JsonPath.read(jsonContent.getJson(), "$.data"), "Data should not be null");

                         String expectedTitle = JsonPath.read(UPDATE_ARTICLE_PAYLOAD, "$.title");
                         Long expectedId = Long.parseLong(JsonPath.read(jsonContent.getJson(), "$.data.id").toString());
                         String expectedOldCategory = JsonPath.read(NEW_ARTICLE_PAYLOAD, "$.categories[0]");
                         String expectedNewCategoryOne = JsonPath.read(UPDATE_ARTICLE_PAYLOAD, "$.categories[0]");
                         String expectedNewCategoryTwo = JsonPath.read(UPDATE_ARTICLE_PAYLOAD, "$.categories[1]");

                         assertEquals("You have successfully updated the article",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));

                         assertEquals(expectedTitle, JsonPath.read(jsonContent.getJson(), "$.data.title"));

                         assertEquals(createdArticleId, expectedId);

                         assertEquals(1, articleRepository.findByCategories_Name(expectedNewCategoryOne).size());
                         assertEquals(1, articleRepository.findByCategories_Name(expectedNewCategoryTwo).size());
                         assertTrue(articleRepository.findByCategories_Name(expectedOldCategory).isEmpty());
                         assertTrue(categoryRepository.findByName(expectedOldCategory)
                                                      .map(category -> category.getArticles().isEmpty())
                                                      .orElse(false));
                     });
    }

    @Test
    @Order(4)
    @DisplayName("Test concurrent creation of multiple requests and only one should exist in the database")
    void testConcurrentCreateArticle(@Autowired @NotNull MockMvc mockMvc) {
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
    @Order(5)
    @DisplayName("Test delete article where an authenticated admin attempts to delete an article")
    void testDeleteArticle() {
        mockMvcTester.delete().uri(BASE_URL + "/{articleId}", createdArticleId).headers(authHeader()).assertThat()
                     .hasStatus(HttpStatus.NO_CONTENT).bodyJson()
                     .satisfies(jsonContent -> assertEquals("You have successfully deleted the article",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));

        assertTrue(articleRepository.findById(createdArticleId).isEmpty());
    }

    @Test
    @DisplayName("Test create article with valid request body, based on a created suggestion, and it is successful")
    void testCreateArticleFromSuggestion() {
        String suggestionPayload = """
                                   {
                                       "suggestionId": %d,
                                       "title": "Test Article from Suggestion",
                                       "subTitle": "Based on a Suggestion",
                                       "summary": "This is a test summary with sufficient length to pass validation.",
                                       "content": "This is a test article from a suggestion. It is a very good test article based on a suggestion. This additional text ensures the content is at least 100 characters.",
                                       "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                       "categories": ["test"]
                                   }
                                   """;

        mockMvcTester.post().uri(BASE_URL).contentType(MediaType.APPLICATION_JSON).headers(authHeader())
                     .content(suggestionPayload.formatted(getSuggestionIdToBeUsedInTests())).assertThat()
                     .hasStatus2xxSuccessful().hasStatus(HttpStatus.CREATED).bodyJson().satisfies(jsonContent -> {
                         String expectedTitle = JsonPath.read(suggestionPayload
                                                                      .formatted(getSuggestionIdToBeUsedInTests()),
                                                              "$.title");
                         String expectedSubTitle = JsonPath.read(suggestionPayload
                                                                         .formatted(getSuggestionIdToBeUsedInTests()),
                                                                 "$.subTitle");

                         assertEquals(expectedTitle, JsonPath.read(jsonContent.getJson(), "$.data.title"));
                         assertEquals(expectedSubTitle, JsonPath.read(jsonContent.getJson(), "$.data.subTitle"));
                     });
    }

    @Test
    @DisplayName("Test create article with invalid request body, based on a created suggestion, and it fails")
    void testCreateArticleFromSuggestionWithInvalidRequestBody() {
        String suggestionPayload = """
                                   {
                                       "suggestionId": 80,
                                       "title": "Test Article from Suggestion",
                                       "subTitle": "Based on a Suggestion",
                                       "summary": "This is a test summary with sufficient length to pass validation.",
                                       "content": "This is a test article from a suggestion. It is a very good test article based on a suggestion. This additional text ensures the content is at least 100 characters.",
                                       "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                       "categories": ["test"]
                                   }
                                   """;

        mockMvcTester.post().uri(BASE_URL).contentType(MediaType.APPLICATION_JSON).headers(authHeader())
                     .content(suggestionPayload).assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.NOT_FOUND)
                     .failure().isInstanceOf(EntityNotFoundException.class);
    }
}