package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.repositories.SuggestionRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.barataribeiro.sentinelofliberty.utils.ConcurrencyTestUtil;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.NEW_SUGGESTION_PAYLOAD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class SuggestionControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/suggestions";

    private final MockMvc mockMvc;
    private final SuggestionRepository suggestionRepository;

    @Test
    @DisplayName("Test where an user, authenticated or not, attempts to get the latest public suggestions")
    void testGetLatestPublicSuggestions() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public/latest"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.message").value("You have successfully retrieved the latest suggestions"))
               .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Test where an user, authenticated or not, attempts to get all public suggestions")
    void testGetAllPublicSuggestionsPaginated() throws Exception {
        mockMvc.perform(get(BASE_URL + "/public")
                                .param("page", "0")
                                .param("perPage", "10")
                                .param("direction", "ASC")
                                .param("orderBy", "createdAt"))
               .andExpect(status().isOk())
               .andDo(print())
               .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    @DisplayName("Test concurrent creation of multiple suggestions and all should exist in the database")
    void testConcurrentCreateSuggestion() {
        ConcurrencyTestUtil.doAsyncAndConcurrently(10, () -> mockMvc
                .perform(post(BASE_URL)
                                 .headers(userAuthHeader())
                                 .contentType(MediaType.APPLICATION_JSON)
                                 .content("""
                                          {
                                              "title": "Test Concurrent Suggestion",
                                              "content": "This is a test content for a concurrent suggestion. It is a very good test content. This additional text ensures the content is at least 100 characters.",
                                              "mediaUrl": "https://exampleOne.com/image.jpg",
                                              "sourceUrl": "https://exampleTwo.com"
                                          }
                                          """))
                .andExpect(status().isCreated())
                .andDo(print()));

        assertEquals(10, suggestionRepository.countDistinctByTitleAllIgnoreCase("Test Concurrent Suggestion"),
                     "Ten instances of the suggestion should exist in the database because only the id is unique");
    }

    @Test
    @DisplayName("Test where an authenticated user attempts to create a suggestion and is successful")
    void testCreateSuggestion() throws Exception {
        mockMvc.perform(post(BASE_URL)
                                .headers(userAuthHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(NEW_SUGGESTION_PAYLOAD))
               .andExpect(status().isCreated())
               .andDo(print())
               .andExpect(jsonPath("$.data.title").value("Test Suggestion"));
    }

    @Test
    @DisplayName("Test where an authenticated user attempts to create a suggestion with invalid payload")
    void testCreateSuggestionWithInvalidPayload() throws Exception {
        mockMvc.perform(post(BASE_URL)
                                .headers(userAuthHeader())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                         {
                                             "title": "",
                                             "content": "This...",
                                             "mediaUrl": "http://exampleOne.com/image.jpg",
                                             "sourceUrl": "http://exampleTwo.com"
                                         }
                                         """))
               .andExpect(status().isBadRequest())
               .andDo(print())
               .andExpect(result -> assertInstanceOf(MethodArgumentNotValidException.class,
                                                     result.getResolvedException()));
    }
}