package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Suggestion;
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

public interface SuggestionRepository extends JpaRepository<Suggestion, Long>,
        RepositorySpecificationExecutor<Suggestion, Long> {

    @Override
    @EntityGraph(attributePaths = {"user", "articles"})
    @NotNull List<Suggestion> findAll(@Nullable Specification<Suggestion> spec);

    @Query("SELECT s.id FROM Suggestion s JOIN s.user u WHERE u.username = :username")
    Page<Long> findIdsByUser_Username(@Param("username") String username, Pageable pageable);

    long deleteByIdAndUser_UsernameAllIgnoreCase(Long id, String username);

    long countDistinctByTitleAllIgnoreCase(String title);

    @EntityGraph(attributePaths = {"user"})
    long countDistinctByUser_Username(String username);
}