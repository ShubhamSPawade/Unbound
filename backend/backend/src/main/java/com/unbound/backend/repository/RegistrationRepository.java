package com.unbound.backend.repository;

import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Registration;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByUserAndEvent(User user, Event event);
    int countByEvent(Event event);
    
    // Optimized queries with JOIN FETCH to avoid N+1 problem
    @Query("SELECT r FROM Registration r " +
           "LEFT JOIN FETCH r.event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE r.event = :event")
    List<Registration> findAllByEventWithRelations(@Param("event") Event event);

    @Query("SELECT r FROM Registration r " +
           "LEFT JOIN FETCH r.event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE r.user = :user " +
           "ORDER BY r.registrationDate DESC")
    List<Registration> findAllByUserWithRelations(@Param("user") User user);

    @Query("SELECT r FROM Registration r " +
           "LEFT JOIN FETCH r.event e " +
           "LEFT JOIN FETCH r.user u " +
           "WHERE r.user = :user AND r.event = :event")
    Optional<Registration> findByUserAndEventWithRelations(@Param("user") User user, @Param("event") Event event);

    // Original methods for backward compatibility
    List<Registration> findAllByEvent(Event event);
    List<Registration> findAllByUser(User user);
    Optional<Registration> findByUserAndEvent(User user, Event event);

    // Count only confirmed registrations for accurate capacity tracking
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event = :event AND r.status = :status")
    int countByEventAndStatus(@Param("event") Event event, @Param("status") RegistrationStatus status);

    // Batch operations
    @Query("SELECT r FROM Registration r " +
           "LEFT JOIN FETCH r.event e " +
           "LEFT JOIN FETCH r.user u " +
           "WHERE r.event.id IN :eventIds")
    List<Registration> findAllByEventIdInWithRelations(@Param("eventIds") List<Long> eventIds);
}
