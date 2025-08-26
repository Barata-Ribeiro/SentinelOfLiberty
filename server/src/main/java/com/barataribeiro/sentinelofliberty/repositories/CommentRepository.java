package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import com.barataribeiro.sentinelofliberty.repositories.specifications.RepositorySpecificationExecutor;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long>, RepositorySpecificationExecutor<Comment,
        Long> {
    long countDistinctByArticle_Id(Long id);

    @Query("""
           SELECT c.id
           FROM Comment c LEFT JOIN c.article a
           WHERE a.id = :articleId
           ORDER BY c.parent.id NULLS FIRST, c.createdAt DESC
           """)
    Page<Long> findIdsByArticle_Id(@Param("articleId") Long articleId, Pageable pageable);

    @Query("SELECT c.id FROM Comment c LEFT JOIN c.user u WHERE u.username = :username")
    Page<Long> findIdsByUser_Username(@Param("username") String username, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"user", "article.references", "parent.user", "children.user"})
    @NotNull List<Comment> findAll(@Nullable Specification<Comment> spec);

    long deleteByIdAndArticle_IdAndUser_UsernameAllIgnoreCase(Long id, Long id1, String username);

    long countDistinctByUser_Username(String username);
}