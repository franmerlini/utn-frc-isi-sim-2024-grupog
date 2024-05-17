import { ChangeDetectionStrategy, Component, inject, output, viewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { MonteCarloSimulation } from '@grupog/libs/shared/models';
import { InputTextComponent } from '@grupog/libs/shared/ui/form-controls';
import { CustomValidators, getErrorMessage } from '@grupog/libs/shared/util';

type DemandDistributionForm = FormGroup<{
  demand: FormControl<string>;
  probability: FormControl<string>;
}>;

type ParametersForm = {
  n: FormControl<string>;
  purchasePrice: FormControl<string>;
  sellingPrice: FormControl<string>;
  stockOutCost: FormControl<string>;
  returnPrice: FormControl<string>;
  initialDemand: FormControl<string>;
  demandDistribution: FormArray<DemandDistributionForm>;
};

@Component({
  selector: 'gg-parameters-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent, TableModule, ButtonModule, TooltipModule],
  template: `
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold underline">Parámetros de simulación</h1>

      <form
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        [formGroup]="form"
        ngForm
        (ngSubmit)="onSubmit()"
      >
        <gg-input-text [label]="'Cantidad de días (n)'" [formControlName]="'n'" [formControl]="n" ngDefaultControl />

        <gg-input-text
          [label]="'Precio compra'"
          [formControlName]="'purchasePrice'"
          [formControl]="purchasePrice"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Precio venta'"
          [formControlName]="'sellingPrice'"
          [formControl]="sellingPrice"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Costo stock-out'"
          [formControlName]="'stockOutCost'"
          [formControl]="stockOutCost"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Precio devolución'"
          [formControlName]="'returnPrice'"
          [formControl]="returnPrice"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Demanda inicial'"
          [formControlName]="'initialDemand'"
          [formControl]="initialDemand"
          ngDefaultControl
        />

        <div class="sm:col-span-2 md:col-span-3 lg:col-span-3">
          <h2>Distribución de la demanda</h2>
        </div>

        <div class="flex flex-col gap-2 sm:col-span-2 md:col-span-3 lg:col-span-3 max-w-[500px]">
          <p-table formArrayName="demandDistribution" [value]="demandDistribution.controls">
            <ng-template pTemplate="header">
              <tr>
                <th class="text-center">Demanda</th>
                <th class="text-center">Probabilidad</th>
                <th><p-button icon="pi pi-plus" pTooltip="Agregar" tooltipPosition="top" (click)="onAddClick()" /></th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-control let-i="rowIndex">
              <tr [formGroupName]="i">
                <td>
                  <gg-input-text
                    [label]="''"
                    [formControlName]="'demand'"
                    [formControl]="control.get('demand')"
                    ngDefaultControl
                  />
                </td>
                <td>
                  <gg-input-text
                    [label]="''"
                    [formControlName]="'probability'"
                    [formControl]="control.get('probability')"
                    ngDefaultControl
                  />
                </td>
                <td>
                  <p-button icon="pi pi-trash" pTooltip="Eliminar" tooltipPosition="top" (click)="onRemoveClick(i)" />
                </td>
              </tr>
            </ng-template>
          </p-table>

          @if (demandDistribution.invalid && (demandDistribution.touched || demandDistribution.dirty)) {
          <small class="text-red-400">{{ getErrorMessage(demandDistribution) }}</small>
          }
        </div>

        <div class="sm:col-span-2 md:col-span-3 lg:col-span-3 flex justify-end gap-2">
          <p-button
            type="button"
            label="Reiniciar"
            [outlined]="true"
            severity="secondary"
            (click)="onResetClick()"
          ></p-button>
          <p-button
            type="button"
            label="Cargar valores por defecto"
            [outlined]="true"
            severity="secondary"
            (click)="onLoadDefaultValues()"
          ></p-button>
          <p-button type="submit" label="Simular"></p-button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParametersFormComponent {
  formGroupDirective = viewChild.required(FormGroupDirective);

  submitForm = output<MonteCarloSimulation>();
  resetForm = output();
  formError = output<string>();

  #fb = inject(NonNullableFormBuilder);

  getErrorMessage = getErrorMessage;

  form = this.#fb.group<ParametersForm>({
    n: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    purchasePrice: this.#fb.control('', [
      Validators.required,
      CustomValidators.number,
      CustomValidators.greaterThan(0),
    ]),
    sellingPrice: this.#fb.control('', [Validators.required, CustomValidators.number, CustomValidators.greaterThan(0)]),
    stockOutCost: this.#fb.control('', [Validators.required, CustomValidators.number, CustomValidators.greaterThan(0)]),
    returnPrice: this.#fb.control('', [Validators.required, CustomValidators.number, CustomValidators.greaterThan(0)]),
    initialDemand: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    demandDistribution: this.#fb.array<DemandDistributionForm>(
      [this.buildDemandDistributionForm()],
      [CustomValidators.sumOfProbabilities()]
    ),
  });

  private buildDemandDistributionForm(): DemandDistributionForm {
    return this.#fb.group({
      demand: this.#fb.control('', [
        Validators.required,
        Validators.min(1),
        CustomValidators.number,
        CustomValidators.integer,
      ]),
      probability: this.#fb.control('', [
        Validators.required,
        CustomValidators.number,
        CustomValidators.greaterThan(0),
        CustomValidators.lessThan(1),
      ]),
    });
  }

  onLoadDefaultValues(): void {
    this.buildDemandDistributionForms(6);
    this.form.patchValue({
      n: '120',
      purchasePrice: '1',
      sellingPrice: '1.2',
      stockOutCost: '0.6',
      returnPrice: '0.4',
      initialDemand: '22',
      demandDistribution: [
        { demand: '30', probability: '0.05' },
        { demand: '31', probability: '0.15' },
        { demand: '32', probability: '0.22' },
        { demand: '33', probability: '0.38' },
        { demand: '34', probability: '0.14' },
        { demand: '35', probability: '0.06' },
      ],
    });
  }

  private buildDemandDistributionForms(formQuantity = 1): void {
    this.demandDistribution.clear();

    for (let i = 0; i < formQuantity; i++) {
      this.demandDistribution.push(
        this.#fb.group({
          demand: this.#fb.control('', [
            Validators.required,
            Validators.min(1),
            CustomValidators.number,
            CustomValidators.integer,
          ]),
          probability: this.#fb.control('', [
            Validators.required,
            CustomValidators.number,
            CustomValidators.greaterThan(0),
            CustomValidators.lessThan(1),
          ]),
        })
      );
    }
  }

  onAddClick(): void {
    this.demandDistribution.push(this.buildDemandDistributionForm());
  }

  onRemoveClick(index: number): void {
    if (this.demandDistribution.length === 1) return;
    this.demandDistribution.removeAt(index);
  }

  onResetClick(): void {
    this.form.reset();
    this.demandDistribution.clear();
    this.buildDemandDistributionForms();
    this.resetForm.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formError.emit('Formulario inválido. Intente nuevamente.');
      return;
    }

    const { n, purchasePrice, sellingPrice, stockOutCost, returnPrice, initialDemand, demandDistribution } =
      this.form.getRawValue();

    const payload: MonteCarloSimulation = {
      n: Number(n),
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stockOutCost: Number(stockOutCost),
      returnPrice: Number(returnPrice),
      initialDemand: Number(initialDemand),
      demandDistribution: demandDistribution.map(({ demand, probability }) => ({
        demand: Number(demand),
        probability: Number(probability),
      })),
    };

    this.submitForm.emit(payload);
  }

  get n(): FormControl<string> {
    return this.form.get('n') as FormControl<string>;
  }

  get purchasePrice(): FormControl<string> {
    return this.form.get('purchasePrice') as FormControl<string>;
  }

  get sellingPrice(): FormControl<string> {
    return this.form.get('sellingPrice') as FormControl<string>;
  }

  get stockOutCost(): FormControl<string> {
    return this.form.get('stockOutCost') as FormControl<string>;
  }

  get returnPrice(): FormControl<string> {
    return this.form.get('returnPrice') as FormControl<string>;
  }

  get initialDemand(): FormControl<string> {
    return this.form.get('initialDemand') as FormControl<string>;
  }

  get demandDistribution(): FormArray<DemandDistributionForm> {
    return this.form.get('demandDistribution') as FormArray<DemandDistributionForm>;
  }
}
