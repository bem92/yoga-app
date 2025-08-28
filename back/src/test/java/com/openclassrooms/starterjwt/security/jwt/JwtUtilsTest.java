package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class JwtUtilsTest {

    @Autowired
    private JwtUtils jwtUtils;

    private UserDetailsImpl userDetails;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        userDetails = UserDetailsImpl.builder()
            .id(1L)
            .username("test@test.com")
            .firstName("Test")
            .lastName("User")
            .admin(true)
            .password("password")
            .build();

        authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "testSecret");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000);
    }

    @Test
    @DisplayName("Should generate valid JWT token")
    void testGenerateJwtToken() {
        String token = jwtUtils.generateJwtToken(authentication);

        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    @DisplayName("Should extract username from token")
    void testGetUserNameFromJwtToken() {
        String token = jwtUtils.generateJwtToken(authentication);
        String username = jwtUtils.getUserNameFromJwtToken(token);

        assertThat(username).isEqualTo("test@test.com");
    }

    @Test
    @DisplayName("Should validate correct token")
    void testValidateJwtToken_Valid() {
        String token = jwtUtils.generateJwtToken(authentication);
        boolean isValid = jwtUtils.validateJwtToken(token);

        assertThat(isValid).isTrue();
    }

    @Test
    void validateJwtToken_withMalformedJwtException() {
        boolean isValid = jwtUtils.validateJwtToken("malformed");
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("validateJwtToken should return false for expired token")
    void validateJwtToken_expiredToken() {
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 1);
        String token = jwtUtils.generateJwtToken(authentication);

        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        boolean isValid = jwtUtils.validateJwtToken(token);
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_withUnsupportedJwtException() {
        String unsignedToken = Jwts.builder().setSubject("test").compact();
        boolean isValid = jwtUtils.validateJwtToken(unsignedToken);
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_withIllegalArgumentException() {
        boolean isValid = jwtUtils.validateJwtToken("");
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_withSignatureException() {
        String token = jwtUtils.generateJwtToken(authentication);
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "otherSecret");
        boolean isValid = jwtUtils.validateJwtToken(token);
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_nullToken() {
        boolean isValid = jwtUtils.validateJwtToken(null);
        assertThat(isValid).isFalse();
    }
}
