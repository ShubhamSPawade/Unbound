package com.unbound.backend.repository;

import com.unbound.backend.entity.Fest;
import com.unbound.backend.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FestRepository extends JpaRepository<Fest, Long> {
    List<Fest> findByCollege(College college);
} 