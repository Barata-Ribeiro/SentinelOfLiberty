package com.barataribeiro.sentinelofliberty.dtos.comment;

import com.barataribeiro.sentinelofliberty.dtos.user.AuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for {@link com.barataribeiro.sentinelofliberty.models.entities.Comment}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommentDTO implements Serializable {
    private Long id;
    private String content;
    private AuthorDTO user;
    private Long articleId;
    private String articleTitle;
    private String articleSlug;
    private Long parentId;
    private Long childrenCount;
    private List<CommentDTO> children = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;
}