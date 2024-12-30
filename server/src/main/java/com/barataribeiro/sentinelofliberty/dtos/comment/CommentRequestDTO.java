package com.barataribeiro.sentinelofliberty.dtos.comment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommentRequestDTO implements Serializable {

    private Long parentId;

    @NotBlank
    private String body;
}
