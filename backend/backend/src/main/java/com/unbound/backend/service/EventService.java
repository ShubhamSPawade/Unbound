package com.unbound.backend.service;

import com.unbound.backend.dto.request.EventRequest;
import com.unbound.backend.dto.response.EventResponse;
import com.unbound.backend.entity.Club;
import com.unbound.backend.entity.Event;
import com.unbound.backend.entity.Fest;
import com.unbound.backend.enums.EventCategory;
import com.unbound.backend.enums.EventStatus;
import com.unbound.backend.exception.BadRequestException;
import com.unbound.backend.exception.ResourceNotFoundException;
import com.unbound.backend.repository.ClubRepository;
import com.unbound.backend.repository.EventRepository;
import com.unbound.backend.repository.FestRepository;
import com.unbound.backend.repository.RegistrationRepository;
import com.unbound.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final FestRepository festRepository;
    private final ClubRepository clubRepository;
    private final RegistrationRepository registrationRepository;
    private final EmailService emailService;

    public EventResponse toResponse(Event event) {
        int currentRegistrations = registrationRepository.countByEvent(event);
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .bannerUrl(event.getBannerUrl())
                .venue(event.getVenue())
                .eventDate(event.getEventDate())
                .maxParticipants(event.getMaxParticipants())
                .currentRegistrations(currentRegistrations)
                .feeAmount(event.getFeeAmount())
                .isPaid(event.getFeeAmount() != null && event.getFeeAmount() > 0)
                .category(event.getCategory())
                .status(event.getStatus())
                .festId(event.getFest() != null ? event.getFest().getId() : null)
                .festName(event.getFest() != null ? event.getFest().getName() : null)
                .clubId(event.getClub().getId())
                .clubName(event.getClub().getName())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

    private Fest getFest(Long festId) {
        return festRepository.findById(festId)
                .orElseThrow(() -> new ResourceNotFoundException("Fest not found with id: " + festId));
    }

    private Club getClub(Long clubId) {
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id: " + clubId));
    }

    // POST /api/events
    public EventResponse createEvent(EventRequest request) {
        Fest fest = request.getFestId() != null ? getFest(request.getFestId()) : null;
        Club club = getClub(request.getClubId());

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .bannerUrl(request.getBannerUrl())
                .venue(request.getVenue())
                .eventDate(request.getEventDate())
                .maxParticipants(request.getMaxParticipants())
                .category(request.getCategory())
                .feeAmount(request.getFeeAmount())
                .status(EventStatus.DRAFT)
                .fest(fest)
                .club(club)
                .build();

        return toResponse(eventRepository.save(event));
    }

    // GET /api/events with optional filters
    public List<EventResponse> getAllPublishedEvents(EventCategory category, Long clubId, Long festId,
            LocalDateTime from, LocalDateTime to) {
        return eventRepository.filterPublishedEvents(category, clubId, festId, from, to)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/events/admin/all
    public List<EventResponse> getAllEventsForAdmin() {
        return eventRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/events/{id}
    public EventResponse getEventById(Long id) {
        return toResponse(eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id)));
    }

    // GET /api/events/fest/{festId}
    public List<EventResponse> getEventsByFest(Long festId) {
        Fest fest = getFest(festId);
        return eventRepository.findAllByFestAndStatus(fest, EventStatus.PUBLISHED)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // GET /api/events/club/{clubId}
    public List<EventResponse> getEventsByClub(Long clubId) {
        Club club = getClub(clubId);
        return eventRepository.findAllByClub(club)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // PUT /api/events/{id}
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setBannerUrl(request.getBannerUrl());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setCategory(request.getCategory());
        event.setFeeAmount(request.getFeeAmount());
        event.setFest(request.getFestId() != null ? getFest(request.getFestId()) : null);
        event.setClub(getClub(request.getClubId()));

        return toResponse(eventRepository.save(event));
    }

    // PATCH /api/events/{id}/publish
    public EventResponse publishEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        if (event.getStatus() == EventStatus.PUBLISHED) {
            throw new BadRequestException("Event is already published");
        }
        event.setStatus(EventStatus.PUBLISHED);
        Event updatedEvent = eventRepository.save(event);
        try {
            emailService.sendEventPublishedNotification(
                    updatedEvent.getClub().getCreatedBy().getEmail(),
                    updatedEvent.getClub().getCreatedBy().getName(),
                    updatedEvent.getTitle(),
                    updatedEvent.getEventDate());
        } catch (Exception ex) {
            log.warn("Event published email failed for event {}", updatedEvent.getId(), ex);
        }
        return toResponse(updatedEvent);
    }

    // PATCH /api/events/{id}/cancel
    public EventResponse cancelEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Event is already cancelled");
        }
        event.setStatus(EventStatus.CANCELLED);
        Event updatedEvent = eventRepository.save(event);
        try {
            emailService.sendEventCancelledNotification(
                    updatedEvent.getClub().getCreatedBy().getEmail(),
                    updatedEvent.getClub().getCreatedBy().getName(),
                    updatedEvent.getTitle(),
                    updatedEvent.getEventDate(),
                    updatedEvent.getVenue());
        } catch (Exception ex) {
            log.warn("Event cancelled email failed for event {}", updatedEvent.getId(), ex);
        }
        return toResponse(updatedEvent);
    }

    // DELETE /api/events/{id}
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        eventRepository.delete(event);
    }
}
