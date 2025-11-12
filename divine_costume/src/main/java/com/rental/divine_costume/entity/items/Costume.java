package com.rental.divine_costume.entity.items;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "costume")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Costume extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "costume_variant_id", nullable = false)
    private CostumeVariant costumeVariant;

    @Column(name = "number_of_items")
    private Integer numberOfItems;

    @Column(name = "size", length = 20)
    private String size;

    @Column(name = "serial_number")
    private Integer serialNumber;

    @Column(name = "purchase_price", precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "rental_price_per_day", precision = 10, scale = 2)
    private BigDecimal rentalPricePerDay;

    @Column(name = "deposit", precision = 10, scale = 2)
    private BigDecimal deposit;

    @Column(name = "is_rentable")
    @Builder.Default
    private Boolean isRentable = true;
}
