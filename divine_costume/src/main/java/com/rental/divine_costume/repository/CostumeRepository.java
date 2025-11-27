package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.Costume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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

    // Inventory management queries with eager image loading
    @Query("SELECT DISTINCT c FROM Costume c " +
           "JOIN FETCH c.costumeVariant v " +
           "LEFT JOIN FETCH v.images " +
           "JOIN v.category cat " +
           "WHERE cat.id = :categoryId")
    List<Costume> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT DISTINCT c FROM Costume c " +
           "JOIN FETCH c.costumeVariant v " +
           "LEFT JOIN FETCH v.images " +
           "WHERE v.id = :variantId")
    List<Costume> findByVariantId(@Param("variantId") Long variantId);

    @Query("SELECT DISTINCT c FROM Costume c " +
           "JOIN FETCH c.costumeVariant v " +
           "LEFT JOIN FETCH v.images " +
           "WHERE v.id = :variantId AND c.size = :size")
    List<Costume> findByVariantIdAndSize(@Param("variantId") Long variantId, @Param("size") String size);

    @Query("SELECT DISTINCT c.size FROM Costume c " +
           "JOIN c.costumeVariant v " +
           "WHERE v.id = :variantId " +
           "ORDER BY c.size")
    List<String> findDistinctSizesByVariantId(@Param("variantId") Long variantId);

    @Query("SELECT COUNT(c) FROM Costume c " +
           "JOIN c.costumeVariant v " +
           "WHERE v.id = :variantId AND c.size = :size AND c.isRentable = true")
    Long countAvailableByVariantIdAndSize(@Param("variantId") Long variantId, @Param("size") String size);
}
