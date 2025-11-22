package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.CostumePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CostumePartRepository extends JpaRepository<CostumePart, Long> {
    
    List<CostumePart> findByParentCostumeId(Long parentCostumeId);
    
    @Query("SELECT cp FROM CostumePart cp WHERE cp.parentCostume.id = :costumeId AND cp.isEssential = true")
    List<CostumePart> findEssentialPartsByCostumeId(@Param("costumeId") Long costumeId);
    
    @Query("SELECT cp FROM CostumePart cp WHERE cp.partType = :partType")
    List<CostumePart> findByPartType(@Param("partType") String partType);
}
