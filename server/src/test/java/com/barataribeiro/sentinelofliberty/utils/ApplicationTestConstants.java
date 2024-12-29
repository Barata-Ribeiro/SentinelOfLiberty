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

    public static final String NEW_NOTICE_PAYLOAD = """
                                                    {
                                                        "title": "Test Notice",
                                                        "message": "This is a test notice. A warning which all users should read."
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

    public static final String ADMIN_UPDATE_PROFILE_PAYLOAD = """
                                                              {
                                                                  "currentPassword": "testpassword",
                                                                  "username": "testadminupdated",
                                                                  "email": "testadminnewemail@example.com",
                                                                  "displayName": "New Admin",
                                                                  "fullName": "Mr New Admin",
                                                                  "avatarUrl": "https://example.com/avatar.jpg",
                                                                  "biography": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                                                  "location": "New York, USA",
                                                                  "website": "https://example.com",
                                                                  "newPassword": "4JTH#Rf7tUtwaEi@"
                                                              }
                                                              """;


    private ApplicationTestConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}
