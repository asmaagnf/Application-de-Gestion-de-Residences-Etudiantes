package dev.asmaa.ResidenceETU.repository;

import dev.asmaa.ResidenceETU.model.Incident;
import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    long countByStatus(String status);
}
