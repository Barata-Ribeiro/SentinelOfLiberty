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
import com.barataribeiro.sentinelofliberty.utils.ApplicationConstants;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    @Transactional(readOnly = true)
    public Page<SuggestionDTO> getAllSuggestions(int page, int perPage, String direction, String orderBy) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        return suggestionRepository.findAll(pageable).map(suggestionMapper::toSuggestionDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public SuggestionDTO getSuggestionById(Long id) {
        Suggestion suggestion = suggestionRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(Suggestion.class.getSimpleName()));

        return suggestionMapper.toSuggestionDTO(suggestion);
    }

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
