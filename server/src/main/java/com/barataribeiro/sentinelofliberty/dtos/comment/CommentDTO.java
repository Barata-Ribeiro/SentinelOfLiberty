package com.barataribeiro.sentinelofliberty.dtos.comment;

import com.barataribeiro.sentinelofliberty.dtos.user.AuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.sentinelofliberty.models.entities.Comment}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommentDTO implements Serializable {
    Long id;
    String content;
    AuthorDTO user;
    Long articleId;
    Long parentId;
    Long childrenCount;
    Instant createdAt;
    Instant updatedAt;
}