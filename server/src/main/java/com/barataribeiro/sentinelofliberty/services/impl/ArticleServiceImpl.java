package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.ArticleMapper;
import com.barataribeiro.sentinelofliberty.dtos.article.*;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.models.entities.Category;
import com.barataribeiro.sentinelofliberty.models.entities.Suggestion;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CategoryRepository;
import com.barataribeiro.sentinelofliberty.repositories.SuggestionRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.ArticleService;
import com.barataribeiro.sentinelofliberty.utils.ApplicationConstants;
import com.barataribeiro.sentinelofliberty.utils.StringNormalizer;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ArticleServiceImpl implements ArticleService {
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ArticleMapper articleMapper;
    private final ArticleRepository articleRepository;
    private final SuggestionRepository suggestionRepository;

    @Override
    @Transactional(readOnly = true)
    public ArticleDTO getArticle(Long articleId) {
        return articleMapper.toArticleDTO(articleRepository
                                                  .findById(articleId)
                                                  .orElseThrow(() -> new EntityNotFoundException(
                                                          Article.class.getSimpleName())));
    }

    @Override
    @Transactional(readOnly = true)
    public Set<ArticleSummaryDTO> getLatestArticles() {
        return articleMapper.toArticleSummaryDTOs(articleRepository.findTop10ByOrderByCreatedAtDesc());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleSummaryDTO> getAllArticles(int page, int perPage, String direction, String orderBy) {
        final PageRequest pageable = getPageRequest(page, perPage, direction, orderBy);
        return articleRepository.findAll(pageable).map(articleMapper::toArticleSummaryDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleSummaryDTO> getAllArticlesByCategory(String category, int page, int perPage, String direction,
                                                            String orderBy) {
        final PageRequest pageable = getPageRequest(page, perPage, direction, orderBy);
        return articleRepository.findAllByCategories_Name(category, pageable).map(articleMapper::toArticleSummaryDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().parallelStream()
                                 .map(articleMapper::toCategoryDTO).collect(Collectors.toSet());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleSummaryDTO> getAllOwnArticles(String search, int page, int perPage, String direction,
                                                     String orderBy, Authentication authentication) {
        final PageRequest pageable = getPageRequest(page, perPage, direction, orderBy);

        Page<ArticleSummaryDTO> articlesPage;
        if (search != null && !search.isBlank()) {
            articlesPage = articleRepository
                    .findAllByAuthor_UsernameAndSearchParams(authentication.getName(), search, pageable)
                    .map(articleMapper::toArticleSummaryDTO);
        } else {
            articlesPage = articleRepository
                    .findAllByAuthor_Username(authentication.getName(), pageable)
                    .map(articleMapper::toArticleSummaryDTO);
        }

        return articlesPage;
    }

    @Override
    @Transactional
    public ArticleDTO createArticle(@NotNull ArticleRequestDTO body, @NotNull Authentication authentication) {
        User author = userRepository.findByUsername(authentication.getName())
                                    .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Article article = Article.builder()
                                 .title(body.getTitle())
                                 .subTitle(body.getSubTitle())
                                 .content(body.getContent())
                                 .summary(body.getSummary())
                                 .references(body.getReferences())
                                 .author(author)
                                 .build();

        String generatedSlug = author.getUsername() + "-" + StringNormalizer.toSlug(body.getTitle()) + "-" +
                StringNormalizer.toSlug(body.getSubTitle());
        article.setSlug(generatedSlug);

        Optional.ofNullable(body.getMediaUrl()).ifPresent(article::setMediaUrl);

        Set<Category> categories = getNewCategories(body.getCategories(), article);

        article.setCategories(categories);

        Optional.ofNullable(body.getSuggestionId()).ifPresent(suggestionId -> {
            Suggestion suggestion = suggestionRepository
                    .findById(suggestionId)
                    .orElseThrow(() -> new EntityNotFoundException(Suggestion.class.getSimpleName()));

            article.setSuggestion(suggestion);
        });

        categoryRepository.saveAll(categories);

        return articleMapper.toArticleDTO(articleRepository.saveAndFlush(article));
    }

    @Override
    @Transactional
    public ArticleDTO updateArticle(Long articleId, ArticleUpdateRequestDTO body,
                                    @NotNull Authentication authentication) {
        Article article = articleRepository
                .findById(articleId)
                .orElseThrow(() -> new EntityNotFoundException(Article.class.getSimpleName()));

        if (!article.getAuthor().getUsername().equals(authentication.getName())) {
            throw new IllegalRequestException("You are not the author of this article.");
        }

        updateArticlePropertiesIfPresentAndSetItAsEdited(body, article);

        return articleMapper.toArticleDTO(articleRepository.saveAndFlush(article));
    }

    @Override
    @Transactional
    public void deleteArticle(Long articleId, @NotNull Authentication authentication) {
        long wasDeleted = articleRepository
                .deleteByIdAndAuthor_UsernameAllIgnoreCase(articleId, authentication.getName());
        if (wasDeleted == 0) throw new IllegalRequestException("Article not found or you are not the author");
    }

    @Override
    @Transactional
    public ArticleDTO adminUpdateAnArticle(Long articleId, ArticleUpdateRequestDTO body,
                                           @NotNull Authentication authentication) {
        Article article = articleRepository
                .findById(articleId)
                .orElseThrow(() -> new EntityNotFoundException(Article.class.getSimpleName()));

        if (article.getAuthor().getUsername().equals(authentication.getName())) {
            throw new IllegalRequestException("Admins cannot update their own articles through this resource.");
        }

        updateArticlePropertiesIfPresentAndSetItAsEdited(body, article);

        return articleMapper.toArticleDTO(articleRepository.saveAndFlush(article));
    }

    private @NotNull PageRequest getPageRequest(int page, int perPage, String direction, String orderBy) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        return PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));
    }

    private void updateArticlePropertiesIfPresentAndSetItAsEdited(@NotNull ArticleUpdateRequestDTO body,
                                                                  @NotNull Article article) {
        Optional.ofNullable(body.getTitle()).ifPresent(article::setTitle);

        Optional.ofNullable(body.getSubTitle()).ifPresent(article::setSubTitle);

        Optional.ofNullable(body.getSummary()).ifPresent(article::setSummary);

        Optional.ofNullable(body.getContent()).ifPresent(article::setContent);

        Optional.ofNullable(body.getMediaUrl()).ifPresent(article::setMediaUrl);

        Optional.ofNullable(body.getReferences()).ifPresent(references -> {
            article.getReferences().clear();
            article.getReferences().addAll(references);
        });

        Optional.ofNullable(body.getCategories()).ifPresent(categories -> {
            Set<Category> newCategories = getNewCategories(categories, article);
            article.getCategories().removeIf(existingCategory -> {
                boolean shouldRemove = !newCategories.contains(existingCategory);
                if (shouldRemove) existingCategory.getArticles().remove(article);
                return shouldRemove;
            });
            article.getCategories().addAll(newCategories);
            categoryRepository.saveAll(newCategories);
        });

        article.setWasEdit(true);
    }

    private @NotNull Set<Category> getNewCategories(@NotNull List<@NotBlank String> categories, Article article) {
        return categories.stream()
                         .map(category -> categoryRepository
                                 .findByName(category)
                                 .map(existingCategory -> {
                                     existingCategory.getArticles().add(article);
                                     return existingCategory;
                                 })
                                 .orElseGet(() -> getNewCategory(category, article)))
                         .collect(Collectors.toSet());
    }

    private Category getNewCategory(String category, Article article) {
        return Category
                .builder()
                .name(category)
                .description("No description provided")
                .articles(new LinkedHashSet<>(Set.of(article)))
                .build();
    }
}
