import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
}
