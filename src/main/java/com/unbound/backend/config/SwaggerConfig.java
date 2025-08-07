package com.unbound.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Unbound Platform API")
                        .description("""
                                # Unbound Platform - Comprehensive Fest & Event Management System
                                
                                ## 🚀 **Key Features**
                                - **User Management**: Student, College, and Admin roles with JWT authentication
                                - **Fest & Event Management**: Create, manage, and approve fests and events
                                - **Payment Integration**: Razorpay payment gateway with direct college routing
                                - **Beautiful HTML Email Templates**: Professional email notifications with modern design
                                - **Team Management**: Support for team-based event registrations
                                - **Certificate Generation**: PDF certificates for event participation
                                - **College Dashboard**: Analytics, earnings, and student management
                                - **Student Dashboard**: Event exploration, registration, and payment tracking
                                - **Review System**: Student ratings and reviews for events
                                - **Public Access**: Non-authenticated users can explore fests and events
                                
                                ## 📧 **Enhanced Email System**
                                - **HTML Email Templates**: Beautiful, responsive email templates with modern CSS
                                - **Thymeleaf Integration**: Dynamic template rendering with data binding
                                - **Email Types**: Registration receipts, payment notifications, password reset, refunds
                                - **Professional Design**: Gradient headers, organized sections, color-coded status badges
                                - **Mobile Responsive**: Optimized for all email clients and devices
                                
                                ## 💰 **Payment Features**
                                - **Direct College Routing**: Payments go directly to college's bank account
                                - **College Payment Setup**: Colleges configure Razorpay account and bank details
                                - **Payment Notifications**: Both student and college receive beautiful email confirmations
                                - **Payment Analytics**: Detailed payment tracking and analytics for colleges
                                
                                ## 🔐 **Security & Authentication**
                                - **JWT Authentication**: Secure stateless authentication
                                - **Role-based Access**: Different permissions for different user types
                                - **Input Validation**: Comprehensive validation on all inputs
                                - **Payment Security**: Secure payment processing through Razorpay
                                
                                ## 📊 **Analytics & Dashboard**
                                - **College Analytics**: Earnings, registrations, and event performance
                                - **Student Dashboard**: Personal event history and certificate management
                                - **Admin Dashboard**: Platform-wide statistics and content moderation
                                
                                ## 🌐 **Public Access**
                                - **Fest Exploration**: Browse approved fests with filtering
                                - **Event Discovery**: Search events with comprehensive filters
                                - **Statistics**: View platform statistics without authentication
                                
                                ## 📚 **API Documentation**
                                - **Interactive Testing**: Test all endpoints directly from Swagger UI
                                - **Authentication**: JWT Bearer token authentication supported
                                - **Request/Response Examples**: Detailed examples for all endpoints
                                - **Error Handling**: Comprehensive error responses and validation
                                
                                ## 🛠️ **Technical Stack**
                                - **Backend**: Spring Boot 3.5.3, Java 17
                                - **Database**: MySQL with JPA/Hibernate
                                - **Security**: Spring Security with JWT
                                - **Email**: Spring Mail with Thymeleaf templates
                                - **Payment**: Razorpay integration
                                - **Documentation**: Swagger/OpenAPI 3
                                - **Testing**: JUnit 5 with Spring Boot Test
                                """)
                        .version("2.0.0")
                        .contact(new Contact()
                                .name("Unbound Platform Team")
                                .email("support@unboundplatform.com")
                                .url("https://unboundplatform.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8081").description("Development Server"),
                        new Server().url("https://api.unboundplatform.com").description("Production Server")
                ));
    }
} 