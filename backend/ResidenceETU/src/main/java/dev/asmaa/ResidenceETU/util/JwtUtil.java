package dev.asmaa.ResidenceETU.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Service
public class JwtUtil {

    // Read secret key and expiration time from configuration
    @Value("${jwt.secret.key}") // Pass a Base64-encoded key
    private String secretKey;

    @Value("${jwt.token.expiration}") // Default 10 hours (in milliseconds) if not specified
    private Long expirationTime;

    private Key signingKey;

    // Initialize the signing key
    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("The secret key is not sufficiently long. Minimum length: 256 bits (32 bytes).");
        }
        signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate a JWT Token with username, role, and userId
     */
    public String generateToken(String username, String role, Long userId) {
        return Jwts.builder()
                .claim("role", role)          // Add role claim
                .claim("userId", userId)      // Add userId claim
                .setSubject(username)         // Add subject (username)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Issue time
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Expiration time
                .signWith(signingKey, SignatureAlgorithm.HS256) // Sign with key and algorithm
                .compact(); // Generate token
    }

    /**
     * Extract all claims from a JWT Token
     */
    public Claims extractClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(signingKey) // Set the signing key
                    .build()
                    .parseClaimsJws(token)    // Parse the token
                    .getBody();               // Extract the token body
        } catch (JwtException e) {
            // Log and handle the exception (logging can be added if required)
            throw new IllegalStateException("Invalid JWT token", e);
        }
    }

    /**
     * Extract the username (subject) from a JWT Token
     */
    public String extractUsername(String token) {
        return extractClaims(token).getSubject(); // The subject is the username
    }

    /**
     * Extract the role from a JWT Token
     */
    public String extractRole(String token) {
        return (String) extractClaims(token).get("role"); // Extract "role" claim
    }

    /**
     * Extract the userId from a JWT Token
     */
    public Long extractUserId(String token) {
        return ((Number) extractClaims(token).get("userId")).longValue(); // Extract "userId" claim
    }

    /**
     * Check if a JWT Token is expired
     */
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date()); // Compare expiration date
    }
}