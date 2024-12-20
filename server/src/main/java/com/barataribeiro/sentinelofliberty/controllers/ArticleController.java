package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleRequestDTO;
import com.barataribeiro.sentinelofliberty.services.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Article", description = "Article endpoints")
public class ArticleController {

    private final ArticleService articleService;

    @Operation(summary = "Create an article",
               description = "This endpoint allows an admin to create an article by providing the title, content, " +
                       "and the category of the article.")
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<ArticleDTO>> createArticle(@RequestBody @Valid ArticleRequestDTO body,
                                                                            Authentication authentication) {
        ArticleDTO response = articleService.createArticle(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApplicationResponseDTO<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                                "You have successfully created an article", response));
    }
}
