package com.barataribeiro.sentinelofliberty.config.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Security headers are set correctly")
    void securityHeadersAreSetCorrectly() throws Exception {
        mockMvc.perform(get("/api/v1/articles/public/latest"))
               .andExpect(status().isOk())
               .andExpect(header().string("X-Content-Type-Options", "nosniff"))
               .andExpect(header().string("X-XSS-Protection", "1; mode=block"))
               .andExpect(header().string("Content-Security-Policy",
                                          "script-src 'self'; frame-ancestors 'self'; upgrade-insecure-requests"))
               .andExpect(header().string("X-Frame-Options", "SAMEORIGIN"))
               .andExpect(header().string("Permissions-Policy", "geolocation=(), microphone=(), camera=()"));
    }
}