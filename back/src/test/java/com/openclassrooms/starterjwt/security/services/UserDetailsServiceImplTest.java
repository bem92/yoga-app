package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl service;

    @Test
    @DisplayName("Should load user by username")
    void loadUserByUsername_success() {
        User user = User.builder()
                .id(1L)
                .email("john@test.com")
                .lastName("Doe")
                .firstName("John")
                .password("pwd")
                .admin(false)
                .build();
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.of(user));

        assertThat(service.loadUserByUsername("john@test.com").getUsername()).isEqualTo("john@test.com");
    }

    @Test
    @DisplayName("Should throw when user not found")
    void loadUserByUsername_userNotFound() {
        when(userRepository.findByEmail("john@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.loadUserByUsername("john@test.com"))
                .isInstanceOf(UsernameNotFoundException.class);
    }
}
