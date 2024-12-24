package com.barataribeiro.sentinelofliberty.builders;

import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeDTO;
import com.barataribeiro.sentinelofliberty.models.entities.Notice;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.LinkedHashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NoticeMapper {
    private final ModelMapper modelMapper;

    public NoticeDTO toNoticeDTO(Notice notice) {
        return modelMapper.map(notice, NoticeDTO.class);
    }

    public Set<NoticeDTO> toNoticeDTOSet(@NotNull Set<Notice> notices) {
        LinkedHashSet<NoticeDTO> noticeDTOs = new LinkedHashSet<>();
        notices.forEach(notice -> noticeDTOs.add(toNoticeDTO(notice)));
        return noticeDTOs;
    }
}
