package com.barataribeiro.sentinelofliberty.repositories;

import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import com.barataribeiro.sentinelofliberty.repositories.specifications.RepositorySpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long>, RepositorySpecificationExecutor<Comment,
        Long> {
    long countDistinctByArticle_Id(@Param("articleId") Long articleId);

    @Query("""
           SELECT c FROM Comment c LEFT JOIN FETCH c.user u LEFT JOIN FETCH c.article a WHERE c.article.id = :articleId
           """)
    List<Comment> findByArticleIdWithUserAndArticle(@Param("articleId") Long articleId);

    @Query("SELECT c.id FROM Comment c LEFT JOIN c.user u WHERE u.username = :username")
    Page<Long> findIdsByUser_Username(@Param("username") String username, Pageable pageable);

    long deleteByIdAndArticle_IdAndUser_UsernameAllIgnoreCase(@Param("id") Long id, @Param("articleId") Long articleId,
                                                              @Param("username") String username);

    long countDistinctByUser_Username(@Param("username") String username);
}