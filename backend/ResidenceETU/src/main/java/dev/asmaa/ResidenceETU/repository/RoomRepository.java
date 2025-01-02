package dev.asmaa.ResidenceETU.repository;

import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.model.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);  // Find a room by its number

    List<Room> findByStatus(RoomStatus status);  // Find all rooms by status (available, occupied, etc.)

    List<Room> findByResidentIsNull();  // Find all rooms that are not yet assigned to any resident

    Optional<Room> findByResident_Id(Long residentId);

    // Compter les chambres disponibles
    long countByStatus(RoomStatus status);

}
