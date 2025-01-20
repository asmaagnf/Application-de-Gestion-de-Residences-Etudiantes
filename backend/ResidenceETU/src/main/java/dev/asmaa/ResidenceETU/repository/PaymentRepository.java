package dev.asmaa.ResidenceETU.repository;

import dev.asmaa.ResidenceETU.model.Payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByResident_Id(Long residentId);
    List<Payment> findByDueDateBeforeAndIsPaidFalse(Date currentDate);

    long countByDueDateBeforeAndIsPaidFalse(Date currentDate);
}
