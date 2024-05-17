import { AbstractControl, FormArray, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static number(control: FormControl<string>): ValidationErrors | null {
    if (isNaN(+control.value)) {
      return { number: true };
    }

    return null;
  }

  static greaterThan(value: number): ValidatorFn {
    return (control) => {
      if (+control.value <= value) {
        return { greaterthan: { greaterthan: value, actual: control.value } };
      }

      return null;
    };
  }

  static lessThan(value: number): ValidatorFn {
    return (control) => {
      if (+control.value >= value) {
        return { lessthan: { lessthan: value, actual: control.value } };
      }

      return null;
    };
  }

  static requiredSelectValidator(control: AbstractControl): ValidationErrors | null {
    return !control?.value ? { required: true } : null;
  }

  static integer(control: FormControl<string>): ValidationErrors | null {
    if (!Number.isInteger(+control.value)) {
      return { integer: true };
    }

    return null;
  }

  static sumOfProbabilities(): ValidatorFn {
    return (control) => {
      const probabilities = (control as FormArray).controls.map((c) => Number(c.get('probability')?.value));

      if (probabilities.reduce((acc, curr) => acc + curr, 0) !== 1) {
        return { sumOfProbabilities: true };
      }

      return null;
    };
  }
}
