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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

        private final RegistrationRepository registrationRepository;
        private final EventRepository eventRepository;
        private final UserService userService;
        private final EmailService emailService;

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
        @Transactional
        public RegistrationResponse registerForEvent(Long eventId) {
                User currentUser = userService.getCurrentUser();

                // Acquire pessimistic write lock on event to prevent race conditions
                Event event = eventRepository.findByIdWithLock(eventId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Event not found with id: " + eventId));

                log.info("User {} attempting to register for event {}", currentUser.getId(), eventId);

                // Only published events can be registered for
                if (event.getStatus() != EventStatus.PUBLISHED) {
                        log.warn("Registration attempt for non-published event {}", eventId);
                        throw new BadRequestException("Event is not open for registration");
                }

                // Check duplicate registration
                if (registrationRepository.existsByUserAndEvent(currentUser, event)) {
                        log.warn("Duplicate registration attempt by user {} for event {}", 
                                currentUser.getId(), eventId);
                        throw new BadRequestException("You are already registered for this event");
                }

                // Capacity validation with confirmed registrations only
                int confirmedCount = registrationRepository.countByEventAndStatus(
                        event, RegistrationStatus.CONFIRMED);
                
                log.debug("Event {} capacity: {}/{}", eventId, confirmedCount, event.getMaxParticipants());

                if (confirmedCount >= event.getMaxParticipants()) {
                        log.warn("Event {} is full. Current: {}, Max: {}", 
                                eventId, confirmedCount, event.getMaxParticipants());
                        throw new BadRequestException("Event is full. No more registrations allowed.");
                }

                Registration registration = Registration.builder()
                                .user(currentUser)
                                .event(event)
                                .status(RegistrationStatus.CONFIRMED)
                                .build();

                Registration savedRegistration = registrationRepository.save(registration);
                
                log.info("User {} successfully registered for event {}. Registration ID: {}", 
                        currentUser.getId(), eventId, savedRegistration.getId());

                // Send confirmation email asynchronously
                try {
                        emailService.sendEventRegistrationConfirmation(
                                        currentUser.getEmail(),
                                        currentUser.getName(),
                                        event.getTitle(),
                                        event.getEventDate(),
                                        event.getVenue());
                } catch (Exception ex) {
                        log.error("Registration confirmation email failed for registration {}", 
                                savedRegistration.getId(), ex);
                }
                
                return toResponse(savedRegistration);
        }

        // DELETE /api/registrations/{eventId} — student cancels registration
        @Transactional
        public void cancelRegistration(Long eventId) {
                User currentUser = userService.getCurrentUser();

                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Event not found with id: " + eventId));

                Registration registration = registrationRepository.findByUserAndEvent(currentUser, event)
                                .orElseThrow(() -> new BadRequestException("You are not registered for this event"));

                log.info("User {} cancelling registration {} for event {}", 
                        currentUser.getId(), registration.getId(), eventId);

                registrationRepository.delete(registration);
                
                try {
                        emailService.sendEventRegistrationCancellation(
                                        currentUser.getEmail(),
                                        currentUser.getName(),
                                        event.getTitle(),
                                        event.getEventDate(),
                                        event.getVenue());
                } catch (Exception ex) {
                        log.error("Registration cancellation email failed for event {}", event.getId(), ex);
                }
        }

        // GET /api/registrations/my — student's own registrations
        @Transactional(readOnly = true)
        public List<RegistrationResponse> getMyRegistrations() {
                User currentUser = userService.getCurrentUser();
                return registrationRepository.findAllByUser(currentUser)
                                .stream().map(this::toResponse).collect(Collectors.toList());
        }

        // GET /api/registrations/event/{eventId} — admin views all registrations for an event
        @Transactional(readOnly = true)
        public List<RegistrationResponse> getRegistrationsByEvent(Long eventId) {
                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Event not found with id: " + eventId));
                return registrationRepository.findAllByEvent(event)
                                .stream().map(this::toResponse).collect(Collectors.toList());
        }

        // GET /api/registrations/event/{eventId}/count
        @Transactional(readOnly = true)
        public int getRegistrationCount(Long eventId) {
                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Event not found with id: " + eventId));
                return registrationRepository.countByEventAndStatus(event, RegistrationStatus.CONFIRMED);
        }
}
