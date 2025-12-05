package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /**
     * Find customer by email
     */
    Optional<Customer> findByEmail(String email);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find customer by contact
     */
    Optional<Customer> findByContact(String contact);

    /**
     * Check if contact exists
     */
    boolean existsByContact(String contact);
}
