package com.rental.divine_costume.controller;

import com.rental.divine_costume.dto.CustomerCreateDTO;
import com.rental.divine_costume.dto.CustomerDTO;
import com.rental.divine_costume.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Get all customers
     */
    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    /**
     * Get customer by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        try {
            CustomerDTO customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get customer by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<CustomerDTO> getCustomerByEmail(@PathVariable String email) {
        try {
            CustomerDTO customer = customerService.getCustomerByEmail(email);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Create new customer (Registration)
     */
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody CustomerCreateDTO createDTO) {
        try {
            CustomerDTO customer = customerService.createCustomer(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update customer
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerCreateDTO updateDTO) {
        try {
            CustomerDTO customer = customerService.updateCustomer(id, updateDTO);
            return ResponseEntity.ok(customer);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update customer password
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        try {
            String newPassword = passwordData.get("newPassword");
            if (newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password cannot be empty"));
            }
            customerService.updatePassword(id, newPassword);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Update login status
     */
    @PutMapping("/{id}/login-status")
    public ResponseEntity<?> updateLoginStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> statusData) {
        try {
            Boolean loginStatus = statusData.get("loginStatus");
            customerService.updateLoginStatus(id, loginStatus);
            return ResponseEntity.ok(Map.of("message", "Login status updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete customer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
            }

            boolean isValid = customerService.verifyCredentials(email, password);
            if (isValid) {
                CustomerDTO customer = customerService.getCustomerByEmail(email);
                // Update login status
                customerService.updateLoginStatus(customer.getId(), true);
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "customer", customer));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Logout endpoint
     */
    @PostMapping("/{id}/logout")
    public ResponseEntity<?> logout(@PathVariable Long id) {
        try {
            customerService.updateLoginStatus(id, false);
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
