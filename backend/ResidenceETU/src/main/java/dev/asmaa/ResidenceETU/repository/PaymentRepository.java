package dev.asmaa.ResidenceETU.repository;

import dev.asmaa.ResidenceETU.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findAllByDueDateBeforeAndBalanceGreaterThan(Date dueDate, double balance);

    List<Payment> findAllByResidentId(Long residentId);

    List<Payment> findAllByRoomId(Long roomId);
}
