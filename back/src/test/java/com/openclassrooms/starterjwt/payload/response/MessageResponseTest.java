package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MessageResponseTest {

    @Test
    void constructor_getter_setter_roundTrip() {
        MessageResponse r = new MessageResponse("Hello");
        assertEquals("Hello", r.getMessage());
        r.setMessage("Bye");
        assertEquals("Bye", r.getMessage());
        r.setMessage(null);
        assertNull(r.getMessage());
    }

    @Test
    void equalsHashCode_and_toString() {
        MessageResponse a = new MessageResponse("msg");
        MessageResponse b = a;
        MessageResponse c = new MessageResponse("msg");

        assertTrue(a.equals(b));
        assertFalse(a.equals(c));
        assertFalse(a.equals(null));
        assertFalse(a.equals("str"));
        assertEquals(a.hashCode(), b.hashCode());
        assertNotNull(a.toString());
    }
}
