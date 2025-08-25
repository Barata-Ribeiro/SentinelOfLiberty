package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findTop5ByRecipient_UsernameOrderByCreatedAtDesc(@Param("username") String username);

    Page<Notification> findAllByRecipient_Username(@Param("username") String username, Pageable pageable);

    @EntityGraph(attributePaths = {"recipient"})
    Optional<Notification> findByIdAndRecipient_Username(Long id, @Param("username") String username);

    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findAllByRecipient_UsernameAndIdIn(@Param("username") String username, Collection<Long> ids);

    @Query("""
           SELECT new map(
               COUNT(n) AS totalCount,
               SUM(CASE WHEN n.isRead = true THEN 1 ELSE 0 END) AS totalRead,
               SUM(CASE WHEN n.isRead = false THEN 1 ELSE 0 END) AS totalUnread
           )
           FROM Notification n
           WHERE n.recipient.username = :username
           """)
    Map<String, Long> getNotificationCountsByRecipient_Username(@Param("username") String username);

    long deleteByIdAndRecipient_UsernameAllIgnoreCase(Long id, @Param("username") String username);

    long deleteByIdInAndRecipient_UsernameAllIgnoreCase(Collection<Long> ids, @Param("username") String username);
}