package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    @EntityGraph(attributePaths = {"author", "categories", "references"})
    Page<Article> findAllByAuthor_Username(String username, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "categories", "references"})
    @Query("""
           SELECT a FROM Article a WHERE a.author.username = :username
           AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :term, '%'))
                OR LOWER(a.subTitle) LIKE LOWER(CONCAT('%', :term, '%'))
                OR a.content LIKE CONCAT('%', :term, '%'))
           """)
    Page<Article> findAllByAuthor_UsernameAndSearchParams(@Param("username") String username,
                                                          @Param("term") String term, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "categories", "references"})
    Set<Article> findByCategories_Name(String name);

    @EntityGraph(attributePaths = {"author", "categories", "references"})
    Set<Article> findTop10ByOrderByCreatedAtDesc();

    long countByTitle(String title);

    long countDistinctByAuthor_Username(String username);
}