package com.unbound.backend.repository;

import com.unbound.backend.entity.College;
import com.unbound.backend.entity.Fest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FestRepository extends JpaRepository<Fest, Long> {
    List<Fest> findAllByCollege(College college);
    boolean existsByNameAndCollege(String name, College college);
}
