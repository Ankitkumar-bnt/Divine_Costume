package com.rental.divine_costume.entity.items;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "costume_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostumeImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "costume_variant_id", nullable = false)
    private CostumeVariant costumeVariant;

    @Column(name = "image_url", length = 255, nullable = false)
    private String imageUrl;
}
