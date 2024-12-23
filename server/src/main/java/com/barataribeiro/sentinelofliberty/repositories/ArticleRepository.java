package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Page<Article> findAllByAuthor_Username(String username, Pageable pageable);

    Set<Article> findByCategories_Name(String name);

    Set<Article> findTop10ByOrderByCreatedAtDesc();

    long countByTitle(String title);


}