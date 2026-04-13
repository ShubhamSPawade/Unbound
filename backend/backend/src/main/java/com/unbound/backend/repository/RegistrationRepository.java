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
    List<Registration> findAllByEvent(Event event);
    List<Registration> findAllByUser(User user);
    Optional<Registration> findByUserAndEvent(User user, Event event);

    // Count only confirmed registrations for accurate capacity tracking
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event = :event AND r.status = :status")
    int countByEventAndStatus(@Param("event") Event event, @Param("status") RegistrationStatus status);
}
