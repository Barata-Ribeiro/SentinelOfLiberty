package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionRequestDTO;
import com.barataribeiro.sentinelofliberty.services.SuggestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/suggestions")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Suggestion", description = "Suggestions endpoints")
public class SuggestionController {

    private SuggestionService suggestionService;

    @Operation(summary = "Create a suggestion",
               description = "This endpoint allows any logged user to create a suggestion.")
    @PostMapping
    public ResponseEntity<ApplicationResponseDTO<SuggestionDTO>> createSuggestion(SuggestionRequestDTO body,
                                                                                  Authentication authentication) {
        SuggestionDTO response = suggestionService.createSuggestion(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApplicationResponseDTO<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                                "You have successfully created a suggestion",
                                                                null));
    }
}
