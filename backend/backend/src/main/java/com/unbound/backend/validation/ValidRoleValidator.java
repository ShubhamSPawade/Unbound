package com.unbound.backend.validation;

import com.unbound.backend.enums.Role;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidRoleValidator implements ConstraintValidator<ValidRole, Role> {

    @Override
    public boolean isValid(Role role, ConstraintValidatorContext context) {
        if (role == null) return true; // @NotNull handles null separately
        return role != Role.SUPER_ADMIN;
    }
}
