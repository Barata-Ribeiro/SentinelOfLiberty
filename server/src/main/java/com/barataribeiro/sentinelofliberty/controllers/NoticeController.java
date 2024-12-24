package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.dtos.ApplicationResponseDTO;
import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeDTO;
import com.barataribeiro.sentinelofliberty.dtos.notice.NoticeRequestDTO;
import com.barataribeiro.sentinelofliberty.services.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Notice", description = "Notice endpoints")
public class NoticeController {
    private final NoticeService noticeService;

    @Operation(summary = "Create a notice",
               description = "This endpoint allows an admin to create a notice by providing the title and message. " +
                       "The notice will be displayed on the homepage. The title is optional.")
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<NoticeDTO>> createArticle(@RequestBody @Valid NoticeRequestDTO body,
                                                                           Authentication authentication) {
        NoticeDTO response = noticeService.createNotice(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApplicationResponseDTO<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                                "You have successfully created a notice", response));
    }
}
