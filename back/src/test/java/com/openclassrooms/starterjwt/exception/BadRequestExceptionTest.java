package com.openclassrooms.starterjwt.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.assertj.core.api.Assertions.assertThat;

class BadRequestExceptionTest {

    @Test
    @DisplayName("Should have BAD_REQUEST status")
    void shouldReturn400Status() {
        ResponseStatus annotation = BadRequestException.class.getAnnotation(ResponseStatus.class);
        assertThat(annotation.value()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
