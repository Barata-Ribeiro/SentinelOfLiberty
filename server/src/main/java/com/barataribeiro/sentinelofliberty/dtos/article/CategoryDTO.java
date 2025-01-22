package com.barataribeiro.sentinelofliberty.dtos.article;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for {@link com.barataribeiro.sentinelofliberty.models.entities.Category}
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryDTO implements Serializable {
    private Long id;
    private String name;
    private String description;
}