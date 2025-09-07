package com.openclassrooms.starterjwt.models;

// Tests unitaires pour l'entité Session.
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

import static org.assertj.core.api.Assertions.assertThat;

class SessionTest {

    // Vérifie que le builder remplit correctement toutes les propriétés.
    @Test
    @DisplayName("Builder should create session with all fields")
    void builder_shouldCreateSession() {
        Teacher teacher = Teacher.builder().id(1L).lastName("Doe").firstName("John").build();
        Session session = Session.builder()
                .id(1L)
                .name("Yoga")
                .date(new Date())
                .description("desc")
                .teacher(teacher)
                .users(new ArrayList<>())
                .build();
        assertThat(session.getName()).isEqualTo("Yoga");
        assertThat(session.getTeacher()).isEqualTo(teacher);
    }

    // equals et hashCode doivent s'appuyer sur l'identifiant.
    @Test
    @DisplayName("equals should work on id")
    void equalsAndHashCode_shouldUseId() {
        Session s1 = new Session().setId(1L);
        Session s2 = new Session().setId(1L);
        Session s3 = new Session().setId(2L);
        assertThat(s1).isEqualTo(s2).isNotEqualTo(s3);
        assertThat(s1.hashCode()).isEqualTo(s2.hashCode());
    }

    @Test
    void hashCode_nullId_works() {
        Session session = new Session();
        // Vérifie que hashCode fonctionne même sans id.
        assertNotEquals(0, session.hashCode());
    }

    @Test
    void equals_bothNullId_returnsTrue() {
        Session session1 = new Session();
        Session session2 = new Session();
        assertThat(session1.equals(session2)).isTrue();
    }

    @Test
    void equals_differentIds_returnsFalse() {
        Session session1 = new Session();
        session1.setId(1L);
        Session session2 = new Session();
        session2.setId(2L);
        assertThat(session1.equals(session2)).isFalse();
    }

    @Test
    void equals_sameId_returnsTrue() {
        Session s1 = new Session();
        s1.setId(1L);
        Session s2 = new Session();
        s2.setId(1L);
        assertTrue(s1.equals(s2));
    }

    @Test
    void equals_oneNullOneNot_returnsFalse() {
        Session s1 = new Session();
        s1.setId(1L);
        Session s2 = new Session();
        assertFalse(s1.equals(s2));
    }

    @Test
    void equals_withSameObject_returnsTrue() {
        Session session = new Session();
        assertTrue(session.equals(session));
    }

    @Test
    @DisplayName("equals should return false when comparing to null")
    void equals_shouldReturnFalseWhenNull() {
        Session session = new Session();
        assertThat(session.equals(null)).isFalse();
    }

    @Test
    @DisplayName("equals should return false when classes differ")
    void equals_shouldReturnFalseWhenDifferentClass() {
        Session session = new Session();
        assertThat(session.equals("string")).isFalse();
    }

    @Test
    @DisplayName("toString should contain field values")
    void toString_shouldContainFields() {
        Session session = Session.builder().id(1L).name("Yoga").build();
        assertThat(session.toString()).contains("Yoga");
    }

    @Test
    @DisplayName("Should set createdAt and updatedAt")
    void setters_shouldHandleDates() {
        Session session = new Session();
        LocalDateTime now = LocalDateTime.now();
        session.setCreatedAt(now);
        session.setUpdatedAt(now);
        assertThat(session.getCreatedAt()).isEqualTo(now);
        assertThat(session.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testAllArgsConstructor() {
        Date date = new Date();
        Session session = new Session(1L, "name", date, "desc", null, new ArrayList<>(), null, null);
        assertEquals("name", session.getName());
    }

    @Test
    void testChainedSetters() {
        Session session = new Session()
            .setName("Test")
            .setDescription("Desc");
        assertEquals("Test", session.getName());
    }

    static class SessionSubClass extends Session {
        @Override
        protected boolean canEqual(Object other) {
            return false;
        }
    }

    @Test
    void equals_canEqualFalse_returnsFalse() {
        Session session = new Session();
        session.setId(1L);
        Session other = new SessionSubClass();
        other.setId(1L);
        assertThat(session.equals(other)).isFalse();
    }
}
