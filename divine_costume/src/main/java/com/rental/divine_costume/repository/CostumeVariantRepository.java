package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.CostumeVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CostumeVariantRepository extends JpaRepository<CostumeVariant, Long> {
    List<CostumeVariant> findByCategoryId(Long categoryId);
    List<CostumeVariant> findByCategoryIdAndVariantDescriptionIgnoreCase(Long categoryId, String variantDescription);
    
    // Eager fetch images to avoid lazy loading issues
    @Query("SELECT DISTINCT v FROM CostumeVariant v LEFT JOIN FETCH v.images WHERE v.id = :id")
    Optional<CostumeVariant> findByIdWithImages(@Param("id") Long id);
    
    @Query("SELECT DISTINCT v FROM CostumeVariant v LEFT JOIN FETCH v.images WHERE v.category.id = :categoryId")
    List<CostumeVariant> findByCategoryIdWithImages(@Param("categoryId") Long categoryId);
}
