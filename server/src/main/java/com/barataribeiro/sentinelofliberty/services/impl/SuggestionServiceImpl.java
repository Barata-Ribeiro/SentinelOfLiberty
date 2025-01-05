package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.SuggestionMapper;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionDTO;
import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionRequestDTO;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.models.entities.Suggestion;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.repositories.SuggestionRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.SuggestionService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SuggestionServiceImpl implements SuggestionService {
    private final UserRepository userRepository;
    private final SuggestionMapper suggestionMapper;
    private final SuggestionRepository suggestionRepository;

    @Override
    @Transactional
    public SuggestionDTO createSuggestion(@NotNull SuggestionRequestDTO body, @NotNull Authentication authentication) {
        User author = userRepository.findByUsername(authentication.getName())
                                    .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Suggestion suggestion = Suggestion.builder()
                                          .title(body.getTitle())
                                          .content(body.getContent())
                                          .mediaUrl(body.getMediaUrl())
                                          .sourceUrl(body.getSourceUrl())
                                          .user(author)
                                          .build();

        return suggestionMapper.toSuggestionDTO(suggestionRepository.saveAndFlush(suggestion));
    }
}
