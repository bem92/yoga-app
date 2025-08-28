package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    @Test
    @DisplayName("Constructor should set non null fields")
    void constructor_shouldSetFields() {
        User user = new User("mail@test.com", "Doe", "John", "pwd", false);
        assertThat(user.getEmail()).isEqualTo("mail@test.com");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getPassword()).isEqualTo("pwd");
        assertThat(user.isAdmin()).isFalse();
    }

    @Test
    @DisplayName("equals should return true for same id")
    void equals_sameId_returnsTrue() {
        User u1 = new User();
        u1.setId(1L);
        User u2 = new User();
        u2.setId(1L);
        assertThat(u1).isEqualTo(u2);
    }

    @Test
    @DisplayName("equals should return false for different id")
    void equals_differentId_returnsFalse() {
        User u1 = new User();
        u1.setId(1L);
        User u2 = new User();
        u2.setId(2L);
        assertThat(u1).isNotEqualTo(u2);
    }

    @Test
    void equals_bothNullId_returnsTrue() {
        User user1 = new User();
        User user2 = new User();
        assertThat(user1.equals(user2)).isTrue();
    }

    @Test
    void equals_oneWithIdOneWithout_returnsFalse() {
        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        assertThat(user1.equals(user2)).isFalse();
    }

    @Test
    void equals_withSameObject_returnsTrue() {
        User user = new User();
        assertTrue(user.equals(user));
    }

    @Test
    @DisplayName("equals should return false when comparing to null")
    void equals_withNull_returnsFalse() {
        User user = new User();
        assertThat(user.equals(null)).isFalse();
    }

    @Test
    @DisplayName("equals should return false when classes differ")
    void equals_differentClass_returnsFalse() {
        User user = new User();
        assertThat(user.equals("string")).isFalse();
    }

    @Test
    @DisplayName("Builder should create user")
    void builder_shouldCreateUser() {
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .id(1L)
                .email("mail@test.com")
                .lastName("Doe")
                .firstName("John")
                .password("pwd")
                .admin(true)
                .createdAt(now)
                .updatedAt(now)
                .build();
        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.isAdmin()).isTrue();
    }

    @Test
    void testConstructorWithNonNullFields() {
        User user = new User("email@test.com", "Last", "First", "pass", true);
        assertEquals("email@test.com", user.getEmail());
        assertTrue(user.isAdmin());
    }

    @Test
    void testSettersAndGetters() {
        User user = new User();
        LocalDateTime now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
    }

    @Test
    void testToString() {
        User user = new User();
        user.setEmail("test@test.com");
        assertTrue(user.toString().contains("test@test.com"));
    }

    @Test
    void hashCode_sameId_sameHash() {
        User u1 = new User();
        u1.setId(1L);
        User u2 = new User();
        u2.setId(1L);
        assertEquals(u1.hashCode(), u2.hashCode());
    }

    @Test
    void hashCode_nullId_works() {
        User user = new User();
        // should not throw and provide consistent value when id is null
        assertNotEquals(0, user.hashCode());
    }

    @Test
    void setters_nullValues_throwException() {
        User user = new User();
        assertThrows(NullPointerException.class, () -> user.setEmail(null));
        assertThrows(NullPointerException.class, () -> user.setLastName(null));
        assertThrows(NullPointerException.class, () -> user.setFirstName(null));
        assertThrows(NullPointerException.class, () -> user.setPassword(null));
    }

    @Test
    void builder_nullValues_throwException() {
        assertThrows(NullPointerException.class, () -> User.builder().email(null));
        assertThrows(NullPointerException.class, () -> User.builder().lastName(null));
        assertThrows(NullPointerException.class, () -> User.builder().firstName(null));
        assertThrows(NullPointerException.class, () -> User.builder().password(null));
    }

    static class UserSubClass extends User {
        @Override
        protected boolean canEqual(Object other) {
            return false;
        }
    }

    @Test
    void equals_canEqualFalse_returnsFalse() {
        User user = new User();
        user.setId(1L);
        User other = new UserSubClass();
        other.setId(1L);
        assertThat(user.equals(other)).isFalse();
    }
}
