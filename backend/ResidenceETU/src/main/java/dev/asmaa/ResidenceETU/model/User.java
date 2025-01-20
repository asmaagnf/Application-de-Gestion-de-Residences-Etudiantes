package dev.asmaa.ResidenceETU.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 3, max = 50)
    private String username;

    @Email(message = "Format d'e-mail invalide")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Mot de passe est obligatoire")
    private String password;

    @NotBlank(message = "Numéro de téléphone est obligatoire")
    private String contact;

    @Enumerated(EnumType.STRING)
    private Role role = Role.RESIDENT; // Default role is RESIDENT

    @NotBlank(message = "Le nom de l'établissement est obligatoire")
    private String nomEtablissements; // New field for institution name

    @NotBlank(message = "CIN est obligatoire")
    @Size(min = 6, max = 20)
    @Column(unique = true)
    private String cin; // New field for CIN

    // Constructors
    public User() {}

    public User(String username, String email, String password, String contact, Role role, String nomEtablissements, String cin) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.contact = contact;
        this.role = role;
        this.nomEtablissements = nomEtablissements;
        this.cin = cin;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getNomEtablissements() {
        return nomEtablissements;
    }

    public void setNomEtablissements(String nomEtablissements) {
        this.nomEtablissements = nomEtablissements;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }
}


