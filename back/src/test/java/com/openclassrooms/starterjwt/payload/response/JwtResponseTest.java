package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtResponseTest {

    @Test
    void fullConstructor_and_getters() {
        JwtResponse r = new JwtResponse("tok", 1L, "user", "John", "Doe", true);
        assertEquals("tok", r.getToken());
        assertEquals("Bearer", r.getType());
        assertEquals(1L, r.getId());
        assertEquals("user", r.getUsername());
        assertEquals("John", r.getFirstName());
        assertEquals("Doe", r.getLastName());
        assertTrue(r.getAdmin());
    }

    @Test
    void setters_roundTrip_and_nulls() {
        JwtResponse r = new JwtResponse("tok", 1L, "user", "John", "Doe", false);
        r.setToken("new");
        r.setType("Custom");
        r.setId(2L);
        r.setUsername("alice");
        r.setFirstName("Alice");
        r.setLastName("Smith");
        r.setAdmin(true);

        assertEquals("new", r.getToken());
        assertEquals("Custom", r.getType());
        assertEquals(2L, r.getId());
        assertEquals("alice", r.getUsername());
        assertEquals("Alice", r.getFirstName());
        assertEquals("Smith", r.getLastName());
        assertTrue(r.getAdmin());

        r.setToken(null);
        r.setType(null);
        r.setId(null);
        r.setUsername(null);
        r.setFirstName(null);
        r.setLastName(null);
        r.setAdmin(null);

        assertNull(r.getToken());
        assertNull(r.getType());
        assertNull(r.getId());
        assertNull(r.getUsername());
        assertNull(r.getFirstName());
        assertNull(r.getLastName());
        assertNull(r.getAdmin());
    }

    @Test
    void equalsHashCode_and_toString() {
        JwtResponse a = new JwtResponse("t", 1L, "u", "f", "l", true);
        JwtResponse b = a;
        JwtResponse c = new JwtResponse("t", 1L, "u", "f", "l", true);

        assertTrue(a.equals(b));
        assertFalse(a.equals(c));
        assertFalse(a.equals(null));
        assertFalse(a.equals("str"));
        assertEquals(a.hashCode(), b.hashCode());
        assertNotNull(a.toString());
    }
}
