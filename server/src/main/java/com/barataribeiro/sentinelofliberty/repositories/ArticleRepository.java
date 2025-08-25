package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.repositories.specifications.RepositorySpecificationExecutor;
import jakarta.persistence.QueryHint;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ArticleRepository extends JpaRepository<Article, Long>, RepositorySpecificationExecutor<Article,
        Long> {
    @Override
    @EntityGraph(attributePaths = {"author", "suggestion.user", "categories", "references"})
    @NotNull Optional<Article> findById(@Param("id") @NotNull Long id);

    @Override
    @EntityGraph(attributePaths = {"author", "suggestion.user", "comments", "categories", "references"})
    @NotNull List<Article> findAll(@Nullable Specification<Article> spec);

    @Query("SELECT a.id FROM Article a JOIN a.author WHERE a.author.username = :username")
    @QueryHints({
            @QueryHint(name = "org.hibernate.readOnly", value = "true"),
            @QueryHint(name = "org.hibernate.fetchSize", value = "20"),
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    Page<Long> findIdsByAuthor_Username(@Param("username") String username, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "categories", "references"})
    Set<Article> findByCategories_Name(String name);

    @Query("SELECT a.id FROM Article a JOIN a.categories c WHERE c.name = :name")
    @QueryHints({
            @QueryHint(name = "org.hibernate.readOnly", value = "true"),
            @QueryHint(name = "org.hibernate.fetchSize", value = "20"),
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    Page<Long> findIdsByCategories_Name(@Param("name") String name, Pageable pageable);

    Optional<Article> findTopByAuthor_UsernameOrderByCreatedAtDesc(String username);

    @EntityGraph(attributePaths = {"author", "categories", "references"})
    @Query("""
           SELECT a FROM Article a
           ORDER BY SIZE(a.comments) DESC
           LIMIT 5
           """)
    @QueryHints({
            @QueryHint(name = "org.hibernate.readOnly", value = "true"),
            @QueryHint(name = "org.hibernate.cacheable", value = "true")
    })
    Set<Article> getPopularArticles();

    long countByTitle(String title);

    long countDistinctByAuthor_Username(String username);

    long deleteByIdAndAuthor_UsernameAllIgnoreCase(Long id, String username);
}