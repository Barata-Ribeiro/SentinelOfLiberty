package com.barataribeiro.sentinelofliberty.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_articles", indexes = {
        @Index(name = "idx_article_title", columnList = "title")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uc_article_title_slug", columnNames = {"title", "slug"})
})
public class Article implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(name = "sub_title")
    private String subTitle;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String summary;

    @Builder.Default
    @ElementCollection
    private Collection<String> references = new ArrayList<>();

    @Column(name = "media_url")
    private String mediaUrl;

    @Column(nullable = false, unique = true)
    private String slug;

    @Builder.Default
    @Column(name = "was_edit", nullable = false)
    private Boolean wasEdit = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;


    @Builder.Default
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(name = "tb_articles_categories",
               joinColumns = @JoinColumn(name = "articles_id"),
               inverseJoinColumns = @JoinColumn(name = "categories_id"))
    private Set<Category> categories = new LinkedHashSet<>();

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new LinkedHashSet<>();

    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;


}