package com.unbound.backend.repository;

import com.unbound.backend.entity.Club;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Fest;
import com.unbound.backend.enums.EventCategory;
import com.unbound.backend.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByFest(Fest fest);
    List<Event> findAllByClub(Club club);
    List<Event> findAllByStatus(EventStatus status);
    List<Event> findAllByFestAndStatus(Fest fest, EventStatus status);
    int countByFest(Fest fest);

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
}
