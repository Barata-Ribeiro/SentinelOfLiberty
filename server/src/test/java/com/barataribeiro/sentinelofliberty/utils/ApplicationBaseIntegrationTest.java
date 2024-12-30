package com.barataribeiro.sentinelofliberty.utils;

import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.BeforeAll;
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.VALID_ADMIN_LOGIN_PAYLOAD;
import static com.barataribeiro.sentinelofliberty.utils.ApplicationTestConstants.VALID_LOGIN_PAYLOAD;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public abstract class ApplicationBaseIntegrationTest {
    protected static String accessToken;
    protected static String userAccessToken;

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
            mockMvc.perform(MockMvcRequestBuilders
                                    .post("/api/v1/auth/login")
                                    .contentType("application/json")
                                    .content(VALID_ADMIN_LOGIN_PAYLOAD))
                   .andExpect(MockMvcResultMatchers.status().isOk())
                   .andDo(MockMvcResultHandlers.print())
                   .andDo(result -> {
                       String responseBody = result.getResponse().getContentAsString();
                       accessToken = JsonPath.read(responseBody, "$.data.accessToken");
                   });

            mockMvc.perform(MockMvcRequestBuilders
                                    .post("/api/v1/auth/login")
                                    .contentType("application/json")
                                    .content(VALID_LOGIN_PAYLOAD))
                   .andExpect(MockMvcResultMatchers.status().isOk())
                   .andDo(MockMvcResultHandlers.print())
                   .andDo(result -> {
                       String responseBody = result.getResponse().getContentAsString();
                       userAccessToken = JsonPath.read(responseBody, "$.data.accessToken");
                   });
        }

        // Generate list of new articles
        for (int i = 0; i < 10; i++) {
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
                                             """.formatted(i, new java.util.Random().nextInt(1000), "testing" + i)))
                   .andDo(MockMvcResultHandlers.print());
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
}
