package com.barataribeiro.sentinelofliberty.dtos.suggestion;

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
    Long id;
    String title;
    String content;
    String mediaUrl;
    String sourceUrl;
    Long articlesWritten;
    Instant createdAt;
    Instant updatedAt;
}