package com.rental.divine_costume.mapper;

import com.rental.divine_costume.dto.CustomerCreateDTO;
import com.rental.divine_costume.dto.CustomerDTO;
import com.rental.divine_costume.entity.Customer;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CustomerMapper {

    /**
     * Convert Customer entity to CustomerDTO
     */
    public CustomerDTO toDTO(Customer customer) {
        if (customer == null) {
            return null;
        }

        return CustomerDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .contact(customer.getContact())
                .alternateContact(customer.getAlternateContact())
                .address(customer.getAddress())
                .signinDate(customer.getSigninDate())
                .loginStatus(customer.getLoginStatus())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .createdBy(customer.getCreatedBy())
                .updatedBy(customer.getUpdatedBy())
                .build();
    }

    /**
     * Convert CustomerCreateDTO to Customer entity
     * Note: Password should be encrypted before calling this method
     */
    public Customer toEntity(CustomerCreateDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        Customer customer = new Customer();
        customer.setName(createDTO.getName());
        customer.setEmail(createDTO.getEmail());
        customer.setPassword(createDTO.getPassword()); // Should be encrypted
        customer.setContact(createDTO.getContact());
        customer.setAlternateContact(createDTO.getAlternateContact());
        customer.setAddress(createDTO.getAddress());
        customer.setSigninDate(LocalDateTime.now());
        customer.setLoginStatus(false);

        return customer;
    }

    /**
     * Update existing Customer entity from CustomerCreateDTO
     */
    public void updateEntity(Customer customer, CustomerCreateDTO updateDTO) {
        if (customer == null || updateDTO == null) {
            return;
        }

        if (updateDTO.getName() != null) {
            customer.setName(updateDTO.getName());
        }
        if (updateDTO.getEmail() != null) {
            customer.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getContact() != null) {
            customer.setContact(updateDTO.getContact());
        }
        if (updateDTO.getAlternateContact() != null) {
            customer.setAlternateContact(updateDTO.getAlternateContact());
        }
        if (updateDTO.getAddress() != null) {
            customer.setAddress(updateDTO.getAddress());
        }
        // Password update should be handled separately with encryption
    }
}
