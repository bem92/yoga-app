package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SignupRequestTest {

    @Test
    void defaultConstructor_gettersSetters_roundTrip() {
        SignupRequest r = new SignupRequest();
        r.setEmail("john@example.com");
        r.setFirstName("John");
        r.setLastName("Doe");
        r.setPassword("secret");
        assertEquals("john@example.com", r.getEmail());
        assertEquals("John", r.getFirstName());
        assertEquals("Doe", r.getLastName());
        assertEquals("secret", r.getPassword());
    }

    @Test
    void equalsHashCode_canEqual_and_toString() {
        SignupRequest a = new SignupRequest();
        a.setEmail("a@example.com");
        a.setFirstName("A");
        a.setLastName("B");
        a.setPassword("pw");

        SignupRequest b = new SignupRequest();
        b.setEmail("a@example.com");
        b.setFirstName("A");
        b.setLastName("B");
        b.setPassword("pw");

        SignupRequest c = new SignupRequest();
        c.setEmail("c@example.com");
        c.setFirstName("C");
        c.setLastName("D");
        c.setPassword("pw2");

        assertTrue(a.equals(b));
        assertEquals(a.hashCode(), b.hashCode());
        assertTrue(a.canEqual(b));
        assertFalse(a.equals(c));
        assertNotEquals(a.hashCode(), c.hashCode());
        assertFalse(a.canEqual(new Object()));
        assertFalse(a.equals(null));
        assertFalse(a.equals("str"));
        assertEquals(a, a);
        String text = a.toString();
        assertTrue(text.contains("a@example.com"));
        assertTrue(text.contains("A"));
        assertTrue(text.contains("B"));
    }

    @Test
    void equals_handlesNullFields() {
        SignupRequest r1 = new SignupRequest();
        SignupRequest r2 = new SignupRequest();
        assertEquals(r1, r2);
        assertEquals(r1.hashCode(), r2.hashCode());
        r2.setFirstName("X");
        assertNotEquals(r1, r2);
    }
}
