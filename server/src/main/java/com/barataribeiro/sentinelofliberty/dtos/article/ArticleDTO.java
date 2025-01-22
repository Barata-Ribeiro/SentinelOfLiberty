package com.barataribeiro.sentinelofliberty.dtos.article;

import com.barataribeiro.sentinelofliberty.dtos.user.AuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.Collection;
import java.util.Set;

/**
 * DTO for {@link com.barataribeiro.sentinelofliberty.models.entities.Article}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleDTO implements Serializable {
    private Long id;
    private String title;
    private String subTitle;
    private String content;
    private String summary;
    private Collection<String> references;
    private String mediaUrl;
    private String slug;
    private Boolean wasEdit;
    private AuthorDTO author;
    private Set<CategoryDTO> categories;
    private Instant createdAt;
    private Instant updatedAt;
}