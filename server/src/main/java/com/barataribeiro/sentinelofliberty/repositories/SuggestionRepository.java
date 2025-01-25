package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Suggestion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    @EntityGraph(attributePaths = {"user", "articles.references"})
    Set<Suggestion> findTop3ByUser_UsernameOrderByCreatedAtDesc(String username);

    @EntityGraph(attributePaths = {"user", "articles.references"})
    Set<Suggestion> findTop10ByOrderByCreatedAtDesc();

    long deleteByIdAndUser_UsernameAllIgnoreCase(Long id, String username);

    long countDistinctByTitleAllIgnoreCase(String title);

    @EntityGraph(attributePaths = {"user"})
    long countDistinctByUser_Username(String username);
}