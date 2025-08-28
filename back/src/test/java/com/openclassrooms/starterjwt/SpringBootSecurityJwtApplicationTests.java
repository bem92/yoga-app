package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;

class SpringBootSecurityJwtApplicationTests {

    @Test
    void main_calls_spring_application_run() {
        try (MockedStatic<SpringApplication> mocked = mockStatic(SpringApplication.class)) {
            ConfigurableApplicationContext context = mock(ConfigurableApplicationContext.class);
            mocked.when(() -> SpringApplication.run(any(Class.class), any(String[].class)))
                  .thenReturn(context);

            String[] args = new String[]{};
            assertDoesNotThrow(() -> SpringBootSecurityJwtApplication.main(args));
            mocked.verify(() -> SpringApplication.run(SpringBootSecurityJwtApplication.class, args));
        }
    }
}

