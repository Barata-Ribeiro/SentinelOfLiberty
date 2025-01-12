package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Suggestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    Set<Suggestion> findTop10ByOrderByCreatedAtDesc();

    long deleteByIdAndUser_UsernameAllIgnoreCase(Long id, String username);

    long countDistinctByTitleAllIgnoreCase(String title);
}