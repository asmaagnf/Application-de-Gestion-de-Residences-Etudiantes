package dev.asmaa.ResidenceETU.controller;

import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.model.RoomStatus;
import dev.asmaa.ResidenceETU.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // Create a new room
    @PostMapping(value = "/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Room> createRoom(@RequestBody Room roomRequest) {
        Room room = roomService.createRoom(
                roomRequest.getRoomNumber(),
                roomRequest.getSize(),
                roomRequest.getEquipment(),
                roomRequest.getPrice()
        );
        return ResponseEntity.ok(room);
    }

    // Method to update room details
    @PutMapping(value = "/update/{roomId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long roomId,
            @RequestBody Room roomRequest
    ) {
        Room updatedRoom = roomService.updateRoom(
                roomId,
                roomRequest.getRoomNumber(),
                roomRequest.getSize(),
                roomRequest.getEquipment(),
                roomRequest.getStatus(),
                roomRequest.getPrice()
        );
        return ResponseEntity.ok(updatedRoom);
    }

    // Method to delete a room by ID
    @DeleteMapping("/delete/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoomById(roomId);
        return ResponseEntity.noContent().build();
    }

    // Method to list all rooms
    @GetMapping("/list")
    public ResponseEntity<List<Room>> listRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }

    // Get all rooms by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Room>> getRoomsByStatus(@PathVariable RoomStatus status) {
        List<Room> rooms = roomService.getRoomsByStatus(status);
        return ResponseEntity.ok(rooms);
    }

    // Get all available rooms
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        List<Room> rooms = roomService.getAvailableRooms();
        return ResponseEntity.ok(rooms);
    }

    // Assign a resident to a room
    @PostMapping(value = "/assign/{roomId}")
    public ResponseEntity<Room> assignResident(@PathVariable Long roomId, @RequestParam Long residentId) {
        Room room = roomService.assignResident(roomId, residentId);
        return ResponseEntity.ok(room);
    }

    @PutMapping("/unassign/{roomId}")
    public ResponseEntity<Room> unassignResident(@PathVariable Long roomId) {
        Room room = roomService.unassignResident(roomId);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/capacity")
    public ResponseEntity<Long> getTotalCapacity() {
        long capacity = roomService.getTotalCapacity();
        return ResponseEntity.ok(capacity);
    }

    // Nombre de chambres disponibles
    @GetMapping("/available/count")
    public ResponseEntity<Long> getAvailableRoomsCount() {
        long availableRooms = roomService.getAvailableRoomsCount();
        return ResponseEntity.ok(availableRooms);
    }

}
