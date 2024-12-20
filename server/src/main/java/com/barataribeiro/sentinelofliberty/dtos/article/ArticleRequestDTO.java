package com.barataribeiro.sentinelofliberty.dtos.article;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleRequestDTO {
    @NotBlank
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters.")
    private String title;

    @NotBlank
    @Size(min = 3, max = 100, message = "Subtitle must be between 3 and 100 characters.")
    private String subTitle;

    @NotBlank
    @Size(min = 100, message = "Content must be at least 100 characters.")
    private String content;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String mediaUrl;

    @NotBlank
    private List<String> categories;
}