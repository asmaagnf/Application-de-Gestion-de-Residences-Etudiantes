package dev.asmaa.ResidenceETU.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomNumber;  // Unique room identifier

    private double size;  // Size of the room in square meters

    private String equipment;  // List or description of the equipment in the room (e.g., bed, desk)

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id")
    @JsonIgnore
    private User resident;  // Resident assigned to the room

    private double price;  // Room price per month

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;  // Room creation date

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;  // Last updated date

    // Constructors
    public Room() {}

    public Room(String roomNumber, double size, String equipment, RoomStatus status, double price) {
        this.roomNumber = roomNumber;
        this.size = size;
        this.equipment = equipment;
        this.status = status;
        this.price = price;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public double getSize() {
        return size;
    }

    public void setSize(double size) {
        this.size = size;
    }

    public String getEquipment() {
        return equipment;
    }

    public void setEquipment(String equipment) {
        this.equipment = equipment;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public User getResident() {
        return resident;
    }

    public void setResident(User resident) {
        this.resident = resident;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getResidentId() {
        return resident != null ? resident.getId() : null;
    }
}



