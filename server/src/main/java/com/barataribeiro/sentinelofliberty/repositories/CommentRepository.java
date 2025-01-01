package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    long countDistinctByArticle_Id(Long id);

    @Query(value = """
                   WITH RECURSIVE comment_tree (id, content, user_id, article_id, parent_id, created_at, updated_at) AS (
                       SELECT c.id,
                              c.content,
                              c.user_id,
                              c.article_id,
                              c.parent_id,
                              c.created_at,
                              c.updated_at
                       FROM tb_comments c
                       WHERE c.article_id = :articleId
                         AND c.parent_id IS NULL
                       UNION ALL
                       SELECT c.id,
                              c.content,
                              c.user_id,
                              c.article_id,
                              c.parent_id,
                              c.created_at,
                              c.updated_at
                       FROM tb_comments c
                       INNER JOIN comment_tree ct ON c.parent_id = ct.id
                   )
                   SELECT *
                   FROM comment_tree
                   ORDER BY created_at DESC;
                   """, nativeQuery = true)
    List<Comment> findCommentsRecursivelyByArticleId(@Param("articleId") Long articleId);
}