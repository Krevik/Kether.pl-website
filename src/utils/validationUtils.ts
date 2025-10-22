/**
 * Validation utilities for form handling and data validation
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export const validationUtils = {
    /**
     * Validates if a string is not empty and has minimum length
     */
    validateRequired: (value: string, fieldName: string, minLength = 1): ValidationResult => {
        const errors: string[] = [];
        
        if (!value || value.trim().length === 0) {
            errors.push(`${fieldName} is required`);
        } else if (value.trim().length < minLength) {
            errors.push(`${fieldName} must be at least ${minLength} character(s) long`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Validates if a string has maximum length
     */
    validateMaxLength: (value: string, fieldName: string, maxLength: number): ValidationResult => {
        const errors: string[] = [];
        
        if (value && value.length > maxLength) {
            errors.push(`${fieldName} must be no more than ${maxLength} character(s) long`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Validates if a string matches a regex pattern
     */
    validatePattern: (value: string, _fieldName: string, pattern: RegExp, message: string): ValidationResult => {
        const errors: string[] = [];
        
        if (value && !pattern.test(value)) {
            errors.push(message);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Combines multiple validation results
     */
    combineValidations: (...validations: ValidationResult[]): ValidationResult => {
        const allErrors = validations.flatMap(v => v.errors);
        return {
            isValid: allErrors.length === 0,
            errors: allErrors
        };
    },

    /**
     * Validates bind text (specific to this application)
     */
    validateBindText: (text: string): ValidationResult => {
        return validationUtils.combineValidations(
            validationUtils.validateRequired(text, 'Bind text', 1),
            validationUtils.validateMaxLength(text, 'Bind text', 1000)
        );
    },

    /**
     * Validates command text (specific to this application)
     */
    validateCommandText: (text: string): ValidationResult => {
        return validationUtils.combineValidations(
            validationUtils.validateRequired(text, 'Command', 1),
            validationUtils.validateMaxLength(text, 'Command', 100)
        );
    },

    /**
     * Validates author name
     */
    validateAuthor: (author: string): ValidationResult => {
        return validationUtils.combineValidations(
            validationUtils.validateRequired(author, 'Author', 1),
            validationUtils.validateMaxLength(author, 'Author', 50)
        );
    }
};
