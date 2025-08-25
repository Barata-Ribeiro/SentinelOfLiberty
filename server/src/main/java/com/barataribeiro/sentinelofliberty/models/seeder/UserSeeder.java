package com.barataribeiro.sentinelofliberty.models.seeder;

import com.barataribeiro.sentinelofliberty.models.entities.User;
import com.barataribeiro.sentinelofliberty.models.enums.Roles;
import com.barataribeiro.sentinelofliberty.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@Profile("development")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserSeeder {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${api.seed.username}")
    private String adminUsername;

    @Value("${api.seed.email}")
    private String adminEmail;

    @Value("${api.seed.password}")
    private String adminPassword;


    @PostConstruct
    @Transactional
    public void seedUsers() {
        boolean adminExists = userRepository.existsByUsernameOrEmailAllIgnoreCase(adminUsername, adminEmail);

        if (adminExists) {
            log.atInfo().log("An administrator already exists. Skipping user seeding.");
            return;
        }

        User newAdmin = User.builder()
                            .username(adminUsername)
                            .email(adminEmail)
                            .password(passwordEncoder.encode(adminPassword))
                            .displayName("Barata Ribeiro")
                            .role(Roles.ADMIN)
                            .build();

        userRepository.save(newAdmin);
        log.atInfo().log("Administrator user created with username: {} and email: {}", adminUsername, adminEmail);
    }
}
