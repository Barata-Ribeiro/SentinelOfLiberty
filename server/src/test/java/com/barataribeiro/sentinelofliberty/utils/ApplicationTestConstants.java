package com.barataribeiro.sentinelofliberty.utils;

public final class ApplicationTestConstants {

    public static final String NEW_ARTICLE_PAYLOAD = """
                                                     {
                                                         "title": "Test Article",
                                                         "subTitle": "Short Test",
                                                         "content": "This is a test article. It is a very good test article. This additional text ensures the content is at least 100 characters.",
                                                         "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                                         "categories": ["test"]
                                                     }
                                                     """;
    public static final String UPDATE_ARTICLE_PAYLOAD = """
                                                        {
                                                            "title": "Updated Test Article",
                                                            "subTitle": "Updated Short Test",
                                                            "content": "This is an update to the testing article. It is a very good testing article. This additional text ensures the content is at least 100 characters. Now it is updated with more text.",
                                                            "mediaUrl": "https://example.com/image.jpg",
                                                            "references": ["https://exampleTwo.com", "https://exampleThree.com"],
                                                            "categories": ["testing", "update"]
                                                        }
                                                        """;

    public static final String VALID_LOGIN_PAYLOAD = """
                                                     {
                                                         "username": "testuser",
                                                         "password": "testpassword",
                                                         "rememberMe": false
                                                     }
                                                     """;
    public static final String VALID_ADMIN_LOGIN_PAYLOAD = """
                                                           {
                                                               "username": "testadmin",
                                                               "password": "testpassword"
                                                           }
                                                           """;


    private ApplicationTestConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}
