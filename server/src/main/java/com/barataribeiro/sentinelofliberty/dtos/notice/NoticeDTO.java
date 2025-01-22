package com.barataribeiro.sentinelofliberty.dtos.notice;

import com.barataribeiro.sentinelofliberty.dtos.user.AuthorDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Notice;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link Notice}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoticeDTO implements Serializable {
    private Long id;
    private String title;
    private String message;
    private Boolean isActive;
    private AuthorDTO user;
    private Instant createdAt;
    private Instant updatedAt;
}