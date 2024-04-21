import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, inject, input } from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';

import { ListItem } from '@grupog/libs/shared/models';
import { getErrorMessage } from '@grupog/libs/shared/util';

@Component({
  selector: 'gg-dropdown',
  standalone: true,
  imports: [DropdownModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  template: `
    <div class="flex flex-col gap-2">
      <label [for]="formControlName">{{ label() }}</label>
      <p-dropdown
        [styleClass]="hasError ? 'w-full border-red-400' : 'w-full'"
        [options]="list()"
        [placeholder]="placeholder()"
        [formControlName]="formControlName()"
      ></p-dropdown>
      @if (hasError && errorMessage) {
      <small class="text-red-400">{{ errorMessage }}</small>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements DoCheck {
  label = input.required<string>();
  list = input.required<ListItem[]>();
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
