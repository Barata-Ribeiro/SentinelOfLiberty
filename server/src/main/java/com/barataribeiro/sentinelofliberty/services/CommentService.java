package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.comment.CommentDTO;
import com.barataribeiro.sentinelofliberty.dtos.comment.CommentRequestDTO;
import org.springframework.security.core.Authentication;

public interface CommentService {
    CommentDTO createComment(Long articleId, CommentRequestDTO body, Authentication authentication);
}
