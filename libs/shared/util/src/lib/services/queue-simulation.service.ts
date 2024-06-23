import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ClientStateEnum, EventEnum, ServerStateEnum } from '@grupog/libs/shared/enum';
import {
  Client,
  ClientState,
  Event,
  QueueSimulation,
  QueueSimulationEvent,
  QueueSimulationRow,
  Server,
} from '@grupog/libs/shared/models';
import { truncateDecimals } from '../random-generators';

@Injectable()
export class QueueSimulationService {
  simulate(queueSimulation: QueueSimulation): Observable<QueueSimulationRow[]> {
    const {
      n,
      from,
      to,
      counterArrivalFrecuency,
      selfserviceArrivalFrecuency,
      onlineArrivalFrecuency,
      takewayArrivalFrecuency,
      deliveryArrivalFrecuency,
      counterEndOfServiceFrecuency,
      selfserviceEndOfServiceFrecuency,
      onlineEndOfServiceFrecuency,
      takeawayEndOfServiceFrecuency,
      deliveryEndOfServiceFrecuency,
    } = queueSimulation;

    let id = 1;
    let event: QueueSimulationEvent = EventEnum.INI;
    let clock = 0;

    let counterArrival = this.generateNextEvent(counterArrivalFrecuency, clock);
    let selfserviceArrival = this.generateNextEvent(selfserviceArrivalFrecuency, clock);
    let onlineArrival = this.generateNextEvent(onlineArrivalFrecuency, clock);
    let takeawayArrival = this.generateNextEvent(takewayArrivalFrecuency, clock);
    let deliveryArrival = this.generateNextEvent(deliveryArrivalFrecuency, clock);

    let counterEndOfService: Event = { rnd: null, time: null, nextTime: null };
    let selfserviceEndOfService: Event = { rnd: null, time: null, nextTime: null };
    let onlineEndOfService: Event = { rnd: null, time: null, nextTime: null };
    let takeawayEndOfService: Event = { rnd: null, time: null, nextTime: null };
    let deliveryEndOfService: Event = { rnd: null, time: null, nextTime: null };

    let counter1: Server = { id: 1, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let counter2: Server = { id: 2, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let counter3: Server = { id: 3, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let counter4: Server = { id: 4, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let counter5: Server = { id: 5, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let selfservice1: Server = { id: 1, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let selfservice2: Server = { id: 2, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let selfservice3: Server = { id: 3, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let online1: Server = { id: 1, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let online2: Server = { id: 2, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let online3: Server = { id: 3, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let takeaway1: Server = { id: 1, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let takeaway2: Server = { id: 2, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let delivery1: Server = { id: 1, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let delivery2: Server = { id: 2, state: ServerStateEnum.IDLE, nextEndOfService: null };
    let delivery3: Server = { id: 3, state: ServerStateEnum.IDLE, nextEndOfService: null };

    let counterQueue = 0;
    let selfserviceQueue = 0;
    let onlineQueue = 0;
    let takeawayQueue = 0;
    let deliveryQueue = 0;

    const queueSimulationRows: QueueSimulationRow[] = [
      {
        id,
        event,
        clock,
        counterArrival,
        selfserviceArrival,
        onlineArrival,
        takeawayArrival,
        deliveryArrival,
        counterEndOfService,
        selfserviceEndOfService,
        onlineEndOfService,
        takeawayEndOfService,
        deliveryEndOfService,
        counter1,
        counter2,
        counter3,
        counter4,
        counter5,
        selfservice1,
        selfservice2,
        selfservice3,
        online1,
        online2,
        online3,
        takeaway1,
        takeaway2,
        delivery1,
        delivery2,
        delivery3,
        counterQueue,
        selfserviceQueue,
        onlineQueue,
        takeawayQueue,
        deliveryQueue,
      },
    ];
    const clients: Client[] = [];

    let clientsQuantity = 0;
    let client: Client;

    for (let i = 1; i < n; i++) {
      id = i + 1;
      [event, clock] = this.getNextEvent({ ...queueSimulationRows[queueSimulationRows.length - 1] });

      // Limpiar valores de rnd, tiempo llegada y tiempo fin
      counterArrival = { ...counterArrival, rnd: null, time: null };
      selfserviceArrival = { ...selfserviceArrival, rnd: null, time: null };
      onlineArrival = { ...onlineArrival, rnd: null, time: null };
      takeawayArrival = { ...takeawayArrival, rnd: null, time: null };
      deliveryArrival = { ...deliveryArrival, rnd: null, time: null };

      switch (event) {
        case EventEnum.LLEG_MOST: {
          clientsQuantity++;

          counterArrival = this.generateNextEvent(counterArrivalFrecuency, clock);

          const idleServerId = this.getIdleServerId([counter1, counter2, counter3, counter4, counter5]);

          if (!idleServerId) {
            counterQueue++;

            client = { id: clientsQuantity, state: ClientStateEnum.ESP_ATE_MOST, arrivalTime: clock };
            clients.push(client);
            break;
          }

          counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);

          switch (idleServerId) {
            case 1: {
              counter1 = { ...counter1, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_MOST_1, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 2: {
              counter2 = { ...counter2, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_MOST_2, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 3: {
              counter3 = { ...counter3, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_MOST_3, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 4: {
              counter4 = { ...counter4, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_MOST_4, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 5: {
              counter5 = { ...counter5, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_MOST_5, arrivalTime: clock };
              clients.push(client);
              break;
            }
          }

          break;
        }
        case EventEnum.LLEG_AUTO: {
          clientsQuantity++;

          selfserviceArrival = this.generateNextEvent(selfserviceArrivalFrecuency, clock);

          const idleServerId = this.getIdleServerId([selfservice1, selfservice2, selfservice3]);

          if (!idleServerId) {
            selfserviceQueue++;

            client = { id: clientsQuantity, state: ClientStateEnum.ESP_ATE_AUTO, arrivalTime: clock };
            clients.push(client);
            break;
          }

          selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);

          switch (idleServerId) {
            case 1: {
              selfservice1 = {
                ...selfservice1,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: selfserviceEndOfService.nextTime,
              };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_AUTO_1, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 2: {
              selfservice2 = {
                ...selfservice2,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: selfserviceEndOfService.nextTime,
              };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_AUTO_2, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 3: {
              selfservice3 = {
                ...selfservice3,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: selfserviceEndOfService.nextTime,
              };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_AUTO_3, arrivalTime: clock };
              clients.push(client);
              break;
            }
          }

          break;
        }
        case EventEnum.LLEG_ONLINE: {
          clientsQuantity++;

          onlineArrival = this.generateNextEvent(onlineArrivalFrecuency, clock);

          const idleServerId = this.getIdleServerId([online1, online2, online3]);

          if (!idleServerId) {
            onlineQueue++;

            client = { id: clientsQuantity, state: ClientStateEnum.ESP_ATE_ONLINE, arrivalTime: clock };
            clients.push(client);
            break;
          }

          onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);

          switch (idleServerId) {
            case 1: {
              online1 = { ...online1, state: ServerStateEnum.ACTIVE, nextEndOfService: onlineEndOfService.nextTime };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_ONLINE_1, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 2: {
              online2 = { ...online2, state: ServerStateEnum.ACTIVE, nextEndOfService: onlineEndOfService.nextTime };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_ONLINE_2, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 3: {
              online3 = { ...online3, state: ServerStateEnum.ACTIVE, nextEndOfService: onlineEndOfService.nextTime };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_ONLINE_3, arrivalTime: clock };
              clients.push(client);
              break;
            }
          }

          break;
        }
        case EventEnum.LLEG_LLEVAR: {
          clientsQuantity++;

          takeawayArrival = this.generateNextEvent(takewayArrivalFrecuency, clock);

          const idleServerId = this.getIdleServerId([takeaway1, takeaway2]);

          if (!idleServerId) {
            takeawayQueue++;

            client = { id: clientsQuantity, state: ClientStateEnum.ESP_ATE_LLEVAR, arrivalTime: clock };
            clients.push(client);
            break;
          }

          takeawayEndOfService = this.generateNextEvent(takeawayEndOfServiceFrecuency, clock);

          switch (idleServerId) {
            case 1: {
              takeaway1 = {
                ...takeaway1,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: takeawayEndOfService.nextTime,
              };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_LLEVAR_1, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 2: {
              takeaway2 = {
                ...takeaway2,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: takeawayEndOfService.nextTime,
              };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_LLEVAR_2, arrivalTime: clock };
              clients.push(client);
              break;
            }
          }

          break;
        }
        case EventEnum.LLEG_DELI: {
          clientsQuantity++;

          deliveryArrival = this.generateNextEvent(deliveryArrivalFrecuency, clock);

          const idleServerId = this.getIdleServerId([delivery1, delivery2, delivery3]);

          if (!idleServerId) {
            deliveryQueue++;

            client = { id: clientsQuantity, state: ClientStateEnum.ESP_ATE_DELI, arrivalTime: clock };
            clients.push(client);
            break;
          }

          deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);

          switch (idleServerId) {
            case 1: {
              delivery1 = {
                ...delivery1,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: deliveryEndOfService.nextTime,
              };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_DELI_1, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 2: {
              delivery2 = {
                ...delivery2,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: deliveryEndOfService.nextTime,
              };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_DELI_2, arrivalTime: clock };
              clients.push(client);
              break;
            }
            case 3: {
              delivery3 = {
                ...delivery3,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: deliveryEndOfService.nextTime,
              };

              client = { id: clientsQuantity, state: ClientStateEnum.SIE_ATE_DELI_3, arrivalTime: clock };
              clients.push(client);
              break;
            }
          }

          break;
        }
        case EventEnum.FIN_MOST_1: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_MOST_1);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter1 = { ...counter1, nextEndOfService: counterEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_MOST);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_MOST_1;
            break;
          }

          counter1 = { ...counter1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_MOST_2: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_MOST_2);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter2 = { ...counter2, nextEndOfService: counterEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_MOST);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_MOST_2;
            break;
          }

          counter2 = { ...counter2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_MOST_3: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_MOST_3);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter3 = { ...counter3, nextEndOfService: counterEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_MOST);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_MOST_3;
            break;
          }

          counter3 = { ...counter3, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_MOST_4: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_MOST_4);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter4 = { ...counter4, nextEndOfService: counterEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_MOST);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_MOST_4;
            break;
          }

          counter4 = { ...counter4, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_MOST_5: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_MOST_5);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter5 = { ...counter5, nextEndOfService: counterEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_MOST);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_MOST_5;
            break;
          }

          counter5 = { ...counter5, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_AUTO_1: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_AUTO_1);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);

            selfservice1 = { ...selfservice1, nextEndOfService: selfserviceEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_AUTO);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_AUTO_1;
            break;
          }

          selfservice1 = { ...selfservice1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_AUTO_2: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_AUTO_2);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);
            selfservice2 = { ...selfservice2, nextEndOfService: selfserviceEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_AUTO);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_AUTO_2;
            break;
          }

          selfservice2 = { ...selfservice2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_AUTO_3: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_AUTO_3);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);
            selfservice3 = { ...selfservice3, nextEndOfService: selfserviceEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_AUTO);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_AUTO_3;
            break;
          }

          selfservice3 = { ...selfservice3, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_ONLINE_1: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_ONLINE_1);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online1 = { ...online1, nextEndOfService: onlineEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_ONLINE);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_ONLINE_1;
            break;
          }

          online1 = { ...online1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_ONLINE_2: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_ONLINE_2);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online2 = { ...online2, nextEndOfService: onlineEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_ONLINE);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_ONLINE_2;
            break;
          }

          online2 = { ...online2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_ONLINE_3: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_ONLINE_3);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online3 = { ...online3, nextEndOfService: onlineEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_ONLINE);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_ONLINE_3;
            break;
          }

          online3 = { ...online3, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_LLEVAR_1: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_LLEVAR_1);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (takeawayQueue > 0) {
            takeawayQueue--;

            takeawayEndOfService = this.generateNextEvent(takeawayEndOfServiceFrecuency, clock);
            takeaway1 = { ...takeaway1, nextEndOfService: takeawayEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_LLEVAR);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_LLEVAR_1;
            break;
          }

          takeaway1 = { ...takeaway1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_LLEVAR_2: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_LLEVAR_2);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (takeawayQueue > 0) {
            takeawayQueue--;

            takeawayEndOfService = this.generateNextEvent(takeawayEndOfServiceFrecuency, clock);
            takeaway2 = { ...takeaway2, nextEndOfService: takeawayEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_LLEVAR);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_LLEVAR_2;
            break;
          }

          takeaway2 = { ...takeaway2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_DELI_1: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_DELI_1);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery1 = { ...delivery1, nextEndOfService: deliveryEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_DELI);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_DELI_1;
            break;
          }

          delivery1 = { ...delivery1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_DELI_2: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_DELI_2);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery2 = { ...delivery2, nextEndOfService: deliveryEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_DELI);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_DELI_2;
            break;
          }

          delivery2 = { ...delivery2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_DELI_3: {
          const clientToDestroy = this.getNextClient(clients, ClientStateEnum.SIE_ATE_DELI_3);
          clientToDestroy.state = null;
          clientToDestroy.arrivalTime = null;

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery3 = { ...delivery3, nextEndOfService: deliveryEndOfService.nextTime };

            const clientToUpdate = this.getNextClient(clients, ClientStateEnum.ESP_ATE_DELI);
            clientToUpdate.state = ClientStateEnum.SIE_ATE_DELI_2;
            break;
          }

          delivery3 = { ...delivery3, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
      }

      queueSimulationRows.push({
        id,
        event,
        clock,
        counterArrival,
        selfserviceArrival,
        onlineArrival,
        takeawayArrival,
        deliveryArrival,
        counterEndOfService,
        selfserviceEndOfService,
        onlineEndOfService,
        takeawayEndOfService,
        deliveryEndOfService,
        counter1,
        counter2,
        counter3,
        counter4,
        counter5,
        selfservice1,
        selfservice2,
        selfservice3,
        online1,
        online2,
        online3,
        takeaway1,
        takeaway2,
        delivery1,
        delivery2,
        delivery3,
        counterQueue,
        selfserviceQueue,
        onlineQueue,
        takeawayQueue,
        deliveryQueue,
        ...clients.reduce(
          (
            acc: { [key: string]: { state: string | null; arrivalTime: number | null } },
            { id, state, arrivalTime }
          ) => {
            acc[`client${id}`] = { state, arrivalTime };
            return acc;
          },
          {}
        ),
      });
    }

    return of(
      queueSimulationRows.splice(from - 1, to - from + 1).concat(queueSimulationRows[queueSimulationRows.length - 1])
    );
  }

  private generarRandomExponencialNegativa(frecuency: number, rnd: number): number {
    return -frecuency * Math.log(1 - rnd);
  }

  private generateNextEvent(frequency: number, clock: number): Event {
    const rnd = truncateDecimals(Math.random(), 2);
    const time = truncateDecimals(this.generarRandomExponencialNegativa(frequency, rnd), 2);
    const nextTime = truncateDecimals(clock + time, 2);
    return { rnd, time, nextTime };
  }

  private getNextEvent(previousState: QueueSimulationRow): [QueueSimulationEvent, number] {
    const events = this.getEvents(previousState);
    const { event, time } = events.reduce((event, currentEvent) => {
      if (currentEvent.time && event.time && currentEvent.time < event.time) {
        return currentEvent;
      }
      return event;
    }, events[0]);
    return [event, time];
  }

  private getIdleServerId(servers: Server[]): number | undefined {
    return servers.find((server) => server.state === ServerStateEnum.IDLE)?.id;
  }

  private getEvents(previousState: QueueSimulationRow): { event: QueueSimulationEvent; time: number }[] {
    const {
      counterArrival,
      selfserviceArrival,
      onlineArrival,
      takeawayArrival,
      deliveryArrival,
      counter1,
      counter2,
      counter3,
      counter4,
      counter5,
      selfservice1,
      selfservice2,
      selfservice3,
      online1,
      online2,
      online3,
      takeaway1,
      takeaway2,
      delivery1,
      delivery2,
      delivery3,
    } = previousState;
    return [
      {
        event: EventEnum.LLEG_MOST as QueueSimulationEvent,
        time: counterArrival?.nextTime ?? -1,
      },
      {
        event: EventEnum.LLEG_AUTO as QueueSimulationEvent,
        time: selfserviceArrival?.nextTime ?? -1,
      },
      {
        event: EventEnum.LLEG_ONLINE as QueueSimulationEvent,
        time: onlineArrival?.nextTime ?? -1,
      },
      {
        event: EventEnum.LLEG_LLEVAR as QueueSimulationEvent,
        time: takeawayArrival?.nextTime ?? -1,
      },
      {
        event: EventEnum.LLEG_DELI as QueueSimulationEvent,
        time: deliveryArrival?.nextTime ?? -1,
      },
      {
        event: EventEnum.FIN_MOST_1 as QueueSimulationEvent,
        time: counter1.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_MOST_2 as QueueSimulationEvent,
        time: counter2.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_MOST_3 as QueueSimulationEvent,
        time: counter3.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_MOST_4 as QueueSimulationEvent,
        time: counter4.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_MOST_5 as QueueSimulationEvent,
        time: counter5.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_AUTO_1 as QueueSimulationEvent,
        time: selfservice1.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_AUTO_2 as QueueSimulationEvent,
        time: selfservice2.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_AUTO_3 as QueueSimulationEvent,
        time: selfservice3.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_ONLINE_1 as QueueSimulationEvent,
        time: online1.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_ONLINE_2 as QueueSimulationEvent,
        time: online2.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_ONLINE_3 as QueueSimulationEvent,
        time: online3.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_LLEVAR_1 as QueueSimulationEvent,
        time: takeaway1.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_LLEVAR_2 as QueueSimulationEvent,
        time: takeaway2.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_DELI_1 as QueueSimulationEvent,
        time: delivery1.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_DELI_2 as QueueSimulationEvent,
        time: delivery2.nextEndOfService ?? -1,
      },
      {
        event: EventEnum.FIN_DELI_3 as QueueSimulationEvent,
        time: delivery3.nextEndOfService ?? -1,
      },
    ].filter(({ time }) => time > -1);
  }

  private getNextClient(clients: Client[], state: ClientState): Client {
    return clients.reduce((client, currentClient) => {
      if (
        currentClient.state === state &&
        currentClient.arrivalTime &&
        client.arrivalTime &&
        currentClient.arrivalTime < client.arrivalTime
      ) {
        return currentClient;
      }
      return client;
    }, clients[0]);
  }
}
