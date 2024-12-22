package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
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

import java.util.LinkedHashMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ArticleControllerTestIT {
    private static final String BASE_URL = "/api/v1/articles";
    private static final String ARTICLE_PAYLOAD = """
                                                  {
                                                      "title": "Test Article",
                                                      "subTitle": "Short Test",
                                                      "content": "This is a test article. It is a very good test article. This additional text ensures the content is at least 100 characters.",
                                                      "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                                      "categories": ["test"]
                                                  }
                                                  """;

    private static String accessToken;
    private final MockMvc mockMvc;
    private Article articleToModify;

    @Autowired
    private ArticleRepository articleRepository;

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
                                                   .content("{\"username\": \"testadmin\", \"password\": " +
                                                                    "\"testpassword\"}"))
                                  .andExpect(MockMvcResultMatchers.status().isOk())
                                  .andDo(MockMvcResultHandlers.print())
                                  .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        accessToken = JsonPath.read(responseBody, "$.data.accessToken");
    }

    @Test
    @Transactional
    void testCreateArticle() throws Exception {
        MvcResult result = mockMvc.perform(post(BASE_URL)
                                                   .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                                                   .contentType(MediaType.APPLICATION_JSON)
                                                   .content(ARTICLE_PAYLOAD))
                                  .andExpect(MockMvcResultMatchers.status().isCreated())
                                  .andDo(MockMvcResultHandlers.print())
                                  .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        LinkedHashMap<String, Object> dataMap = JsonPath.read(responseBody, "$.data");
        this.articleToModify = objectMapper.convertValue(dataMap, Article.class);

        Integer id = JsonPath.read(responseBody, "$.data.id");

        assertEquals("Test Article", JsonPath.read(responseBody, "$.data.title"));
        assertTrue(articleRepository.existsById(Long.valueOf(id)));
    }
}