import { FormControl, ValidationErrors } from '@angular/forms';

const createErrorMessage = (errorKey: string, validationErrors: ValidationErrors): string => {
  const ERROR_MESSAGES: Record<string, string> = {
    required: 'El campo es requerido.',
    min: `El campo debe ser mayor a ${validationErrors['min']}.`,
    max: `El campo debe ser menor a ${validationErrors['max']}.`,
  };
  return ERROR_MESSAGES[errorKey];
};

export const getErrorMessage = (formControl: FormControl): string => {
  const errors = formControl.errors;

  if (errors) {
    for (const key of Object.keys(errors)) {
      const value = errors[key];

      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        return createErrorMessage(key, value);
      }
    }
  }

  return '';
};
