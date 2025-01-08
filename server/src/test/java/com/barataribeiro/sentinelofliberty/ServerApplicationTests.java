package com.barataribeiro.sentinelofliberty;

import com.barataribeiro.sentinelofliberty.controllers.*;
import com.barataribeiro.sentinelofliberty.services.*;
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

    private final CommentController commentController;
    private final CommentService commentService;

    private final NoticeController noticeController;
    private final NoticeService noticeService;

    private final SuggestionController suggestionController;
    private final SuggestionService suggestionService;

    private final UserController userController;
    private final UserService userService;

    @Test
    void contextLoads() {
        assertThat(serverApplication).isNotNull();
        assertThat(authController).isNotNull();
        assertThat(authService).isNotNull();
        assertThat(articleController).isNotNull();
        assertThat(articleService).isNotNull();
        assertThat(commentController).isNotNull();
        assertThat(commentService).isNotNull();
        assertThat(noticeController).isNotNull();
        assertThat(noticeService).isNotNull();
        assertThat(suggestionController).isNotNull();
        assertThat(suggestionService).isNotNull();
        assertThat(userController).isNotNull();
        assertThat(userService).isNotNull();
    }

}
