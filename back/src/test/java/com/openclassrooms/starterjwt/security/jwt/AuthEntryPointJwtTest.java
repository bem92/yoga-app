package com.openclassrooms.starterjwt.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AuthEntryPointJwtTest {
    
    private AuthEntryPointJwt authEntryPointJwt;
    private ObjectMapper objectMapper;
    
    @BeforeEach
    void setUp() {
        authEntryPointJwt = new AuthEntryPointJwt();
        objectMapper = new ObjectMapper();
    }
    
    @Test
    @DisplayName("Should handle authentication exception and return 401")
    void testCommence() throws Exception {  // IMPORTANT: throws Exception ici
        // Arrange
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServletPath("/api/test");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException authException = new BadCredentialsException("Unauthorized access");
        
        // Act
        authEntryPointJwt.commence(request, response, authException);
        
        // Assert
        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertEquals("application/json", response.getContentType());
        
        // Vérifier le contenu JSON de la réponse
        String responseBody = response.getContentAsString();
        Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);
        
        assertEquals(401, responseMap.get("status"));
        assertEquals("Unauthorized", responseMap.get("error"));
        assertEquals("Unauthorized access", responseMap.get("message"));
        assertEquals("/api/test", responseMap.get("path"));
    }
    
    @Test
    @DisplayName("Should handle different authentication exceptions")
    void testCommenceWithDifferentException() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setServletPath("/api/secure");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException authException = new BadCredentialsException("Invalid token");
        
        authEntryPointJwt.commence(request, response, authException);
        
        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertTrue(response.getContentAsString().contains("Invalid token"));
    }
}

