package com.unbound.backend.repository;

import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.College;
import com.unbound.backend.entity.Fest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCollege(College college);
    List<Event> findByFest(Fest fest);
    List<Event> findByCollegeAndFestIsNull(College college);
} 