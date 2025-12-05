package com.rental.divine_costume.service;

import com.rental.divine_costume.dto.AdminCreateDTO;
import com.rental.divine_costume.dto.AdminDTO;
import com.rental.divine_costume.entity.Admin;
import com.rental.divine_costume.mapper.AdminMapper;
import com.rental.divine_costume.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final AdminMapper adminMapper;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get all admins
     */
    @Transactional(readOnly = true)
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(adminMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get admin by ID
     */
    @Transactional(readOnly = true)
    public AdminDTO getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));
        return adminMapper.toDTO(admin);
    }

    /**
     * Get admin by email
     */
    @Transactional(readOnly = true)
    public AdminDTO getAdminByEmail(String email) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found with email: " + email));
        return adminMapper.toDTO(admin);
    }

    /**
     * Create new admin
     */
    @Transactional
    public AdminDTO createAdmin(AdminCreateDTO createDTO) {
        // Check if email already exists
        if (adminRepository.existsByEmail(createDTO.getEmail())) {
            throw new RuntimeException("Email already exists: " + createDTO.getEmail());
        }

        // Check if contact already exists
        if (adminRepository.existsByContact(createDTO.getContact())) {
            throw new RuntimeException("Contact already exists: " + createDTO.getContact());
        }

        // Encrypt password
        String encryptedPassword = passwordEncoder.encode(createDTO.getPassword());
        createDTO.setPassword(encryptedPassword);

        // Convert DTO to entity
        Admin admin = adminMapper.toEntity(createDTO);

        // Save admin
        Admin savedAdmin = adminRepository.save(admin);

        return adminMapper.toDTO(savedAdmin);
    }

    /**
     * Update admin
     */
    @Transactional
    public AdminDTO updateAdmin(Long id, AdminCreateDTO updateDTO) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));

        // Check if email is being changed and if it already exists
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(admin.getEmail())) {
            if (adminRepository.existsByEmail(updateDTO.getEmail())) {
                throw new RuntimeException("Email already exists: " + updateDTO.getEmail());
            }
        }

        // Check if contact is being changed and if it already exists
        if (updateDTO.getContact() != null && !updateDTO.getContact().equals(admin.getContact())) {
            if (adminRepository.existsByContact(updateDTO.getContact())) {
                throw new RuntimeException("Contact already exists: " + updateDTO.getContact());
            }
        }

        // Update entity
        adminMapper.updateEntity(admin, updateDTO);

        // Save updated admin
        Admin updatedAdmin = adminRepository.save(admin);

        return adminMapper.toDTO(updatedAdmin);
    }

    /**
     * Update admin password
     */
    @Transactional
    public void updatePassword(Long id, String newPassword) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));

        String encryptedPassword = passwordEncoder.encode(newPassword);
        admin.setPassword(encryptedPassword);

        adminRepository.save(admin);
    }

    /**
     * Update login status
     */
    @Transactional
    public void updateLoginStatus(Long id, Boolean loginStatus) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));

        admin.setLoginStatus(loginStatus);
        adminRepository.save(admin);
    }

    /**
     * Delete admin
     */
    @Transactional
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found with id: " + id);
        }
        adminRepository.deleteById(id);
    }

    /**
     * Verify admin credentials (for login)
     */
    @Transactional(readOnly = true)
    public boolean verifyCredentials(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElse(null);

        if (admin == null) {
            return false;
        }

        return passwordEncoder.matches(password, admin.getPassword());
    }
}
