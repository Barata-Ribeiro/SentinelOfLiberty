package com.barataribeiro.sentinelofliberty.builders;


import com.barataribeiro.sentinelofliberty.dtos.suggestion.SuggestionDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Suggestion;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SuggestionMapper {
    private final ModelMapper modelMapper;

    @PostConstruct
    public void setupModelMapper() {
        modelMapper.addMappings(new PropertyMap<Suggestion, SuggestionDTO>() {
            @Override
            protected void configure() {
                using(ctx -> {
                    Set<?> articles = (Set<?>) ctx.getSource();
                    return articles == null ? 0L : articles.size();
                }).map(source.getArticles(), destination.getArticlesWritten());
            }
        });
    }

    public SuggestionDTO toSuggestionDTO(Suggestion suggestion) {
        return modelMapper.map(suggestion, SuggestionDTO.class);
    }
}
