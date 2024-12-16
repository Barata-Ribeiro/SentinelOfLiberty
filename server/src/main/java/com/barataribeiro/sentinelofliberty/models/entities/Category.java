package com.barataribeiro.sentinelofliberty.models.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.io.Serial;
import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_categories", indexes = {
        @Index(name = "idx_category_name_unq", columnList = "name", unique = true)
})
public class Category implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @ToString.Exclude
    @Builder.Default
    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    private Set<Article> articles = new LinkedHashSet<>();

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
        Category category = (Category) o;
        return getId() != null && Objects.equals(getId(), category.getId());
    }
}