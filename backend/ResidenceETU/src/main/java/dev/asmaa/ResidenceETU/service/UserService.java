package dev.asmaa.ResidenceETU.service;

import dev.asmaa.ResidenceETU.model.Role;
import dev.asmaa.ResidenceETU.model.User;
import dev.asmaa.ResidenceETU.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository; // Injection du dépôt pour les utilisateurs

    @Autowired
    private PasswordEncoder passwordEncoder; // Injection de l'encodeur de mots de passe

    // Enregistrer un nouvel utilisateur
    @Transactional
    public User registerUser(User user) {
        // Vérifie si l'email est déjà pris
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("L'email est déjà pris");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode le mot de passe
        return userRepository.save(user); // Sauvegarde de l'utilisateur dans le dépôt
    }

    // Mettre à jour un utilisateur existant
    @Transactional
    public User updateUser(Long id, User userUpdate) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id));

        existingUser.setUsername(userUpdate.getUsername());
        existingUser.setEmail(userUpdate.getEmail());
        existingUser.setContact(userUpdate.getContact());
        existingUser.setRole(userUpdate.getRole());
        existingUser.setNomEtablissements(userUpdate.getNomEtablissements());
        existingUser.setCin(userUpdate.getCin());

        if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    // Récupérer un utilisateur par ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id)); // Recherche de l'utilisateur par ID
    }

    // Récupérer tous les utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll(); // Récupération de tous les utilisateurs
    }

    // Récupérer les résidents
    public List<User> getResidents() {
        return userRepository.findByRole(Role.RESIDENT); // Recherche des utilisateurs avec le rôle de résident
    }

    // Supprimer un utilisateur par ID
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id)); // Recherche de l'utilisateur
        userRepository.delete(user); // Suppression de l'utilisateur
    }

    public long getTotalResidents() {
        return userRepository.countByRole(Role.RESIDENT); // Compte les utilisateurs avec le rôle de résident
    }
}
