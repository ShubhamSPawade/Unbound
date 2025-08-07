package com.unbound.backend.controller;

import com.unbound.backend.dto.EventRegistrationRequest;
import com.unbound.backend.dto.RegistrationResponse;
import com.unbound.backend.dto.TeamMemberRequest;
import com.unbound.backend.dto.TeamResponse;
import com.unbound.backend.dto.TeamMemberInfo;
import com.unbound.backend.entity.*;
import com.unbound.backend.repository.*;
import com.unbound.backend.service.EmailService;
import com.unbound.backend.service.StudentDashboardService;
import com.unbound.backend.service.CertificateService;
import com.unbound.backend.entity.Payment;
import com.unbound.backend.mail.MailTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
import jakarta.persistence.EntityNotFoundException;
import com.unbound.backend.exception.RegistrationClosedException;
import com.unbound.backend.exception.StudentNotFoundException;
import com.unbound.backend.exception.EventNotFoundException;
import com.unbound.backend.exception.ForbiddenActionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.unbound.backend.dto.StudentProfileUpdateRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/student/events")
@Tag(name = "Student Event APIs", description = "APIs for student event operations (Student access required)")
@SecurityRequirement(name = "bearerAuth")
public class StudentEventController {
    private static final Logger logger = LoggerFactory.getLogger(StudentEventController.class);
    
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private TeamMembersRepository teamMembersRepository;
    @Autowired
    private EventReviewRepository eventReviewRepository;
    @Autowired
    private StudentDashboardService studentDashboardService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CertificateService certificateService;
    @Autowired
    private UnregisteredTeamMemberRepository unregisteredTeamMemberRepository;
    @Autowired
    private MailTemplateService mailTemplateService;

    private Student getStudentForUser(User user) {
        return studentRepository.findAll().stream()
                .filter(s -> s.getUser().getUid().equals(user.getUid()))
                .findFirst().orElse(null);
    }

    @PostMapping("/register")
    @Operation(summary = "Register for an event", description = "Allows students to register for a specific event.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registration successful"),
        @ApiResponse(responseCode = "400", description = "Invalid registration type, deadline passed, or event full"),
        @ApiResponse(responseCode = "403", description = "Only students can register"),
        @ApiResponse(responseCode = "404", description = "Event or Student not found")
    })
    public ResponseEntity<?> registerForEvent(@AuthenticationPrincipal User user, @RequestBody EventRegistrationRequest req) {
        if (user == null || user.getRole() != User.Role.Student) {
            throw new ForbiddenActionException("Only students can register for events.");
        }
        Student student = getStudentForUser(user);
        if (student == null) throw new StudentNotFoundException("Student not found.");
        Long eventId = req.getEventId();
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EventNotFoundException("Event not found"));
        
        // Check if event is approved and active
        if (!event.isApproved() || !event.isActive()) {
            throw new EventNotFoundException("Event is not available for registration.");
        }
        
        // Check if registration is open
        boolean registrationClosed = !event.isRegistrationOpen();
        if (registrationClosed) {
            throw new RegistrationClosedException("Registration for this event is closed.");
        }
        
        // Check registration deadline
        try {
            LocalDate deadline = LocalDate.parse(event.getRegistrationDeadline());
            if (LocalDate.now().isAfter(deadline)) {
                throw new RegistrationClosedException("Registration deadline has passed.");
            }
        } catch (Exception e) {
            throw new RegistrationClosedException("Invalid registration deadline.");
        }
        
        // Check for duplicate registration
        if (eventRegistrationRepository.findByEventAndStudent(event, student).isPresent()) {
            throw new RegistrationClosedException("Already registered for this event.");
        }
        
        // Check event capacity
        long regCount = eventRegistrationRepository.findByEvent(event).stream().count();
        if (regCount >= event.getCapacity()) {
            throw new RegistrationClosedException("Event is full.");
        }
        
        // Solo registration
        if ("solo".equalsIgnoreCase(req.getRegistrationType())) {
            if (event.getTeamIsAllowed()) {
                throw new EntityNotFoundException("This event requires team registration.");
            }
            EventRegistration registration = EventRegistration.builder()
                    .event(event)
                    .student(student)
                    .erdateTime(java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ISO_DATE_TIME))
                    .status("registered")
                    .paymentStatus(event.getFees() > 0 ? "pending" : "paid")
                    .build();
            eventRegistrationRepository.save(registration);
            
            // Generate receipt number
            String receiptNumber = "RCP" + System.currentTimeMillis();
            
            // Send detailed registration confirmation email
            mailTemplateService.sendRegistrationReceipt(student, event, registration, receiptNumber, "solo", null, null);
            
            // Create response
            RegistrationResponse response = RegistrationResponse.builder()
                    .registrationId(registration.getRid())
                    .eventName(event.getEname())
                    .eventDate(event.getEventDate())
                    .eventLocation(event.getLocation())
                    .fees(event.getFees())
                    .registrationType("solo")
                    .teamName(null)
                    .registrationStatus(registration.getStatus())
                    .paymentStatus(registration.getPaymentStatus())
                    .registrationDateTime(registration.getErdateTime())
                    .studentName(student.getSname())
                    .studentEmail(student.getUser().getEmail())
                    .collegeName(event.getCollege().getCname())
                    .festName(event.getFest() != null ? event.getFest().getFname() : null)
                    .cashPrize(event.getCashPrize())
                    .firstPrize(event.getFirstPrize())
                    .secondPrize(event.getSecondPrize())
                    .thirdPrize(event.getThirdPrize())
                    .registrationDeadline(event.getRegistrationDeadline())
                    .daysLeft((int) java.time.temporal.ChronoUnit.DAYS.between(
                        java.time.LocalDate.now(), 
                        java.time.LocalDate.parse(event.getEventDate())
                    ))
                    .receiptNumber(receiptNumber)
                    .message("Registration successful! Check your email for receipt.")
                    .success(true)
                    .build();
            
            return ResponseEntity.ok(response);
        }
        
        // Team registration
        if ("team".equalsIgnoreCase(req.getRegistrationType())) {
            if (!event.getTeamIsAllowed()) {
                throw new EntityNotFoundException("This event does not allow team registration.");
            }
            Team team = null;
            // Join existing team
            if (req.getTeamId() != null) {
                Long teamId = req.getTeamId();
                Optional<Team> teamOpt = teamRepository.findById(teamId);
                if (teamOpt.isEmpty()) throw new EntityNotFoundException("Team not found.");
                team = teamOpt.get();
                
                // Validate team size constraints
                int currentTeamSize = teamMembersRepository.findByTeam(team).size() + 
                                   unregisteredTeamMemberRepository.findByTeam(team).size();
                if (currentTeamSize >= event.getMaxTeamSize()) {
                    throw new EntityNotFoundException("Team is already at maximum capacity (" + event.getMaxTeamSize() + " members).");
                }
                
                // Check if already a member
                if (teamMembersRepository.findByTeamAndStudent(team, student).isPresent()) {
                    throw new EntityNotFoundException("Already a member of this team.");
                }
                // Add to team
                TeamMembers teamMember = TeamMembers.builder()
                        .team(team)
                        .student(student)
                        .build();
                teamMembersRepository.save(teamMember);
            } else {
                // Create new team
                if (req.getTeamName() == null || req.getTeamName().trim().isEmpty()) {
                    throw new EntityNotFoundException("Team name is required for team registration.");
                }
                
                team = Team.builder()
                        .event(event)
                        .creator(student)
                        .tname(req.getTeamName())
                        .build();
                team = teamRepository.save(team);
                
                // Add creator as member
                TeamMembers teamMember = TeamMembers.builder()
                        .team(team)
                        .student(student)
                        .build();
                teamMembersRepository.save(teamMember);
                
                // Add team members if provided
                if (req.getTeamMembers() != null && !req.getTeamMembers().isEmpty()) {
                    for (TeamMemberRequest memberRequest : req.getTeamMembers()) {
                        if (memberRequest.getIsRegistered() != null && memberRequest.getIsRegistered()) {
                            // Add registered member
                            if (memberRequest.getStudentId() != null) {
                                Optional<Student> memberStudent = studentRepository.findById(memberRequest.getStudentId());
                                if (memberStudent.isPresent()) {
                                    // Check if not already a member
                                    if (!teamMembersRepository.findByTeamAndStudent(team, memberStudent.get()).isPresent()) {
                                        TeamMembers member = TeamMembers.builder()
                                                .team(team)
                                                .student(memberStudent.get())
                                                .build();
                                        teamMembersRepository.save(member);
                                    }
                                }
                            }
                        } else {
                            // Add unregistered member
                            UnregisteredTeamMember unregisteredMember = UnregisteredTeamMember.builder()
                                    .team(team)
                                    .name(memberRequest.getName())
                                    .email(memberRequest.getEmail())
                                    .phone(memberRequest.getPhone())
                                    .college(memberRequest.getCollege())
                                    .branch(memberRequest.getBranch())
                                    .year(memberRequest.getYear())
                                    .addedBy(student.getUser().getEmail())
                                    .build();
                            unregisteredTeamMemberRepository.save(unregisteredMember);
                        }
                    }
                }
                
                // Check if minimum team size is met (for events that require multiple members)
                int totalMembers = teamMembersRepository.findByTeam(team).size() + 
                                unregisteredTeamMemberRepository.findByTeam(team).size();
                if (event.getMinTeamSize() > 1 && totalMembers < event.getMinTeamSize()) {
                    logger.info("Team created with minimum size requirement: {} for event: {}, current members: {}", 
                              event.getMinTeamSize(), event.getEname(), totalMembers);
                }
            }
            
            EventRegistration registration = EventRegistration.builder()
                    .event(event)
                    .student(student)
                    .team(team)
                    .erdateTime(java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ISO_DATE_TIME))
                    .status("registered")
                    .paymentStatus(event.getFees() > 0 ? "pending" : "paid")
                    .build();
            eventRegistrationRepository.save(registration);
            
            // Generate receipt number
            String receiptNumber = "RCP" + System.currentTimeMillis();
            
            // Send detailed registration confirmation email
            mailTemplateService.sendRegistrationReceipt(student, event, registration, receiptNumber, "team", team, null);
            
            // Create response
            RegistrationResponse response = RegistrationResponse.builder()
                    .registrationId(registration.getRid())
                    .eventName(event.getEname())
                    .eventDate(event.getEventDate())
                    .eventLocation(event.getLocation())
                    .fees(event.getFees())
                    .registrationType("team")
                    .teamName(team.getTname())
                    .registrationStatus(registration.getStatus())
                    .paymentStatus(registration.getPaymentStatus())
                    .registrationDateTime(registration.getErdateTime())
                    .studentName(student.getSname())
                    .studentEmail(student.getUser().getEmail())
                    .collegeName(event.getCollege().getCname())
                    .festName(event.getFest() != null ? event.getFest().getFname() : null)
                    .cashPrize(event.getCashPrize())
                    .firstPrize(event.getFirstPrize())
                    .secondPrize(event.getSecondPrize())
                    .thirdPrize(event.getThirdPrize())
                    .registrationDeadline(event.getRegistrationDeadline())
                    .daysLeft((int) java.time.temporal.ChronoUnit.DAYS.between(
                        java.time.LocalDate.now(), 
                        java.time.LocalDate.parse(event.getEventDate())
                    ))
                    .receiptNumber(receiptNumber)
                    .message("Team registration successful! Check your email for receipt.")
                    .success(true)
                    .build();
            
            return ResponseEntity.ok(response);
        }
        
        throw new EntityNotFoundException("Invalid registration type.");
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



    @GetMapping("/my")
    @Operation(summary = "Get my registered events", description = "Retrieves all events a student has registered for.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved registrations"),
        @ApiResponse(responseCode = "403", description = "Only students can view their registrations"),
        @ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<?> myRegistrations(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.Student) {
            throw new EntityNotFoundException("Only students can view their registrations.");
        }
        Student student = getStudentForUser(user);
        if (student == null) throw new EntityNotFoundException("Student not found.");
        return ResponseEntity.ok(studentDashboardService.getMyRegistrations(student));
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get student dashboard statistics", description = "Retrieves various statistics for the authenticated student.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved dashboard stats"),
        @ApiResponse(responseCode = "403", description = "Only students can view dashboard stats"),
        @ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<?> getStudentDashboardStats(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.Student) {
            throw new EntityNotFoundException("Only students can view dashboard stats.");
        }
        Student student = getStudentForUser(user);
        if (student == null) throw new EntityNotFoundException("Student not found.");
        return ResponseEntity.ok(studentDashboardService.getStudentDashboardStats(student));
    }

    @GetMapping("/my/teams")
    @Operation(summary = "Get my teams", description = "Retrieves all teams where the student is a member or leader.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved teams"),
        @ApiResponse(responseCode = "403", description = "Only students can view their teams"),
        @ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<?> getMyTeams(@AuthenticationPrincipal User user) {
        if (user == null || user.getRole() != User.Role.Student) {
            throw new ForbiddenActionException("Only students can view their teams.");
        }
        Student student = getStudentForUser(user);
        if (student == null) throw new StudentNotFoundException("Student not found.");

        List<TeamResponse> teamResponses = new ArrayList<>();
        
        // Get teams where student is a member
        List<TeamMembers> teamMemberships = teamMembersRepository.findByStudent(student);
        for (TeamMembers membership : teamMemberships) {
            Team team = membership.getTeam();
            teamResponses.add(buildTeamResponse(team));
        }
        
        // Get teams where student is the creator
        List<Team> createdTeams = teamRepository.findByCreator(student);
        for (Team team : createdTeams) {
            // Avoid duplicates if student is both creator and member
            if (teamResponses.stream().noneMatch(tr -> tr.getTeamId().equals(team.getTid()))) {
                teamResponses.add(buildTeamResponse(team));
            }
        }
        
        return ResponseEntity.ok(teamResponses);
    }

    @GetMapping("/{eventId}/certificate")
    @Operation(summary = "Download event certificate", description = "Allows students to download their event certificate if they are a registered and paid participant.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Certificate downloaded successfully"),
        @ApiResponse(responseCode = "403", description = "Only students can download certificates or not a registered and paid participant"),
        @ApiResponse(responseCode = "404", description = "Event or Student not found")
    })
    public ResponseEntity<?> downloadCertificate(@AuthenticationPrincipal User user, @PathVariable("eventId") Long eventId) {
        if (user == null || user.getRole() != User.Role.Student) {
            throw new EntityNotFoundException("Only students can download certificates.");
        }
        Student student = getStudentForUser(user);
        if (student == null) throw new EntityNotFoundException("Student not found.");
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        Optional<EventRegistration> regOpt = eventRegistrationRepository.findByEventAndStudent(event, student);
        if (regOpt.isEmpty() || (!"paid".equalsIgnoreCase(regOpt.get().getPaymentStatus()) && event.getFees() > 0)) {
            throw new EntityNotFoundException("You must be a registered and paid participant to download certificate.");
        }
        if (!regOpt.get().isCertificateApproved()) {
            throw new EntityNotFoundException("Certificate not yet approved by college.");
        }
        // Only after event is completed
        try {
            if (!java.time.LocalDate.now().isAfter(java.time.LocalDate.parse(event.getEventDate()))) {
                throw new EntityNotFoundException("Certificate available only after event completion.");
            }
        } catch (Exception e) {
            throw new EntityNotFoundException("Invalid event date for event ID " + eventId + ": " + e.getMessage());
        }
        try {
            byte[] pdf = certificateService.generateCertificate(
                student.getSname(),
                event.getEname(),
                event.getFest() != null ? event.getFest().getFname() : null,
                event.getEventDate()
            );
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=certificate.pdf")
                .body(pdf);
        } catch (Exception e) {
            throw new EntityNotFoundException("Failed to generate certificate for student ID " + student.getSid() + ", event ID " + eventId + ": " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    @Operation(summary = "Get student profile information", description = "Retrieves the profile information for the authenticated student")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Student profile retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only students can view their profile"),
        @ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<?> getStudentProfile(@AuthenticationPrincipal User user) {
        logger.info("[GET] /api/student/events/profile called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.Student) {
            logger.error("User is null or not a student: {}", user);
            throw new ForbiddenActionException("Only students can view their profile");
        }
        if (user.getUid() == null) {
            logger.error("Authenticated user has null UID: {}", user);
            throw new StudentNotFoundException("Authenticated user has no UID. Please contact support.");
        }
        Student student = getStudentForUser(user);
        if (student == null) {
            logger.error("Student not found for user: {} (uid={})", user.getEmail(), user.getUid());
            throw new StudentNotFoundException("Student not found for the authenticated user. Please contact support.");
        }
        if (student.getUser() == null) {
            logger.error("Student entity has null user field: {}", student);
            throw new StudentNotFoundException("Student record is missing user reference. Please contact support.");
        }
        
        logger.info("Student profile fetched for: {} (uid={})", student.getSname(), user.getUid());
        Map<String, Object> response = new HashMap<>();
        response.put("studentId", student.getSid());
        response.put("studentName", student.getSname());
        response.put("collegeId", student.getCollege().getCid());
        response.put("collegeName", student.getCollege().getCname());
        response.put("userEmail", student.getUser().getEmail());
        response.put("createdAt", student.getUser().getCreatedAt());
        response.put("collegeAddress", student.getCollege().getAddress());
        response.put("collegeDescription", student.getCollege().getCdescription());
        response.put("collegeContactEmail", student.getCollege().getContactEmail());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update student profile information", description = "Allows students to update their profile information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Student profile updated successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden: Only students can update their profile"),
        @ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<?> updateStudentProfile(@AuthenticationPrincipal User user, 
                                               @Valid @RequestBody StudentProfileUpdateRequest request) {
        logger.info("[PUT] /api/student/events/profile called by user: {}", user != null ? user.getEmail() : "null");
        if (user == null || user.getRole() != User.Role.Student) {
            logger.error("User is null or not a student: {}", user);
            throw new ForbiddenActionException("Only students can update their profile");
        }
        if (user.getUid() == null) {
            logger.error("Authenticated user has null UID: {}", user);
            throw new StudentNotFoundException("Authenticated user has no UID. Please contact support.");
        }
        Student student = getStudentForUser(user);
        if (student == null) {
            logger.error("Student not found for user: {} (uid={})", user.getEmail(), user.getUid());
            throw new StudentNotFoundException("Student not found for the authenticated user. Please contact support.");
        }
        if (student.getUser() == null) {
            logger.error("Student entity has null user field: {}", student);
            throw new StudentNotFoundException("Student record is missing user reference. Please contact support.");
        }
        
        // Update student profile information
        if (request.getSname() != null && !request.getSname().trim().isEmpty()) {
            student.setSname(request.getSname());
        }
        
        studentRepository.save(student);
        logger.info("Student profile updated for: {} (uid={})", student.getSname(), user.getUid());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Student profile updated successfully");
        response.put("studentId", student.getSid());
        response.put("studentName", student.getSname());
        response.put("collegeId", student.getCollege().getCid());
        response.put("collegeName", student.getCollege().getCname());
        response.put("userEmail", student.getUser().getEmail());
        response.put("createdAt", student.getUser().getCreatedAt());
        response.put("collegeAddress", student.getCollege().getAddress());
        response.put("collegeDescription", student.getCollege().getCdescription());
        response.put("collegeContactEmail", student.getCollege().getContactEmail());
        
        return ResponseEntity.ok(response);
    }
} 