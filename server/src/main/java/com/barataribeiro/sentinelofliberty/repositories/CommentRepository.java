package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Streamable;

import java.util.Set;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    long countDistinctByArticle_Id(Long id);

    Streamable<Comment> findCommentsByArticle_Id(@Param("articleId") Long articleId);

    Set<Comment> findTop3ByUser_UsernameOrderByCreatedAtDesc(String username);

    long deleteByIdAndArticle_IdAndUser_UsernameAllIgnoreCase(Long id, Long id1, String username);

    long countDistinctByUser_Username(String username);
}