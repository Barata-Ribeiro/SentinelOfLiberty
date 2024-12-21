package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Set;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    Set<Article> findByCreatedAt(Instant createdAt);

    Set<Article> findAllByCreatedAtBetween(Instant start, Instant end);

    Set<Article> findByCategories_Name(String name);

    @Query("SELECT a FROM Article a WHERE a.createdAt <= :creationDateTime")
    Set<Article> findAllWithCreationDateTimeBefore(@Param("creationDateTime") Instant creationDateTime);

    Set<Article> findTop10ByOrderByCreatedAtDesc();
}