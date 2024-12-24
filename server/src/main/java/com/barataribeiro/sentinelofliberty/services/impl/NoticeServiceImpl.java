package com.barataribeiro.sentinelofliberty.services.impl;

import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeDTO;
import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeRequestDTO;
import com.barataribeiro.sentinelofliberty.services.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NoticeServiceImpl implements NoticeService {
    @Override
    public NoticeDTO createNotice(NoticeRequestDTO body, Authentication authentication) {
        return null;
    }
}
