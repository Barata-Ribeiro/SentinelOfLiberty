package com.barataribeiro.sentinelofliberty.exceptions;

import lombok.*;

import java.io.Serializable;

@Data
@AllArgsConstructor
public class InvalidParam implements Serializable {
    private final String fieldName;
    private final String reason;
}
