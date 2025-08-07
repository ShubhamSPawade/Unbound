package com.unbound.backend.repository;

import com.unbound.backend.entity.College;
import com.unbound.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findByUserUid(Integer uid);
} 