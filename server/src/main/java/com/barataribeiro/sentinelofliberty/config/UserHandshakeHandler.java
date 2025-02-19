package com.barataribeiro.sentinelofliberty.config;

import com.barataribeiro.sentinelofliberty.services.security.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserHandshakeHandler extends DefaultHandshakeHandler {
    private final TokenService tokenService;

    @Override
    protected Principal determineUser(@NotNull ServerHttpRequest request,
                                      @NotNull WebSocketHandler wsHandler,
                                      @NotNull Map<String, Object> attributes) {

        List<String> authHeaders = request.getHeaders().get("cookie");

        if (authHeaders != null && !authHeaders.isEmpty()) {
            String cookieValue = authHeaders.getFirst();
            String token = Arrays.stream(cookieValue.split(";"))
                                 .map(String::trim)
                                 .filter(s -> s.startsWith("auth_rt="))
                                 .findFirst()
                                 .map(s -> s.substring("auth_rt=".length()))
                                 .orElse(null);
            String username = tokenService.getUsernameFromToken(token);
            return new StomPrincipal(username);
        }

        return null;
    }
}
