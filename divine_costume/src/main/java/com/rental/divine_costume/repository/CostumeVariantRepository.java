package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.CostumeVariant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CostumeVariantRepository extends JpaRepository<CostumeVariant, Long> {
}
