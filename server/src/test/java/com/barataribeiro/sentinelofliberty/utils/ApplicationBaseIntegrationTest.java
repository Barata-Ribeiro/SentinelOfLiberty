package com.barataribeiro.sentinelofliberty.utils;

import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.TestInstance;
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

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.VALID_ADMIN_LOGIN_PAYLOAD;
import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.VALID_LOGIN_PAYLOAD;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public abstract class ApplicationBaseIntegrationTest {
    protected static String accessToken;
    protected static String userAccessToken;

    protected static Long suggestionIdToBeDeleted;
    protected static Long suggestionIdToBeUsedInTests;

    @BeforeAll
    static void createTestingAdmin(@Autowired @NotNull PasswordEncoder passwordEncoder,
                                   @Autowired @NotNull UserRepository userRepository,
                                   @Autowired @NotNull MockMvc mockMvc) throws Exception {
        if (!userRepository.existsByUsernameOrEmailAllIgnoreCase("testadmin", "testadmin@example.com")) {
            User admin = User.builder()
                             .username("testadmin")
                             .email("testadmin@example.com")
                             .password(passwordEncoder.encode("testpassword"))
                             .role(Roles.ADMIN)
                             .displayName("Test Admin")
                             .build();
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsernameOrEmailAllIgnoreCase("testuser", "testuser@example.com")) {
            User user = User.builder()
                            .username("testuser")
                            .email("testuser@example.com")
                            .password(passwordEncoder.encode("testpassword"))
                            .role(Roles.USER)
                            .displayName("Test User")
                            .build();
            userRepository.save(user);
        }

        // Authenticate and get the token
        if (accessToken == null || userAccessToken == null) {
            mockMvc.perform(post("/api/v1/auth/login")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(VALID_ADMIN_LOGIN_PAYLOAD))
                   .andExpect(status().isOk())
                   .andDo(print())
                   .andDo(result -> {
                       String responseBody = result.getResponse().getContentAsString();
                       accessToken = JsonPath.read(responseBody, "$.data.accessToken");
                   });

            mockMvc.perform(post("/api/v1/auth/login")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(VALID_LOGIN_PAYLOAD))
                   .andExpect(status().isOk())
                   .andDo(print())
                   .andDo(result -> {
                       String responseBody = result.getResponse().getContentAsString();
                       userAccessToken = JsonPath.read(responseBody, "$.data.accessToken");
                   });
        }

        // Generate list of new articles
        for (int i = 0; i < 10; i++) {
            final int index = i;
            mockMvc.perform(post("/api/v1/articles")
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content("""
                                             {
                                                 "title": "Test Article %d-%d",
                                                 "subTitle": "Short Test",
                                                 "content": "This is a test article. It is a very good test article. This additional text ensures the content is at least 100 characters.",
                                                 "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                                 "categories": ["%s", "listTest"]
                                             }
                                             """.formatted(index, System.currentTimeMillis(), "testing" + index)))
                   .andDo(print());

            mockMvc.perform(post("/api/v1/suggestions")
                                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + userAccessToken)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content("""
                                             {
                                                 "title": "Test Suggestion %d-%d",
                                                 "content": "This is a test suggestion. It is a very good test suggestion. This additional text ensures the content is at least 100 characters.",
                                                 "mediaUrl": "https://exampleOne.com/image.jpg",
                                                 "sourceUrl": "https://exampleTwo.com"
                                             }
                                             """.formatted(index, System.currentTimeMillis()))
                                    .accept(MediaType.APPLICATION_JSON))
                   .andDo(print())
                   .andDo(result -> {
                       String responseBody = result.getResponse().getContentAsString();
                       Integer suggestionId = JsonPath.read(responseBody, "$.data.id");
                       if (index == 0) suggestionIdToBeDeleted = Long.valueOf(suggestionId);
                       else if (index == 1) suggestionIdToBeUsedInTests = Long.valueOf(suggestionId);
                   });
        }
    }

    protected HttpHeaders authHeader() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
        return headers;
    }

    protected HttpHeaders userAuthHeader() {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.AUTHORIZATION, "Bearer " + userAccessToken);
        return headers;
    }

    protected Long getSuggestionIdToBeDeleted() {
        return suggestionIdToBeDeleted;
    }

    protected Long getSuggestionIdToBeUsedInTests() {
        return suggestionIdToBeUsedInTests;
    }
}
