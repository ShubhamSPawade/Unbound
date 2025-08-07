package com.unbound.backend.controller;

import com.unbound.backend.dto.EventRequest;
import com.unbound.backend.dto.EventResponse;
import com.unbound.backend.dto.TeamResponse;
import com.unbound.backend.dto.TeamMemberInfo;
import com.unbound.backend.entity.*;
import com.unbound.backend.repository.*;
import com.unbound.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import com.unbound.backend.exception.CollegeNotFoundException;
import com.unbound.backend.exception.EventNotFoundException;
import com.unbound.backend.exception.EventNameExistsException;
import com.unbound.backend.exception.InvalidFestForCollegeException;
import com.unbound.backend.exception.EventDateOutOfRangeException;
import com.unbound.backend.exception.ForbiddenActionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Event Management APIs", description = "APIs for managing events (College access required)")
@SecurityRequirement(name = "bearerAuth")
public class EventController {
    private static final Logger logger = LoggerFactory.getLogger(EventController.class);
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private CollegeRepository collegeRepository;
    @Autowired
    private FestRepository festRepository;
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private TeamMembersRepository teamMembersRepository;
    @Autowired
    private UnregisteredTeamMemberRepository unregisteredTeamMemberRepository;

    private College getCollegeForUser(User user) {
        return collegeRepository.findAll().stream()
                .filter(c -> c.getUser().getUid().equals(user.getUid()))
                .findFirst().orElse(null);
    }

    @GetMapping
    @Operation(summary = "List events for a college")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved events"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "College not found")
    })
    public ResponseEntity<?> listEvents(@AuthenticationPrincipal User user) {
        logger.info("[GET] /api/events called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.warn("Unauthorized access attempt to /api/events by user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) {
            logger.error("College not found for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.notFound().build();
        }
        List<Event> events = eventRepository.findByCollege(college);
        logger.info("Successfully retrieved {} events for college: {}", events.size(), college.getCname());
        
        List<EventResponse> responses = events.stream().map(event -> {
            int registrationCount = eventRegistrationRepository.findByEvent(event).size();
            int daysLeft = (int) ChronoUnit.DAYS.between(LocalDate.now(), LocalDate.parse(event.getEventDate()));
            
            return EventResponse.builder()
                    .eid(event.getEid())
                    .ename(event.getEname())
                    .edescription(event.getEdescription())
                    .eventDate(event.getEventDate())
                    .fees(event.getFees())
                    .location(event.getLocation())
                    .capacity(event.getCapacity())
                    .teamIsAllowed(event.getTeamIsAllowed())
                    .minTeamSize(event.getMinTeamSize())
                    .maxTeamSize(event.getMaxTeamSize())
                    .category(event.getCategory())
                    .mode(event.getMode())
                    .posterUrl(event.getPosterUrl())
                    .posterThumbnailUrl(event.getPosterThumbnailUrl())
                    .approved(event.isApproved())
                    .active(event.isActive())
                    .cashPrize(event.getCashPrize())
                    .firstPrize(event.getFirstPrize())
                    .secondPrize(event.getSecondPrize())
                    .thirdPrize(event.getThirdPrize())
                    .city(event.getCity())
                    .state(event.getState())
                    .country(event.getCountry())
                    .eventWebsite(event.getEventWebsite())
                    .contactPhone(event.getContactPhone())
                    .organizerName(event.getOrganizerName())
                    .organizerEmail(event.getOrganizerEmail())
                    .organizerPhone(event.getOrganizerPhone())
                    .rules(event.getRules())
                    .requirements(event.getRequirements())
                    .registrationDeadline(event.getRegistrationDeadline())
                    .registrationOpen(event.isRegistrationOpen())
                    .collegeName(college.getCname())
                    .collegeEmail(college.getUser().getEmail())
                    .festName(event.getFest() != null ? event.getFest().getFname() : null)
                    .registrationCount(registrationCount)
                    .daysLeft(daysLeft)
                    .build();
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @Operation(summary = "Create a new event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event created successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "College not found"),
        @ApiResponse(responseCode = "400", description = "Event name already exists for this college")
    })
    public ResponseEntity<?> createEvent(@AuthenticationPrincipal User user, @Valid @RequestBody EventRequest eventRequest) {
        logger.info("[POST] /api/events called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.warn("Unauthorized access attempt to /api/events by user: {}", user != null ? user.getEmail() : "null");
            throw new ForbiddenActionException("Only colleges can access this endpoint");
        }
        College college = getCollegeForUser(user);
        if (college == null) {
            logger.error("College not found for user: {}", user != null ? user.getEmail() : "null");
            throw new CollegeNotFoundException("College not found for this user.");
        }
        // Duplicate name check
        boolean exists = eventRepository.findByCollege(college).stream()
                .anyMatch(e -> e.getEname().equalsIgnoreCase(eventRequest.getEname()));
        if (exists) {
            logger.warn("Event name already exists for college: {} with name: {}", college.getCname(), eventRequest.getEname());
            throw new EventNameExistsException("Event name already exists for this college.");
        }
        
        // Validate team size constraints
        if (eventRequest.getTeamIsAllowed()) {
            if (eventRequest.getMinTeamSize() == null || eventRequest.getMaxTeamSize() == null) {
                throw new IllegalArgumentException("Team size constraints are required when team registration is allowed.");
            }
            if (eventRequest.getMinTeamSize() < 1) {
                throw new IllegalArgumentException("Minimum team size must be at least 1.");
            }
            if (eventRequest.getMaxTeamSize() < eventRequest.getMinTeamSize()) {
                throw new IllegalArgumentException("Maximum team size must be greater than or equal to minimum team size.");
            }
        }
        
        // Fest linkage and event date validation
        Fest fest = null;
        if (eventRequest.getFid() != null) {
            fest = festRepository.findById(eventRequest.getFid()).orElse(null);
            if (fest == null || !fest.getCollege().getCid().equals(college.getCid())) {
                logger.error("Invalid fest for college: {} with fest ID: {}", college.getCname(), eventRequest.getFid());
                throw new InvalidFestForCollegeException("Invalid fest for this college.");
            }
            if (!isDateWithinRange(eventRequest.getEventDate(), fest.getStartDate(), fest.getEndDate())) {
                logger.error("Event date out of range for fest: {} with event date: {}", fest.getFname(), eventRequest.getEventDate());
                throw new EventDateOutOfRangeException("Event date must be within fest date range.");
            }
        }
        Event event = Event.builder()
                .college(college)
                .fest(fest)
                .ename(eventRequest.getEname())
                .edescription(eventRequest.getEdescription())
                .eventDate(eventRequest.getEventDate())
                .fees(eventRequest.getFees())
                .location(eventRequest.getLocation())
                .capacity(eventRequest.getCapacity())
                .teamIsAllowed(eventRequest.getTeamIsAllowed())
                .minTeamSize(eventRequest.getMinTeamSize())
                .maxTeamSize(eventRequest.getMaxTeamSize())
                .category(eventRequest.getCategory())
                .mode(eventRequest.getMode())
                .posterUrl(eventRequest.getPosterUrl())
                .cashPrize(eventRequest.getCashPrize())
                .firstPrize(eventRequest.getFirstPrize())
                .secondPrize(eventRequest.getSecondPrize())
                .thirdPrize(eventRequest.getThirdPrize())
                .city(eventRequest.getCity())
                .state(eventRequest.getState())
                .country(eventRequest.getCountry())
                .eventWebsite(eventRequest.getEventWebsite())
                .contactPhone(eventRequest.getContactPhone())
                .organizerName(eventRequest.getOrganizerName())
                .organizerEmail(eventRequest.getOrganizerEmail())
                .organizerPhone(eventRequest.getOrganizerPhone())
                .rules(eventRequest.getRules())
                .requirements(eventRequest.getRequirements())
                .registrationDeadline(eventRequest.getRegistrationDeadline())
                .registrationOpen(eventRequest.getRegistrationOpen())
                .approved(false) // Needs admin approval
                .active(true)
                .build();
        Event saved = eventRepository.save(event);
        logger.info("Event created: {} for college: {}", event.getEname(), college.getCname());
        
        EventResponse response = EventResponse.builder()
                .eid(saved.getEid())
                .ename(saved.getEname())
                .edescription(saved.getEdescription())
                .eventDate(saved.getEventDate())
                .fees(saved.getFees())
                .location(saved.getLocation())
                .capacity(saved.getCapacity())
                .teamIsAllowed(saved.getTeamIsAllowed())
                .minTeamSize(saved.getMinTeamSize())
                .maxTeamSize(saved.getMaxTeamSize())
                .category(saved.getCategory())
                .mode(saved.getMode())
                .posterUrl(saved.getPosterUrl())
                .posterThumbnailUrl(saved.getPosterThumbnailUrl())
                .approved(saved.isApproved())
                .active(saved.isActive())
                .cashPrize(saved.getCashPrize())
                .firstPrize(saved.getFirstPrize())
                .secondPrize(saved.getSecondPrize())
                .thirdPrize(saved.getThirdPrize())
                .city(saved.getCity())
                .state(saved.getState())
                .country(saved.getCountry())
                .eventWebsite(saved.getEventWebsite())
                .contactPhone(saved.getContactPhone())
                .organizerName(saved.getOrganizerName())
                .organizerEmail(saved.getOrganizerEmail())
                .organizerPhone(saved.getOrganizerPhone())
                .rules(saved.getRules())
                .requirements(saved.getRequirements())
                .registrationDeadline(saved.getRegistrationDeadline())
                .registrationOpen(saved.isRegistrationOpen())
                .collegeName(college.getCname())
                .collegeEmail(college.getUser().getEmail())
                .festName(fest != null ? fest.getFname() : null)
                .registrationCount(0)
                .daysLeft((int) ChronoUnit.DAYS.between(LocalDate.now(), LocalDate.parse(saved.getEventDate())))
                .build();
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{eid}")
    @Operation(summary = "Update an existing event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event updated successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> updateEvent(@AuthenticationPrincipal User user, @PathVariable Long eid, @Valid @RequestBody EventRequest eventRequest) {
        logger.info("[PUT] /api/events/{eid} called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.warn("Unauthorized access attempt to /api/events/{eid} by user: {}", user != null ? user.getEmail() : "null");
            throw new ForbiddenActionException("Only colleges can access this endpoint");
        }
        College college = getCollegeForUser(user);
        if (college == null) {
            logger.error("College not found for user: {}", user != null ? user.getEmail() : "null");
            throw new CollegeNotFoundException("College not found for this user.");
        }
        Event event = eventRepository.findById(eid).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            logger.error("Event not found or not owned by this college for user: {}", user != null ? user.getEmail() : "null");
            throw new EventNotFoundException("Event not found or not owned by this college");
        }
        // Duplicate name check (excluding self)
        boolean exists = eventRepository.findByCollege(college).stream()
                .anyMatch(e -> !e.getEid().equals(eid) && e.getEname().equalsIgnoreCase(eventRequest.getEname()));
        if (exists) {
            logger.warn("Event name already exists for college: {} with name: {}", college.getCname(), eventRequest.getEname());
            throw new EventNameExistsException("Event name already exists for this college");
        }
        
        // Validate team size constraints
        if (eventRequest.getTeamIsAllowed()) {
            if (eventRequest.getMinTeamSize() == null || eventRequest.getMaxTeamSize() == null) {
                throw new IllegalArgumentException("Team size constraints are required when team registration is allowed.");
            }
            if (eventRequest.getMinTeamSize() < 1) {
                throw new IllegalArgumentException("Minimum team size must be at least 1.");
            }
            if (eventRequest.getMaxTeamSize() < eventRequest.getMinTeamSize()) {
                throw new IllegalArgumentException("Maximum team size must be greater than or equal to minimum team size.");
            }
        }
        
        // Fest linkage and event date validation
        Fest fest = null;
        if (eventRequest.getFid() != null) {
            fest = festRepository.findById(eventRequest.getFid()).orElse(null);
            if (fest == null || !fest.getCollege().getCid().equals(college.getCid())) {
                logger.error("Invalid fest for college: {} with fest ID: {}", college.getCname(), eventRequest.getFid());
                throw new InvalidFestForCollegeException("Invalid fest for this college");
            }
            if (!isDateWithinRange(eventRequest.getEventDate(), fest.getStartDate(), fest.getEndDate())) {
                logger.error("Event date out of range for fest: {} with event date: {}", fest.getFname(), eventRequest.getEventDate());
                throw new EventDateOutOfRangeException("Event date must be within fest date range");
            }
        }
        event.setFest(fest);
        event.setEname(eventRequest.getEname());
        event.setEdescription(eventRequest.getEdescription());
        event.setEventDate(eventRequest.getEventDate());
        event.setFees(eventRequest.getFees());
        event.setLocation(eventRequest.getLocation());
        event.setCapacity(eventRequest.getCapacity());
        event.setTeamIsAllowed(eventRequest.getTeamIsAllowed());
        event.setMinTeamSize(eventRequest.getMinTeamSize());
        event.setMaxTeamSize(eventRequest.getMaxTeamSize());
        event.setCategory(eventRequest.getCategory());
        event.setMode(eventRequest.getMode());
        event.setPosterUrl(eventRequest.getPosterUrl());
        event.setCashPrize(eventRequest.getCashPrize());
        event.setFirstPrize(eventRequest.getFirstPrize());
        event.setSecondPrize(eventRequest.getSecondPrize());
        event.setThirdPrize(eventRequest.getThirdPrize());
        event.setCity(eventRequest.getCity());
        event.setState(eventRequest.getState());
        event.setCountry(eventRequest.getCountry());
        event.setEventWebsite(eventRequest.getEventWebsite());
        event.setContactPhone(eventRequest.getContactPhone());
        event.setOrganizerName(eventRequest.getOrganizerName());
        event.setOrganizerEmail(eventRequest.getOrganizerEmail());
        event.setOrganizerPhone(eventRequest.getOrganizerPhone());
        event.setRules(eventRequest.getRules());
        event.setRequirements(eventRequest.getRequirements());
        event.setRegistrationDeadline(eventRequest.getRegistrationDeadline());
        event.setRegistrationOpen(eventRequest.getRegistrationOpen());
        eventRepository.save(event);
        
        int registrationCount = eventRegistrationRepository.findByEvent(event).size();
        int daysLeft = (int) ChronoUnit.DAYS.between(LocalDate.now(), LocalDate.parse(event.getEventDate()));
        
        EventResponse response = EventResponse.builder()
                .eid(event.getEid())
                .ename(event.getEname())
                .edescription(event.getEdescription())
                .eventDate(event.getEventDate())
                .fees(event.getFees())
                .location(event.getLocation())
                .capacity(event.getCapacity())
                .teamIsAllowed(event.getTeamIsAllowed())
                .minTeamSize(event.getMinTeamSize())
                .maxTeamSize(event.getMaxTeamSize())
                .category(event.getCategory())
                .mode(event.getMode())
                .posterUrl(event.getPosterUrl())
                .posterThumbnailUrl(event.getPosterThumbnailUrl())
                .approved(event.isApproved())
                .active(event.isActive())
                .cashPrize(event.getCashPrize())
                .firstPrize(event.getFirstPrize())
                .secondPrize(event.getSecondPrize())
                .thirdPrize(event.getThirdPrize())
                .city(event.getCity())
                .state(event.getState())
                .country(event.getCountry())
                .eventWebsite(event.getEventWebsite())
                .contactPhone(event.getContactPhone())
                .organizerName(event.getOrganizerName())
                .organizerEmail(event.getOrganizerEmail())
                .organizerPhone(event.getOrganizerPhone())
                .rules(event.getRules())
                .requirements(event.getRequirements())
                .registrationDeadline(event.getRegistrationDeadline())
                .registrationOpen(event.isRegistrationOpen())
                .collegeName(college.getCname())
                .collegeEmail(college.getUser().getEmail())
                .festName(fest != null ? fest.getFname() : null)
                .registrationCount(registrationCount)
                .daysLeft(daysLeft)
                .build();
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{eid}")
    @Operation(summary = "Delete an event")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can access this endpoint"),
        @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> deleteEvent(@AuthenticationPrincipal User user, @PathVariable Long eid) {
        logger.info("[DELETE] /api/events/{eid} called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.warn("Unauthorized access attempt to /api/events/{eid} by user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Only colleges can access this endpoint"));
        }
        College college = getCollegeForUser(user);
        if (college == null) {
            logger.error("College not found for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.notFound().build();
        }
        Event event = eventRepository.findById(eid).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            logger.error("Event not found or not owned by this college for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        eventRepository.delete(event);
        logger.info("Event deleted: {}", eid);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }

    @PostMapping("/{eid}/poster")
    @Operation(summary = "Upload event poster")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event poster uploaded successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can upload event posters"),
        @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> uploadEventPoster(@AuthenticationPrincipal User user, 
                                             @PathVariable Long eid, 
                                             @RequestParam("file") MultipartFile file) {
        logger.info("[POST] /api/events/{eid}/poster called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.warn("Unauthorized access attempt to /api/events/{eid}/poster by user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Only colleges can upload event posters"));
        }
        
        College college = getCollegeForUser(user);
        if (college == null) {
            logger.error("College not found for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.notFound().build();
        }
        
        Event event = eventRepository.findById(eid).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            logger.error("Event not found or not owned by this college for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        
        try {
            // Delete old poster if exists
            if (event.getPosterUrl() != null) {
                fileStorageService.deleteFile(event.getPosterUrl());
            }
            
            // Store new poster
            String posterUrl = fileStorageService.storeEventPoster(file);
            String posterThumbnailUrl = posterUrl; // For now, use same image as thumbnail
            
            // Update event
            event.setPosterUrl(posterUrl);
            event.setPosterThumbnailUrl(posterThumbnailUrl);
            eventRepository.save(event);
            
            logger.info("Event poster uploaded: {}", eid);
            return ResponseEntity.ok(Map.of(
                "message", "Event poster uploaded successfully",
                "posterUrl", posterUrl,
                "posterThumbnailUrl", posterThumbnailUrl
            ));
            
        } catch (IllegalArgumentException e) {
            logger.error("Invalid file upload for event poster: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Failed to upload poster for event: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload poster: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{eid}/poster")
    @Operation(summary = "Delete event poster")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Poster deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can delete posters"),
        @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> deleteEventPoster(@AuthenticationPrincipal User user, @PathVariable Long eid) {
        logger.info("[DELETE] /api/events/{eid}/poster called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.warn("Unauthorized access attempt to /api/events/{eid}/poster by user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Only colleges can delete posters"));
        }
        College college = getCollegeForUser(user);
        if (college == null) {
            logger.error("College not found for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.notFound().build();
        }
        Event event = eventRepository.findById(eid).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            logger.error("Event not found or not owned by this college for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        event.setPosterUrl(null);
        event.setPosterThumbnailUrl(null);
        eventRepository.save(event);
        logger.info("Event poster deleted: {}", eid);
        return ResponseEntity.ok(Map.of("message", "Poster deleted successfully"));
    }

    @GetMapping("/{eid}/registrations")
    @Operation(summary = "Get event registrations")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event registrations retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can view event registrations"),
        @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> getEventRegistrations(@AuthenticationPrincipal User user, @PathVariable Long eid) {
        if (user == null || user.getRole() != User.Role.College) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Only colleges can access this endpoint"));
        }
        
        College college = getCollegeForUser(user);
        if (college == null) {
            return ResponseEntity.notFound().build();
        }
        
        Event event = eventRepository.findById(eid).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            return ResponseEntity.notFound().build();
        }
        
        List<EventRegistration> registrations = eventRegistrationRepository.findByEvent(event);
        List<Team> teams = teamRepository.findByEvent(event);
        
        Map<String, Object> response = new HashMap<>();
        response.put("eventName", event.getEname());
        response.put("eventId", event.getEid());
        response.put("totalRegistrations", registrations.size());
        response.put("capacity", event.getCapacity());
        response.put("teamIsAllowed", event.getTeamIsAllowed());
        response.put("minTeamSize", event.getMinTeamSize());
        response.put("maxTeamSize", event.getMaxTeamSize());
        
        // Solo registrations
        List<Map<String, Object>> soloRegistrations = registrations.stream()
                .filter(reg -> reg.getTeam() == null)
                .map(reg -> {
                    Map<String, Object> solo = new HashMap<>();
                    solo.put("registrationId", reg.getRid());
                    solo.put("studentName", reg.getStudent().getSname());
                    solo.put("studentEmail", reg.getStudent().getUser().getEmail());
                    solo.put("college", reg.getStudent().getCollege().getCname());
                    solo.put("registrationDate", reg.getErdateTime());
                    solo.put("paymentStatus", reg.getPaymentStatus());
                    solo.put("status", reg.getStatus());
                    return solo;
                })
                .collect(Collectors.toList());
        
        // Team registrations
        List<TeamResponse> teamResponses = new ArrayList<>();
        for (Team team : teams) {
            teamResponses.add(buildTeamResponse(team));
        }
        
        response.put("soloRegistrations", soloRegistrations);
        response.put("teamRegistrations", teamResponses);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{eid}/poster/audit-logs")
    @Operation(summary = "Get event poster audit logs")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Audit logs retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only colleges can view audit logs"),
        @ApiResponse(responseCode = "404", description = "Event not found or not owned by this college")
    })
    public ResponseEntity<?> getEventPosterAuditLogs(@AuthenticationPrincipal User user, @PathVariable Long eid) {
        logger.info("[GET] /api/events/{eid}/poster/audit-logs called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.College) {
            logger.warn("Unauthorized access attempt to /api/events/{eid}/poster/audit-logs by user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Only colleges can view audit logs"));
        }
        College college = getCollegeForUser(user);
        if (college == null) {
            logger.error("College not found for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.notFound().build();
        }
        Event event = eventRepository.findById(eid).orElse(null);
        if (event == null || !event.getCollege().getCid().equals(college.getCid())) {
            logger.error("Event not found or not owned by this college for user: {}", user != null ? user.getEmail() : "null");
            return ResponseEntity.status(404).body(Map.of("error", "Event not found or not owned by this college"));
        }
        // Return audit log information
        logger.info("Successfully retrieved audit logs for event poster: {}", eid);
        return ResponseEntity.ok(Map.of(
            "eventId", eid,
            "posterUrl", event.getPosterUrl(),
            "lastUpdated", System.currentTimeMillis()
        ));
    }

    private TeamResponse buildTeamResponse(Team team) {
        List<TeamMembers> registeredMembers = teamMembersRepository.findByTeam(team);
        List<UnregisteredTeamMember> unregisteredMembers = unregisteredTeamMemberRepository.findByTeam(team);
        
        List<TeamMemberInfo> registeredMemberInfos = registeredMembers.stream()
                .map(member -> TeamMemberInfo.builder()
                        .name(member.getStudent().getSname())
                        .email(member.getStudent().getUser().getEmail())
                        .phone("") // Phone not stored in Student entity
                        .college(member.getStudent().getCollege().getCname())
                        .branch("") // Branch not stored in Student entity
                        .year(0) // Year not stored in Student entity
                        .isRegistered(true)
                        .studentId(member.getStudent().getSid().intValue())
                        .build())
                .collect(Collectors.toList());
        
        List<TeamMemberInfo> unregisteredMemberInfos = unregisteredMembers.stream()
                .map(member -> TeamMemberInfo.builder()
                        .name(member.getName())
                        .email(member.getEmail())
                        .phone(member.getPhone())
                        .college(member.getCollege())
                        .branch(member.getBranch())
                        .year(member.getYear())
                        .isRegistered(false)
                        .studentId(null)
                        .build())
                .collect(Collectors.toList());
        
        int totalMembers = registeredMembers.size() + unregisteredMembers.size();
        boolean isComplete = totalMembers >= team.getEvent().getMinTeamSize();
        
        return TeamResponse.builder()
                .teamId(team.getTid())
                .teamName(team.getTname())
                .eventName(team.getEvent().getEname())
                .eventId(team.getEvent().getEid())
                .leaderName(team.getCreator().getSname())
                .leaderEmail(team.getCreator().getUser().getEmail())
                .registeredMembers(registeredMemberInfos)
                .unregisteredMembers(unregisteredMemberInfos)
                .totalMembers(totalMembers)
                .minTeamSize(team.getEvent().getMinTeamSize())
                .maxTeamSize(team.getEvent().getMaxTeamSize())
                .isComplete(isComplete)
                .build();
    }

    private boolean isDateWithinRange(String eventDate, String startDate, String endDate) {
        try {
            LocalDate event = LocalDate.parse(eventDate);
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            return !event.isBefore(start) && !event.isAfter(end);
        } catch (Exception e) {
            logger.error("Error parsing date range for event: {}", e.getMessage());
            return false;
        }
    }
} 