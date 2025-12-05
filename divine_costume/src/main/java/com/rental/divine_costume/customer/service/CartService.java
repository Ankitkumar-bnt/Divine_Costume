package com.rental.divine_costume.customer.service;

import com.rental.divine_costume.customer.dto.CartCreateDTO;
import com.rental.divine_costume.customer.dto.CartDTO;
import com.rental.divine_costume.customer.entity.Cart;
import com.rental.divine_costume.customer.mapper.CartMapper;
import com.rental.divine_costume.customer.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartMapper cartMapper;

    /**
     * Get all cart items for a customer
     */
    @Transactional(readOnly = true)
    public List<CartDTO> getCartByCustomerId(Long customerId) {
        return cartRepository.findByCustomerId(customerId)
                .stream()
                .map(cartMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get cart item by ID
     */
    @Transactional(readOnly = true)
    public CartDTO getCartItemById(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));
        return cartMapper.toDTO(cart);
    }

    /**
     * Add item to cart
     */
    @Transactional
    public CartDTO addToCart(CartCreateDTO createDTO) {
        // Check if item already exists in cart
        if (cartRepository.existsByCustomerIdAndCostumeId(
                createDTO.getCustomerId(), createDTO.getCostumeId())) {
            // Update existing cart item
            Cart existingCart = cartRepository.findByCustomerIdAndCostumeId(
                    createDTO.getCustomerId(), createDTO.getCostumeId())
                    .orElseThrow(() -> new RuntimeException("Cart item not found"));

            cartMapper.updateEntity(existingCart, createDTO);
            Cart updatedCart = cartRepository.save(existingCart);
            return cartMapper.toDTO(updatedCart);
        }

        // Add new item to cart
        Cart cart = cartMapper.toEntity(createDTO);
        Cart savedCart = cartRepository.save(cart);

        return cartMapper.toDTO(savedCart);
    }

    /**
     * Update cart item
     */
    @Transactional
    public CartDTO updateCartItem(Long id, CartCreateDTO updateDTO) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + id));

        cartMapper.updateEntity(cart, updateDTO);
        Cart updatedCart = cartRepository.save(cart);

        return cartMapper.toDTO(updatedCart);
    }

    /**
     * Remove item from cart
     */
    @Transactional
    public void removeFromCart(Long customerId, Long costumeId) {
        if (!cartRepository.existsByCustomerIdAndCostumeId(customerId, costumeId)) {
            throw new RuntimeException("Item not found in cart");
        }

        cartRepository.deleteByCustomerIdAndCostumeId(customerId, costumeId);
    }

    /**
     * Remove cart item by ID
     */
    @Transactional
    public void removeCartItem(Long id) {
        if (!cartRepository.existsById(id)) {
            throw new RuntimeException("Cart item not found with id: " + id);
        }

        cartRepository.deleteById(id);
    }

    /**
     * Clear all cart items for a customer
     */
    @Transactional
    public void clearCart(Long customerId) {
        cartRepository.deleteByCustomerId(customerId);
    }

    /**
     * Check if item exists in cart
     */
    @Transactional(readOnly = true)
    public boolean isInCart(Long customerId, Long costumeId) {
        return cartRepository.existsByCustomerIdAndCostumeId(customerId, costumeId);
    }
}
