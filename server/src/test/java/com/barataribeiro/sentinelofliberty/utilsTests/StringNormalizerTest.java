package com.barataribeiro.sentinelofliberty.utilsTests;

import com.barataribeiro.sentinelofliberty.utils.StringNormalizer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(SpringExtension.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class StringNormalizerTest {

    @ParameterizedTest
    @CsvSource({
            "'This is a test', 'this-is-a-test'",
            "'Café com leite', 'cafe-com-leite'",
            "'This is a test, using numbers 123', 'this-is-a-test-using-numbers-123'",
            "'Decreto do governo restringe o uso de armas por policiais; veja pontos', " +
                    "'decreto-do-governo-restringe-o-uso-de-armas-por-policiais-veja-pontos'",
            "'', ''"
    })
    @DisplayName("Test toSlug method with various inputs to return a slug of the input string for URLs")
    void toSlugHandlesVariousInputs(String input, String expected) {
        assertEquals(expected, StringNormalizer.toSlug(input));
    }

    @ParameterizedTest
    @CsvSource({
            "'Short', 10, 'Short...'",
            "'ExactLength', 11, 'ExactLength...'",
            "'This is a longer input string', 10, 'This is a ...'",
            "'', 10, '...'"
    })
    @DisplayName(
            "Test toSummary method with various inputs to return a summary of the input string with a maximum length")
    void toSummaryHandlesVariousInputs(String input, int length, String expected) {
        assertEquals(expected, StringNormalizer.toSummary(input, length));
    }
}