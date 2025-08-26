package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.repositories.specifications.RepositorySpecificationExecutor;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ArticleRepository extends JpaRepository<Article, Long>, RepositorySpecificationExecutor<Article,
        Long> {
    @Override
    @EntityGraph(attributePaths = {"author", "suggestion.user", "comments", "categories", "references"})
    @NotNull Optional<Article> findById(@Param("id") @NotNull Long id);

    @Override
    @EntityGraph(attributePaths = {"author", "suggestion.user", "comments", "categories", "references"})
    @NotNull List<Article> findAll(@Nullable Specification<Article> spec);

    @Query("SELECT a.id FROM Article a JOIN a.author WHERE a.author.username = :username")
    Page<Long> findIdsByAuthor_Username(@Param("username") String username, Pageable pageable);

    @EntityGraph(attributePaths = {"author", "categories", "references"})
    Set<Article> findByCategories_Name(String name);

    @Query("SELECT a.id FROM Article a JOIN a.categories c WHERE c.name = :name")
    Page<Long> findIdsByCategories_Name(@Param("name") String name, Pageable pageable);

    @Query("""
           SELECT a FROM Article a
           LEFT JOIN a.author
           LEFT JOIN a.comments
           ORDER BY SIZE(a.comments) DESC
           LIMIT 5
           """)
    Set<Article> getPopularArticles();

    long countByTitle(String title);

    long countDistinctByAuthor_Username(String username);

    long deleteByIdAndAuthor_UsernameAllIgnoreCase(Long id, String username);
}