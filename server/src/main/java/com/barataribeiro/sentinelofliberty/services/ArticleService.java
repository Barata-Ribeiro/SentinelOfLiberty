package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleSummaryDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

import java.util.Set;

public interface ArticleService {
    ArticleDTO getArticle(Long articleId);

    Set<ArticleSummaryDTO> getLatestArticles();

    Page<ArticleSummaryDTO> getAllArticles(int page, int perPage, String direction, String orderBy);

    Page<ArticleSummaryDTO> getAllOwnArticles(String search, int page, int perPage, String direction, String orderBy,
                                              Authentication authentication);

    ArticleDTO createArticle(ArticleRequestDTO body, Authentication authentication);

    ArticleDTO updateArticle(Long articleId, ArticleUpdateRequestDTO body, Authentication authentication);

    void deleteArticle(Long articleId, Authentication authentication);

    ArticleDTO adminUpdateAnArticle(Long articleId, ArticleUpdateRequestDTO body, Authentication authentication);
}
