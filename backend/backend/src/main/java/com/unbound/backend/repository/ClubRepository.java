package com.unbound.backend.repository;

import com.unbound.backend.entity.Club;
import com.unbound.backend.entity.College;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.ClubStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Enhanced queries for approval system
    List<Club> findAllByStatusAndIsActiveTrueOrderByCreatedAtDesc(ClubStatus status);
    List<Club> findAllByCollegeAndStatusAndIsActiveTrue(College college, ClubStatus status);
    int countByStatus(ClubStatus status);
    int countByCollegeAndStatus(College college, ClubStatus status);

    @Query("SELECT c FROM Club c WHERE c.isActive = true " +
           "AND (:status IS NULL OR c.status = :status) " +
           "AND (:collegeId IS NULL OR c.college.id = :collegeId) " +
           "ORDER BY c.createdAt DESC")
    List<Club> filterClubs(@Param("status") ClubStatus status, @Param("collegeId") Long collegeId);
}
