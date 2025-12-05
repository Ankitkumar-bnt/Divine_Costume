package com.rental.divine_costume.customer.mapper;

import com.rental.divine_costume.customer.dto.CartCreateDTO;
import com.rental.divine_costume.customer.dto.CartDTO;
import com.rental.divine_costume.customer.entity.Cart;
import org.springframework.stereotype.Component;

@Component
public class CartMapper {

    /**
     * Convert Cart entity to CartDTO
     */
    public CartDTO toDTO(Cart cart) {
        if (cart == null) {
            return null;
        }

        return CartDTO.builder()
                .id(cart.getId())
                .customerId(cart.getCustomerId())
                .costumeId(cart.getCostumeId())
                .count(cart.getCount())
                .totalPrice(cart.getTotalPrice())
                .totalDeposit(cart.getTotalDeposit())
                .build();
    }

    /**
     * Convert CartCreateDTO to Cart entity
     */
    public Cart toEntity(CartCreateDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        Cart cart = new Cart();
        cart.setCustomerId(createDTO.getCustomerId());
        cart.setCostumeId(createDTO.getCostumeId());
        cart.setCount(createDTO.getCount());
        cart.setTotalPrice(createDTO.getTotalPrice());
        cart.setTotalDeposit(createDTO.getTotalDeposit());

        return cart;
    }

    /**
     * Update existing Cart entity from CartCreateDTO
     */
    public void updateEntity(Cart cart, CartCreateDTO updateDTO) {
        if (cart == null || updateDTO == null) {
            return;
        }

        if (updateDTO.getCount() != null) {
            cart.setCount(updateDTO.getCount());
        }
        if (updateDTO.getTotalPrice() != null) {
            cart.setTotalPrice(updateDTO.getTotalPrice());
        }
        if (updateDTO.getTotalDeposit() != null) {
            cart.setTotalDeposit(updateDTO.getTotalDeposit());
        }
    }
}
