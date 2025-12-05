package com.rental.divine_costume.customer.service;

import com.rental.divine_costume.customer.dto.WishlistCreateDTO;
import com.rental.divine_costume.customer.dto.WishlistDTO;
import com.rental.divine_costume.customer.entity.Wishlist;
import com.rental.divine_costume.customer.mapper.WishlistMapper;
import com.rental.divine_costume.customer.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistMapper wishlistMapper;

    /**
     * Get all wishlist items for a customer
     */
    @Transactional(readOnly = true)
    public List<WishlistDTO> getWishlistByCustomerId(Long customerId) {
        return wishlistRepository.findByCustomerId(customerId)
                .stream()
                .map(wishlistMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Add item to wishlist
     */
    @Transactional
    public WishlistDTO addToWishlist(WishlistCreateDTO createDTO) {
        // Check if item already exists in wishlist
        if (wishlistRepository.existsByCustomerIdAndCostumeId(
                createDTO.getCustomerId(), createDTO.getCostumeId())) {
            throw new RuntimeException("Item already exists in wishlist");
        }

        Wishlist wishlist = wishlistMapper.toEntity(createDTO);
        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        return wishlistMapper.toDTO(savedWishlist);
    }

    /**
     * Remove item from wishlist
     */
    @Transactional
    public void removeFromWishlist(Long customerId, Long costumeId) {
        if (!wishlistRepository.existsByCustomerIdAndCostumeId(customerId, costumeId)) {
            throw new RuntimeException("Item not found in wishlist");
        }

        wishlistRepository.deleteByCustomerIdAndCostumeId(customerId, costumeId);
    }

    /**
     * Remove wishlist item by ID
     */
    @Transactional
    public void removeWishlistItem(Long id) {
        if (!wishlistRepository.existsById(id)) {
            throw new RuntimeException("Wishlist item not found with id: " + id);
        }

        wishlistRepository.deleteById(id);
    }

    /**
     * Clear all wishlist items for a customer
     */
    @Transactional
    public void clearWishlist(Long customerId) {
        wishlistRepository.deleteByCustomerId(customerId);
    }

    /**
     * Check if item exists in wishlist
     */
    @Transactional(readOnly = true)
    public boolean isInWishlist(Long customerId, Long costumeId) {
        return wishlistRepository.existsByCustomerIdAndCostumeId(customerId, costumeId);
    }
}
