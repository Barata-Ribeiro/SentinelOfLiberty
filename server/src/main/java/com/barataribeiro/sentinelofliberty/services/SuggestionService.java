package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionRequestDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

public interface SuggestionService {
    Page<SuggestionDTO> getAllSuggestions(int page, int perPage, String direction, String orderBy);

    SuggestionDTO getSuggestionById(Long id);

    SuggestionDTO createSuggestion(SuggestionRequestDTO body, Authentication authentication);

    SuggestionDTO adminUpdateAnExistingSuggestion(Long id, SuggestionUpdateRequestDTO body);

    void deleteSuggestion(Long id, Authentication authentication);
}
