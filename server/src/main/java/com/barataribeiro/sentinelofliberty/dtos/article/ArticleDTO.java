package com.barataribeiro.sentinelofliberty.dtos.article;

import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link com.barataribeiro.sentinelofliberty.models.entities.Article}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleDTO implements Serializable {
    Long id;
    String title;
    String subTitle;
    String content;
    String mediaUrl;
    String slug;
    Boolean wasEdit;
    UserProfileDTO author;
    Set<CategoryDTO> categories;
    Instant createdAt;
    Instant updatedAt;
}