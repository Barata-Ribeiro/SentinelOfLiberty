package com.barataribeiro.sentinelofliberty.utils;

public final class ApplicationConstants {
    public static final String AUTH_0 = "auth0";
    public static final String CONTENT_SECURITY_POLICY_VALUE = "script-src 'self'; frame-ancestors 'self'; " +
            "upgrade-insecure-requests";
    public static final String CREATED_AT = "createdAt";
    public static final String THE_PROVIDED_TOKEN_IS_INVALID = "The provided token is invalid";
    private static final String[] AUTH_WHITELIST = {
            // -- Swagger UI v2
            "/v2/api-docs",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui.html",
            "/webjars/**",
            // -- Swagger UI v3 (OpenAPI)
            "/api-docs",
            "/api-docs/**",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            // -- Application
            "/",
            "/h2-console/**",
            "/actuator/**",
            "/ws/**",
            "/api/v1/auth/**",
            "/api/v1/*/public/**",
            };

    private ApplicationConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }

    public static String[] getAuthWhitelist() {
        return AUTH_WHITELIST.clone();
    }
}
