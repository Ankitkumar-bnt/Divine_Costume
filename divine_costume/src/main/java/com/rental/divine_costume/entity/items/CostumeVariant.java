package com.rental.divine_costume.entity.items;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "costume_variant")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CostumeVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private CostumeCategory category;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String variantDescription;

    @Column(name = "style", columnDefinition = "TEXT")
    private String style;

    @Column(name = "primary_color", columnDefinition = "TEXT")
    private String primaryColor;

    @Column(name = "secondary_color", columnDefinition = "TEXT")
    private String secondaryColor;

    @Column(name = "tertiary_color", columnDefinition = "TEXT")
    private String tertiaryColor;

    @OneToMany(mappedBy = "costumeVariant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<CostumeImage> images = new ArrayList<>();
    
    @OneToMany(mappedBy = "costumeVariant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Costume> costumes = new ArrayList<>();
}
