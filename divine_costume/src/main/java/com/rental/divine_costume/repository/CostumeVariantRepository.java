package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.CostumeVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CostumeVariantRepository extends JpaRepository<CostumeVariant, Long> {
    List<CostumeVariant> findByCategoryId(Long categoryId);
    List<CostumeVariant> findByCategoryIdAndVariantDescriptionIgnoreCase(Long categoryId, String variantDescription);
}
