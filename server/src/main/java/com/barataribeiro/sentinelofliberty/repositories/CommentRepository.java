package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

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
    @QueryHints({
            @QueryHint(name = "org.hibernate.readOnly", value = "true"),
            @QueryHint(name = "org.hibernate.fetchSize", value = "50"),
            @QueryHint(name = "org.hibernate.cacheable", value = "true"),
            @QueryHint(name = "jakarta.persistence.cache.retrieveMode", value = "USE"),
            @QueryHint(name = "jakarta.persistence.cache.storeMode", value = "USE")
    })
    List<Comment> findCommentsRecursivelyByArticleId(@Param("articleId") Long articleId);

    @EntityGraph(attributePaths = {"user", "article.references", "parent", "children"})
    Set<Comment> findTop3ByUser_UsernameOrderByCreatedAtDesc(String username);

    long deleteByIdAndArticle_IdAndUser_UsernameAllIgnoreCase(Long id, Long id1, String username);

    long countDistinctByUser_Username(String username);
}