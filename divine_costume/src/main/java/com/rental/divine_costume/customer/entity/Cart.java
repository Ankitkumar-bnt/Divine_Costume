package com.rental.divine_costume.customer.entity;

import com.rental.divine_costume.entity.items.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cart")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Cart extends BaseEntity {

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "costume_id", nullable = false)
    private Long costumeId;

    @Column(name = "count", nullable = false)
    private Integer count;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "total_deposit", precision = 10, scale = 2)
    private BigDecimal totalDeposit;
}
