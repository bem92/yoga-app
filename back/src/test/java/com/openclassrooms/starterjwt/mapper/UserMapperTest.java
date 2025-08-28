package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper mapper;

    @Test
    @DisplayName("Should map UserDto to User")
    void toEntity_shouldMapAllFields() {
        LocalDateTime now = LocalDateTime.now();
        UserDto dto = new UserDto(1L, "john@test.com", "Doe", "John", false, "pwd", now, now);

        User entity = mapper.toEntity(dto);

        assertThat(entity.getId()).isEqualTo(1L);
        assertThat(entity.getEmail()).isEqualTo("john@test.com");
        assertThat(entity.getLastName()).isEqualTo("Doe");
        assertThat(entity.getFirstName()).isEqualTo("John");
        assertThat(entity.isAdmin()).isFalse();
    }

    @Test
    @DisplayName("Should map User to UserDto")
    void toDto_shouldMapAllFields() {
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .id(1L)
                .email("john@test.com")
                .lastName("Doe")
                .firstName("John")
                .password("pwd")
                .admin(false)
                .createdAt(now)
                .updatedAt(now)
                .build();

        UserDto dto = mapper.toDto(user);

        assertThat(dto.getId()).isEqualTo(1L);
        assertThat(dto.getEmail()).isEqualTo("john@test.com");
        assertThat(dto.getLastName()).isEqualTo("Doe");
        assertThat(dto.getFirstName()).isEqualTo("John");
        assertThat(dto.getCreatedAt()).isEqualTo(now);
        assertThat(dto.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("Should map lists of users")
    void shouldMapLists() {
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .id(1L)
                .email("john@test.com")
                .lastName("Doe")
                .firstName("John")
                .password("pwd")
                .admin(false)
                .createdAt(now)
                .updatedAt(now)
                .build();
        UserDto dto = new UserDto(1L, "john@test.com", "Doe", "John", false, "pwd", now, now);

        assertThat(mapper.toDto(List.of(user))).containsExactly(dto);
        assertThat(mapper.toEntity(List.of(dto))).containsExactly(user);
    }

    @Test
    void toDto_nullUser_returnsNull() {
        assertThat(mapper.toDto((User) null)).isNull();
    }

    @Test
    void toEntity_nullDto_returnsNull() {
        assertThat(mapper.toEntity((UserDto) null)).isNull();
    }

    @Test
    void toDto_nullList_returnsNull() {
        assertThat(mapper.toDto((List<User>) null)).isNull();
    }

    @Test
    void toEntity_nullList_returnsNull() {
        assertThat(mapper.toEntity((List<UserDto>) null)).isNull();
    }
}
