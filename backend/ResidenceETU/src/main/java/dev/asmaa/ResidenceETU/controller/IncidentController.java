package dev.asmaa.ResidenceETU.controller;

import dev.asmaa.ResidenceETU.model.Incident;
import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.service.IncidentService;
import dev.asmaa.ResidenceETU.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @Autowired
    private RoomService roomService;

    // Report an incident
    @PostMapping("/create")
    public ResponseEntity<Incident> createIncident(
            @RequestParam Long roomId,
            @RequestParam Long residentId,
            @RequestParam String description
    ) {
        Incident incident = incidentService.createIncident(roomId, residentId, description);
        return ResponseEntity.ok(incident);
    }

    @PutMapping("/update/{incidentId}")
    public ResponseEntity<Incident> updateIncidentStatus(
            @PathVariable Long incidentId,
            @RequestParam String status
    ) {
        try {
            Incident updatedIncident = incidentService.updateIncidentStatus(incidentId, status);
            return ResponseEntity.ok(updatedIncident);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/assign/{incidentId}")
    public ResponseEntity<Incident> assignIncidentToTechnician(
            @PathVariable Long incidentId,
            @RequestParam String technicianName
    ) {
        Incident incident = incidentService.assignIncidentToTechnician(incidentId, technicianName);
        return ResponseEntity.ok(incident);
    }

    @PutMapping("/unassign/{incidentId}")
    public ResponseEntity<Incident> unassignIncidentFromTechnician(@PathVariable Long incidentId) {
        Incident incident = incidentService.unassignIncidentFromTechnician(incidentId);
        return ResponseEntity.ok(incident);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Incident>> listRooms() {
        List<Incident> incidents = incidentService.getAllIncident();
        return ResponseEntity.ok(incidents);
    }
    @GetMapping("/{incidentId}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long incidentId) {
        Incident incident = incidentService.getIncidentById(incidentId);
        return ResponseEntity.ok(incident);
    }

}
