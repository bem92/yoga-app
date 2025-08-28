package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collection;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class UserDetailsImplTest {

    private UserDetailsImpl build(Long id) {
        return UserDetailsImpl.builder()
                .id(id)
                .username("user@test.com")
                .password("pwd")
                .admin(false)
                .firstName("John")
                .lastName("Doe")
                .build();
    }

    @Test
    @DisplayName("equals should return true when ids match")
    void equals_sameId_true() {
        UserDetailsImpl u1 = build(1L);
        UserDetailsImpl u2 = build(1L);
        assertThat(u1).isEqualTo(u2);
    }

    @Test
    @DisplayName("equals should return false when ids differ")
    void equals_differentId_false() {
        UserDetailsImpl u1 = build(1L);
        UserDetailsImpl u2 = build(2L);
        assertThat(u1).isNotEqualTo(u2);
    }

    @Test
    @DisplayName("equals should return false when one id is null and the other not")
    void equals_nullVsNonNull_false() {
        UserDetailsImpl u1 = build(null);
        UserDetailsImpl u2 = build(2L);
        assertThat(u1).isNotEqualTo(u2);
    }

    @Test
    @DisplayName("equals should return true when both ids are null")
    void equals_bothNull_true() {
        UserDetailsImpl u1 = build(null);
        UserDetailsImpl u2 = build(null);
        assertThat(u1).isEqualTo(u2);
    }

    @Test
    void equals_sameObject_returnsTrue() {
        UserDetailsImpl u1 = build(1L);
        assertThat(u1.equals(u1)).isTrue();
    }

    @Test
    void equals_null_returnsFalse() {
        UserDetailsImpl u1 = build(1L);
        assertThat(u1.equals(null)).isFalse();
    }

    @Test
    void equals_differentClass_returnsFalse() {
        UserDetailsImpl u1 = build(1L);
        assertThat(u1.equals("test")).isFalse();
    }

    @Test
    @DisplayName("getters and default booleans should work")
    void getters_work() {
        UserDetailsImpl details = build(1L);
        assertThat(details.getUsername()).isEqualTo("user@test.com");
        assertThat(details.getPassword()).isEqualTo("pwd");
        Collection<?> authorities = details.getAuthorities();
        assertThat(authorities).isEmpty();
        assertThat(details.isAccountNonExpired()).isTrue();
        assertThat(details.isAccountNonLocked()).isTrue();
        assertThat(details.isCredentialsNonExpired()).isTrue();
        assertThat(details.isEnabled()).isTrue();
    }
}
