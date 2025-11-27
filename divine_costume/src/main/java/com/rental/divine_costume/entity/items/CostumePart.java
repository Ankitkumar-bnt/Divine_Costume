package com.rental.divine_costume.entity.items;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "costume_part")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostumePart extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_costume_id", nullable = false)
    private Costume parentCostume;

    @Column(name = "part_name", nullable = false, length = 100)
    private String partName;

    @Column(name = "part_description", columnDefinition = "TEXT")
    private String partDescription;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "is_essential")
    @Builder.Default
    private Boolean isEssential = false;

    @Column(name = "part_type", length = 50)
    private String partType; // e.g., "accessory", "main_piece", "decoration"

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
