package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    long countDistinctByArticle_Id(Long id);

    @Query(value = """
                   WITH RECURSIVE comment_tree AS (
                        SELECT c.*
                        FROM tb_comments c
                        WHERE c.article_id = :articleId
                            AND c.parent_id IS NULL
                        UNION ALL
                        SELECT c.*
                        FROM tb_comments c
                        INNER JOIN comment_tree ct ON c.parent_id = ct.id
                   )
                   SELECT *
                   FROM comment_tree
                   ORDER BY created_at DESC;
                   """, nativeQuery = true)
    List<Comment> findCommentsRecursivelyByArticleId(@Param("articleId") Long articleId);
}