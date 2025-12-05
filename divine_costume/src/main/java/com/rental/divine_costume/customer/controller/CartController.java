package com.rental.divine_costume.customer.controller;

import com.rental.divine_costume.customer.dto.CartCreateDTO;
import com.rental.divine_costume.customer.dto.CartDTO;
import com.rental.divine_costume.customer.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    /**
     * Get all cart items for a customer
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CartDTO>> getCartByCustomerId(@PathVariable Long customerId) {
        List<CartDTO> cart = cartService.getCartByCustomerId(customerId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Get cart item by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCartItemById(@PathVariable Long id) {
        try {
            CartDTO cart = cartService.getCartItemById(id);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Add item to cart
     */
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartCreateDTO createDTO) {
        try {
            CartDTO cart = cartService.addToCart(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update cart item
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Long id,
            @RequestBody CartCreateDTO updateDTO) {
        try {
            CartDTO cart = cartService.updateCartItem(id, updateDTO);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Remove item from cart by customer ID and costume ID
     */
    @DeleteMapping("/customer/{customerId}/costume/{costumeId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long customerId,
            @PathVariable Long costumeId) {
        try {
            cartService.removeFromCart(customerId, costumeId);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Remove cart item by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long id) {
        try {
            cartService.removeCartItem(id);
            return ResponseEntity.ok(Map.of("message", "Cart item removed"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Clear all cart items for a customer
     */
    @DeleteMapping("/customer/{customerId}")
    public ResponseEntity<?> clearCart(@PathVariable Long customerId) {
        try {
            cartService.clearCart(customerId);
            return ResponseEntity.ok(Map.of("message", "Cart cleared"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Check if item exists in cart
     */
    @GetMapping("/check/customer/{customerId}/costume/{costumeId}")
    public ResponseEntity<Map<String, Boolean>> isInCart(
            @PathVariable Long customerId,
            @PathVariable Long costumeId) {
        boolean exists = cartService.isInCart(customerId, costumeId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
