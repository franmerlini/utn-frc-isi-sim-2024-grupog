import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, input } from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';

import { getErrorMessage } from '@grupog/libs/shared/util';

@Component({
  selector: 'gg-input-text',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  template: `
    <div class="flex flex-col gap-2">
      <label [for]="formControlName">{{ label() }}</label>
      <input
        pInputText
        [id]="formControlName"
        class="w-full"
        [class]="hasError ? 'border-red-400' : ''"
        [type]="type()"
        [placeholder]="placeholder()"
        [formControlName]="formControlName()"
        [formControl]="formControl()"
        autocomplete="off"
      />
      @if (hasError && errorMessage) {
      <small class="text-red-400">{{ errorMessage }}</small>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent implements DoCheck {
  label = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  formControlName = input.required<string>();
  formControl = input.required<FormControl>();

  errorMessage = '';

  #cdr = inject(ChangeDetectorRef);

  ngDoCheck(): void {
    this.errorMessage = getErrorMessage(this.formControl());
    this.#cdr.markForCheck();
  }

  get hasError(): boolean {
    return this.formControl().invalid && (this.formControl().touched || this.formControl().dirty);
  }
}
