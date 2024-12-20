package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleSummaryDTO;
import org.springframework.security.core.Authentication;

import java.util.Set;

public interface ArticleService {
    ArticleDTO createArticle(ArticleRequestDTO body, Authentication authentication);

    Set<ArticleSummaryDTO> getLatestArticles();
}
