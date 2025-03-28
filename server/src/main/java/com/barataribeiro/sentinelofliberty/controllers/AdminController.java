package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleDTO;
import com.barataribeiro.sentinelofliberty.dtos.article.ArticleUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.ProfileUpdateRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserSecurityDTO;
import com.barataribeiro.sentinelofliberty.services.ArticleService;
import com.barataribeiro.sentinelofliberty.services.SuggestionService;
import com.barataribeiro.sentinelofliberty.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Admin", description = "Admin endpoints")
public class AdminController {
    private final UserService userService;
    private final SuggestionService suggestionService;
    private final ArticleService articleService;

    @Operation(summary = "Get all users", description = "This endpoint allows an admin to get all users in the " +
            "system, regardless of verification, ban status, or role. The listing is paginated.")
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<Page<UserSecurityDTO>>> adminGetAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            Authentication authentication) {
        Page<UserSecurityDTO> response = userService
                .adminGetAllUsers(search, page, perPage, direction, orderBy, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved all users", response));
    }

    @Operation(summary = "Update an user",
               description = "This endpoint allows an admin to update an user's information.")
    @PatchMapping("/users/{username}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<UserProfileDTO>> adminUpdateAnUser(@PathVariable String username,
                                                                                    @RequestBody @Valid
                                                                                    ProfileUpdateRequestDTO body,
                                                                                    Authentication authentication) {
        UserProfileDTO response = userService.adminUpdateAnUser(username, body, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully updated the user", response));
    }

    @Operation(summary = "Update an article",
               description = "This endpoint allows an admin to update an article that is not his/hers.")
    @PatchMapping("/articles/{articleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<ArticleDTO>> adminUpdateAnArticle(@PathVariable Long articleId,
                                                                                   @RequestBody @Valid
                                                                                   ArticleUpdateRequestDTO body,
                                                                                   Authentication authentication) {
        ArticleDTO response = articleService.adminUpdateAnArticle(articleId, body, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully updated the article", response));
    }

    @Operation(summary = "Ban or Unban an user",
               description = "This endpoint allows an admin to ban or unban an user.")
    @PatchMapping("/users/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<UserProfileDTO>> adminBanOrUnbanAnUser(
            @PathVariable String username,
            @RequestParam(required = true, defaultValue = "ban") String action) {
        UserProfileDTO response = userService.adminBanOrUnbanAnUser(username, action);
        String messageAction = action.equals("ban") ? "banned" : "unbanned";
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully " + messageAction + " the user",
                                                              response));
    }

    @Operation(description = "Toggles an user's profile verification status.")
    @PatchMapping("/users/{username}/toggle-verification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<UserProfileDTO>> adminToggleUserVerification(
            @PathVariable String username, Authentication authentication) {
        UserProfileDTO response = userService.adminToggleUserVerification(username, authentication);
        String isVerified = Boolean.TRUE.equals(response.getIsVerified()) ? "verified" : "unverified";
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully " + isVerified + " the user",
                                                              response));
    }

    @Operation(summary = "Update an existing suggestion",
               description = "This endpoint allows an admin to update an existing suggestion.")
    @PatchMapping("/suggestions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<SuggestionDTO>> adminUpdateAnExistingSuggestion(
            @PathVariable Long id,
            @RequestBody @Valid SuggestionUpdateRequestDTO body) {
        SuggestionDTO response = suggestionService.adminUpdateAnExistingSuggestion(id, body);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully updated the suggestion",
                                                              response));
    }

    @Operation(summary = "Delete an user",
               description = "This endpoint allows an admin to delete an user.")
    @DeleteMapping("/users/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<UserProfileDTO>> adminDeleteAnUser(@PathVariable String username,
                                                                                    Authentication authentication) {
        userService.adminDeleteAnUser(username, authentication);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                             .body(new ApplicationResponseDTO<>(HttpStatus.NO_CONTENT, HttpStatus.NO_CONTENT.value(),
                                                                "You have successfully deleted the user", null));
    }
}
