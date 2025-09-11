package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.CommentMapper;
import com.barataribeiro.sentinelofliberty.builders.NotificationMapper;
import com.barataribeiro.sentinelofliberty.dtos.comment.CommentDTO;
import com.barataribeiro.sentinelofliberty.dtos.comment.CommentRequestDTO;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.IllegalRequestException;
import com.barataribeiro.sentinelofliberty.models.entities.Article;
import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import com.barataribeiro.sentinelofliberty.models.entities.Notification;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.repositories.ArticleRepository;
import com.barataribeiro.sentinelofliberty.repositories.CommentRepository;
import com.barataribeiro.sentinelofliberty.repositories.NotificationRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.CommentService;
import com.barataribeiro.sentinelofliberty.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentServiceImpl implements CommentService {
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final CommentMapper commentMapper;
    private final CommentRepository commentRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

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

        sendNotificationToArticleAuthorOfNewComment(article, author);

        return commentMapper.toCommentDTO(commentRepository.saveAndFlush(newComment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getArticleCommentsTree(Long articleId) {
        List<Comment> comments = commentRepository.findByArticleIdWithUserAndArticle(articleId);

        List<CommentDTO> allDTOs = comments.parallelStream()
                                           .map(commentMapper::toCommentDTO)
                                           .toList();

        Map<Long, CommentDTO> byId = allDTOs.parallelStream()
                                            .filter(dto -> dto.getId() != null)
                                            .collect(Collectors.toMap(CommentDTO::getId, Function.identity()));

        List<CommentDTO> roots = new ArrayList<>();
        for (CommentDTO dto : allDTOs) {
            Long parentId = dto.getParentId();
            if (parentId == null) roots.add(dto);
            else {
                CommentDTO parent = byId.get(parentId);
                if (parent != null) {
                    if (parent.getChildren() == null) parent.setChildren(new ArrayList<>());
                    parent.getChildren().add(dto);
                } else roots.add(dto);

            }
        }

        return roots;
    }


    @Override
    @Transactional
    public void deleteComment(Long articleId, Long commentId, @NotNull Authentication authentication) {
        long wasDeleted = commentRepository
                .deleteByIdAndArticle_IdAndUser_UsernameAllIgnoreCase(commentId, articleId, authentication.getName());
        if (wasDeleted == 0) throw new IllegalRequestException("Comment not found or you are not the author");
    }

    private void sendNotificationToArticleAuthorOfNewComment(@NotNull Article article, @NotNull User author) {
        final String formatedMessage = String.format("Your article \"%s\" has a new comment. Check it out! It was " +
                                                             "made by %s", article.getTitle(), author.getUsername());

        Notification notification = Notification.builder()
                                                .title("Someone commented on your article!")
                                                .message(formatedMessage)
                                                .recipient(article.getAuthor())
                                                .build();

        notificationService.sendNotificationThroughWebsocket(article.getAuthor().getUsername(),
                                                             notificationMapper.toNotificationDTO(
                                                                     notificationRepository.save(notification)
                                                             ));
    }
}
