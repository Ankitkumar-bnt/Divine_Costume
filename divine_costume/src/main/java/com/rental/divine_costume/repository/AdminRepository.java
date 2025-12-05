package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    /**
     * Find admin by email
     */
    Optional<Admin> findByEmail(String email);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find admin by contact
     */
    Optional<Admin> findByContact(String contact);

    /**
     * Check if contact exists
     */
    boolean existsByContact(String contact);
}
