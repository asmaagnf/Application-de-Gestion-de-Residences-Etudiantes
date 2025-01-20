package dev.asmaa.ResidenceETU.service;

import dev.asmaa.ResidenceETU.model.Incident;
import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.model.RoomStatus;
import dev.asmaa.ResidenceETU.model.User;
import dev.asmaa.ResidenceETU.repository.IncidentRepository;
import dev.asmaa.ResidenceETU.repository.RoomRepository;
import dev.asmaa.ResidenceETU.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service

public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository; // Injection du dépôt pour les incidents

    @Autowired
    private RoomRepository roomRepository; // Injection du dépôt pour les chambres

    @Autowired
    private UserRepository userRepository; // Injection du dépôt pour les utilisateurs

    @Transactional
    public Incident createIncident(Long roomId, Long residentId, String description) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée"));
        User resident = userRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Résident non trouvé"));

        Incident incident = new Incident();
        incident.setRoom(room);
        incident.setResident(resident);
        incident.setDescription(description);

        return incidentRepository.save(incident);
    }

    // Récupérer tous les incidents
    public List<Incident> getAllIncident() {
        return incidentRepository.findAll(); // Récupération de tous les incidents
    }

    // Assigner un incident à un technicien
    public Incident assignIncidentToTechnician(Long incidentId, String technicianName) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.setAssigned(true);
        incident.setStatus("En Cours");
        incident.setUpdatedAt(new Date());
        incident.setTechnicianName(technicianName); // Save technician's name

        Room room = incident.getRoom();
        if (room != null) {
            room.setStatus(RoomStatus.MAINTENANCE);
            roomRepository.save(room);
        }

        return incidentRepository.save(incident);
    }

    // Désassigner un incident d'un technicien
    public Incident unassignIncidentFromTechnician(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.setAssigned(false);
        incident.setStatus("En Attente");
        incident.setUpdatedAt(new Date());
        incident.setTechnicianName(null); // Clear the technician's name

        Room room = incident.getRoom();
        if (room != null) {
            room.setStatus(RoomStatus.OCCUPEE);
        }

        return incidentRepository.save(incident);
    }

    // Mettre à jour le statut d'un incident
    public Incident updateIncidentStatus(Long incidentId, String status) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident non trouvé")); // Recherche de l'incident

        Room room = incident.getRoom(); // Récupération de la chambre associée à l'incident
        incident.setStatus(status); // Mise à jour du statut de l'incident
        incident.setUpdatedAt(new Date()); // Mise à jour de la date de modification

        switch (status.toLowerCase()) {
            case "Résolu":
                incident.setResolvedAt(new Date()); // Mise à jour de la date de résolution
                if (room != null) room.setStatus(RoomStatus.DISPONIBLE); // Changement du statut de la chambre
                break;
            case "en Cours":
                if (room != null) room.setStatus(RoomStatus.MAINTENANCE); // Changement du statut de la chambre
                break;
            default:
                // Optionnel : journaliser ou gérer les statuts inattendus
        }

        return incidentRepository.save(incident); // Sauvegarde de l'incident mis à jour
    }

    // Récupérer un incident par ID
    public Incident getIncidentById(Long incidentId) {
        return incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident non trouvé")); // Recherche de l'incident par ID
    }

    public long getOngoingIncidentsCount() {
        return incidentRepository.countByStatus("En Cours");
    }
}
