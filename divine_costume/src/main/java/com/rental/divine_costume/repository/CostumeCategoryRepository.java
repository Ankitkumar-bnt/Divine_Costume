package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.CostumeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CostumeCategoryRepository extends JpaRepository<CostumeCategory, Long> {
    Optional<CostumeCategory> findByCategoryName(String categoryName);
}
