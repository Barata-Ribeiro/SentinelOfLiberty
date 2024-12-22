package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleSummaryDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleUpdateRequestDTO;
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
import org.springframework.web.bind.annotation.*;

import java.util.Set;

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

    @GetMapping("/public/latest")
    @Operation(summary = "Get the latest articles",
               description = "This endpoint allows a user to get the latest articles, summarised. These articles are " +
                       "usually suggested to be displayed on the homepage.")
    public ResponseEntity<ApplicationResponseDTO<Set<ArticleSummaryDTO>>> getLatestArticles() {
        Set<ArticleSummaryDTO> response = articleService.getLatestArticles();
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved the latest articles",
                                                              response));
    }

    @PatchMapping("/{articleId}")
    @Operation(summary = "Update an article",
               description = "This endpoint allows an admin to update an article by providing the article ID and the " +
                       "fields to update.")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<ArticleDTO>> updateArticle(@PathVariable Long articleId,
                                                                            @RequestBody @Valid
                                                                            ArticleUpdateRequestDTO body,
                                                                            Authentication authentication) {
        ArticleDTO response = articleService.updateArticle(articleId, body, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully updated the article", response));
    }
}
