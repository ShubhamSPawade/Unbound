package com.unbound.backend.service;

import com.unbound.backend.dto.response.RegistrationResponse;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Registration;
import com.unbound.backend.entity.User;
import com.unbound.backend.enums.EventStatus;
import com.unbound.backend.enums.RegistrationStatus;
import com.unbound.backend.exception.BadRequestException;
import com.unbound.backend.exception.ResourceNotFoundException;
import com.unbound.backend.repository.EventRepository;
import com.unbound.backend.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserService userService;

    private RegistrationResponse toResponse(Registration reg) {
        return RegistrationResponse.builder()
                .id(reg.getId())
                .eventId(reg.getEvent().getId())
                .eventTitle(reg.getEvent().getTitle())
                .eventVenue(reg.getEvent().getVenue())
                .eventDate(reg.getEvent().getEventDate())
                .userId(reg.getUser().getId())
                .userName(reg.getUser().getName())
                .userEmail(reg.getUser().getEmail())
                .status(reg.getStatus())
                .registrationDate(reg.getRegistrationDate())
                .build();
    }

    // POST /api/registrations/{eventId} — student registers for event
    public RegistrationResponse registerForEvent(Long eventId) {
        User currentUser = userService.getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        // Only published events can be registered for
        if (event.getStatus() != EventStatus.PUBLISHED) {
            throw new BadRequestException("Event is not open for registration");
        }

        // Check duplicate registration
        if (registrationRepository.existsByUserAndEvent(currentUser, event)) {
            throw new BadRequestException("You are already registered for this event");
        }

        // Capacity validation (#20)
        int currentCount = registrationRepository.countByEvent(event);
        if (currentCount >= event.getMaxParticipants()) {
            throw new BadRequestException("Event is full. No more registrations allowed.");
        }

        Registration registration = Registration.builder()
                .user(currentUser)
                .event(event)
                .status(RegistrationStatus.CONFIRMED)
                .build();

        return toResponse(registrationRepository.save(registration));
    }

    // DELETE /api/registrations/{eventId} — student cancels registration
    public void cancelRegistration(Long eventId) {
        User currentUser = userService.getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        Registration registration = registrationRepository.findByUserAndEvent(currentUser, event)
                .orElseThrow(() -> new BadRequestException("You are not registered for this event"));

        registrationRepository.delete(registration);
    }

    // GET /api/registrations/my — student's own registrations
    public List<RegistrationResponse> getMyRegistrations() {
        User currentUser = userService.getCurrentUser();
        return registrationRepository.findAllByUser(currentUser)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/registrations/event/{eventId} — admin views all registrations for an event
    public List<RegistrationResponse> getRegistrationsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return registrationRepository.findAllByEvent(event)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/registrations/event/{eventId}/count
    public int getRegistrationCount(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return registrationRepository.countByEvent(event);
    }
}
