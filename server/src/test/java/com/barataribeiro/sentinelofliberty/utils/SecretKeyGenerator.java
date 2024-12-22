package com.barataribeiro.sentinelofliberty.utils;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.SecureRandom;

@Disabled
public class SecretKeyGenerator {

    Logger logger = LoggerFactory.getLogger(SecretKeyGenerator.class);

    @Test
    public void generateSecretKey() {
        int keyLength = 64;

        SecureRandom secureRandom = new SecureRandom();

        byte[] key = new byte[keyLength];
        secureRandom.nextBytes(key);

        StringBuilder secretKey = new StringBuilder();
        for (byte b : key) {
            secretKey.append(String.format("%02x", b));
        }

        logger.info("Secret key: {}", secretKey);
    }
}