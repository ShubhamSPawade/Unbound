package com.unbound.backend.repository;

import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Payment;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    // Optimized queries with JOIN FETCH to avoid N+1 problem
    @Query("SELECT p FROM Payment p " +
           "LEFT JOIN FETCH p.user u " +
           "LEFT JOIN FETCH p.event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE p.user = :user " +
           "ORDER BY p.createdAt DESC")
    List<Payment> findAllByUserWithRelations(@Param("user") User user);

    @Query("SELECT p FROM Payment p " +
           "LEFT JOIN FETCH p.user u " +
           "LEFT JOIN FETCH p.event e " +
           "WHERE p.event = :event " +
           "ORDER BY p.createdAt DESC")
    List<Payment> findAllByEventWithRelations(@Param("event") Event event);

    @Query("SELECT p FROM Payment p " +
           "LEFT JOIN FETCH p.user u " +
           "LEFT JOIN FETCH p.event e " +
           "LEFT JOIN FETCH e.club c " +
           "WHERE p.user = :user AND p.status = :status " +
           "ORDER BY p.createdAt DESC")
    List<Payment> findAllByUserAndStatusWithRelations(@Param("user") User user, @Param("status") PaymentStatus status);

    // Original methods for backward compatibility
    List<Payment> findAllByUser(User user);
    List<Payment> findAllByEvent(Event event);

    // Enhanced queries for payment history
    List<Payment> findAllByUserOrderByCreatedAtDesc(User user);
    List<Payment> findAllByUserAndStatusOrderByCreatedAtDesc(User user, PaymentStatus status);
    List<Payment> findAllByEventOrderByCreatedAtDesc(Event event);
    List<Payment> findAllByStatusOrderByCreatedAtDesc(PaymentStatus status);

    // Date range filtering with JOIN FETCH
    @Query("SELECT p FROM Payment p " +
           "LEFT JOIN FETCH p.user u " +
           "LEFT JOIN FETCH p.event e " +
           "LEFT JOIN FETCH e.club c " +
           "WHERE p.user = :user " +
           "AND p.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY p.createdAt DESC")
    List<Payment> findByUserAndDateRangeWithRelations(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Original date range query
    @Query("SELECT p FROM Payment p WHERE p.user = :user " +
           "AND p.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY p.createdAt DESC")
    List<Payment> findByUserAndDateRange(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Statistics queries
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user = :user AND p.status = 'SUCCESS'")
    Double getTotalAmountByUser(@Param("user") User user);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.event = :event AND p.status = 'SUCCESS'")
    Double getTotalRevenueByEvent(@Param("event") Event event);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    int countByStatus(@Param("status") PaymentStatus status);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.event = :event AND p.status = :status")
    int countByEventAndStatus(@Param("event") Event event, @Param("status") PaymentStatus status);

    // Advanced filtering with JOIN FETCH
    @Query("SELECT DISTINCT p FROM Payment p " +
           "LEFT JOIN FETCH p.user u " +
           "LEFT JOIN FETCH p.event e " +
           "LEFT JOIN FETCH e.club c " +
           "WHERE (:userId IS NULL OR p.user.id = :userId) " +
           "AND (:eventId IS NULL OR p.event.id = :eventId) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:startDate IS NULL OR p.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR p.createdAt <= :endDate) " +
           "ORDER BY p.createdAt DESC")
    List<Payment> filterPaymentsOptimized(
            @Param("userId") Long userId,
            @Param("eventId") Long eventId,
            @Param("status") PaymentStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Original filter
    @Query("SELECT p FROM Payment p WHERE " +
           "(:userId IS NULL OR p.user.id = :userId) " +
           "AND (:eventId IS NULL OR p.event.id = :eventId) " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:startDate IS NULL OR p.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR p.createdAt <= :endDate) " +
           "ORDER BY p.createdAt DESC")
    List<Payment> filterPayments(
            @Param("userId") Long userId,
            @Param("eventId") Long eventId,
            @Param("status") PaymentStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
