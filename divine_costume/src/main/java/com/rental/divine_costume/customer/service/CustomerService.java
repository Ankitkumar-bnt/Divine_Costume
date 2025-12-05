package com.rental.divine_costume.customer.service;

import com.rental.divine_costume.customer.dto.CustomerCreateDTO;
import com.rental.divine_costume.customer.dto.CustomerDTO;
import com.rental.divine_costume.customer.entity.Customer;
import com.rental.divine_costume.customer.mapper.CustomerMapper;
import com.rental.divine_costume.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get all customers
     */
    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get customer by ID
     */
    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return customerMapper.toDTO(customer);
    }

    /**
     * Get customer by email
     */
    @Transactional(readOnly = true)
    public CustomerDTO getCustomerByEmail(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));
        return customerMapper.toDTO(customer);
    }

    /**
     * Create new customer
     */
    @Transactional
    public CustomerDTO createCustomer(CustomerCreateDTO createDTO) {
        // Check if email already exists
        if (customerRepository.existsByEmail(createDTO.getEmail())) {
            throw new RuntimeException("Email already exists: " + createDTO.getEmail());
        }

        // Check if contact already exists
        if (customerRepository.existsByContact(createDTO.getContact())) {
            throw new RuntimeException("Contact already exists: " + createDTO.getContact());
        }

        // Encrypt password
        String encryptedPassword = passwordEncoder.encode(createDTO.getPassword());
        createDTO.setPassword(encryptedPassword);

        // Convert DTO to entity
        Customer customer = customerMapper.toEntity(createDTO);

        // Save customer
        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toDTO(savedCustomer);
    }

    /**
     * Update customer
     */
    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerCreateDTO updateDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        // Check if email is being changed and if it already exists
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(customer.getEmail())) {
            if (customerRepository.existsByEmail(updateDTO.getEmail())) {
                throw new RuntimeException("Email already exists: " + updateDTO.getEmail());
            }
        }

        // Check if contact is being changed and if it already exists
        if (updateDTO.getContact() != null && !updateDTO.getContact().equals(customer.getContact())) {
            if (customerRepository.existsByContact(updateDTO.getContact())) {
                throw new RuntimeException("Contact already exists: " + updateDTO.getContact());
            }
        }

        // Update entity
        customerMapper.updateEntity(customer, updateDTO);

        // Save updated customer
        Customer updatedCustomer = customerRepository.save(customer);

        return customerMapper.toDTO(updatedCustomer);
    }

    /**
     * Update customer password
     */
    @Transactional
    public void updatePassword(Long id, String newPassword) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        String encryptedPassword = passwordEncoder.encode(newPassword);
        customer.setPassword(encryptedPassword);

        customerRepository.save(customer);
    }

    /**
     * Update login status
     */
    @Transactional
    public void updateLoginStatus(Long id, Boolean loginStatus) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        customer.setLoginStatus(loginStatus);
        customerRepository.save(customer);
    }

    /**
     * Delete customer
     */
    @Transactional
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    /**
     * Verify customer credentials (for login)
     */
    @Transactional(readOnly = true)
    public boolean verifyCredentials(String email, String password) {
        Customer customer = customerRepository.findByEmail(email)
                .orElse(null);

        if (customer == null) {
            return false;
        }

        return passwordEncoder.matches(password, customer.getPassword());
    }
}
