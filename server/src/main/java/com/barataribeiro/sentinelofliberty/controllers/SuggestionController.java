package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionRequestDTO;
import com.barataribeiro.sentinelofliberty.services.SuggestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/suggestions")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Suggestion", description = "Suggestions endpoints")
public class SuggestionController {
    private SuggestionService suggestionService;

    @Operation(summary = "Get all suggestions paginated",
               description = "This endpoint allows any user to retrieve all suggestions paginated, that are available" +
                       " to be displayed publicly. Logged or not, anyone can access this endpoint.")
    @GetMapping("/public")
    public ResponseEntity<ApplicationResponseDTO<Page<SuggestionDTO>>> getAllSuggestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy) {
        Page<SuggestionDTO> response = suggestionService.getAllSuggestions(page, perPage, direction, orderBy);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved all suggestions",
                                                              response));
    }

    @Operation(summary = "Get suggestion by id",
               description = "This endpoint allows any user to retrieve a suggestion by its id. Logged or not, anyone" +
                       " can access this endpoint.")
    @GetMapping("/public/{id}")
    public ResponseEntity<ApplicationResponseDTO<SuggestionDTO>> getSuggestionById(@PathVariable Long id) {
        SuggestionDTO response = suggestionService.getSuggestionById(id);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved the suggestion",
                                                              response));
    }

    @Operation(summary = "Create a suggestion",
               description = "This endpoint allows any logged user to create a suggestion.")
    @PostMapping
    public ResponseEntity<ApplicationResponseDTO<SuggestionDTO>> createSuggestion(
            @RequestBody @Valid SuggestionRequestDTO body,
            Authentication authentication) {
        SuggestionDTO response = suggestionService.createSuggestion(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApplicationResponseDTO<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                                "You have successfully created a suggestion",
                                                                response));
    }

    @Operation(summary = "Delete a suggestion",
               description = "This endpoint allows the user who created the suggestion to delete it.")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApplicationResponseDTO<SuggestionDTO>> deleteSuggestion(@PathVariable Long id,
                                                                                  Authentication authentication) {
        suggestionService.deleteSuggestion(id, authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully deleted the suggestion",
                                                              null));
    }
}
