package com.openclassrooms.starterjwt.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.assertj.core.api.Assertions.assertThat;

class NotFoundExceptionTest {

    @Test
    @DisplayName("Should have NOT_FOUND status")
    void shouldReturn404Status() {
        ResponseStatus annotation = NotFoundException.class.getAnnotation(ResponseStatus.class);
        assertThat(annotation.value()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
