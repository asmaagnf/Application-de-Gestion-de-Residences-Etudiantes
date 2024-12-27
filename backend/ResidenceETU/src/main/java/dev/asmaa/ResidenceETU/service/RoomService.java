package dev.asmaa.ResidenceETU.service;

import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.model.RoomStatus;
import dev.asmaa.ResidenceETU.model.User;
import dev.asmaa.ResidenceETU.repository.RoomRepository;
import dev.asmaa.ResidenceETU.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepository userRepository;

    // Create a new room
    public Room createRoom(String roomNumber, double size, String equipment, double price) {
        Room room = new Room(roomNumber, size, equipment, RoomStatus.DISPONIBLE, price);
        return roomRepository.save(room);
    }

    // Method to update room details (exists)
    public Room updateRoom(Long roomId, String roomNumber, double size, String equipment, RoomStatus status, double price) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        room.setRoomNumber(roomNumber);
        room.setSize(size);
        room.setEquipment(equipment);
        room.setStatus(status);
        room.setPrice(price);
        room.setUpdatedAt(new Date());
        return roomRepository.save(room);
    }

    // Method to delete a room by ID
    public void deleteRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + roomId));
        roomRepository.delete(room);
    }

    // Method to fetch all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Get room by number
    public Optional<Room> getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    // Get all rooms by status
    public List<Room> getRoomsByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status);
    }

    // Get all available rooms
    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(RoomStatus.DISPONIBLE);
    }


    @Transactional
    // Assign a resident to a room
    public Room assignResident(Long roomId, Long residentId) {
        // Fetch room and resident by their IDs
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User resident = userRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        // Assign the resident to the room
        room.setResident(resident);
        room.setStatus(RoomStatus.OCCUPEE);  // Change room status to OCCUPIED

        // Save the updated room with the assigned resident
        return roomRepository.save(room);
    }

    public Room unassignResident(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setResident(null);
        room.setStatus(RoomStatus.DISPONIBLE);
        return roomRepository.save(room);
    }

    public long getTotalCapacity() {
        return roomRepository.count(); // Nombre total de chambres
    }

    // Nombre de chambres disponibles
    public long getAvailableRoomsCount() {
        return roomRepository.countByStatus(RoomStatus.DISPONIBLE);
    }


    // Get all unassigned rooms
    public List<Room> getUnassignedRooms() {
        return roomRepository.findByResidentIsNull();
    }
}
