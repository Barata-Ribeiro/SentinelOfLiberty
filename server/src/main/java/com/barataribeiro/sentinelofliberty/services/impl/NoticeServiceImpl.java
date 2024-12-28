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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    @Transactional(readOnly = true)
    public Page<NoticeDTO> getAllOwnNotices(String search, int page, int perPage, String direction, String orderBy,
                                            Authentication authentication) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<NoticeDTO> noticesPage;
        if (search != null && !search.isBlank()) {
            noticesPage = noticeRepository
                    .findAllByUser_UsernameAndSearchParams(authentication.getName(), search, pageable)
                    .map(noticeMapper::toNoticeDTO);
        } else {
            noticesPage = noticeRepository
                    .findByUser_Username(authentication.getName(), pageable)
                    .map(noticeMapper::toNoticeDTO);
        }

        return noticesPage;
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
