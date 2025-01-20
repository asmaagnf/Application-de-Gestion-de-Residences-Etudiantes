package dev.asmaa.ResidenceETU.repository;

import dev.asmaa.ResidenceETU.model.Role;
import dev.asmaa.ResidenceETU.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(@Param("role") Role role);
    long countByRole(Role role);
    User findByUsername(String username);
}
