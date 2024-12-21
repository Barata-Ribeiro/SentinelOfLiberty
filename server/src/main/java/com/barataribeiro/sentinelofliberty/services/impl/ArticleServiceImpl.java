package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.ArticleMapper;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleSummaryDTO;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.models.entities.Category;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CategoryRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.ArticleService;
import com.barataribeiro.sentinelofliberty.utils.StringNormalizer;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        Set<Category> categories = body.getCategories().stream()
                                       .map(category -> categoryRepository
                                               .findByName(category)
                                               .map(existingCategory -> {
                                                   existingCategory.getArticles().add(article);
                                                   return existingCategory;
                                               })
                                               .orElseGet(() -> getNewCategory(category, article)))
                                       .collect(Collectors.toSet());

        article.setCategories(categories);

        categoryRepository.saveAll(categories);

        return articleMapper.toArticleDTO(articleRepository.saveAndFlush(article));
    }

    @Override
    @Transactional(readOnly = true)
    public Set<ArticleSummaryDTO> getLatestArticles() {
        return articleMapper.toArticleSummaryDTOs(articleRepository.findTop10ByOrderByCreatedAtDesc());
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
