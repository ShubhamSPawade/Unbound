package com.unbound.backend.repository;

import com.unbound.backend.entity.Club;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Fest;
import com.unbound.backend.enums.EventCategory;
import com.unbound.backend.enums.EventStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Optimized queries with JOIN FETCH to avoid N+1 problem
    @Query("SELECT e FROM Event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE e.fest = :fest")
    List<Event> findAllByFestWithClubAndFest(@Param("fest") Fest fest);

    @Query("SELECT e FROM Event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE e.club = :club")
    List<Event> findAllByClubWithFestAndClub(@Param("club") Club club);

    @Query("SELECT e FROM Event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE e.status = :status")
    List<Event> findAllByStatusWithRelations(@Param("status") EventStatus status);

    @Query("SELECT e FROM Event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE e.fest = :fest AND e.status = :status")
    List<Event> findAllByFestAndStatusWithRelations(@Param("fest") Fest fest, @Param("status") EventStatus status);

    // Original methods for backward compatibility
    List<Event> findAllByFest(Fest fest);
    List<Event> findAllByClub(Club club);
    List<Event> findAllByStatus(EventStatus status);
    List<Event> findAllByFestAndStatus(Fest fest, EventStatus status);
    int countByFest(Fest fest);

    // Optimized filter query with JOIN FETCH
    @Query("SELECT DISTINCT e FROM Event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH c.college " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE e.status = 'PUBLISHED'" +
           " AND (:category IS NULL OR e.category = :category)" +
           " AND (:clubId IS NULL OR e.club.id = :clubId)" +
           " AND (:festId IS NULL OR e.fest.id = :festId)" +
           " AND (:from IS NULL OR e.eventDate >= :from)" +
           " AND (:to IS NULL OR e.eventDate <= :to)")
    List<Event> filterPublishedEventsOptimized(
            @Param("category") EventCategory category,
            @Param("clubId") Long clubId,
            @Param("festId") Long festId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    // Original filter for backward compatibility
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED'" +
           " AND (:category IS NULL OR e.category = :category)" +
           " AND (:clubId IS NULL OR e.club.id = :clubId)" +
           " AND (:festId IS NULL OR e.fest.id = :festId)" +
           " AND (:from IS NULL OR e.eventDate >= :from)" +
           " AND (:to IS NULL OR e.eventDate <= :to)")
    List<Event> filterPublishedEvents(
            @Param("category") EventCategory category,
            @Param("clubId") Long clubId,
            @Param("festId") Long festId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    // Optimized findById with relations
    @Query("SELECT e FROM Event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH c.college " +
           "LEFT JOIN FETCH c.createdBy " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE e.id = :eventId")
    Optional<Event> findByIdWithRelations(@Param("eventId") Long eventId);

    // Pessimistic write lock for capacity checking during registration
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :eventId")
    Optional<Event> findByIdWithLock(@Param("eventId") Long eventId);

    // Batch fetch events by IDs
    @Query("SELECT DISTINCT e FROM Event e " +
           "LEFT JOIN FETCH e.club c " +
           "LEFT JOIN FETCH e.fest f " +
           "WHERE e.id IN :eventIds")
    List<Event> findAllByIdInWithRelations(@Param("eventIds") List<Long> eventIds);
}
