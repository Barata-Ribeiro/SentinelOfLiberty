package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.*;
import com.barataribeiro.sentinelofliberty.services.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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

    @GetMapping("/public/article/{articleId}")
    @Operation(summary = "Get an article",
               description = "This endpoint allows a user to get an article by providing the article ID.")
    public ResponseEntity<ApplicationResponseDTO<ArticleDTO>> getArticle(@PathVariable Long articleId) {
        ArticleDTO response = articleService.getArticle(articleId);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved the article", response));
    }

    @Operation(summary = "Get all articles",
               description = "This endpoint allows an user to get all articles, summarised. These articles are " +
                       "usually suggested to be displayed on the listing page, through infinite scrolling or " +
                       "pagination. Regardless the author.")
    @GetMapping("/public")
    public ResponseEntity<ApplicationResponseDTO<Page<ArticleSummaryDTO>>> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy) {
        Page<ArticleSummaryDTO> response = articleService.getAllArticles(page, perPage, direction, orderBy);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved all articles",
                                                              response));
    }

    @Operation(summary = "Get all articles by category",
               description = "This endpoint allows an user to get all articles by category, summarised. These " +
                       "articles are usually suggested to be displayed on the listing page, through infinite " +
                       "scrolling or pagination. Regardless the author.")
    @GetMapping("/public/category/{category}")
    public ResponseEntity<ApplicationResponseDTO<Page<ArticleSummaryDTO>>> getAllArticlesByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy) {
        Page<ArticleSummaryDTO> response = articleService
                .getAllArticlesByCategory(category, page, perPage, direction, orderBy);
        final String message = "You have successfully retrieved all articles for the category " + category;
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(), message, response));
    }

    @Operation(summary = "Get all available categories",
               description = "This endpoint allows an user to get all available categories.")
    @GetMapping("/public/categories")
    public ResponseEntity<ApplicationResponseDTO<Set<CategoryDTO>>> getAllCategories() {
        Set<CategoryDTO> response = articleService.getAllCategories();
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved all categories",
                                                              response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Get all of your (admin) articles",
               description = "This endpoint allows an admin to get all of their articles.")
    public ResponseEntity<ApplicationResponseDTO<Page<ArticleSummaryDTO>>> getAllOwnArticles(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            Authentication authentication) {
        Page<ArticleSummaryDTO> response = articleService.getAllOwnArticles(search, page, perPage, direction, orderBy,
                                                                            authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved all of your articles",
                                                              response));
    }

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

    @DeleteMapping("/{articleId}")
    @Operation(summary = "Delete an article",
               description = "This endpoint allows an admin that is also the owner of the article, to delete it by " +
                       "providing the article ID.")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<String>> deleteArticle(@PathVariable Long articleId,
                                                                        Authentication authentication) {
        articleService.deleteArticle(articleId, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new ApplicationResponseDTO<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                                "You have successfully deleted the article", null));
    }
}
