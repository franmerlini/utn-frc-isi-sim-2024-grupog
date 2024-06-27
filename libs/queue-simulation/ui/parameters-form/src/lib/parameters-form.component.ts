import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { QueueSimulation } from '@grupog/libs/shared/models';
import { InputTextComponent, RadioButtonGroupComponent } from '@grupog/libs/shared/ui/form-controls';
import { CustomValidators } from '@grupog/libs/shared/util';

type ParametersForm = {
  n: FormControl<string>;
  from: FormControl<string>;
  to: FormControl<string>;
  counterArrivalFrecuency: FormControl<string>;
  selfserviceArrivalFrecuency: FormControl<string>;
  onlineArrivalFrecuency: FormControl<string>;
  takewayArrivalFrecuency: FormControl<string>;
  deliveryArrivalFrecuency: FormControl<string>;
  dessertPercent: FormControl<string>;
  counterEndOfServiceFrecuency: FormControl<string>;
  selfserviceEndOfServiceFrecuency: FormControl<string>;
  onlineEndOfServiceFrecuency: FormControl<string>;
  takeawayEndOfServiceFrecuency: FormControl<string>;
  deliveryEndOfServiceFrecuency: FormControl<string>;
  dessertEndOfServiceFrecuency: FormControl<string>;
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
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-end gap-6"
        [formGroup]="form"
        ngForm
        (ngSubmit)="onSubmit()"
      >
        <gg-input-text [label]="'Cantidad de filas (n)'" [formControlName]="'n'" [formControl]="n" ngDefaultControl />

        <gg-input-text [label]="'Desde'" [formControlName]="'from'" [formControl]="from" ngDefaultControl />

        <gg-input-text [label]="'Hasta'" [formControlName]="'to'" [formControl]="to" ngDefaultControl />

        <gg-input-text
          [label]="'Frecuencia llegada pedido en mostrador'"
          [formControlName]="'counterArrivalFrecuency'"
          [formControl]="counterArrivalFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia llegada pedido autoservicio'"
          [formControlName]="'selfserviceArrivalFrecuency'"
          [formControl]="selfserviceArrivalFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia llegada pedido online'"
          [formControlName]="'onlineArrivalFrecuency'"
          [formControl]="onlineArrivalFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia llegada pedido para llevar'"
          [formControlName]="'takewayArrivalFrecuency'"
          [formControl]="takewayArrivalFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia llegada pedido delivery'"
          [formControlName]="'deliveryArrivalFrecuency'"
          [formControl]="deliveryArrivalFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Porcentaje postre'"
          [formControlName]="'dessertPercent'"
          [formControl]="dessertPercent"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia fin atención pedido en mostrador'"
          [formControlName]="'counterEndOfServiceFrecuency'"
          [formControl]="counterEndOfServiceFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia fin atención pedido autoservicio'"
          [formControlName]="'selfserviceEndOfServiceFrecuency'"
          [formControl]="selfserviceEndOfServiceFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia fin atención pedido online'"
          [formControlName]="'onlineEndOfServiceFrecuency'"
          [formControl]="onlineEndOfServiceFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia fin atención pedido para llevar'"
          [formControlName]="'takeawayEndOfServiceFrecuency'"
          [formControl]="takeawayEndOfServiceFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia fin atención pedido delivery'"
          [formControlName]="'deliveryEndOfServiceFrecuency'"
          [formControl]="deliveryEndOfServiceFrecuency"
          ngDefaultControl
        />

        <gg-input-text
          [label]="'Frecuencia fin atención pedido postre'"
          [formControlName]="'dessertEndOfServiceFrecuency'"
          [formControl]="dessertEndOfServiceFrecuency"
          ngDefaultControl
        />

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
export class ParametersFormComponent {
  submitForm = output<QueueSimulation>();
  resetForm = output();
  formError = output<string>();

  #fb = inject(NonNullableFormBuilder);

  form = this.#fb.group<ParametersForm>({
    n: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    from: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    to: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    counterArrivalFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    selfserviceArrivalFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    onlineArrivalFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    takewayArrivalFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    deliveryArrivalFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    dessertPercent: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    counterEndOfServiceFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    selfserviceEndOfServiceFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    onlineEndOfServiceFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    takeawayEndOfServiceFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    deliveryEndOfServiceFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
    dessertEndOfServiceFrecuency: this.#fb.control('', [
      Validators.required,
      Validators.min(1),
      CustomValidators.number,
      CustomValidators.integer,
    ]),
  });

  onResetClick(): void {
    this.form.reset();
    this.resetForm.emit();
  }

  onLoadDefaultValues(): void {
    this.form.patchValue({
      n: '100',
      from: '1',
      to: '10',
      counterArrivalFrecuency: '50',
      selfserviceArrivalFrecuency: '40',
      onlineArrivalFrecuency: '30',
      takewayArrivalFrecuency: '25',
      deliveryArrivalFrecuency: '20',
      dessertPercent: '15',
      counterEndOfServiceFrecuency: '12',
      selfserviceEndOfServiceFrecuency: '15',
      onlineEndOfServiceFrecuency: '10',
      takeawayEndOfServiceFrecuency: '20',
      deliveryEndOfServiceFrecuency: '8',
      dessertEndOfServiceFrecuency: '5',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formError.emit('Formulario inválido.');
      return;
    }

    const {
      n,
      from,
      to,
      counterArrivalFrecuency,
      selfserviceArrivalFrecuency,
      onlineArrivalFrecuency,
      takewayArrivalFrecuency,
      deliveryArrivalFrecuency,
      dessertPercent,
      counterEndOfServiceFrecuency,
      selfserviceEndOfServiceFrecuency,
      onlineEndOfServiceFrecuency,
      takeawayEndOfServiceFrecuency,
      deliveryEndOfServiceFrecuency,
      dessertEndOfServiceFrecuency,
    } = this.form.getRawValue();

    const payload: QueueSimulation = {
      n: Number(n),
      from: Number(from),
      to: Number(to),
      counterArrivalFrecuency: Number(counterArrivalFrecuency),
      selfserviceArrivalFrecuency: Number(selfserviceArrivalFrecuency),
      onlineArrivalFrecuency: Number(onlineArrivalFrecuency),
      takewayArrivalFrecuency: Number(takewayArrivalFrecuency),
      deliveryArrivalFrecuency: Number(deliveryArrivalFrecuency),
      dessertPercent: Number(dessertPercent),
      counterEndOfServiceFrecuency: Number(counterEndOfServiceFrecuency),
      selfserviceEndOfServiceFrecuency: Number(selfserviceEndOfServiceFrecuency),
      onlineEndOfServiceFrecuency: Number(onlineEndOfServiceFrecuency),
      takeawayEndOfServiceFrecuency: Number(takeawayEndOfServiceFrecuency),
      deliveryEndOfServiceFrecuency: Number(deliveryEndOfServiceFrecuency),
      dessertEndOfServiceFrecuency: Number(dessertEndOfServiceFrecuency),
    };

    this.submitForm.emit(payload);
  }

  get n(): FormControl<string> {
    return this.form.get('n') as FormControl<string>;
  }

  get from(): FormControl<string> {
    return this.form.get('from') as FormControl<string>;
  }

  get to(): FormControl<string> {
    return this.form.get('to') as FormControl<string>;
  }

  get counterArrivalFrecuency(): FormControl<string> {
    return this.form.get('counterArrivalFrecuency') as FormControl<string>;
  }

  get selfserviceArrivalFrecuency(): FormControl<string> {
    return this.form.get('selfserviceArrivalFrecuency') as FormControl<string>;
  }

  get onlineArrivalFrecuency(): FormControl<string> {
    return this.form.get('onlineArrivalFrecuency') as FormControl<string>;
  }

  get takewayArrivalFrecuency(): FormControl<string> {
    return this.form.get('takewayArrivalFrecuency') as FormControl<string>;
  }

  get deliveryArrivalFrecuency(): FormControl<string> {
    return this.form.get('deliveryArrivalFrecuency') as FormControl<string>;
  }

  get dessertPercent(): FormControl<string> {
    return this.form.get('dessertPercent') as FormControl<string>;
  }

  get counterEndOfServiceFrecuency(): FormControl<string> {
    return this.form.get('counterEndOfServiceFrecuency') as FormControl<string>;
  }

  get selfserviceEndOfServiceFrecuency(): FormControl<string> {
    return this.form.get('selfserviceEndOfServiceFrecuency') as FormControl<string>;
  }

  get onlineEndOfServiceFrecuency(): FormControl<string> {
    return this.form.get('onlineEndOfServiceFrecuency') as FormControl<string>;
  }

  get takeawayEndOfServiceFrecuency(): FormControl<string> {
    return this.form.get('takeawayEndOfServiceFrecuency') as FormControl<string>;
  }

  get deliveryEndOfServiceFrecuency(): FormControl<string> {
    return this.form.get('deliveryEndOfServiceFrecuency') as FormControl<string>;
  }

  get dessertEndOfServiceFrecuency(): FormControl<string> {
    return this.form.get('dessertEndOfServiceFrecuency') as FormControl<string>;
  }
}
