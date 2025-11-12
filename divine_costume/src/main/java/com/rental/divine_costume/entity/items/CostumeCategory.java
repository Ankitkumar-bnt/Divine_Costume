package com.rental.divine_costume.entity.items;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "costume_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostumeCategory extends BaseEntity {

    @Column(name = "category_name", nullable = false, length = 100)
    private String categoryName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String categoryDescription;
}
