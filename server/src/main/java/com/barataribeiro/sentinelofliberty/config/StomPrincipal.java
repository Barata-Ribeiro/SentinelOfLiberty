package com.barataribeiro.sentinelofliberty.config;

import lombok.RequiredArgsConstructor;

import java.security.Principal;

@RequiredArgsConstructor
public class StomPrincipal implements Principal {
    private final String name;

    @Override
    public String getName() {
        return name;
    }
}
