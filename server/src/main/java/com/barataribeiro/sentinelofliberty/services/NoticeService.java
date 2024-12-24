package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeDTO;
import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeRequestDTO;
import org.springframework.security.core.Authentication;

import java.util.Set;

public interface NoticeService {
    Set<NoticeDTO> getLatestActiveNotices();

    NoticeDTO createNotice(NoticeRequestDTO body, Authentication authentication);
}
