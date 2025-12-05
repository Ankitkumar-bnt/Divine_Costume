package com.rental.divine_costume.entity.items;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "costume")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Costume extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
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
    
    @OneToMany(mappedBy = "costume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<CostumeItem> items = new ArrayList<>();
}
