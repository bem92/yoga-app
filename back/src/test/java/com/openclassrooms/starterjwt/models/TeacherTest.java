package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

import static org.assertj.core.api.Assertions.assertThat;

class TeacherTest {

    @Test
    @DisplayName("Builder should create teacher")
    void builder_shouldCreateTeacher() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = Teacher.builder()
                .id(1L)
                .lastName("Doe")
                .firstName("John")
                .createdAt(now)
                .updatedAt(now)
                .build();
        assertThat(teacher.getFirstName()).isEqualTo("John");
        assertThat(teacher.getCreatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("equals should depend on id only")
    void equals_shouldUseIdOnly() {
        Teacher t1 = new Teacher().setId(1L);
        Teacher t2 = new Teacher().setId(1L);
        Teacher t3 = new Teacher().setId(2L);
        assertThat(t1).isEqualTo(t2).isNotEqualTo(t3);
    }

    @Test
    void equals_bothNullId_returnsTrue() {
        Teacher teacher1 = new Teacher();
        Teacher teacher2 = new Teacher();
        assertThat(teacher1.equals(teacher2)).isTrue();
    }

    @Test
    void equals_mixedNullAndNotNull_returnsFalse() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(5L);
        Teacher teacher2 = new Teacher();
        assertThat(teacher1.equals(teacher2)).isFalse();
    }

    @Test
    void equals_withSameObject_returnsTrue() {
        Teacher teacher = new Teacher();
        assertTrue(teacher.equals(teacher));
    }

    @Test
    @DisplayName("equals should return false when comparing to null")
    void equals_shouldReturnFalseWhenNull() {
        Teacher teacher = new Teacher();
        assertThat(teacher.equals(null)).isFalse();
    }

    @Test
    @DisplayName("equals should return false when classes differ")
    void equals_shouldReturnFalseWhenDifferentClass() {
        Teacher teacher = new Teacher();
        assertThat(teacher.equals("string")).isFalse();
    }

    @Test
    @DisplayName("toString should contain names")
    void toString_shouldContainNames() {
        Teacher teacher = Teacher.builder().id(1L).firstName("John").lastName("Doe").build();
        assertThat(teacher.toString()).contains("John");
    }

    @Test
    @DisplayName("Setters should handle dates")
    void setters_shouldHandleDates() {
        Teacher teacher = new Teacher();
        LocalDateTime now = LocalDateTime.now();
        teacher.setCreatedAt(now);
        teacher.setUpdatedAt(now);
        assertThat(teacher.getCreatedAt()).isEqualTo(now);
        assertThat(teacher.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testBuilderPattern() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = Teacher.builder()
            .id(1L)
            .firstName("John")
            .lastName("Doe")
            .createdAt(now)
            .updatedAt(now)
            .build();
        assertEquals("John", teacher.getFirstName());
    }

    @Test
    void hashCode_sameId_sameHash() {
        Teacher t1 = new Teacher().setId(1L);
        Teacher t2 = new Teacher().setId(1L);
        assertEquals(t1.hashCode(), t2.hashCode());
    }

    @Test
    void hashCode_nullId_works() {
        Teacher teacher = new Teacher();
        // hashCode should execute and return a consistent value even if id is null
        assertNotEquals(0, teacher.hashCode());
    }

    static class TeacherSubClass extends Teacher {
        @Override
        protected boolean canEqual(Object other) {
            return false;
        }
    }

    @Test
    void equals_canEqualFalse_returnsFalse() {
        Teacher t1 = new Teacher().setId(1L);
        Teacher t2 = new TeacherSubClass().setId(1L);
        assertThat(t1.equals(t2)).isFalse();
    }
}
