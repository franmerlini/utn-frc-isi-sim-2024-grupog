import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, output, viewChild } from '@angular/core';
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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

import { ListItem, MonteCarloSimulation, Policy, PolicyEnum } from '@grupog/libs/shared/models';
import { InputTextComponent, RadioButtonGroupComponent } from '@grupog/libs/shared/ui/form-controls';
import { CustomValidators, getErrorMessage } from '@grupog/libs/shared/util';

type DemandDistributionForm = FormGroup<{
  demand: FormControl<string>;
  probability: FormControl<string>;
}>;

type ParametersForm = {
  policy: FormControl<Policy>;
  orderAmount: FormControl<string>;
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
  imports: [
    ReactiveFormsModule,
    RadioButtonGroupComponent,
    InputTextComponent,
    TableModule,
    ButtonModule,
    TooltipModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold underline">Parámetros de simulación</h1>

      <form
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        [formGroup]="form"
        ngForm
        (ngSubmit)="onSubmit()"
      >
        <gg-radio-button-group
          class="sm:col-span-2 md:col-span-3 lg:col-span-3"
          [label]="'Política'"
          [list]="policyList"
          [formControlName]="'policy'"
          [formControl]="policy"
          ngDefaultControl
        />

        @if(policy.value === policyEnum.FIXED_ORDER_AMOUNT) {
        <gg-input-text
          [label]="'Cantidad de pedidio'"
          [formControlName]="'orderAmount'"
          [formControl]="orderAmount"
          ngDefaultControl
        />
        } @if(policy.value === policyEnum.VARIABLE_ORDER_AMOUNT) {
        <gg-input-text
          [label]="'Demanda inicial'"
          [formControlName]="'initialDemand'"
          [formControl]="initialDemand"
          ngDefaultControl
        />
        }

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

        <div class="sm:col-span-2 md:col-span-3 lg:col-span-3 flex flex-col sm:flex-row sm:justify-end gap-2">
          <p-button type="button" [outlined]="true" severity="secondary" styleClass="w-full" (click)="onResetClick()">
            <div class="flex justify-center items-center gap-2 font-bold w-full">
              <i class="pi pi-refresh"></i>
              <span>Reiniciar</span>
            </div>
          </p-button>
          <p-button
            type="button"
            label="Cargar valores por defecto"
            severity="secondary"
            styleClass="w-full"
            (click)="onLoadDefaultValues()"
          />
          <p-button type="submit" label="Simular" styleClass="w-full" />
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParametersFormComponent implements OnInit {
  formGroupDirective = viewChild.required(FormGroupDirective);

  submitForm = output<MonteCarloSimulation>();
  resetForm = output();
  formError = output<string>();

  policyList: ListItem[] = [
    {
      value: PolicyEnum.FIXED_ORDER_AMOUNT,
      label: 'Política 1 (cantidad pedido constante)',
    },
    {
      value: PolicyEnum.VARIABLE_ORDER_AMOUNT,
      label: 'Política 2 (cantidad pedido igual a la demanda del día anterior)',
    },
  ];
  policyEnum = PolicyEnum;

  #fb = inject(NonNullableFormBuilder);
  #destroRef = inject(DestroyRef);

  getErrorMessage = getErrorMessage;

  form = this.#fb.group<ParametersForm>({
    policy: this.#fb.control(PolicyEnum.FIXED_ORDER_AMOUNT),
    orderAmount: this.#fb.control(''),
    initialDemand: this.#fb.control(''),
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
    demandDistribution: this.#fb.array<DemandDistributionForm>(
      [this.buildDemandDistributionForm()],
      [CustomValidators.sumOfProbabilities()]
    ),
  });

  ngOnInit(): void {
    this.subscribePolicyValueChanges();
  }

  private subscribePolicyValueChanges(): void {
    this.policy.valueChanges
      .pipe(takeUntilDestroyed(this.#destroRef), startWith(PolicyEnum.FIXED_ORDER_AMOUNT))
      .subscribe((value) => {
        switch (value) {
          case PolicyEnum.FIXED_ORDER_AMOUNT: {
            this.orderAmount.setValidators([
              Validators.required,
              Validators.min(1),
              CustomValidators.number,
              CustomValidators.integer,
            ]);
            this.initialDemand.clearValidators();

            break;
          }
          case PolicyEnum.VARIABLE_ORDER_AMOUNT: {
            this.orderAmount.clearValidators();
            this.initialDemand.setValidators([
              Validators.required,
              Validators.min(1),
              CustomValidators.number,
              CustomValidators.integer,
            ]);
            break;
          }
        }
        this.orderAmount.updateValueAndValidity();
        this.initialDemand.updateValueAndValidity();
      });
  }

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
    const formValue = {
      n: '120',
      purchasePrice: '1',
      sellingPrice: '1.2',
      stockOutCost: '0.6',
      returnPrice: '0.4',
      demandDistribution: [
        { demand: '30', probability: '0.05' },
        { demand: '31', probability: '0.15' },
        { demand: '32', probability: '0.22' },
        { demand: '33', probability: '0.38' },
        { demand: '34', probability: '0.14' },
        { demand: '35', probability: '0.06' },
      ],
    };
    this.form.patchValue(
      this.policy.value === PolicyEnum.FIXED_ORDER_AMOUNT
        ? { ...formValue, orderAmount: '30' }
        : { ...formValue, initialDemand: '22' }
    );
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

    const {
      policy,
      orderAmount,
      n,
      purchasePrice,
      sellingPrice,
      stockOutCost,
      returnPrice,
      initialDemand,
      demandDistribution,
    } = this.form.getRawValue();

    const payload: MonteCarloSimulation = {
      policy,
      orderAmount: Number(orderAmount),
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

  get policy(): FormControl<number> {
    return this.form.get('policy') as FormControl<number>;
  }

  get orderAmount(): FormControl<string> {
    return this.form.get('orderAmount') as FormControl<string>;
  }

  get initialDemand(): FormControl<string> {
    return this.form.get('initialDemand') as FormControl<string>;
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

  get demandDistribution(): FormArray<DemandDistributionForm> {
    return this.form.get('demandDistribution') as FormArray<DemandDistributionForm>;
  }
}
