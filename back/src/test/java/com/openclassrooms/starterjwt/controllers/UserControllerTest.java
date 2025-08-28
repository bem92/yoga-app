package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserMapper userMapper;

    private User user;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        user = new User("john@test.com", "Doe", "John", "pwd", false);
        user.setId(1L);
        userDto = new UserDto(1L, "john@test.com", "Doe", "John", false, "pwd", null, null);
    }

    @Test
    @DisplayName("Should find user by id")
    @WithMockUser
    void testFindById_Success() throws Exception {
        when(userService.findById(anyLong())).thenReturn(user);
        when(userMapper.toDto(any(User.class))).thenReturn(userDto);

        mockMvc.perform(get("/api/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("john@test.com"));
    }

    @Test
    @DisplayName("Should return 404 when user not found")
    @WithMockUser
    void testFindById_NotFound() throws Exception {
        when(userService.findById(anyLong())).thenReturn(null);

        mockMvc.perform(get("/api/user/1"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return 400 when id invalid")
    @WithMockUser
    void testFindById_BadRequest() throws Exception {
        mockMvc.perform(get("/api/user/invalid"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should delete user successfully")
    @WithMockUser(username = "john@test.com")
    void testDelete_Success() throws Exception {
        when(userService.findById(anyLong())).thenReturn(user);
        doNothing().when(userService).delete(1L);

        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isOk());

        verify(userService, times(1)).delete(1L);
    }

    @Test
    @DisplayName("Should return unauthorized when deleting another user")
    @WithMockUser(username = "other@test.com")
    void testDelete_Unauthorized() throws Exception {
        when(userService.findById(anyLong())).thenReturn(user);

        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return 404 when user to delete not found")
    @WithMockUser(username = "john@test.com")
    void testDelete_NotFound() throws Exception {
        when(userService.findById(anyLong())).thenReturn(null);

        mockMvc.perform(delete("/api/user/1"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return 400 when deleting with invalid id")
    @WithMockUser(username = "john@test.com")
    void testDelete_BadRequest() throws Exception {
        mockMvc.perform(delete("/api/user/invalid"))
            .andExpect(status().isBadRequest());
    }
}

