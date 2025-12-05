package com.rental.divine_costume.customer.mapper;

import com.rental.divine_costume.customer.dto.WishlistCreateDTO;
import com.rental.divine_costume.customer.dto.WishlistDTO;
import com.rental.divine_costume.customer.entity.Wishlist;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {

    /**
     * Convert Wishlist entity to WishlistDTO
     */
    public WishlistDTO toDTO(Wishlist wishlist) {
        if (wishlist == null) {
            return null;
        }

        return WishlistDTO.builder()
                .id(wishlist.getId())
                .customerId(wishlist.getCustomerId())
                .costumeId(wishlist.getCostumeId())
                .build();
    }

    /**
     * Convert WishlistCreateDTO to Wishlist entity
     */
    public Wishlist toEntity(WishlistCreateDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setCustomerId(createDTO.getCustomerId());
        wishlist.setCostumeId(createDTO.getCostumeId());

        return wishlist;
    }
}
