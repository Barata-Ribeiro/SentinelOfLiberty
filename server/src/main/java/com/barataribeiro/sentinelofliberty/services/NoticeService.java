package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeDTO;
import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

import java.util.Set;

public interface NoticeService {
    Set<NoticeDTO> getLatestActiveNotices();

    Page<NoticeDTO> getAllOwnNotices(String search, int page, int perPage, String direction, String orderBy,
                                     Authentication authentication);

    NoticeDTO createNotice(NoticeRequestDTO body, Authentication authentication);

    NoticeDTO updateNotice(Long id, NoticeRequestDTO body, Authentication authentication);
}
