import { FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static number(control: FormControl<string>): ValidationErrors | null {
    if (isNaN(+control.value)) {
      return { number: true };
    }

    return null;
  }
}
