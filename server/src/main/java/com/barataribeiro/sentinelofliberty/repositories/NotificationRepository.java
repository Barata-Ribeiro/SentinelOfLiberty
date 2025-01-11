package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findTop5ByRecipient_UsernameOrderByCreatedAtDesc(String username);

    @EntityGraph(attributePaths = {"recipient"})
    Page<Notification> findAllByRecipient_Username(String username, Pageable pageable);

    @EntityGraph(attributePaths = {"recipient"})
    Optional<Notification> findByIdAndRecipient_Username(Long id, String username);

    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findAllByRecipient_UsernameAndIdIn(String username, List<Long> ids);

    long deleteByIdAndRecipient_UsernameAllIgnoreCase(Long id, String username);
}