package dev.asmaa.ResidenceETU.controller;

import dev.asmaa.ResidenceETU.model.Payment;
import dev.asmaa.ResidenceETU.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Add a payment for a resident's room.
     * Updates the resident's total due and balance.
     */
    @PostMapping
    public ResponseEntity<?> addPayment(
            @RequestParam Long roomId,
            @RequestParam Long residentId,
            @RequestParam double amountPaid) {
        try {
            Payment payment = paymentService.addPayment(roomId, residentId, amountPaid);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Retrieve all payments for a specific resident.
     */
    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<Payment>> getPaymentsByResident(@PathVariable Long residentId) {
        List<Payment> payments = paymentService.getPaymentsByResident(residentId);
        return ResponseEntity.ok(payments);
    }

    /**
     * Retrieve all payments for a specific room.
     */
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Payment>> getPaymentsByRoom(@PathVariable Long roomId) {
        List<Payment> payments = paymentService.getPaymentsByRoom(roomId);
        return ResponseEntity.ok(payments);
    }

    /**
     * Endpoint to force update total due for all residents (optional).
     * Useful for testing scheduled tasks manually.
     */
    @PostMapping("/update-total-due")
    public ResponseEntity<?> updateTotalDue() {
        try {
            paymentService.updateTotalDueForAllResidents();
            return ResponseEntity.ok("Total due updated for all residents.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
