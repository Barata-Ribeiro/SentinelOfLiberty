package com.barataribeiro.sentinelofliberty.utils;

public final class ApplicationTestConstants {
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

    public static final String NEW_SUGGESTION_PAYLOAD = """
                                                        {
                                                            "title": "Test Suggestion",
                                                            "content": "This is a test suggestion. It is a very good test suggestion. This additional text ensures the content is at least 100 characters.",
                                                            "mediaUrl": "https://exampleOne.com/image.jpg",
                                                            "sourceUrl": "https://exampleTwo.com"
                                                        }
                                                        """;

    public static final String LONG_LOREM_IPSUM = "Iuvaret proin orci alienum maximus definitionem nobis diam veri " +
            "habemus nisl dolores amet metus suas accumsan interdum senectus venenatis ius dolore reprimique eros ne " +
            "adversarium volumus ornatus invidunt antiopam postea sumo metus ridens lobortis prompta habemus ornatus " +
            "alterum venenatis aenean taciti sit fermentum ullamcorper ac errem mentitum principes inceptos inimicus " +
            "taciti omittam possim simul augue nulla ridens ridens ignota idque splendide appareat eget adversarium " +
            "legimus suspendisse tractatos non pri quod suspendisse vidisse viris verterem bibendum sapientem idque " +
            "platonem suscipiantur veritus nisl maecenas tamquam penatibus odio ultrices gloriatur sumo comprehensam " +
            "pharetra ut mutat diam constituto nobis ultricies libero tincidunt tale diam meliore conceptam quis sit " +
            "vel tibique ultricies lectus ullamcorper ipsum aptent possit sagittis possim ancillae elementum " +
            "deterruisset idque vero inceptos id liber gubergren ipsum simul volutpat rhoncus elit porta definiebas " +
            "prodesset solum sit vix efficiantur maecenas hendrerit quod fames reformidans id condimentum eget " +
            "phasellus causae class mnesarchum consectetuer necessitatibus tation idque habeo ultricies ludus " +
            "necessitatibus fames egestas tibique qui tantas adversarium his nobis a imperdiet sanctus comprehensam " +
            "tritani vulputate esse eum mentitum tantas singulis cu ultricies offendit turpis consul libero habitant " +
            "luctus brute cras iuvaret elit diam commune morbi eruditi omittantur elementum pertinax montes sit " +
            "mediocrem habeo pri petentium ubique.";

    public static final String NEW_ARTICLE_PAYLOAD = String.format("""
                                                                   {
                                                                       "title": "Test Article",
                                                                       "subTitle": "Short Test",
                                                                       "summary": "This is a test article. It is a very good test article. This additional text ensures the content is at least 100 characters.",
                                                                       "content": "%s",
                                                                       "references": ["https://exampleOne.com", "https://exampleTwo.com"],
                                                                       "categories": ["test"]
                                                                   }
                                                                   """, LONG_LOREM_IPSUM);
    public static final String UPDATE_ARTICLE_PAYLOAD = """
                                                        {
                                                            "title": "Updated Test Article",
                                                            "subTitle": "Updated Short Test",
                                                            "summary": "This is an update to the testing article. It is a very good testing article. This additional text ensures the content is at least 100 characters.",
                                                            "content": "This is an update to the testing article. It is a very good testing article. This additional text ensures the content is at least 100 characters. Now it is updated with more text. This additional text ensures the content is at least enough updated characters.",
                                                            "mediaUrl": "https://example.com/image.jpg",
                                                            "references": ["https://exampleTwo.com", "https://exampleThree.com"],
                                                            "categories": ["testing", "update"]
                                                        }
                                                        """;

    private ApplicationTestConstants() {
        throw new UnsupportedOperationException("This class cannot be instantiated.");
    }
}
