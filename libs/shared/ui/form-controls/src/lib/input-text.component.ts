import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';

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
        [type]="type()"
        [placeholder]="placeholder()"
        [formControlName]="formControlName()"
        [formControl]="formControl()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent {
  label = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  formControlName = input.required<string>();
  formControl = input.required<FormControl>();
}
