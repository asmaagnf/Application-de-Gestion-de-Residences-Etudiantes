package dev.asmaa.ResidenceETU.controller;
import dev.asmaa.ResidenceETU.service.IncidentService;
import dev.asmaa.ResidenceETU.service.PaymentService;
import dev.asmaa.ResidenceETU.service.RoomService;
import dev.asmaa.ResidenceETU.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private IncidentService incidentService;

    @Autowired
    private UserService userService;

    @GetMapping("/occupancy-rate")
    public double getOccupancyRate() {
        return roomService.getOccupancyRate();
    }

    @GetMapping("/overdue-payments")
    public long getOverduePaymentsCount() {
        return paymentService.getOverduePaymentsCount();
    }

    @GetMapping("/ongoing-incidents")
    public long getOngoingIncidentsCount() {
        return incidentService.getOngoingIncidentsCount();
    }
    @GetMapping("/total-occupancy")
    public long getTotalOccupancy() {
        return roomService.getTotalOccupancy();
    }
    @GetMapping("/total-residents")
    public long getTotalResidents() {
        long totalResidents = userService.getTotalResidents();
        System.out.println("Total Residents: " + totalResidents);
        return totalResidents;
    }
}
