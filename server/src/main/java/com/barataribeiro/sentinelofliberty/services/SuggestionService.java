package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionRequestDTO;
import org.springframework.security.core.Authentication;

public interface SuggestionService {
    SuggestionDTO createSuggestion(SuggestionRequestDTO body, Authentication authentication);
}
