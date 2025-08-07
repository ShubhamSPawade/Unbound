package com.unbound.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Collections;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Check APIs", description = "APIs for system health monitoring")
public class HealthController {
    
    @Autowired
    private DataSource dataSource;
    
    @GetMapping
    @Operation(summary = "Check system health")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "System is healthy"),
        @ApiResponse(responseCode = "503", description = "System is degraded or down")
    })
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        health.put("service", "Unbound Platform API");
        health.put("version", "1.0.0");
        
        // Check database connectivity
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) {
                health.put("database", "UP");
            } else {
                health.put("database", "DOWN");
                health.put("status", "DEGRADED");
            }
        } catch (SQLException e) {
            health.put("database", "DOWN");
            health.put("database_error", e.getMessage());
            health.put("status", "DEGRADED");
        }
        
        // Check memory usage
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        Map<String, Object> memory = new HashMap<>();
        memory.put("total", totalMemory);
        memory.put("used", usedMemory);
        memory.put("free", freeMemory);
        memory.put("usage_percentage", (double) usedMemory / totalMemory * 100);
        health.put("memory", memory);
        
        return ResponseEntity.ok(health);
    }
    
    @GetMapping("/ping")
    @Operation(summary = "Ping the server")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Server is responding")
    })
    public ResponseEntity<Map<String, String>> ping() {
        return ResponseEntity.ok(Map.of("message", "pong"));
    }

    @GetMapping("/test")
    @Operation(summary = "Test endpoint", description = "Simple test endpoint to verify application is working")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Application is working")
    })
    public ResponseEntity<Map<String, String>> test() {
        return ResponseEntity.ok(Map.of("message", "Unbound Platform is running successfully!"));
    }

    @GetMapping("/swagger-test")
    @Operation(summary = "Swagger test endpoint", description = "Test endpoint to verify Swagger is working")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Swagger test successful")
    })
    public ResponseEntity<Map<String, String>> swaggerTest() {
        return ResponseEntity.ok(Map.of("message", "Swagger is working!", "timestamp", String.valueOf(System.currentTimeMillis())));
    }

    @GetMapping("/debug")
    @Operation(summary = "Debug endpoint", description = "Debug endpoint to check request details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Debug information")
    })
    public ResponseEntity<Map<String, Object>> debug(HttpServletRequest request) {
        Map<String, Object> debug = new HashMap<>();
        debug.put("requestURI", request.getRequestURI());
        debug.put("method", request.getMethod());
        debug.put("headers", Collections.list(request.getHeaderNames()).stream()
            .collect(Collectors.toMap(name -> name, request::getHeader)));
        debug.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(debug);
    }

    @GetMapping("/favicon.ico")
    public ResponseEntity<Void> favicon() {
        return ResponseEntity.noContent().build();
    }
} 