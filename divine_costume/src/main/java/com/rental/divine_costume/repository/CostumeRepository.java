package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.Costume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CostumeRepository extends JpaRepository<Costume, Long> {
    @Query("select coalesce(max(c.serialNumber), 0) from Costume c " +
           "join c.costumeVariant v " +
           "join v.category cat " +
           "where lower(cat.categoryName) = lower(:categoryName) " +
           "and lower(v.primaryColor) = lower(:primaryColor) " +
           "and lower(coalesce(v.secondaryColor, '')) = lower(coalesce(:secondaryColor, '')) " +
           "and lower(coalesce(v.tertiaryColor, '')) = lower(coalesce(:tertiaryColor, '')) " +
           "and lower(c.size) = lower(:size)")
    Integer findMaxSerialNumber(
            @Param("categoryName") String categoryName,
            @Param("primaryColor") String primaryColor,
            @Param("secondaryColor") String secondaryColor,
            @Param("tertiaryColor") String tertiaryColor,
            @Param("size") String size
    );
}
