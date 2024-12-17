package com.barataribeiro.sentinelofliberty.dtos;

import org.springframework.http.HttpStatus;

public record ApplicationResponseDTO<T>(HttpStatus status,
                                        int code,
                                        String message,
                                        T data) {}