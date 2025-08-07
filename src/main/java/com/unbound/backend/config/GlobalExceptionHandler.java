package com.unbound.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.unbound.backend.exception.EmailNotFoundException;
import com.unbound.backend.exception.IncorrectPasswordException;
import com.unbound.backend.exception.RegistrationClosedException;
import com.unbound.backend.exception.PaymentFailedException;
import com.unbound.backend.exception.EmailAlreadyRegisteredException;
import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import com.unbound.backend.exception.CollegeNotFoundException;
import com.unbound.backend.exception.EventNameExistsException;
import com.unbound.backend.exception.InvalidFestForCollegeException;
import com.unbound.backend.exception.EventDateOutOfRangeException;
import com.unbound.backend.exception.FestNameExistsException;
import com.unbound.backend.exception.InvalidDateRangeException;
import com.unbound.backend.exception.FestNotFoundException;
import com.unbound.backend.exception.EventNotFoundException;
import com.unbound.backend.exception.ForbiddenActionException;
import com.unbound.backend.exception.StudentNotFoundException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Validation failed");
        response.put("details", errors);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Validation failed");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Authentication failed");
        response.put("message", "Invalid email or password");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Access denied");
        response.put("message", "You don't have permission to access this resource");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "File upload failed");
        response.put("message", "File size exceeds maximum allowed limit");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Invalid request");
        response.put("message", ex.getMessage());
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(EmailNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEmailNotFound(EmailNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Account Not Found");
        body.put("message", "No account found with that email address.");
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IncorrectPasswordException.class)
    public ResponseEntity<Map<String, Object>> handleIncorrectPassword(IncorrectPasswordException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Incorrect Password");
        body.put("message", "The password you entered is incorrect.");
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MailAuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleMailAuth(MailAuthenticationException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Email Sending Failed");
        body.put("message", "We couldn't send you an email. Please try again later or contact support.");
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Database Error");
        body.put("message", "Something went wrong. Please try again later or contact support.");
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEntityNotFound(EntityNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RegistrationClosedException.class)
    public ResponseEntity<Map<String, Object>> handleRegistrationClosed(RegistrationClosedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Registration Closed");
        body.put("message", "Registration for this event is closed.");
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(PaymentFailedException.class)
    public ResponseEntity<Map<String, Object>> handlePaymentFailed(PaymentFailedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Payment Failed");
        body.put("message", "We couldn't process your payment. Please try again or use a different payment method.");
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.PAYMENT_REQUIRED);
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<Map<String, Object>> handleEmailAlreadyRegistered(EmailAlreadyRegisteredException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Email Already Registered");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    // Handle specific RuntimeException messages
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        
        String message = ex.getMessage();
        if (message != null) {
            if (message.contains("Email not found") || message.contains("Email already registered")) {
                body.put("error", "Account Not Found");
                body.put("message", "No account found with that email address.");
                return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
            } else if (message.contains("College not found") || message.contains("college")) {
                body.put("error", "College Not Found");
                body.put("message", "The college you selected could not be found. Please check the college ID and try again.");
                return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
            } else if (message.contains("Event not found") || message.contains("event")) {
                body.put("error", "Event Not Found");
                body.put("message", "The event you're looking for could not be found.");
                return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
            } else if (message.contains("Fest not found") || message.contains("fest")) {
                body.put("error", "Fest Not Found");
                body.put("message", "The fest you're looking for could not be found.");
                return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
            } else if (message.contains("Team not found") || message.contains("team")) {
                body.put("error", "Team Not Found");
                body.put("message", "The team you're looking for could not be found.");
                return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
            } else if (message.contains("Registration not found")) {
                body.put("error", "Registration Not Found");
                body.put("message", "The registration you're looking for could not be found.");
                return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
            } else if (message.contains("Invalid token") || message.contains("Token expired")) {
                body.put("error", "Invalid Token");
                body.put("message", "The reset token is invalid or has expired.");
                return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
            }
        }
        
        // Default for other RuntimeException
        body.put("error", "Something went wrong");
        body.put("message", "Something went wrong. Please try again later or contact support.");
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<Map<String, Object>> handleMissingServletRequestPartException(MissingServletRequestPartException ex) {
        logger.error("Missing request part: {}", ex.getMessage());
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Missing file upload");
        response.put("message", "Please ensure you are uploading a file with the correct parameter name. For fest images use 'image', for event posters use 'file'.");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        logger.error("JSON parsing error: {}", ex.getMessage());
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Invalid JSON request");
        response.put("message", "The request body could not be parsed as JSON.");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Something went wrong");
        body.put("message", "Something went wrong. Please try again later or contact support.");
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(CollegeNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleCollegeNotFound(CollegeNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "College Not Found");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EventNameExistsException.class)
    public ResponseEntity<Map<String, Object>> handleEventNameExists(EventNameExistsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Event Name Exists");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidFestForCollegeException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidFestForCollege(InvalidFestForCollegeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Invalid Fest For College");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EventDateOutOfRangeException.class)
    public ResponseEntity<Map<String, Object>> handleEventDateOutOfRange(EventDateOutOfRangeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Event Date Out Of Range");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FestNameExistsException.class)
    public ResponseEntity<Map<String, Object>> handleFestNameExists(FestNameExistsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Fest Name Exists");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidDateRangeException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidDateRange(InvalidDateRangeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Invalid Date Range");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FestNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleFestNotFound(FestNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Fest Not Found");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEventNotFound(EventNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Event Not Found");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ForbiddenActionException.class)
    public ResponseEntity<Map<String, Object>> handleForbiddenAction(ForbiddenActionException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Forbidden");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleStudentNotFound(StudentNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Student Not Found");
        body.put("message", ex.getMessage());
        body.put("timestamp", System.currentTimeMillis());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
} 