package com.barataribeiro.sentinelofliberty.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.proxy.HibernateProxy;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import java.util.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Indexed
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

    @FullTextField
    @Column(nullable = false, unique = true)
    private String title;

    @FullTextField
    @Column(name = "sub_title")
    private String subTitle;

    @Lob
    @FullTextField
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @FullTextField
    @Column(nullable = false)
    private String summary;

    @Builder.Default
    @KeywordField
    @ElementCollection
    @Column(name = "reference_list", nullable = false)
    private Collection<String> references = new ArrayList<>();

    @Column(name = "media_url")
    private String mediaUrl;

    @Column(nullable = false, unique = true)
    private String slug;

    @Builder.Default
    @Column(name = "was_edit", columnDefinition = "BOOLEAN default 'false'", nullable = false)
    private Boolean wasEdit = false;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    @IndexedEmbedded
    private User author;


    @Builder.Default
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(name = "tb_articles_categories",
               joinColumns = @JoinColumn(name = "articles_id"),
               inverseJoinColumns = @JoinColumn(name = "categories_id"))
    @IndexedEmbedded
    private Set<Category> categories = new LinkedHashSet<>();

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new LinkedHashSet<>();

    @ManyToOne
    @JoinColumn(name = "suggestion_id")
    private Suggestion suggestion;

    @GenericField(sortable = Sortable.YES)
    @Column(updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @GenericField(sortable = Sortable.YES)
    @UpdateTimestamp
    private Instant updatedAt;

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy hibernateProxy ?
               hibernateProxy.getHibernateLazyInitializer().getPersistentClass().hashCode() :
               getClass().hashCode();
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || this.getClass() != o.getClass()) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy hibernateProxy ?
                                   hibernateProxy.getHibernateLazyInitializer().getPersistentClass() :
                                   o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy hibernateProxyThis ?
                                      hibernateProxyThis.getHibernateLazyInitializer().getPersistentClass() :
                                      this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Article article = (Article) o;
        return getId() != null && Objects.equals(getId(), article.getId());
    }
}