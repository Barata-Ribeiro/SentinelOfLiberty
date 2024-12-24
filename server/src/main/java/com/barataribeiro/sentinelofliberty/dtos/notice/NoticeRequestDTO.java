package com.barataribeiro.sentinelofliberty.dtos.notice;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoticeRequestDTO {
    private String title;

    @NotBlank
    private String message;
}