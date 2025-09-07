package com.openclassrooms.starterjwt.services;

// Import de l'entité User utilisée dans les tests.
import com.openclassrooms.starterjwt.models.User;
// Référentiel mocké pour simuler l'accès aux données.
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

// Extension Mockito permettant l'utilisation des annotations @Mock et @InjectMocks.
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository; // Dépendance simulée.

    @InjectMocks
    private UserService userService; // Service testé avec le repository injecté.

    @Test
    @DisplayName("Should delete user by id")
    void delete_shouldCallRepository() {
        userService.delete(1L); // Appel de la méthode à tester.
        verify(userRepository).deleteById(1L); // Vérifie l'appel au repository.
    }

    @Test
    @DisplayName("Should find user by id")
    void findById_shouldReturnUser() {
        User user = User.builder().id(1L).email("john@test.com").firstName("John").lastName("Doe").password("pwd").admin(false)
                .build(); // Création d'un utilisateur fictif.
        when(userRepository.findById(1L)).thenReturn(Optional.of(user)); // Le repository renvoie l'utilisateur.

        User result = userService.findById(1L); // Appel du service.
        assertThat(result).isEqualTo(user); // L'utilisateur récupéré doit être celui attendu.
    }

    @Test
    @DisplayName("Should return null when user not found")
    void findById_shouldReturnNull() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty()); // Aucun utilisateur trouvé.

        User result = userService.findById(1L); // Appel du service.
        assertThat(result).isNull(); // Le résultat doit être null.
    }
}

