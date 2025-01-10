package com.barataribeiro.sentinelofliberty.builders;

import com.barataribeiro.sentinelofliberty.dtos.user.UserAccountDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserProfileDTO;
import com.barataribeiro.sentinelofliberty.dtos.user.UserSecurityDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Notification;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserMapper {
    private final ModelMapper modelMapper;

    @PostConstruct
    public void setupModelMapper() {
        modelMapper.addMappings(new PropertyMap<User, UserAccountDTO>() {
            @Override
            protected void configure() {
                using(ctx -> {
                    Set<?> articles = (Set<?>) ctx.getSource();
                    return articles == null ? 0L : (long) articles.size();
                }).map(source.getArticles(), destination.getArticlesCount());

                using(ctx -> {
                    Set<?> children = (Set<?>) ctx.getSource();
                    return children == null ? 0L : (long) children.size();
                }).map(source.getComments(), destination.getCommentsCount());

                using(ctx -> {
                    Set<?> notifications = (Set<?>) ctx.getSource();
                    return notifications == null ? 0L : notifications
                            .parallelStream()
                            .filter(notification -> ((Notification) notification).isRead()).count();
                }).map(source.getNotifications(), destination.getReadNotificationsCount());

                using(ctx -> {
                    Set<?> notifications = (Set<?>) ctx.getSource();
                    return notifications == null ? 0L : notifications
                            .parallelStream()
                            .filter(notification -> !((Notification) notification).isRead()).count();
                }).map(source.getNotifications(), destination.getUnreadNotificationsCount());
            }
        });
    }

    public UserSecurityDTO toUserSecurityDTO(User user) {
        return modelMapper.map(user, UserSecurityDTO.class);
    }

    public UserProfileDTO toUserProfileDTO(User user) {
        return modelMapper.map(user, UserProfileDTO.class);
    }

    public UserAccountDTO toUserAccountDTO(User user) {
        return modelMapper.map(user, UserAccountDTO.class);
    }
}
