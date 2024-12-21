package com.barataribeiro.sentinelofliberty.builders;

import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleSummaryDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.CategoryDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.models.entities.Category;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ArticleMapper {
    private final ModelMapper modelMapper;

    @PostConstruct
    public void setupModelMapper() {
        modelMapper.addMappings(new PropertyMap<Article, ArticleSummaryDTO>() {
            @Override
            protected void configure() {
                map().setCommentsCount((long) source.getComments().size());
            }
        });
    }

    public ArticleDTO toArticleDTO(Article article) {
        return modelMapper.map(article, ArticleDTO.class);
    }

    public ArticleSummaryDTO toArticleSummaryDTO(Article article) {
        return modelMapper.map(article, ArticleSummaryDTO.class);
    }

    public Set<ArticleSummaryDTO> toArticleSummaryDTOs(@NotNull Set<Article> articles) {
        return articles.stream()
                       .map(this::toArticleSummaryDTO)
                       .collect(Collectors.toSet());
    }

    public CategoryDTO toCategoryDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }
}
