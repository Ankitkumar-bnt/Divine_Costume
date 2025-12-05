package com.rental.divine_costume.customer.controller;

import com.rental.divine_costume.customer.dto.WishlistCreateDTO;
import com.rental.divine_costume.customer.dto.WishlistDTO;
import com.rental.divine_costume.customer.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;

    /**
     * Get all wishlist items for a customer
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<WishlistDTO>> getWishlistByCustomerId(@PathVariable Long customerId) {
        List<WishlistDTO> wishlist = wishlistService.getWishlistByCustomerId(customerId);
        return ResponseEntity.ok(wishlist);
    }

    /**
     * Add item to wishlist
     */
    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody WishlistCreateDTO createDTO) {
        try {
            WishlistDTO wishlist = wishlistService.addToWishlist(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(wishlist);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Remove item from wishlist by customer ID and costume ID
     */
    @DeleteMapping("/customer/{customerId}/costume/{costumeId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long customerId,
            @PathVariable Long costumeId) {
        try {
            wishlistService.removeFromWishlist(customerId, costumeId);
            return ResponseEntity.ok(Map.of("message", "Item removed from wishlist"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Remove wishlist item by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeWishlistItem(@PathVariable Long id) {
        try {
            wishlistService.removeWishlistItem(id);
            return ResponseEntity.ok(Map.of("message", "Wishlist item removed"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Clear all wishlist items for a customer
     */
    @DeleteMapping("/customer/{customerId}")
    public ResponseEntity<?> clearWishlist(@PathVariable Long customerId) {
        try {
            wishlistService.clearWishlist(customerId);
            return ResponseEntity.ok(Map.of("message", "Wishlist cleared"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Check if item exists in wishlist
     */
    @GetMapping("/check/customer/{customerId}/costume/{costumeId}")
    public ResponseEntity<Map<String, Boolean>> isInWishlist(
            @PathVariable Long customerId,
            @PathVariable Long costumeId) {
        boolean exists = wishlistService.isInWishlist(customerId, costumeId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
