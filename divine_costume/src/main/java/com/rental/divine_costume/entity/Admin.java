package com.rental.divine_costume.entity;

import com.rental.divine_costume.entity.items.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Admin extends BaseEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false)
    private String password; // Will be encrypted

    @Column(name = "contact", nullable = false, length = 15)
    private String contact;

    @Column(name = "alternate_contact", length = 15)
    private String alternateContact;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "map_address", columnDefinition = "TEXT")
    private String mapAddress;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 10)
    private String pincode;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "instagram", length = 255)
    private String instagram;

    @Column(name = "facebook", length = 255)
    private String facebook;

    @Column(name = "x_twitter", length = 255)
    private String xTwitter;

    @Column(name = "signin_date")
    private LocalDateTime signinDate;

    @Column(name = "login_status")
    private Boolean loginStatus = false;
}
