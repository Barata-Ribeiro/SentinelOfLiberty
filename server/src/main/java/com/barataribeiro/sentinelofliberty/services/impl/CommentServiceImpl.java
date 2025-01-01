package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.CommentMapper;
import com.barataribeiro.sentinelofliberty.dtos.comment.CommentDTO;
import com.barataribeiro.sentinelofliberty.dtos.comment.CommentRequestDTO;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CommentRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentServiceImpl implements CommentService {
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final CommentMapper commentMapper;
    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public CommentDTO createComment(Long articleId, @NotNull CommentRequestDTO body,
                                    @NotNull Authentication authentication) {
        User author = userRepository.findByUsername(authentication.getName())
                                    .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Article article = articleRepository
                .findById(articleId)
                .orElseThrow(() -> new EntityNotFoundException(Article.class.getSimpleName()));

        Comment newComment = Comment.builder()
                                    .content(body.getBody())
                                    .article(article)
                                    .user(author)
                                    .build();

        Optional.ofNullable(body.getParentId()).ifPresent(parentId -> {
            Comment parent = commentRepository
                    .findById(parentId)
                    .orElseThrow(() -> new EntityNotFoundException(Comment.class.getSimpleName()));

            newComment.setParent(parent);
        });

        return commentMapper.toCommentDTO(commentRepository.saveAndFlush(newComment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getArticleCommentsTree(Long articleId) {
        List<Comment> comments = commentRepository.findCommentsRecursivelyByArticleId(articleId);
        List<CommentDTO> commentDTOS = commentMapper.toCommentDTOList(comments);

        Map<Long, CommentDTO> dtoById = new LinkedHashMap<>();
        for (CommentDTO dto : commentDTOS) {
            dto.setChildren(new ArrayList<>());
            dtoById.put(dto.getId(), dto);
        }

        List<CommentDTO> roots = new ArrayList<>();
        for (CommentDTO dto : commentDTOS) {
            if (dto.getParentId() == null) roots.add(dto);
            else {
                CommentDTO parentDTO = dtoById.get(dto.getParentId());
                if (parentDTO != null) parentDTO.getChildren().add(dto);
            }
        }

        return roots;
    }
}
