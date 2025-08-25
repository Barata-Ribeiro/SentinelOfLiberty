package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Notice;
import jakarta.persistence.QueryHint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Set<Notice> findTop5ByIsActiveTrueOrderByCreatedAtDesc();

    Page<Notice> findByUser_Username(String username, Pageable pageable);

    @Query("""
           SELECT n FROM Notice n WHERE n.user.username = :username
           AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :term, '%'))
                OR n.message LIKE CONCAT('%', :term, '%'))
           """)
    @QueryHints({
            @QueryHint(name = "org.hibernate.readOnly", value = "true"),
            @QueryHint(name = "org.hibernate.fetchSize", value = "20"),
            @QueryHint(name = "org.hibernate.cacheable", value = "true"),
            @QueryHint(name = "jakarta.persistence.cache.retrieveMode", value = "USE"),
            @QueryHint(name = "jakarta.persistence.cache.storeMode", value = "USE")
    })
    Page<Notice> findAllByUser_UsernameAndSearchParams(@Param("username") String username, @Param("term") String term,
                                                       Pageable pageable);
}