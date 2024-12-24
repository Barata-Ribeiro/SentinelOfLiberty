package com.barataribeiro.sentinelofliberty.services;

import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeDTO;
import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeRequestDTO;
import org.springframework.security.core.Authentication;

public interface NoticeService {
    NoticeDTO createNotice(NoticeRequestDTO body, Authentication authentication);
}
