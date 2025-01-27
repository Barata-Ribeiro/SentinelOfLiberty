package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.repositories.SuggestionRepository;
import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.barataribeiro.sentinelofliberty.utils.ConcurrencyTestUtil;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.LinkedHashMap;
import java.util.List;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.NEW_SUGGESTION_PAYLOAD;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class SuggestionControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/suggestions";

    private final MockMvcTester mockMvcTester;
    private final SuggestionRepository suggestionRepository;

    @Test
    @DisplayName("Test where an user, authenticated or not, attempts to get the latest public suggestions")
    void testGetLatestPublicSuggestions() {
        mockMvcTester.get().uri(BASE_URL + "/public/latest").assertThat()
                     .hasStatusOk().bodyJson().satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved the latest suggestions",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertInstanceOf(List.class, JsonPath.read(jsonContent.getJson(), "$.data"),
                                          "Data should be a list");
                     });
    }

    @Test
    @DisplayName("Test where an user, authenticated or not, attempts to get all public suggestions")
    void testGetAllPublicSuggestionsPaginated() {
        mockMvcTester.get().uri(BASE_URL + "/public")
                     .param("page", "0")
                     .param("perPage", "10")
                     .param("direction", "ASC")
                     .param("orderBy", "createdAt")
                     .assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> assertInstanceOf(LinkedHashMap.class,
                                                                JsonPath.read(jsonContent.getJson(), "$.data"),
                                                                "Data should be linked hash map"));

    }

    @Test
    @DisplayName("Test concurrent creation of multiple suggestions and all should exist in the database")
    void testConcurrentCreateSuggestion(@Autowired @NotNull MockMvc mockMvc) {
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
    void testCreateSuggestion() {
        mockMvcTester.post().uri(BASE_URL).contentType(MediaType.APPLICATION_JSON).headers(userAuthHeader())
                     .content(NEW_SUGGESTION_PAYLOAD)
                     .assertThat().hasStatus2xxSuccessful().hasStatus(HttpStatus.CREATED)
                     .bodyJson().extractingPath("$.data")
                     .satisfies(jsonContent -> {
                         String expectedTitle = JsonPath.read(NEW_SUGGESTION_PAYLOAD, "$.title");
                         String expectedContent = JsonPath.read(NEW_SUGGESTION_PAYLOAD, "$.content");
                         String expectedMediaUrl = JsonPath.read(NEW_SUGGESTION_PAYLOAD, "$.mediaUrl");
                         String expectedSourceUrl = JsonPath.read(NEW_SUGGESTION_PAYLOAD, "$.sourceUrl");

                         assertEquals(expectedTitle, JsonPath.read(jsonContent, "$.title"));
                         assertEquals(expectedContent, JsonPath.read(jsonContent, "$.content"));
                         assertEquals(expectedMediaUrl, JsonPath.read(jsonContent, "$.mediaUrl"));
                         assertEquals(expectedSourceUrl, JsonPath.read(jsonContent, "$.sourceUrl"));
                     });
    }

    @Test
    @DisplayName("Test where an authenticated user attempts to create a suggestion with invalid payload")
    void testCreateSuggestionWithInvalidPayload() {
        mockMvcTester.post().uri(BASE_URL).contentType(MediaType.APPLICATION_JSON).headers(userAuthHeader())
                     .content("""
                              {
                                "title": "",
                                "content": "This...",
                                "mediaUrl": "http://exampleOne.com/image.jpg",
                                "sourceUrl": "http://exampleTwo.com"
                              }
                              """).assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.BAD_REQUEST)
                     .failure().isInstanceOf(MethodArgumentNotValidException.class);

    }
}