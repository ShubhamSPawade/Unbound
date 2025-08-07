package com.unbound.backend;

import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.College;
import com.unbound.backend.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TeamSizeFunctionalityTest {

    @Test
    void testEventWithTeamSizeConstraints() {
        // Test that Event entity can be created with team size constraints
        Event event = Event.builder()
                .ename("Test Event")
                .edescription("Test Description")
                .eventDate("2024-12-31")
                .fees(100)
                .location("Test Location")
                .capacity(50)
                .teamIsAllowed(true)
                .minTeamSize(2)
                .maxTeamSize(5)
                .category("Technical")
                .mode("Online")
                .approved(true)
                .active(true)
                .registrationDeadline("2024-12-30")
                .registrationOpen(true)
                .build();

        // Verify team size constraints are set correctly
        assertTrue(event.getTeamIsAllowed());
        assertEquals(2, event.getMinTeamSize());
        assertEquals(5, event.getMaxTeamSize());
        
        // Test that max team size is greater than or equal to min team size
        assertTrue(event.getMaxTeamSize() >= event.getMinTeamSize());
    }

    @Test
    void testEventWithoutTeamRegistration() {
        // Test that Event entity can be created without team registration
        Event event = Event.builder()
                .ename("Solo Event")
                .edescription("Solo Event Description")
                .eventDate("2024-12-31")
                .fees(50)
                .location("Test Location")
                .capacity(100)
                .teamIsAllowed(false)
                .minTeamSize(1) // Default value
                .maxTeamSize(1) // Default value
                .category("Cultural")
                .mode("Offline")
                .approved(true)
                .active(true)
                .registrationDeadline("2024-12-30")
                .registrationOpen(true)
                .build();

        // Verify team registration is disabled
        assertFalse(event.getTeamIsAllowed());
        assertEquals(1, event.getMinTeamSize());
        assertEquals(1, event.getMaxTeamSize());
    }

    @Test
    void testTeamSizeValidation() {
        // Test that team size constraints are valid
        Event event = Event.builder()
                .ename("Team Event")
                .edescription("Team Event Description")
                .eventDate("2024-12-31")
                .fees(200)
                .location("Test Location")
                .capacity(20)
                .teamIsAllowed(true)
                .minTeamSize(3)
                .maxTeamSize(6)
                .category("Sports")
                .mode("Offline")
                .approved(true)
                .active(true)
                .registrationDeadline("2024-12-30")
                .registrationOpen(true)
                .build();

        // Verify team size constraints are reasonable
        assertTrue(event.getMinTeamSize() >= 1);
        assertTrue(event.getMaxTeamSize() <= event.getCapacity());
        assertTrue(event.getMaxTeamSize() >= event.getMinTeamSize());
    }
} 