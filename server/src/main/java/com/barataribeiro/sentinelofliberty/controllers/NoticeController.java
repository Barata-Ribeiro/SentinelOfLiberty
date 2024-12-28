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
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Tag(name = "Notice", description = "Notice endpoints")
public class NoticeController {
    private final NoticeService noticeService;

    @Operation(summary = "Get the latest notice",
               description = "This endpoint returns the latest five active notices that are displayed on the homepage.")
    @GetMapping("/public/latest")
    public ResponseEntity<ApplicationResponseDTO<Set<NoticeDTO>>> getLatestNotice() {
        Set<NoticeDTO> response = noticeService.getLatestActiveNotices();
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved the latest notices",
                                                              response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Get all notices issued by you (admin)",
               description = "This endpoint allows a requesting admin (you) to get all notices that they have issued.")
    public ResponseEntity<ApplicationResponseDTO<Page<NoticeDTO>>> getAllOwnNotices(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt") String orderBy,
            Authentication authentication) {
        Page<NoticeDTO> response = noticeService.getAllOwnNotices(search, page, perPage, direction, orderBy,
                                                                  authentication);
        return ResponseEntity.ok(new ApplicationResponseDTO<>(HttpStatus.OK, HttpStatus.OK.value(),
                                                              "You have successfully retrieved all of your notices",
                                                              response));
    }

    @Operation(summary = "Create a notice",
               description = "This endpoint allows an admin to create a notice by providing the title and message. " +
                       "The notice will be displayed on the homepage. The title is optional.")
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApplicationResponseDTO<NoticeDTO>> createNotice(@RequestBody @Valid NoticeRequestDTO body,
                                                                          Authentication authentication) {
        NoticeDTO response = noticeService.createNotice(body, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(new ApplicationResponseDTO<>(HttpStatus.CREATED, HttpStatus.CREATED.value(),
                                                                "You have successfully created a notice", response));
    }
}
