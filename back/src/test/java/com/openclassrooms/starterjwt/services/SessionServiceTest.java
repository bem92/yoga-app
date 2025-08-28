package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private Session session;
    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .email("john.doe@test.com")
                .lastName("Doe")
                .firstName("John")
                .password("password")
                .admin(false)
                .build();

        session = Session.builder()
                .id(1L)
                .name("Morning Yoga")
                .date(new Date())
                .description("description")
                .users(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Should create session successfully")
    void create_shouldSaveSession() {
        when(sessionRepository.save(session)).thenReturn(session);

        Session result = sessionService.create(session);

        assertThat(result).isEqualTo(session);
        verify(sessionRepository).save(session);
    }

    @Test
    @DisplayName("Should delete session by id")
    void delete_shouldCallRepository() {
        Long id = 1L;

        sessionService.delete(id);

        verify(sessionRepository).deleteById(id);
    }

    @Test
    @DisplayName("Should find all sessions")
    void findAll_shouldReturnSessions() {
        when(sessionRepository.findAll()).thenReturn(List.of(session));

        List<Session> result = sessionService.findAll();

        assertThat(result).containsExactly(session);
        verify(sessionRepository).findAll();
    }

    @Test
    void getById_existingId_returnsSession() {
        Session session = new Session();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        assertEquals(session, sessionService.getById(1L));
    }

    @Test
    void getById_nonExistingId_returnsNull() {
        when(sessionRepository.findById(999L)).thenReturn(Optional.empty());
        assertNull(sessionService.getById(999L));
    }

    @Test
    @DisplayName("Should update session with given id")
    void update_shouldSetIdAndSave() {
        Session toUpdate = Session.builder()
                .name("New Yoga")
                .date(new Date())
                .description("desc")
                .users(new ArrayList<>())
                .build();
        Session saved = Session.builder()
                .id(2L)
                .name("New Yoga")
                .date(new Date())
                .description("desc")
                .users(new ArrayList<>())
                .build();
        when(sessionRepository.save(any(Session.class))).thenReturn(saved);

        Session result = sessionService.update(2L, toUpdate);

        ArgumentCaptor<Session> captor = ArgumentCaptor.forClass(Session.class);
        verify(sessionRepository).save(captor.capture());
        Session captured = captor.getValue();

        assertThat(captured.getId()).isEqualTo(2L);
        assertThat(result).isEqualTo(saved);
    }

    @Test
    @DisplayName("Should add user to session")
    void participate_shouldAddUser() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        sessionService.participate(1L, 1L);

        assertThat(session.getUsers()).containsExactly(user);
        verify(sessionRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(sessionRepository).save(session);
    }

    @Test
    @DisplayName("Should throw NotFoundException when session not found")
    void participate_shouldThrowNotFoundWhenSessionMissing() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> sessionService.participate(1L, 1L))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw NotFoundException when user not found")
    void participate_shouldThrowNotFoundWhenUserMissing() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.participate(1L, 1L))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(sessionRepository, never()).save(any());
    }

    @Test
    void participate_bothMissing_throwNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> sessionService.participate(1L, 1L))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException when user already participates")
    void participate_shouldThrowBadRequestWhenAlreadyParticipates() {
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> sessionService.participate(1L, 1L))
                .isInstanceOf(BadRequestException.class);
        verify(sessionRepository).findById(1L);
        verify(userRepository).findById(1L);
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should remove user from session")
    void noLongerParticipate_shouldRemoveUser() {
        session.getUsers().add(user);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, 1L);

        assertThat(session.getUsers()).doesNotContain(user);
        verify(sessionRepository).findById(1L);
        verify(sessionRepository).save(session);
    }

    @Test
    @DisplayName("Should throw NotFoundException when session does not exist")
    void noLongerParticipate_shouldThrowNotFoundWhenSessionMissing() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 1L))
                .isInstanceOf(NotFoundException.class);
        verify(sessionRepository).findById(1L);
        verify(sessionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException when user not participating")
    void noLongerParticipate_shouldThrowBadRequestWhenUserNotParticipating() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 1L))
                .isInstanceOf(BadRequestException.class);
        verify(sessionRepository).findById(1L);
        verify(sessionRepository, never()).save(any());
    }
}
