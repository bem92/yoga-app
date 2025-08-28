package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionMapperTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private SessionMapperImpl sessionMapper;

    @Test
    @DisplayName("toEntity should map teacher and users")
    void toEntity_shouldMapRelations() {
        SessionDto dto = new SessionDto();
        dto.setName("Session");
        dto.setTeacher_id(1L);
        dto.setUsers(Arrays.asList(2L));

        Teacher teacher = Teacher.builder().id(1L).firstName("T").lastName("L").build();
        User user = new User("user@test.com", "Doe", "John", "password", false);
        user.setId(2L);
        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(2L)).thenReturn(user);

        Session session = sessionMapper.toEntity(dto);
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).containsExactly(user);
    }

    @Test
    @DisplayName("toEntity should handle nulls")
    void toEntity_shouldHandleNulls() {
        SessionDto dto = new SessionDto();
        dto.setName("Session");
        dto.setTeacher_id(null);
        dto.setUsers(null);

        Session session = sessionMapper.toEntity(dto);
        assertThat(session.getTeacher()).isNull();
        assertThat(session.getUsers()).isEmpty();
    }

    @Test
    @DisplayName("toEntity should return null teacher when teacher_id is null")
    void toEntity_withNullTeacherId_returnsNullTeacher() {
        SessionDto dto = new SessionDto();
        dto.setTeacher_id(null);
        dto.setUsers(Arrays.asList(1L));

        User user = new User("user@test.com", "Doe", "John", "password", false);
        user.setId(1L);
        when(userService.findById(1L)).thenReturn(user);

        Session session = sessionMapper.toEntity(dto);
        assertThat(session.getTeacher()).isNull();
        assertThat(session.getUsers()).containsExactly(user);
    }

    @Test
    @DisplayName("toEntity should return empty user list when users is null")
    void toEntity_withNullUsers_returnsEmptyList() {
        SessionDto dto = new SessionDto();
        dto.setTeacher_id(1L);
        dto.setUsers(null);

        Teacher teacher = Teacher.builder().id(1L).firstName("T").lastName("L").build();
        when(teacherService.findById(1L)).thenReturn(teacher);

        Session session = sessionMapper.toEntity(dto);
        assertThat(session.getUsers()).isEmpty();
        assertThat(session.getTeacher()).isEqualTo(teacher);
    }

    @Test
    @DisplayName("toDto should map teacher and users")
    void toDto_shouldMapRelations() {
        Teacher teacher = Teacher.builder().id(1L).firstName("T").lastName("L").build();
        User user = new User("user@test.com", "Doe", "John", "password", false);
        user.setId(2L);
        Session session = Session.builder()
                .id(1L)
                .name("Session")
                .description("desc")
                .date(new Date())
                .teacher(teacher)
                .users(List.of(user))
                .build();

        SessionDto dto = sessionMapper.toDto(session);
        assertThat(dto.getTeacher_id()).isEqualTo(1L);
        assertThat(dto.getUsers()).containsExactly(2L);
    }

    @Test
    void toEntity_nullInput_returnsNull() {
        assertNull(sessionMapper.toEntity((SessionDto) null));
    }

    @Test
    void toDto_nullInput_returnsNull() {
        assertNull(sessionMapper.toDto((Session) null));
    }

    @Test
    @DisplayName("toDto should handle nulls")
    void toDto_shouldHandleNulls() {
        Session session = Session.builder()
                .id(1L)
                .name("Session")
                .description("desc")
                .date(new Date())
                .teacher(null)
                .users(null)
                .build();

        SessionDto dto = sessionMapper.toDto(session);
        assertThat(dto.getTeacher_id()).isNull();
        assertThat(dto.getUsers()).isEmpty();
    }

    @Test
    void toDto_teacherWithoutId_returnsNullTeacherId() {
        Teacher teacher = Teacher.builder().id(null).firstName("T").lastName("L").build();
        Session session = Session.builder().teacher(teacher).build();
        SessionDto dto = sessionMapper.toDto(session);
        assertThat(dto.getTeacher_id()).isNull();
    }

    @Test
    void toEntity_allFieldsNull_handlesGracefully() {
        SessionDto dto = new SessionDto();
        Session result = sessionMapper.toEntity(dto);
        assertNotNull(result);
        assertNull(result.getTeacher());
        assertTrue(result.getUsers().isEmpty());
    }

    @Test
    void toDto_nullTeacher_mapsToNullTeacherId() {
        Session session = Session.builder()
            .id(1L)
            .teacher(null)
            .users(null)
            .build();
        SessionDto result = sessionMapper.toDto(session);
        assertNull(result.getTeacher_id());
    }

    @Test
    void toEntity_invalidUserId_resultsInListWithNull() {
        SessionDto dto = new SessionDto();
        dto.setUsers(Arrays.asList(999L));
        when(userService.findById(999L)).thenReturn(null);
        Session result = sessionMapper.toEntity(dto);
        assertThat(result.getUsers()).containsExactly((User) null);
    }

    @Test
    void toEntity_teacherNotFound_returnsNullTeacher() {
        SessionDto dto = new SessionDto();
        dto.setTeacher_id(1L);
        when(teacherService.findById(1L)).thenReturn(null);
        Session session = sessionMapper.toEntity(dto);
        assertThat(session.getTeacher()).isNull();
    }

    @Test
    void toEntity_listNull_returnsNull() {
        assertNull(sessionMapper.toEntity((List<SessionDto>) null));
    }

    @Test
    void toDto_listNull_returnsNull() {
        assertNull(sessionMapper.toDto((List<Session>) null));
    }

    @Test
    void toEntity_list_mapsElements() {
        SessionDto dto = new SessionDto();
        dto.setName("A");
        List<Session> sessions = sessionMapper.toEntity(List.of(dto));
        assertThat(sessions).hasSize(1);
    }

    @Test
    void toDto_list_mapsElements() {
        Session session = Session.builder().name("A").build();
        List<SessionDto> dtos = sessionMapper.toDto(List.of(session));
        assertThat(dtos).hasSize(1);
    }

    @Test
    void toEntity_mixedValidAndInvalidUsers_includesNullForMissingOnes() {
        SessionDto dto = new SessionDto();
        dto.setUsers(Arrays.asList(1L, 2L));

        User user = new User("user@test.com", "Doe", "John", "password", false);
        user.setId(1L);
        when(userService.findById(1L)).thenReturn(user);
        when(userService.findById(2L)).thenReturn(null);

        Session result = sessionMapper.toEntity(dto);
        assertThat(result.getUsers()).containsExactly(user, null);
    }
}
