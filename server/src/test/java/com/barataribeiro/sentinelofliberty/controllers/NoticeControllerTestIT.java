package com.barataribeiro.sentinelofliberty.controllers;

import com.barataribeiro.sentinelofliberty.utils.ApplicationBaseIntegrationTest;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;

import static org.junit.jupiter.api.Assertions.assertTrue;

@DirtiesContext
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
class NoticeControllerTestIT extends ApplicationBaseIntegrationTest {

    @Test
    public void testVoid() {
        assertTrue(true, "Test not implemented yet");
    }
}