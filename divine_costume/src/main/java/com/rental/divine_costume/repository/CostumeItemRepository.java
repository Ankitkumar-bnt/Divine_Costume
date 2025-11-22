package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.CostumeItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CostumeItemRepository extends JpaRepository<CostumeItem, Long> {
    Iterable<? extends CostumeItem> findAllByCostumeId(Long costumeId);
}
