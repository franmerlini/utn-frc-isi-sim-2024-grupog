import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TableModule } from 'primeng/table';

import { QueueSimulationRow } from '@grupog/libs/shared/models';

@Component({
  selector: 'gg-simulation-table',
  standalone: true,
  imports: [TableModule],
  template: `
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold underline">Resultados de simulación</h1>

      <p-table
        [value]="queueSimulationRows()"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        [rowsPerPageOptions]="[10, 15, 20]"
        styleClass="p-datatable-sm p-datatable-striped"
      >
        <ng-template pTemplate="header">
          <tr>
            <th rowspan="3">#</th>
            <th rowspan="3">Evento</th>
            <th rowspan="3">Reloj (horas)</th>
            <th colspan="3">Llegada mostrador</th>
            <th colspan="3">Llegada autoservicio</th>
            <th colspan="3">Llegada online</th>
            <th colspan="3">Llegada para llevar</th>
            <th colspan="3">Llegada delivery</th>
            <th colspan="3">Fin atención mostrador</th>
            <th colspan="3">Fin atención autoservicio</th>
            <th colspan="3">Fin atención online</th>
            <th colspan="3">Fin atención para llevar</th>
            <th colspan="3">Fin atención delivery</th>
            <th colspan="10">Empleados mostrador</th>
            <th colspan="6">Estaciones autoservicio</th>
            <th colspan="6">Empleados online</th>
            <th colspan="4">Empleados para llevar</th>
            <th colspan="6">Empleados delivery</th>
            <th colspan="5">Colas</th>
            <th colspan="10">Tiempo de espera promedio</th>
            <th [colSpan]="getClientsQuantity() * 2">Clientes</th>
          </tr>
          <tr>
            <th rowspan="2">RND 1</th>
            <th rowspan="2">Tiempo llegada</th>
            <th rowspan="2">Próxima llegada</th>
            <th rowspan="2">RND 2</th>
            <th rowspan="2">Tiempo llegada</th>
            <th rowspan="2">Próxima llegada</th>
            <th rowspan="2">RND 3</th>
            <th rowspan="2">Tiempo llegada</th>
            <th rowspan="2">Próxima llegada</th>
            <th rowspan="2">RND 4</th>
            <th rowspan="2">Tiempo llegada</th>
            <th rowspan="2">Próxima llegada</th>
            <th rowspan="2">RND 5</th>
            <th rowspan="2">Tiempo llegada</th>
            <th rowspan="2">Próxima llegada</th>
            <th rowspan="2">RND 6</th>
            <th rowspan="2">Tiempo fin</th>
            <th rowspan="2">Próximo fin</th>
            <th rowspan="2">RND 7</th>
            <th rowspan="2">Tiempo fin</th>
            <th rowspan="2">Próximo fin</th>
            <th rowspan="2">RND 8</th>
            <th rowspan="2">Tiempo fin</th>
            <th rowspan="2">Próximo fin</th>
            <th rowspan="2">RND 9</th>
            <th rowspan="2">Tiempo fin</th>
            <th rowspan="2">Próximo fin</th>
            <th rowspan="2">RND 10</th>
            <th rowspan="2">Tiempo fin</th>
            <th rowspan="2">Próximo fin</th>
            <th colspan="2">1</th>
            <th colspan="2">2</th>
            <th colspan="2">3</th>
            <th colspan="2">4</th>
            <th colspan="2">5</th>
            <th colspan="2">1</th>
            <th colspan="2">2</th>
            <th colspan="2">3</th>
            <th colspan="2">1</th>
            <th colspan="2">2</th>
            <th colspan="2">3</th>
            <th colspan="2">1</th>
            <th colspan="2">2</th>
            <th colspan="2">1</th>
            <th colspan="2">2</th>
            <th colspan="2">3</th>
            <th rowspan="2">Mostrador</th>
            <th rowspan="2">Autoservicio</th>
            <th rowspan="2">Online</th>
            <th rowspan="2">Para llevar</th>
            <th rowspan="2">Delivery</th>
            <th rowspan="2">Acum tiempo espera mostrador</th>
            <th rowspan="2">Acum tiempo espera autoservicio</th>
            <th rowspan="2">Acum tiempo espera online</th>
            <th rowspan="2">Acum tiempo espera para llevar</th>
            <th rowspan="2">Acum tiempo espera delivery</th>
            <th rowspan="2">Porcentaje tiempo espera mostrador</th>
            <th rowspan="2">Porcentaje tiempo espera autoservicio</th>
            <th rowspan="2">Porcentaje tiempo espera online</th>
            <th rowspan="2">Porcentaje tiempo espera para llevar</th>
            <th rowspan="2">Porcentaje tiempo espera delivery</th>
            @for(number of getNumberArray(); track number) {
            <th colspan="2">{{ number }}</th>
            }
          </tr>
          <tr>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            <th>Estado</th>
            <th>Próximo fin</th>
            @for(number of getNumberArray(); track number) {
            <th>Estado</th>
            <th>Hora llegada</th>
            }
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-row>
          <tr>
            <td>{{ row.id }}</td>
            <td>{{ row.event }}</td>
            <td>{{ row.clock }}</td>

            <td>{{ row.counterArrival.rnd }}</td>
            <td>{{ row.counterArrival.time }}</td>
            <td>{{ row.counterArrival.nextTime }}</td>
            <td>{{ row.selfserviceArrival.rnd }}</td>
            <td>{{ row.selfserviceArrival.time }}</td>
            <td>{{ row.selfserviceArrival.nextTime }}</td>
            <td>{{ row.onlineArrival.rnd }}</td>
            <td>{{ row.onlineArrival.time }}</td>
            <td>{{ row.onlineArrival.nextTime }}</td>
            <td>{{ row.takeawayArrival.rnd }}</td>
            <td>{{ row.takeawayArrival.time }}</td>
            <td>{{ row.takeawayArrival.nextTime }}</td>
            <td>{{ row.deliveryArrival.rnd }}</td>
            <td>{{ row.deliveryArrival.time }}</td>
            <td>{{ row.deliveryArrival.nextTime }}</td>

            <td>{{ row.counterEndOfService.rnd }}</td>
            <td>{{ row.counterEndOfService.time }}</td>
            <td>{{ row.counterEndOfService.nextTime }}</td>
            <td>{{ row.selfserviceEndOfService.rnd }}</td>
            <td>{{ row.selfserviceEndOfService.time }}</td>
            <td>{{ row.selfserviceEndOfService.nextTime }}</td>
            <td>{{ row.onlineEndOfService.rnd }}</td>
            <td>{{ row.onlineEndOfService.time }}</td>
            <td>{{ row.onlineEndOfService.nextTime }}</td>
            <td>{{ row.takeawayEndOfService.rnd }}</td>
            <td>{{ row.takeawayEndOfService.time }}</td>
            <td>{{ row.takeawayEndOfService.nextTime }}</td>
            <td>{{ row.deliveryEndOfService.rnd }}</td>
            <td>{{ row.deliveryEndOfService.time }}</td>
            <td>{{ row.deliveryEndOfService.nextTime }}</td>
            <td>{{ row.counter1.state }}</td>
            <td>{{ row.counter1.nextEndOfService }}</td>
            <td>{{ row.counter2.state }}</td>
            <td>{{ row.counter2.nextEndOfService }}</td>
            <td>{{ row.counter3.state }}</td>
            <td>{{ row.counter3.nextEndOfService }}</td>
            <td>{{ row.counter4.state }}</td>
            <td>{{ row.counter4.nextEndOfService }}</td>
            <td>{{ row.counter5.state }}</td>
            <td>{{ row.counter5.nextEndOfService }}</td>
            <td>{{ row.selfservice1.state }}</td>
            <td>{{ row.selfservice1.nextEndOfService }}</td>
            <td>{{ row.selfservice2.state }}</td>
            <td>{{ row.selfservice2.nextEndOfService }}</td>
            <td>{{ row.selfservice3.state }}</td>
            <td>{{ row.selfservice3.nextEndOfService }}</td>
            <td>{{ row.online1.state }}</td>
            <td>{{ row.online1.nextEndOfService }}</td>
            <td>{{ row.online2.state }}</td>
            <td>{{ row.online2.nextEndOfService }}</td>
            <td>{{ row.online3.state }}</td>
            <td>{{ row.online3.nextEndOfService }}</td>
            <td>{{ row.takeaway1.state }}</td>
            <td>{{ row.takeaway1.nextEndOfService }}</td>
            <td>{{ row.takeaway2.state }}</td>
            <td>{{ row.takeaway2.nextEndOfService }}</td>
            <td>{{ row.delivery1.state }}</td>
            <td>{{ row.delivery1.nextEndOfService }}</td>
            <td>{{ row.delivery2.state }}</td>
            <td>{{ row.delivery2.nextEndOfService }}</td>
            <td>{{ row.delivery3.state }}</td>
            <td>{{ row.delivery3.nextEndOfService }}</td>

            <td>{{ row.counterQueue }}</td>
            <td>{{ row.selfserviceQueue }}</td>
            <td>{{ row.onlineQueue }}</td>
            <td>{{ row.takeawayQueue }}</td>
            <td>{{ row.deliveryQueue }}</td>

            <td>{{ row.counterWaitingTime }}</td>
            <td>{{ row.selfserviceWaitingTime }}</td>
            <td>{{ row.onlineWaitingTime }}</td>
            <td>{{ row.takeawayWaitingTime }}</td>
            <td>{{ row.deliveryWaitingTime }}</td>
            <td>{{ row.counterAverageWaitingTime }}</td>
            <td>{{ row.selfserviceAverageWaitingTime }}</td>
            <td>{{ row.onlineAverageWaitingTime }}</td>
            <td>{{ row.takeawayAverageWaitingTime }}</td>
            <td>{{ row.deliveryAverageWaitingTime }}</td>

            @for(client of row.clients; track client.id) {
            <td>{{ client.state }}</td>
            <td>{{ client.arrivalTime }}</td>
            }
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [
    `
      th {
        border-width: 0 1px 1px 0;
      }

      th,
      td {
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationTableComponent {
  queueSimulationRows = input.required<QueueSimulationRow[]>();

  getClientsQuantity(): number {
    return this.queueSimulationRows()[this.queueSimulationRows().length - 1]?.clients?.length ?? 0;
  }

  getNumberArray(): number[] {
    return Array.from({ length: this.getClientsQuantity() }, (_, i) => i + 1);
  }
}
