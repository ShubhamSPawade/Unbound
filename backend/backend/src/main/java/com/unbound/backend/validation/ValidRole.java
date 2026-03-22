package com.unbound.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ValidRoleValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRole {
    String message() default "Role SUPER_ADMIN cannot be assigned via registration";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
