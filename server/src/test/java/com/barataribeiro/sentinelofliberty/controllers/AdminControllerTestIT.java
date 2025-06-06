package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import com.jayway.jsonpath.JsonPath;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class AdminControllerTestIT extends ApplicationBaseIntegrationTest {
    private static final String BASE_URL = "/api/v1/admin";

    private final MockMvcTester mockMvcTester;

    @Test
    @DisplayName("Test to get all users in the system paginated")
    void testGetAllUsersPaginated() {
        mockMvcTester.get().uri(BASE_URL + "/users")
                     .param("search", "testuser")
                     .param("page", "0")
                     .param("perPage", "10")
                     .param("direction", "ASC")
                     .param("orderBy", "createdAt")
                     .headers(authHeader())
                     .assertThat().hasStatusOk().bodyJson().satisfies(jsonContent -> {
                         assertEquals("You have successfully retrieved all users",
                                      JsonPath.read(jsonContent.getJson(), "$.message"));
                         assertInstanceOf(List.class, JsonPath.read(jsonContent.getJson(), "$.data.content"));
                         assertTrue((Integer) JsonPath.read(jsonContent.getJson(), "$.data.page.totalElements") > 0);
                     });
    }

    @Test
    @DisplayName("Test admin banning and unbanning an user")
    void testAdminBanOrUnbanAnUser() {
        mockMvcTester.patch().uri(BASE_URL + "/users/{username}", "testuser").param("action", "ban")
                     .headers(authHeader()).assertThat().hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> assertEquals("You have successfully banned the user",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));

        mockMvcTester.patch().uri(BASE_URL + "/users/{username}", "testuser").param("action", "unban")
                     .headers(authHeader()).assertThat().hasStatusOk()
                     .bodyJson()
                     .satisfies(jsonContent -> assertEquals("You have successfully unbanned the user",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));
    }

    @Test
    @DisplayName("Test admin toggling an user's verification status")
    void testAdminToggleVerification() {
        mockMvcTester.patch().uri(BASE_URL + "/users/{username}/toggle-verification", "testuser")
                     .headers(authHeader()).assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> assertEquals("You have successfully verified the user",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));

        mockMvcTester.patch().uri(BASE_URL + "/users/{username}/toggle-verification", "testuser")
                     .headers(authHeader()).assertThat().hasStatusOk().bodyJson()
                     .satisfies(jsonContent -> assertEquals("You have successfully unverified the user",
                                                            JsonPath.read(jsonContent.getJson(), "$.message")));
    }

    @Test
    @DisplayName("Test where a regular user tries to access the admin endpoint, should return 403")
    void testRegularUserAccessingAdminEndpoint() {
        mockMvcTester.patch().uri(BASE_URL + "/users/{username}", "testuser").param("action", "ban")
                     .headers(userAuthHeader()).assertThat().hasStatus4xxClientError().hasStatus(HttpStatus.FORBIDDEN)
                     .failure().isInstanceOf(AccessDeniedException.class);
    }
}