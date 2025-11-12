package com.rental.divine_costume.entity.items;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "costume_variant")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostumeVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
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
}
