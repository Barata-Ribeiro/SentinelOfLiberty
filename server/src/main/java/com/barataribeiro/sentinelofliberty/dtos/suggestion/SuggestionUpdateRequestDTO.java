package com.barataribeiro.sentinelofliberty.dtos.suggestion;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SuggestionUpdateRequestDTO implements Serializable {

    private String title;

    @Size(min = 10, max = 500, message = "Content must be between 10 and 500 characters")
    private String content;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String mediaUrl;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String sourceUrl;
}
