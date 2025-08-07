package com.unbound.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggingConfig {
    
    @Bean
    public Logger applicationLogger() {
        return LoggerFactory.getLogger("com.unbound.backend");
    }
    
    @Bean
    public Logger securityLogger() {
        return LoggerFactory.getLogger("com.unbound.backend.security");
    }
    
    @Bean
    public Logger databaseLogger() {
        return LoggerFactory.getLogger("com.unbound.backend.database");
    }
} 