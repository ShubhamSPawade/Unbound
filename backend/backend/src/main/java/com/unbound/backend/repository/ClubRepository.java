package com.unbound.backend.repository;

import com.unbound.backend.entity.Club;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.ClubStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    boolean existsByCreatedBy(User createdBy);
    Optional<Club> findByCreatedBy(User createdBy);
    List<Club> findAllByStatusAndIsActiveTrue(ClubStatus status);
    List<Club> findAllByIsActiveTrue();
    boolean existsByName(String name);
    boolean existsByContactEmail(String contactEmail);
}
