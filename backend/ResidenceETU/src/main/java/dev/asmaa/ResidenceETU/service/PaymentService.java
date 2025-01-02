package dev.asmaa.ResidenceETU.service;

import dev.asmaa.ResidenceETU.model.Payment;
import dev.asmaa.ResidenceETU.model.Room;
import dev.asmaa.ResidenceETU.model.User;
import dev.asmaa.ResidenceETU.repository.PaymentRepository;
import dev.asmaa.ResidenceETU.repository.RoomRepository;
import dev.asmaa.ResidenceETU.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Adds a payment for a resident and updates the balance.
     */
    public Payment addPayment(Long roomId, Long residentId, double amountPaid) {
        Optional<Room> room = roomRepository.findById(roomId);
        Optional<User> resident = userRepository.findById(residentId);

        if (room.isPresent() && resident.isPresent()) {
            Room roomData = room.get();
            User residentData = resident.get();

            double roomPrice = roomData.getPrice();
            double totalDue = calculateTotalDue(roomId);

            double newBalance = Math.max(0, totalDue - amountPaid);

            Payment payment = new Payment(
                    roomData,
                    residentData,
                    amountPaid,
                    newBalance,
                    totalDue,
                    new Date(),
                    new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000) // Due next month
            );

            return paymentRepository.save(payment);
        } else {
            throw new IllegalArgumentException("Room or Resident not found.");
        }
    }

    /**
     * Calculates the total due for a resident's room.
     */
    public double calculateTotalDue(Long roomId) {
        List<Payment> payments = paymentRepository.findAllByRoomId(roomId);
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        double totalPayments = payments.stream().mapToDouble(Payment::getAmountPaid).sum();
        double totalRoomCost = payments.size() * room.getPrice();

        return totalRoomCost - totalPayments;
    }

    /**
     * Scheduled task to update total due every month.
     */
    @Scheduled(cron = "0 0 0 1 * ?") // Runs on the first day of every month
    public void updateTotalDueForAllResidents() {
        List<Room> rooms = roomRepository.findAll();

        for (Room room : rooms) {
            if (room.getResident() != null) {
                // Get the most recent payment
                Payment lastPayment = paymentRepository.findAllByRoomId(room.getId())
                        .stream()
                        .max((p1, p2) -> p1.getPaymentDate().compareTo(p2.getPaymentDate()))
                        .orElse(null);

                // Calculate new total due
                double previousBalance = lastPayment != null ? lastPayment.getBalance() : 0;
                double newTotalDue = previousBalance + room.getPrice();

                // Add a new payment record for this month's dues
                Payment monthlyPayment = new Payment(
                        room,
                        room.getResident(),
                        0.0, // No payment made yet
                        newTotalDue, // Updated total balance
                        newTotalDue, // Total due including this month's room price
                        new Date(), // Current date
                        new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000) // Next due date
                );

                paymentRepository.save(monthlyPayment);
            }
        }
    }

    public List<Payment> getPaymentsByResident(Long residentId) {
        return paymentRepository.findAllByResidentId(residentId);
    }

    public List<Payment> getPaymentsByRoom(Long roomId) {
        return paymentRepository.findAllByRoomId(roomId);
    }




}
