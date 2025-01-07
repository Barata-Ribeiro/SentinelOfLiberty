package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.NEW_SUGGESTION_PAYLOAD;
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
}