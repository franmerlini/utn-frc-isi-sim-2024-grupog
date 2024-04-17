import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroupDirective,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { distinctUntilChanged, filter, merge, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';

import { InputTextComponent, RadioButtonGroupComponent } from '@grupog/libs/shared/ui/form-controls';
import { CustomValidators } from '@grupog/libs/shared/util';

type ParametersForm = {
  distribution: FormControl<number>;
  sampleSize: FormControl<string>;
  a: FormControl<string>;
  b: FormControl<string>;
  mean: FormControl<string>;
  standardDeviation: FormControl<string>;
  lambda: FormControl<string>;
};

@Component({
  selector: 'gg-parameters-form',
  standalone: true,
  imports: [ReactiveFormsModule, RadioButtonGroupComponent, InputTextComponent, ButtonModule],
  template: `
    <form
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      [formGroup]="form"
      ngForm
      (ngSubmit)="onSubmit()"
    >
      <gg-radio-button-group
        class="sm:col-span-2 md:col-span-3 lg:col-span-3"
        [label]="'Distribución'"
        [list]="distributionList"
        [formControlName]="'distribution'"
        [formControl]="distribution"
        ngDefaultControl
      />

      <gg-input-text
        [label]="'Tamaño de muestra (n)'"
        [formControlName]="'sampleSize'"
        [formControl]="sampleSize"
        ngDefaultControl
      />

      @switch(distribution.value) { @case (1) {
      <gg-input-text [label]="'Extremo inferior (a)'" [formControlName]="'a'" [formControl]="a" ngDefaultControl />

      <gg-input-text [label]="'Extremo superior (b)'" [formControlName]="'b'" [formControl]="b" ngDefaultControl />
      } @case (2) {
      <gg-input-text [label]="'Media (µ)'" [formControlName]="'mean'" [formControl]="mean" ngDefaultControl />

      <gg-input-text
        [label]="'Desviación estándar (σ)'"
        [formControlName]="'standardDeviation'"
        [formControl]="standardDeviation"
        ngDefaultControl
      />
      } @case (3) {
      <gg-input-text [label]="'Frecuencia (λ)'" [formControlName]="'lambda'" [formControl]="lambda" ngDefaultControl />
      } }

      <div class="sm:col-span-2 md:col-span-3 lg:col-span-3 flex justify-end gap-2">
        <p-button
          type="button"
          label="Reiniciar"
          [outlined]="true"
          severity="secondary"
          (click)="onResetClick()"
        ></p-button>
        <p-button type="submit" label="Simular"></p-button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParametersFormComponent implements OnInit {
  formGroupDirective = viewChild.required(FormGroupDirective);

  simulate = output<any>();
  formError = output<string>();

  distributionList = [
    {
      id: 1,
      label: 'Uniforme',
    },
    {
      id: 2,
      label: 'Normal',
    },
    {
      id: 3,
      label: 'Exponencial',
    },
  ];

  #fb = inject(NonNullableFormBuilder);
  #destroyRef = inject(DestroyRef);

  form = this.#fb.group<ParametersForm>({
    distribution: this.#fb.control(1),
    sampleSize: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      Validators.max(1000000),
      CustomValidators.number,
    ]),
    a: this.#fb.control('', [Validators.required, CustomValidators.number]),
    b: this.#fb.control('', [Validators.required, CustomValidators.number]),
    mean: this.#fb.control('', [Validators.required, CustomValidators.number]),
    standardDeviation: this.#fb.control('', [Validators.required, CustomValidators.number]),
    lambda: this.#fb.control('', [Validators.required, CustomValidators.number, Validators.min(0.0001)]),
  });

  ngOnInit(): void {
    this.subscribeDistributionValueChanges();
    this.subscribeABValueChanges();
  }

  // TODO: implementar logica para quitar validadores segun la distribucion seleccionada
  private subscribeDistributionValueChanges(): void {
    return;
  }

  private subscribeABValueChanges(): void {
    const aChanges$ = this.a.valueChanges.pipe(
      distinctUntilChanged(),
      filter((value) => !isNaN(+value)),
      tap((value) => {
        this.b.setValidators([Validators.required, CustomValidators.number, CustomValidators.greaterThan(+value)]);

        if ((this.a.valid && this.b.value) || this.a.invalid) {
          this.b.updateValueAndValidity();
        }
      })
    );

    const bChanges$ = this.b.valueChanges.pipe(
      distinctUntilChanged(),
      filter((value) => !isNaN(+value)),
      tap((value) => {
        this.a.setValidators([Validators.required, CustomValidators.number, CustomValidators.lessThan(+value)]);

        if ((this.b.valid && this.a.value) || this.b.invalid) {
          this.a.updateValueAndValidity();
        }
      })
    );

    merge(aChanges$, bChanges$).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe();
  }

  onResetClick(): void {
    [this.sampleSize, this.a, this.b, this.mean, this.standardDeviation, this.lambda].forEach((control) =>
      control.reset()
    );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.formError.emit('Formulario inválido.');
      return;
    }

    this.simulate.emit(this.form.getRawValue());
  }

  get distribution(): FormControl<number> {
    return this.form.get('distribution') as FormControl<number>;
  }

  get sampleSize(): FormControl<string> {
    return this.form.get('sampleSize') as FormControl<string>;
  }

  get a(): FormControl<string> {
    return this.form.get('a') as FormControl<string>;
  }

  get b(): FormControl<string> {
    return this.form.get('b') as FormControl<string>;
  }

  get mean(): FormControl<string> {
    return this.form.get('mean') as FormControl<string>;
  }

  get standardDeviation(): FormControl<string> {
    return this.form.get('standardDeviation') as FormControl<string>;
  }

  get lambda(): FormControl<string> {
    return this.form.get('lambda') as FormControl<string>;
  }
}