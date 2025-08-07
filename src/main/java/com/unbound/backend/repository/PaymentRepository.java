package com.unbound.backend.repository;

import com.unbound.backend.entity.Payment;
import com.unbound.backend.entity.EventRegistration;
import com.unbound.backend.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByEventRegistration(EventRegistration eventRegistration);
    
    List<Payment> findByCollege(College college);
    
    List<Payment> findByStatus(String status);
    
    List<Payment> findByCollegeAndStatus(College college, String status);
    
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    
    Optional<Payment> findByPaymentId(String paymentId);
    
    @Query("SELECT p FROM Payment p WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.college = :college AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Payment> findByCollegeAndCreatedAtBetween(@Param("college") College college, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.college = :college AND p.status = 'paid'")
    Long countPaidPaymentsByCollege(@Param("college") College college);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.college = :college AND p.status = 'paid'")
    Integer sumPaidAmountByCollege(@Param("college") College college);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.eventRegistration = :registration AND p.status = 'paid'")
    Long countPaidPaymentsByRegistration(@Param("registration") EventRegistration registration);
} 