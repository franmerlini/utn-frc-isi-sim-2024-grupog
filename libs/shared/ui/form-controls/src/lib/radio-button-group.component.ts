import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';

import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'gg-radio-button-group',
  standalone: true,
  imports: [RadioButtonModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  template: `
    <div class="flex flex-col gap-2">
      <label>{{ label() }}</label>
      @for(item of list(); track item.id) {
      <div class="pl-4 flex items-center">
        <p-radioButton
          [name]="formControlName()"
          [value]="item.id"
          [inputId]="item.id"
          [formControlName]="formControlName()"
        ></p-radioButton>
        <label [for]="item.id" class="ml-2 cursor-pointer">{{ item.label }}</label>
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonGroupComponent {
  label = input.required<string>();
  list = input.required<any[]>();
  formControlName = input.required<string>();
  formControl = input.required<FormControl>();
}
