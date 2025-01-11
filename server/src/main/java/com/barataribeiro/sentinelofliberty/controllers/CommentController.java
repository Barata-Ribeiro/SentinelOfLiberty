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

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Comment", description = "Comment endpoints")
public class CommentController {
    private final CommentService commentService;

    @Operation(summary = "Get article's comments tree",
               description = "This endpoint allows a user to get all comments from an article in a tree structure.")
    @GetMapping("/{articleId}")
    public ResponseEntity<ApplicationResponseDTO<List<CommentDTO>>> getArticleCommentsTree(@PathVariable
                                                                                           Long articleId) {
        List<CommentDTO> response = commentService.getArticleCommentsTree(articleId);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved the comments tree",
                                                              response));
    }

    @Operation(summary = "Create a comment",
               description = "This endpoint allows a logged in user to create a comment on an article or reply to a " +
                       "comment through the parentId field in the request body.")
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

    @Operation(summary = "Delete a comment",
               description = "This endpoint allows a logged in user to delete his own comment.")
    @DeleteMapping("/{articleId}/{commentId}")
    public ResponseEntity<ApplicationResponseDTO<CommentDTO>> deleteComment(@PathVariable Long articleId,
                                                                            @PathVariable Long commentId,
                                                                            Authentication authentication) {
        commentService.deleteComment(articleId, commentId, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new ApplicationResponseDTO<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                                "You have successfully deleted the comment", null));
    }
}
