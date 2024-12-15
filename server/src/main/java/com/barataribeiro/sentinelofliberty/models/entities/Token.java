package com.barataribeiro.sentinelofliberty.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_blacklisted_tokens", uniqueConstraints = {
        @UniqueConstraint(name = "uc_blacklist_token", columnNames = {"token"})
})
public class Token {
    @Id // The id is the JTI (JWT Token Identifier)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @Column(nullable = false, unique = true)
    private String tokenValue;

    @Column(name = "owner_username", nullable = false)
    private String ownerUsername;

    @Column(name = "expiration_date", nullable = false)
    private Instant expirationDate;

    @Column(name = "blacklisted_at", nullable = false)
    @CreationTimestamp
    private Instant blacklistedAt;

}