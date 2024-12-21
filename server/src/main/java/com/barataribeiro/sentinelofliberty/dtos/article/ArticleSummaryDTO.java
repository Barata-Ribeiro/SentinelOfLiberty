package com.barataribeiro.sentinelofliberty.dtos.article;

import com.barataribeiro.sentinelofliberty.dtos.user.AuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.sentinelofliberty.models.entities.Article}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleSummaryDTO implements Serializable {
    Long id;
    String title;
    String subTitle;
    String summary;
    String mediaUrl;
    String slug;
    Long commentsCount;
    AuthorDTO author;
    Instant createdAt;
}