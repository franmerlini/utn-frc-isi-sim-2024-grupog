import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, input } from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';

import { RadioButtonModule } from 'primeng/radiobutton';

import { ListItem } from '@grupog/libs/shared/models';
import { getErrorMessage } from '@grupog/libs/shared/util';

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

      @for(item of list(); track item.value) {
      <div class="pl-4 flex items-center">
        <p-radioButton
          [name]="formControlName()"
          [value]="item.value"
          [inputId]="item.value.toString()"
          [formControlName]="formControlName()"
        ></p-radioButton>
        <label [for]="item.value" class="ml-2 cursor-pointer">{{ item.label }}</label>
      </div>
      } @if (hasError && errorMessage) {
      <small class="text-red-400">{{ errorMessage }}</small>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonGroupComponent implements DoCheck {
  label = input.required<string>();
  list = input.required<ListItem[]>();
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
