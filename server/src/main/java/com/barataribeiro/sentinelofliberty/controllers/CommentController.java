package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.comment.CommentDTO;
import com.barataribeiro.sentinelofliberty.dtos.comment.CommentRequestDTO;
import com.barataribeiro.sentinelofliberty.services.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Comment", description = "Comment endpoints")
public class CommentController {
    private final CommentService commentService;

    @Operation(summary = "Create a comment",
               description = "This endpoint allows a logged in user to create a comment on an article.")
    @PostMapping("/{articleId}")
    public ResponseEntity<ApplicationResponseDTO<CommentDTO>> createComment(
            @PathVariable Long articleId,
            @RequestBody @Valid CommentRequestDTO commentRequestDTO,
            Authentication authentication) {
        CommentDTO response = commentService.createComment(articleId, commentRequestDTO, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApplicationResponseDTO<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                                "You have successfully created a comment", response));
    }
}