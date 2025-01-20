package dev.asmaa.ResidenceETU.filter;

import dev.asmaa.ResidenceETU.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.lang.NonNull;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil; // Injection de l'utilitaire JWT

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, // Requête HTTP
            @NonNull HttpServletResponse response, // Réponse HTTP
            @NonNull FilterChain chain // Chaîne de filtres
    )
            throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization"); // Récupération de l'en-tête d'autorisation

        // Vérifie si l'en-tête d'autorisation est présent et commence par "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // Extraction du token (en retirant "Bearer ")
            String username = jwtUtil.extractUsername(token); // Extraction du nom d'utilisateur à partir du token

            // Vérifie si le nom d'utilisateur est non nul et si l'authentification n'est pas déjà définie
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Création d'un token d'authentification
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, null);
                SecurityContextHolder.getContext().setAuthentication(authToken); // Définit l'authentification dans le contexte de sécurité
            }
        }

        chain.doFilter(request, response); // Poursuit la chaîne de filtres
    }
}
