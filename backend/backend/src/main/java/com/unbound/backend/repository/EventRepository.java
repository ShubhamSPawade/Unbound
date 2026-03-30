package com.unbound.backend.repository;

import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Fest;
import com.unbound.backend.entity.Club;
import com.unbound.backend.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByFest(Fest fest);
    List<Event> findAllByClub(Club club);
    List<Event> findAllByStatus(EventStatus status);
    List<Event> findAllByFestAndStatus(Fest fest, EventStatus status);
    int countByFest(Fest fest);
}
