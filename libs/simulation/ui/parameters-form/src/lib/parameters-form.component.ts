import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroupDirective,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { distinctUntilChanged, filter, merge, startWith, tap } from 'rxjs';

import { ButtonModule } from 'primeng/button';

import { Distribution, DistributionEnum, ListItem, Simulation } from '@grupog/libs/shared/models';
import { DropdownComponent, InputTextComponent, RadioButtonGroupComponent } from '@grupog/libs/shared/ui/form-controls';
import { CustomValidators } from '@grupog/libs/shared/util';

type ParametersForm = {
  distribution: FormControl<Distribution>;
  sampleSize: FormControl<string>;
  a: FormControl<string>;
  b: FormControl<string>;
  mean: FormControl<string>;
  standardDeviation: FormControl<string>;
  lambda: FormControl<string>;
  intervalQuantity: FormControl<number>;
};

@Component({
  selector: 'gg-parameters-form',
  standalone: true,
  imports: [ReactiveFormsModule, RadioButtonGroupComponent, InputTextComponent, ButtonModule, DropdownComponent],
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

      @switch(distribution.value) { @case (distributionEnum.UNIFORM) {
      <gg-input-text [label]="'Extremo inferior (a)'" [formControlName]="'a'" [formControl]="a" ngDefaultControl />

      <gg-input-text [label]="'Extremo superior (b)'" [formControlName]="'b'" [formControl]="b" ngDefaultControl />
      } @case (distributionEnum.NORMAL) {
      <gg-input-text [label]="'Media (µ)'" [formControlName]="'mean'" [formControl]="mean" ngDefaultControl />

      <gg-input-text
        [label]="'Desviación estándar (σ)'"
        [formControlName]="'standardDeviation'"
        [formControl]="standardDeviation"
        ngDefaultControl
      />
      } @case (distributionEnum.EXPONENTIAL) {
      <gg-input-text [label]="'Frecuencia (λ)'" [formControlName]="'lambda'" [formControl]="lambda" ngDefaultControl />
      } }

      <gg-dropdown
        [label]="'Cantidad de intervalos'"
        [list]="intervalQuantityList"
        [formControlName]="'intervalQuantity'"
        [formControl]="intervalQuantity"
        ngDefaultControl
      />

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

  simulate = output<Simulation>();
  reset = output<Distribution>();
  formError = output<string>();

  distributionList: ListItem[] = [
    {
      value: 1,
      label: 'Uniforme',
    },
    {
      value: 2,
      label: 'Normal',
    },
    {
      value: 3,
      label: 'Exponencial',
    },
  ];
  distributionEnum = DistributionEnum;
  intervalQuantityList: ListItem[] = [
    {
      value: 10,
      label: '10',
    },
    {
      value: 12,
      label: '12',
    },
    {
      value: 16,
      label: '16',
    },
    {
      value: 23,
      label: '23',
    },
  ];

  #fb = inject(NonNullableFormBuilder);
  #destroyRef = inject(DestroyRef);

  form = this.#fb.group<ParametersForm>({
    distribution: this.#fb.control(DistributionEnum.UNIFORM),
    sampleSize: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      Validators.max(1000000),
      CustomValidators.number,
    ]),
    a: this.#fb.control(''),
    b: this.#fb.control(''),
    mean: this.#fb.control(''),
    standardDeviation: this.#fb.control(''),
    lambda: this.#fb.control(''),
    intervalQuantity: this.#fb.control(0, [CustomValidators.requiredSelectValidator]),
  });

  ngOnInit(): void {
    this.subscribeDistributionValueChanges();
    this.subscribeABValueChanges();
  }

  private subscribeDistributionValueChanges(): void {
    this.distribution.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef), startWith(DistributionEnum.UNIFORM))
      .subscribe((value) => {
        switch (value) {
          case DistributionEnum.UNIFORM: {
            this.a.setValidators([Validators.required, CustomValidators.number]);
            this.b.setValidators([Validators.required, CustomValidators.number]);
            this.mean.clearValidators();
            this.standardDeviation.clearValidators();
            this.lambda.clearValidators();
            break;
          }
          case DistributionEnum.NORMAL: {
            this.a.clearValidators();
            this.b.clearValidators();
            this.mean.setValidators([Validators.required, CustomValidators.number]);
            this.standardDeviation.setValidators([Validators.required, CustomValidators.number]);
            this.lambda.clearValidators();
            break;
          }
          case DistributionEnum.EXPONENTIAL: {
            this.a.clearValidators();
            this.b.clearValidators();
            this.mean.clearValidators();
            this.standardDeviation.clearValidators();
            this.lambda.setValidators([Validators.required, CustomValidators.number, Validators.min(0.0001)]);
            break;
          }
        }

        [this.a, this.b, this.mean, this.standardDeviation, this.lambda].forEach((control) => {
          control.updateValueAndValidity();
        });
      });
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
    [this.sampleSize, this.a, this.b, this.mean, this.standardDeviation, this.lambda, this.intervalQuantity].forEach(
      (control) => control.reset()
    );
    this.reset.emit(this.distribution.value as Distribution);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formError.emit('Formulario inválido.');
      return;
    }

    const { distribution, sampleSize, a, b, mean, standardDeviation, lambda, intervalQuantity } =
      this.form.getRawValue();

    const payload: Simulation = {
      distribution,
      sampleSize: +sampleSize,
      a: +a,
      b: +b,
      mean: +mean,
      standardDeviation: +standardDeviation,
      lambda: +lambda,
      intervalQuantity,
    };

    this.simulate.emit(payload);
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

  get intervalQuantity(): FormControl<number> {
    return this.form.get('intervalQuantity') as FormControl<number>;
  }
}
