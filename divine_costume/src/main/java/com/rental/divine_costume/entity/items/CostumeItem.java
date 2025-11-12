package com.rental.divine_costume.entity.items;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "costume_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostumeItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "costume_id", nullable = false)
    private Costume costume;

    @Column(name = "item_name", nullable = false, columnDefinition = "TEXT")
    private String itemName;

    @Column(name = "rental_price_per_day", precision = 10, scale = 2)
    private BigDecimal rentalPricePerDay;

    @Column(name = "deposit", precision = 10, scale = 2)
    private BigDecimal deposit;

    @Column(name = "image_url", length = 255)
    private String imageUrl;
}
