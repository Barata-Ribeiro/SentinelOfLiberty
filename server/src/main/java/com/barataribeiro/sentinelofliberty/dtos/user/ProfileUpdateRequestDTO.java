package com.barataribeiro.sentinelofliberty.dtos.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.io.Serializable;
import java.time.LocalDate;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProfileUpdateRequestDTO implements Serializable {
    @NotBlank
    private String currentPassword;

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
    @Pattern(regexp = "^[a-z]*$", message = "Username must contain only lowercase letters.")
    private String username;

    @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
           message = "You must provide a valid email address.")
    private String email;

    @Size(min = 3, max = 50, message = "Display name must be between 3 and 50 characters.")
    @Pattern(regexp = "^[a-zA-Z ]*$", message = "Display name must contain only letters, and spaces.")
    private String displayName;

    @Pattern(regexp = "^[a-zA-Z ]*$", message = "Full name must contain only letters, and spaces.")
    private String fullName;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String avatarUrl;

    @Size(max = 160, message = "Biography must be less than 160 characters.")
    private String biography;

    private LocalDate birthDate;

    private String location;

    @URL(message = "Invalid URL format.", protocol = "https",
         regexp = "((((https?|ftps?|gopher|telnet|nntp)://)|(mailto:|news:))([-%()_.!~*';/?:@&=+$,A-Za-z0-9])+)")
    private String website;

    private String socialMedia;

    private String videoChannel;

    private String streamingChannel;

    private Boolean isPrivate;

    @Size(min = 8, max = 100, message = "New password must be between 8 and 100 characters.")
    @Pattern(
            message = "New password must contain at least one digit, one lowercase letter, one uppercase letter, one " +
                    "special character and no whitespace.",
            regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$")
    private String newPassword;
}
