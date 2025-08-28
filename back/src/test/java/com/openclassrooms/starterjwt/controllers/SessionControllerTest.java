package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import org.mockito.Mockito;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.hasSize;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private SessionMapper sessionMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Session session;
    private SessionDto sessionDto;
    private Teacher teacher;

    @BeforeEach
    void setUp() {
        teacher = Teacher.builder()
            .id(1L)
            .firstName("John")
            .lastName("Doe")
            .build();

        session = Session.builder()
            .id(1L)
            .name("Morning Yoga")
            .description("A relaxing morning session")
            .date(new Date())
            .teacher(teacher)
            .users(new ArrayList<>())
            .build();

        sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setName("Morning Yoga");
        sessionDto.setDescription("A relaxing morning session");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(new ArrayList<>());
    }

    @Test
    @DisplayName("Should return all sessions")
    @WithMockUser
    void testFindAll_Success() throws Exception {
        List<Session> sessions = Arrays.asList(session);
        List<SessionDto> sessionDtos = Arrays.asList(sessionDto);
        
        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        mockMvc.perform(get("/api/session"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].name").value("Morning Yoga"));
        
        verify(sessionService, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return session by id")
    @WithMockUser
    void testFindById_Success() throws Exception {
        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(Mockito.any(Session.class))).thenReturn(sessionDto);

        mockMvc.perform(get("/api/session/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Morning Yoga"));
        
        verify(sessionService, times(1)).getById(1L);
    }

    @Test
    @DisplayName("Should return 404 when session not found")
    @WithMockUser
    void testFindById_NotFound() throws Exception {
        when(sessionService.getById(999L)).thenReturn(null);

        mockMvc.perform(get("/api/session/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return 400 for invalid id format")
    @WithMockUser
    void testFindById_BadRequest() throws Exception {
        mockMvc.perform(get("/api/session/invalid"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should create session successfully")
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void testCreate_Success() throws Exception {
        when(sessionMapper.toEntity(Mockito.any(SessionDto.class))).thenReturn(session);
        when(sessionService.create(Mockito.any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(Mockito.any(Session.class))).thenReturn(sessionDto);

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Morning Yoga"));
    }

    @Test
    @DisplayName("Should update session successfully")
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void testUpdate_Success() throws Exception {
        when(sessionMapper.toEntity(Mockito.any(SessionDto.class))).thenReturn(session);
        when(sessionService.update(Mockito.eq(1L), Mockito.any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(Mockito.any(Session.class))).thenReturn(sessionDto);

        mockMvc.perform(put("/api/session/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should delete session successfully")
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void testDelete_Success() throws Exception {
        when(sessionService.getById(1L)).thenReturn(session);
        doNothing().when(sessionService).delete(1L);

        mockMvc.perform(delete("/api/session/1"))
            .andExpect(status().isOk());
        
        verify(sessionService, times(1)).delete(1L);
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existent session")
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void testDelete_NotFound() throws Exception {
        when(sessionService.getById(999L)).thenReturn(null);

        mockMvc.perform(delete("/api/session/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Create session should be allowed for non-admin users")
    @WithMockUser
    void testCreate_AllowedForNonAdmin() throws Exception {
        when(sessionMapper.toEntity(Mockito.any(SessionDto.class))).thenReturn(session);
        when(sessionService.create(Mockito.any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(Mockito.any(Session.class))).thenReturn(sessionDto);

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Morning Yoga"));
    }

    @Test
    @DisplayName("Update session should be allowed for non-admin users")
    @WithMockUser
    void testUpdate_AllowedForNonAdmin() throws Exception {
        when(sessionMapper.toEntity(Mockito.any(SessionDto.class))).thenReturn(session);
        when(sessionService.update(Mockito.eq(1L), Mockito.any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(Mockito.any(Session.class))).thenReturn(sessionDto);

        mockMvc.perform(put("/api/session/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionDto)))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Delete session should be allowed for non-admin users")
    @WithMockUser
    void testDelete_AllowedForNonAdmin() throws Exception {
        when(sessionService.getById(1L)).thenReturn(session);
        doNothing().when(sessionService).delete(1L);

        mockMvc.perform(delete("/api/session/1"))
            .andExpect(status().isOk());

        verify(sessionService, times(1)).delete(1L);
    }

    @Test
    @DisplayName("Should participate in session successfully")
    @WithMockUser
    void testParticipate_Success() throws Exception {
        doNothing().when(sessionService).participate(1L, 2L);

        mockMvc.perform(post("/api/session/1/participate/2"))
            .andExpect(status().isOk());
        
        verify(sessionService, times(1)).participate(1L, 2L);
    }

    @Test
    @DisplayName("Should return 400 for invalid participation ids")
    @WithMockUser
    void testParticipate_BadRequest() throws Exception {
        mockMvc.perform(post("/api/session/invalid/participate/invalid"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should remove participation successfully")
    @WithMockUser
    void testNoLongerParticipate_Success() throws Exception {
        doNothing().when(sessionService).noLongerParticipate(1L, 2L);

        mockMvc.perform(delete("/api/session/1/participate/2"))
            .andExpect(status().isOk());
        
        verify(sessionService, times(1)).noLongerParticipate(1L, 2L);
    }

    @Test
    @DisplayName("Should return empty list when no sessions")
    @WithMockUser
    void testFindAll_EmptyList() throws Exception {
        when(sessionService.findAll()).thenReturn(new ArrayList<>());
        when(sessionMapper.toDto(Mockito.anyList())).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/api/session"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("Should return 400 when creating session with invalid data")
    @WithMockUser(username = "admin@test.com", roles = {"ADMIN"})
    void testCreate_ValidationError() throws Exception {
        SessionDto invalidDto = new SessionDto();

        mockMvc.perform(post("/api/session")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
            .andExpect(status().isBadRequest());
    }
}

