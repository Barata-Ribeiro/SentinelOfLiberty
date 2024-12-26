package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CategoryRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.utils.ConcurrencyTestUtil;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ArticleControllerTestIT {
    private static final String BASE_URL = "/api/v1/articles";

    private static String accessToken;
    private static Long createdArticleId;
    private final MockMvc mockMvc;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired private CategoryRepository categoryRepository;

    @BeforeAll
    static void createTestingAdmin(@Autowired @NotNull PasswordEncoder passwordEncoder,
                                   @Autowired @NotNull UserRepository userRepository,
                                   @Autowired @NotNull MockMvc mockMvc) throws Exception {
        User admin = User.builder()
                         .username("testadmin")
                         .email("testadmin@example.com")
                         .password(passwordEncoder.encode("testpassword"))
                         .role(Roles.ADMIN)
                         .displayName("Test Admin")
                         .build();

        userRepository.save(admin);

        // Authenticate and get the token
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                                                   .post("/api/v1/auth/login")
                                                   .contentType("application/json")
                                                   .content(VALID_ADMIN_LOGIN_PAYLOAD))
                                  .andExpect(MockMvcResultMatchers.status().isOk())
                                  .andDo(MockMvcResultHandlers.print())
                                  .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        accessToken = JsonPath.read(responseBody, "$.data.accessToken");

        // Generate list of new articles
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(post(BASE_URL)
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content("""
                                             {
                                                 "title": "Test Article %d",
                                                 "subTitle": "Short Test",
                                                 "content": "This is a test article. It is a very good test article. This additional text ensures the content is at least 100 characters.",
                                                 "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                                 "categories": ["%s", "listTest"]
                                             }
                                             """.formatted(i, "testing" + i)));
        }
    }

    @Test
    @Order(1)
    @DisplayName("Test create article with valid request body and an authenticated admin attempts to create an article")
    void testCreateArticle() throws Exception {
        MvcResult result = mockMvc.perform(post(BASE_URL)
                                                   .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                                                   .contentType(MediaType.APPLICATION_JSON)
                                                   .content(NEW_ARTICLE_PAYLOAD))
                                  .andExpect(MockMvcResultMatchers.status().isCreated())
                                  .andDo(MockMvcResultHandlers.print())
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
                                                   .patch(BASE_URL + "/" + createdArticleId)
                                                   .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                                                   .contentType(MediaType.APPLICATION_JSON)
                                                   .content(UPDATE_ARTICLE_PAYLOAD))
                                  .andExpect(MockMvcResultMatchers.status().isOk())
                                  .andDo(MockMvcResultHandlers.print())
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
                .perform(MockMvcRequestBuilders.post(BASE_URL)
                                               .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                                               .contentType(MediaType.APPLICATION_JSON)
                                               .content(NEW_ARTICLE_PAYLOAD))
                .andExpect(MockMvcResultMatchers.status().isConflict())
                .andDo(MockMvcResultHandlers.print()));

        assertEquals(1, articleRepository.countByTitle("Test Article"),
                     "Only one instance of the article should exist in the database");
    }

    @Test
    @Order(4)
    @DisplayName("Test delete article where an authenticated admin attempts to delete an article")
    void testDeleteArticle() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                                .delete(BASE_URL + "/" + createdArticleId)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
               .andExpect(MockMvcResultMatchers.status().isNoContent())
               .andDo(MockMvcResultHandlers.print());

        assertTrue(articleRepository.findById(createdArticleId).isEmpty());
    }

    @Test
    @DisplayName("Test get all own articles where an authenticated admin attempts to get all of their articles " +
            "paginated")
    void testGetAllOwnArticles() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(BASE_URL)
                                              .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                                              .param("page", "0")
                                              .param("perPage", "10")
                                              .param("direction", "ASC"))
               .andExpect(MockMvcResultMatchers.status().isOk())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("Test get public latest articles where a user attempts to get the latest articles")
    void testGetLatestArticles() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/public/latest"))
               .andExpect(MockMvcResultMatchers.status().isOk())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Test get public article where a user attempts to get an article")
    void testGetArticle() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/public/1"))
               .andExpect(MockMvcResultMatchers.status().isOk())
               .andDo(MockMvcResultHandlers.print())
               .andExpect(MockMvcResultMatchers.jsonPath("$.data.id").value(1));
    }
}