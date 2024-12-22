package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.ArticleMapper;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleSummaryDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.models.entities.Category;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CategoryRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.ArticleService;
import com.barataribeiro.sentinelofliberty.utils.StringNormalizer;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    @Transactional
    public ArticleDTO createArticle(@NotNull ArticleRequestDTO body, @NotNull Authentication authentication) {
        User author = userRepository.findByUsername(authentication.getName())
                                    .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Article article = Article.builder()
                                 .title(body.getTitle())
                                 .subTitle(body.getSubTitle())
                                 .content(body.getContent())
                                 .summary(StringNormalizer.toSummary(body.getContent(), 100))
                                 .references(body.getReferences())
                                 .slug(StringNormalizer.toSlug(body.getTitle()))
                                 .author(author)
                                 .build();

        Optional.ofNullable(body.getMediaUrl()).ifPresent(article::setMediaUrl);

        Set<Category> categories = getNewCategories(body.getCategories(), article);

        article.setCategories(categories);

        categoryRepository.saveAll(categories);

        return articleMapper.toArticleDTO(articleRepository.saveAndFlush(article));
    }

    @Override
    @Transactional(readOnly = true)
    public Set<ArticleSummaryDTO> getLatestArticles() {
        return articleMapper.toArticleSummaryDTOs(articleRepository.findTop10ByOrderByCreatedAtDesc());
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

        Optional.ofNullable(body.getTitle()).ifPresent(article::setTitle);

        Optional.ofNullable(body.getSubTitle()).ifPresent(article::setSubTitle);

        Optional.ofNullable(body.getContent()).ifPresent(content -> {
            article.setContent(content);
            article.setSummary(StringNormalizer.toSummary(content, 100));
        });

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

        return articleMapper.toArticleDTO(articleRepository.saveAndFlush(article));
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
                .articles(Set.of(article))
                .build();
    }
}
