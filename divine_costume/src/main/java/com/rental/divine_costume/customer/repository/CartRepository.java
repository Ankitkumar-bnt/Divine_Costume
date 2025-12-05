package com.rental.divine_costume.customer.repository;

import com.rental.divine_costume.customer.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    /**
     * Find all cart items for a customer
     */
    List<Cart> findByCustomerId(Long customerId);

    /**
     * Find cart item by customer ID and costume ID
     */
    Optional<Cart> findByCustomerIdAndCostumeId(Long customerId, Long costumeId);

    /**
     * Delete cart item by customer ID and costume ID
     */
    void deleteByCustomerIdAndCostumeId(Long customerId, Long costumeId);

    /**
     * Check if costume exists in customer's cart
     */
    boolean existsByCustomerIdAndCostumeId(Long customerId, Long costumeId);

    /**
     * Delete all cart items for a customer
     */
    void deleteByCustomerId(Long customerId);
}
