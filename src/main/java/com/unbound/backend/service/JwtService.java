package com.unbound.backend.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY = "replace_this_with_a_very_long_secret_key_for_jwt_signing_which_should_be_secure";
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String extractUsername(String token) {
        logger.info("[JWT] Extracting username from token");
        String username = extractClaim(token, Claims::getSubject);
        logger.info("[JWT] Username extracted: {}", username);
        return username;
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        logger.info("[JWT] Extracting claim from token");
        final Claims claims = extractAllClaims(token);
        T claim = claimsResolver.apply(claims);
        logger.info("[JWT] Claim extracted: {}", claim);
        return claim;
    }

    public String generateToken(String email, String role) {
        logger.info("[JWT] Generating token for email: {}, role: {}", email, role);
        String token = Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
        logger.info("[JWT] Token generated for email: {}", email);
        return token;
    }

    public boolean isTokenValid(String token, String username) {
        logger.info("[JWT] Validating token for username: {}", username);
        final String extractedUsername = extractUsername(token);
        boolean isValid = (extractedUsername.equals(username) && !isTokenExpired(token));
        logger.info("[JWT] Token validation result for username {}: {}", username, isValid);
        return isValid;
    }

    private boolean isTokenExpired(String token) {
        logger.info("[JWT] Checking if token is expired");
        boolean isExpired = extractExpiration(token).before(new Date());
        logger.info("[JWT] Token expired: {}", isExpired);
        return isExpired;
    }

    private Date extractExpiration(String token) {
        logger.info("[JWT] Extracting expiration date from token");
        Date expiration = extractClaim(token, Claims::getExpiration);
        logger.info("[JWT] Token expiration date: {}", expiration);
        return expiration;
    }

    private Claims extractAllClaims(String token) {
        logger.info("[JWT] Parsing claims from token");
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        logger.info("[JWT] Claims parsed successfully");
        return claims;
    }
} 