package dev.asmaa.ResidenceETU.controller;

import dev.asmaa.ResidenceETU.model.Payment;
import dev.asmaa.ResidenceETU.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    @GetMapping("/resident/history/{residentId}")
    public List<Payment> getPaymentsByResident(@PathVariable Long residentId) {
        return paymentService.getResidentPayments(residentId);
    }

    @PostMapping("/{paymentId}/pay")
    public ResponseEntity<?> processPayment(@PathVariable Long paymentId, @RequestParam double amountPaid) {
        paymentService.processPayment(paymentId, amountPaid);
        return ResponseEntity.ok("Payment processed successfully");
    }

    @GetMapping("/overdue")
    public List<Payment> getOverduePayments() {
        return paymentService.getOverduePayments();
    }
    @GetMapping("/resident/{username}")
    public List<Payment> getPaymentsByUsername(@PathVariable String username) {
        return paymentService.getResidentPaymentsByUsername(username);
    }
    @GetMapping("/receipt/{paymentId}")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId); // Fetch the payment record by ID

        try {

            byte[] receipt = paymentService.generateReceipt(payment); // Generate PDF receipt
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=payment_receipt.pdf");

            // Return the receipt as a downloadable file
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(receipt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

