import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { QueueSimulationRow } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-simulation-result',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div class="flex flex-col gap-4">
        <h6 class="text-lg underline">Tiempo de espera promedio por servicio</h6>
        <ul>
          <li>
            Mostrador: <b>{{ getLastRow().counterAverageWaitingTime }} horas</b>
          </li>
          <li>
            Autoservicio: <b>{{ getLastRow().selfserviceAverageWaitingTime }} horas</b>
          </li>
          <li>
            Online: <b>{{ getLastRow().onlineAverageWaitingTime }} horas</b>
          </li>
          <li>
            Para llevar: <b>{{ getLastRow().takeawayAverageWaitingTime }} horas</b>
          </li>
          <li>
            Delivery: <b>{{ getLastRow().deliveryAverageWaitingTime }} horas</b>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-4">
        <h6 class="text-lg underline">Tiempo de ocupación promedio por servicio</h6>
        <ul>
          <li>
            Mostrador: <b>{{ getLastRow().counterAverageUtilizationTime }} horas</b>
          </li>
          <li>
            Autoservicio: <b>{{ getLastRow().selfserviceAverageUtilizationTime }} horas</b>
          </li>
          <li>
            Online: <b>{{ getLastRow().onlineAverageUtilizationTime }} horas</b>
          </li>
          <li>
            Para llevar: <b>{{ getLastRow().takeawayAverageUtilizationTime }} horas</b>
          </li>
          <li>
            Delivery: <b>{{ getLastRow().deliveryAverageUtilizationTime }} horas</b>
          </li>
          <li>
            Postre: <b>{{ getLastRow().dessertAverageUtilizationTime }} horas</b>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-4">
        <h6 class="text-lg underline">Servicio más rápido</h6>
        <p>
          <b>{{ getFastestService() }}</b>
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <h6 class="text-lg underline">Clientes atendidos por servicio</h6>
        <ul>
          <li>
            Mostrador: <b>{{ getLastRow().counterServedClients }}</b>
          </li>
          <li>
            Autoservicio: <b>{{ getLastRow().selfserviceServedClients }}</b>
          </li>
          <li>
            Online: <b>{{ getLastRow().onlineServedClients }}</b>
          </li>
          <li>
            Para llevar: <b>{{ getLastRow().takeawayServedClients }}</b>
          </li>
          <li>
            Delivery: <b>{{ getLastRow().deliveryServedClients }}</b>
          </li>
          <li>
            Postre: <b>{{ getLastRow().dessertServedClients }}</b>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-4">
        <h6 class="text-lg underline">Total clientes atendidos</h6>
        <p>
          <b>{{ getLastRow().servedClients }}</b>
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <h6 class="text-lg underline">Servicio con más clientes atendidos</h6>
        <p>
          <b>{{ getMostServedService() }}</b>
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationResultComponent {
  queueSimulationRows = input.required<QueueSimulationRow[]>();

  getLastRow(): QueueSimulationRow {
    return this.queueSimulationRows()[this.queueSimulationRows().length - 1];
  }

  getFastestService(): string {
    const services = [
      { name: 'Mostrador', time: this.getLastRow().counterAverageWaitingTime },
      { name: 'Autoservicio', time: this.getLastRow().selfserviceAverageWaitingTime },
      { name: 'Online', time: this.getLastRow().onlineAverageWaitingTime },
      { name: 'Para llevar', time: this.getLastRow().takeawayAverageWaitingTime },
      { name: 'Delivery', time: this.getLastRow().deliveryAverageWaitingTime },
    ];
    return services.reduce((prev, current) => (prev.time < current.time ? prev : current)).name;
  }

  getMostServedService(): string {
    const services = [
      { name: 'Mostrador', clients: this.getLastRow().counterServedClients },
      { name: 'Autoservicio', clients: this.getLastRow().selfserviceServedClients },
      { name: 'Online', clients: this.getLastRow().onlineServedClients },
      { name: 'Para llevar', clients: this.getLastRow().takeawayServedClients },
      { name: 'Delivery', clients: this.getLastRow().deliveryServedClients },
    ];
    return services.reduce((prev, current) => (prev.clients > current.clients ? prev : current)).name;
  }
}
