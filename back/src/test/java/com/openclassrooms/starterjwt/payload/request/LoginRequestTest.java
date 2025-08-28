package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    @Test
    void defaultConstructor_gettersSetters_roundTrip() {
        LoginRequest r = new LoginRequest();
        r.setEmail("user@mail.com");
        r.setPassword("secret");
        assertEquals("user@mail.com", r.getEmail());
        assertEquals("secret", r.getPassword());
    }

    @Test
    void equalsHashCode_and_toString() {
        LoginRequest a = new LoginRequest();
        a.setEmail("a@mail.com");
        a.setPassword("pw");

        LoginRequest b = new LoginRequest();
        b.setEmail("a@mail.com");
        b.setPassword("pw");

        LoginRequest c = a;

        assertTrue(a.equals(c));
        assertFalse(a.equals(b));
        assertFalse(a.equals(null));
        assertFalse(a.equals("str"));
        assertEquals(a.hashCode(), c.hashCode());
        assertNotNull(a.toString());
    }
}
