package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper; // Sérialisation/désérialisation JSON
import com.openclassrooms.starterjwt.models.User; // Entité User utilisée dans les tests
import com.openclassrooms.starterjwt.payload.request.LoginRequest; // DTO pour la connexion
import com.openclassrooms.starterjwt.payload.request.SignupRequest; // DTO pour l'inscription
import com.openclassrooms.starterjwt.repository.UserRepository; // Répertoire mocké
import com.openclassrooms.starterjwt.security.jwt.JwtUtils; // Utilitaire JWT mocké
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl; // Détails utilisateur utilisés pour l'authentification
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc; // Configure MockMvc automatiquement
import org.springframework.boot.test.context.SpringBootTest; // Lance le contexte Spring complet
import org.springframework.boot.test.mock.mockito.MockBean; // Permet de mocker des beans Spring
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc; // Client HTTP simulé

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*; // Utilitaires Mockito pour matcher les arguments
import static org.mockito.Mockito.*; // Méthodes Mockito (when, thenReturn...)
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post; // Construction de requêtes POST
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*; // Assertions sur la réponse

@SpringBootTest // Charge le contexte Spring complet
@AutoConfigureMockMvc // Prépare MockMvc pour les tests HTTP
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc; // Client HTTP simulé

    @Autowired
    private ObjectMapper objectMapper; // Pour convertir les objets en JSON

    @MockBean
    private AuthenticationManager authenticationManager; // Gestionnaire d'authentification mocké

    @MockBean
    private JwtUtils jwtUtils; // Utilitaire JWT mocké

    @MockBean
    private PasswordEncoder passwordEncoder; // Encodeur de mot de passe mocké

    @MockBean
    private UserRepository userRepository; // Répertoire d'utilisateurs mocké

    @BeforeEach
    void setUp() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder() // Création d'un utilisateur factice
            .id(1L)
            .username("test@test.com")
            .firstName("Test")
            .lastName("User")
            .admin(false)
            .password("encodedPassword")
            .build();

        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null); // Authentification simulée
        when(authenticationManager.authenticate(any())).thenReturn(auth); // Le manager renvoie notre authentification
        when(jwtUtils.generateJwtToken(any())).thenReturn("fake-jwt-token"); // Génération d'un token fictif
    }

    @Test
    @DisplayName("Should login successfully")
    void testLogin_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password");

        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setAdmin(false);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user)); // L'utilisateur existe en base

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))) // Envoie de la requête
            .andExpect(status().isOk()) // Doit réussir
            .andExpect(jsonPath("$.token").value("fake-jwt-token")); // Le token renvoyé est celui du mock
    }

    @Test
    void login_whenUserIsAdmin_returnsAdminTrue() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("admin@test.com");
        loginRequest.setPassword("password");

        User user = new User();
        user.setId(1L);
        user.setEmail("admin@test.com");
        user.setAdmin(true);

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("admin@test.com")
                .firstName("Admin")
                .lastName("User")
                .admin(true)
                .password("encodedPassword")
                .build();
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admin").value(true)); // Vérifie que le champ admin est vrai
    }

    @Test
    void login_whenUserIsNotAdmin_returnsAdminFalse() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@test.com");
        loginRequest.setPassword("password");

        User user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");
        user.setAdmin(false);

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("user@test.com")
                .firstName("Test")
                .lastName("User")
                .admin(false)
                .password("encodedPassword")
                .build();
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admin").value(false)); // L'utilisateur n'est pas admin
    }

    @Test
    void login_whenUserNotFoundInRepo_returnsAdminFalse() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nouser@test.com");
        loginRequest.setPassword("password");

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("nouser@test.com")
                .firstName("Test")
                .lastName("User")
                .admin(false)
                .password("encodedPassword")
                .build();
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByEmail("nouser@test.com")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admin").value(false)); // Par défaut false si utilisateur inconnu
    }

    @Test
    @DisplayName("Should return unauthorized for bad credentials")
    void testLogin_BadCredentials() throws Exception {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials")); // Simulation d'échec d'authentification

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("bad@test.com");
        loginRequest.setPassword("bad");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isUnauthorized()); // Statut 401 attendu
    }

    @Test
    @DisplayName("Should register user successfully")
    void testRegister_Success() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("new@test.com");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");
        signupRequest.setPassword("password");

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false); // Email disponible
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword"); // Mot de passe encodé

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    @DisplayName("Should return error when email already taken")
    void testRegister_EmailTaken() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("taken@test.com");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");
        signupRequest.setPassword("password");

        when(userRepository.existsByEmail("taken@test.com")).thenReturn(true); // Email déjà utilisé

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }
}

