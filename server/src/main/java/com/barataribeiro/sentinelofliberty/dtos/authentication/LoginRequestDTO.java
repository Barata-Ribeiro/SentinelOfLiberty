package com.barataribeiro.sentinelofliberty.dtos.authentication;

import com.barataribeiro.sentinelofliberty.utils.BooleanDeserializer;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginRequestDTO implements Serializable {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @JsonDeserialize(using = BooleanDeserializer.class)
    private Boolean rememberMe;
}
