package dev.asmaa.ResidenceETU.service;

import dev.asmaa.ResidenceETU.model.Payment;
import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.model.RoomStatus;
import dev.asmaa.ResidenceETU.model.User;
import dev.asmaa.ResidenceETU.repository.RoomRepository;
import dev.asmaa.ResidenceETU.repository.UserRepository;
import dev.asmaa.ResidenceETU.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository; // Injection du dépôt pour les chambres
    @Autowired
    private UserRepository userRepository; // Injection du dépôt pour les utilisateurs
    @Autowired
    private PaymentRepository paymentRepository; // Injection du dépôt pour les paiements

    // Créer une nouvelle chambre
    public Room createRoom(String roomNumber, double size, String equipment, double price) {
        Room room = new Room(roomNumber, size, equipment, RoomStatus.DISPONIBLE, price); // Création d'une nouvelle chambre
        return roomRepository.save(room); // Sauvegarde de la chambre dans le dépôt
    }

    // Méthode pour mettre à jour les détails d'une chambre (existe)
    public Room updateRoom(Long roomId, String roomNumber, double size, String equipment, RoomStatus status, double price) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Chambre non trouvée")); // Recherche de la chambre
        room.setRoomNumber(roomNumber); // Mise à jour du numéro de la chambre
        room.setSize(size); // Mise à jour de la taille de la chambre
        room.setEquipment(equipment); // Mise à jour de l'équipement
        room.setStatus(status); // Mise à jour du statut
        room.setPrice(price); // Mise à jour du prix
        room.setUpdatedAt(new Date()); // Mise à jour de la date de modification
        return roomRepository.save(room); // Sauvegarde des modifications
    }

    // Méthode pour supprimer une chambre par ID
    public void deleteRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée avec l'ID : " + roomId)); // Recherche de la chambre
        roomRepository.delete(room); // Suppression de la chambre
    }

    // Méthode pour récupérer toutes les chambres
    public List<Room> getAllRooms() {
        return roomRepository.findAll(); // Récupération de toutes les chambres
    }

    // Récupérer une chambre par son numéro
    public Optional<Room> getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber); // Recherche d'une chambre par son numéro
    }

    // Récupérer toutes les chambres par statut
    public List<Room> getRoomsByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status); // Recherche des chambres par statut
    }

    // Récupérer toutes les chambres disponibles
    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(RoomStatus.DISPONIBLE); // Recherche des chambres disponibles
    }

    // Récupérer la chambre assignée à un résident
    public Room getAssignedRoom(Long residentId) {
        return roomRepository.findByResident_Id(residentId)
                .orElse(null); // Retourne null si aucune chambre n'est assignée
    }

    @Transactional
    public Room assignResident(Long roomId, Long residentId) {
        // Récupérer la chambre et le résident par leurs ID
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée")); // Recherche de la chambre

        User resident = userRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Résident non trouvé")); // Recherche du résident

        // Assigner le résident à la chambre
        room.setResident(resident); // Assignation du résident
        room.setStatus(RoomStatus.OCCUPEE); // Changement du statut de la chambre à OCCUPÉE

        // Sauvegarder la chambre d'abord
        Room updatedRoom = roomRepository.save(room); // Sauvegarde de la chambre mise à jour

        return updatedRoom; // Retourne la chambre mise à jour
    }

    // Désassigner un résident d'une chambre
    public Room unassignResident(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Chambre non trouvée")); // Recherche de la chambre

        room.setResident(null); // Désassignation du résident
        room.setStatus(RoomStatus.DISPONIBLE); // Changement du statut de la chambre à DISPONIBLE
        return roomRepository.save(room); // Sauvegarde de la chambre mise à jour
    }

    // Obtenir la capacité totale
    public long getTotalCapacity() {
        return roomRepository.count(); // Nombre total de chambres
    }

    // Nombre de chambres disponibles
    public long getAvailableRoomsCount() {
        return roomRepository.countByStatus(RoomStatus.DISPONIBLE); // Compte des chambres disponibles
    }

    // Récupérer toutes les chambres non assignées
    public List<Room> getUnassignedRooms() {
        return roomRepository.findByResidentIsNull(); // Recherche des chambres non assignées
    }

    public double getOccupancyRate() {
        long totalRooms = roomRepository.count();
        long occupiedRooms = roomRepository.countByStatus(RoomStatus.OCCUPEE);
        return (totalRooms == 0) ? 0 : (double) occupiedRooms / totalRooms * 100;
    }
    public long getTotalOccupancy() {return roomRepository.countByStatus(RoomStatus.OCCUPEE);}
}
