package com.barataribeiro.sentinelofliberty.dtos.suggestion;

import com.barataribeiro.sentinelofliberty.dtos.user.AuthorDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.sentinelofliberty.models.entities.Suggestion}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SuggestionDTO implements Serializable {
    private Long id;
    private String title;
    private String content;
    private String mediaUrl;
    private String sourceUrl;
    private AuthorDTO user;
    private Long articlesWritten;
    private Instant createdAt;
    private Instant updatedAt;
}