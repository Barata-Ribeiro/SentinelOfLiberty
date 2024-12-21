package com.barataribeiro.sentinelofliberty.utils;

import org.jetbrains.annotations.NotNull;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class StringNormalizer {
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private StringNormalizer() {
        throw new IllegalStateException("Utility class");
    }

    public static @NotNull String toSlug(String input) {
        String noWhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }

    public static @NotNull String toSummary(@NotNull String input, int length) {
        return input.substring(0, Math.min(input.length(), length)) + "...";
    }
}
