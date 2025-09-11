package com.barataribeiro.sentinelofliberty.builders;

import com.barataribeiro.sentinelofliberty.dtos.comment.CommentDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.AuthorDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Comment;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import jakarta.annotation.Nullable;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.ByteBuffer;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.*;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentMapper {
    private final ModelMapper modelMapper;

    @PostConstruct
    public void setupModelMapper() {
        modelMapper.addMappings(new PropertyMap<Comment, CommentDTO>() {
            @Override
            protected void configure() {
                skip(destination.getChildren());

                using(ctx -> {
                    Set<?> children = (Set<?>) ctx.getSource();
                    return Hibernate.isInitialized(children) ? (long) children.size() : 0L;
                }).map(source.getChildren(), destination.getChildrenCount());

                map(source.getArticle().getId(), destination.getArticleId());
                map(source.getArticle().getTitle(), destination.getArticleTitle());
                map(source.getArticle().getSlug(), destination.getArticleSlug());
                map(source.getParent().getId(), destination.getParentId());
            }
        });
    }

    public CommentDTO toCommentDTO(Comment comment) {
        return modelMapper.map(comment, CommentDTO.class);
    }
}
