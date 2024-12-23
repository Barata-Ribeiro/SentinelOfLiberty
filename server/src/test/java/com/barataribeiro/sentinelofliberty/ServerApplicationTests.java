package com.barataribeiro.sentinelofliberty;

import com.barataribeiro.sentinelofliberty.controllers.ArticleController;
import com.barataribeiro.sentinelofliberty.controllers.AuthController;
import com.barataribeiro.sentinelofliberty.services.ArticleService;
import com.barataribeiro.sentinelofliberty.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class ServerApplicationTests {
    private final ServerApplication serverApplication;
    private final AuthController authController;
    private final AuthService authService;
    private final ArticleController articleController;
    private final ArticleService articleService;

    @Test
    void contextLoads() {
        assertThat(serverApplication).isNotNull();
        assertThat(authController).isNotNull();
        assertThat(authService).isNotNull();
        assertThat(articleController).isNotNull();
        assertThat(articleService).isNotNull();
    }

}
