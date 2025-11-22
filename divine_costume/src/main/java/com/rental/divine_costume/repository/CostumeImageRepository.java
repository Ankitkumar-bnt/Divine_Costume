package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.CostumeImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CostumeImageRepository extends JpaRepository<CostumeImage, Long> {
    Iterable<? extends CostumeImage> findAllByCostumeVariantId(long id);
}
