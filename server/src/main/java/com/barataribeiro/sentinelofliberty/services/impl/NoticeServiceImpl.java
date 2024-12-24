package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.builders.NoticeMapper;
import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeDTO;
import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeRequestDTO;
import com.barataribeiro.sentinelofliberty.exceptions.throwables.EntityNotFoundException;
import com.barataribeiro.sentinelofliberty.models.entities.Notice;
import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.repositories.NoticeRepository;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import com.barataribeiro.sentinelofliberty.services.NoticeService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NoticeServiceImpl implements NoticeService {
    private final UserRepository userRepository;
    private final NoticeMapper noticeMapper;
    private final NoticeRepository noticeRepository;

    @Override
    @Transactional(readOnly = true)
    public Set<NoticeDTO> getLatestActiveNotices() {
        return noticeMapper.toNoticeDTOSet(noticeRepository.findTop5ByIsActiveTrueOrderByCreatedAtDesc());
    }

    @Override
    @Transactional
    public NoticeDTO createNotice(@NotNull NoticeRequestDTO body, @NotNull Authentication authentication) {
        User author = userRepository.findByUsername(authentication.getName())
                                    .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName()));

        Notice notice = Notice.builder()
                              .title(body.getTitle())
                              .message(body.getMessage())
                              .user(author)
                              .build();

        return noticeMapper.toNoticeDTO(noticeRepository.saveAndFlush(notice));
    }
}
