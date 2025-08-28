package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TeacherMapperTest {

    @Autowired
    private TeacherMapper mapper;

    @Test
    @DisplayName("Should map TeacherDto to Teacher")
    void toEntity_shouldMapAllFields() {
        LocalDateTime now = LocalDateTime.now();
        TeacherDto dto = new TeacherDto(1L, "Doe", "John", now, now);

        Teacher entity = mapper.toEntity(dto);

        assertThat(entity.getId()).isEqualTo(1L);
        assertThat(entity.getLastName()).isEqualTo("Doe");
        assertThat(entity.getFirstName()).isEqualTo("John");
    }

    @Test
    @DisplayName("Should map Teacher to TeacherDto")
    void toDto_shouldMapAllFields() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = Teacher.builder()
                .id(1L)
                .lastName("Doe")
                .firstName("John")
                .createdAt(now)
                .updatedAt(now)
                .build();

        TeacherDto dto = mapper.toDto(teacher);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getLastName()).isEqualTo("Doe");
        assertThat(dto.getFirstName()).isEqualTo("John");
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("Should map lists of teachers")
    void shouldMapLists() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = Teacher.builder()
                .id(1L)
                .lastName("Doe")
                .firstName("John")
                .createdAt(now)
                .updatedAt(now)
                .build();
        TeacherDto dto = new TeacherDto(1L, "Doe", "John", now, now);

        assertThat(mapper.toDto(List.of(teacher))).containsExactly(dto);
        assertThat(mapper.toEntity(List.of(dto))).containsExactly(teacher);
    }

    @Test
    void toDto_nullTeacher_returnsNull() {
        assertThat(mapper.toDto((Teacher) null)).isNull();
    }

    @Test
    void toEntity_nullDto_returnsNull() {
        assertThat(mapper.toEntity((TeacherDto) null)).isNull();
    }

    @Test
    void toDto_nullList_returnsNull() {
        assertThat(mapper.toDto((List<Teacher>) null)).isNull();
    }

    @Test
    void toEntity_nullList_returnsNull() {
        assertThat(mapper.toEntity((List<TeacherDto>) null)).isNull();
    }
}
