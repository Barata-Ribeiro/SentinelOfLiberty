package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Set<Notice> findTop5ByIsActiveTrueOrderByCreatedAtDesc();

    Page<Notice> findByUser_Username(String username, Pageable pageable);
}