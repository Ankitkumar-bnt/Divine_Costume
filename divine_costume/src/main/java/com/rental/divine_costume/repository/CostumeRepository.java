package com.rental.divine_costume.repository;

import com.rental.divine_costume.entity.items.Costume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CostumeRepository extends JpaRepository<Costume, Long> {
}
