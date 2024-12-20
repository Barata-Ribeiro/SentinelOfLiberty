package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleRequestDTO;
import org.springframework.security.core.Authentication;

public interface ArticleService {
    ArticleDTO createArticle(ArticleRequestDTO body, Authentication authentication);
}
