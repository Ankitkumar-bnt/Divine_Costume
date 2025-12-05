package com.rental.divine_costume.customer.repository;

import com.rental.divine_costume.customer.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    /**
     * Find all wishlist items for a customer
     */
    List<Wishlist> findByCustomerId(Long customerId);

    /**
     * Find wishlist item by customer ID and costume ID
     */
    Optional<Wishlist> findByCustomerIdAndCostumeId(Long customerId, Long costumeId);

    /**
     * Delete wishlist item by customer ID and costume ID
     */
    void deleteByCustomerIdAndCostumeId(Long customerId, Long costumeId);

    /**
     * Check if costume exists in customer's wishlist
     */
    boolean existsByCustomerIdAndCostumeId(Long customerId, Long costumeId);

    /**
     * Delete all wishlist items for a customer
     */
    void deleteByCustomerId(Long customerId);
}
