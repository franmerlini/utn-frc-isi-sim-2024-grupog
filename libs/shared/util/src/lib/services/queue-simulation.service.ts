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

    let counterWaitingTime = 0;
    let selfserviceWaitingTime = 0;
    let onlineWaitingTime = 0;
    let takeawayWaitingTime = 0;
    let deliveryWaitingTime = 0;
    let counterAverageWaitingTime = 0;
    let selfserviceAverageWaitingTime = 0;
    let onlineAverageWaitingTime = 0;
    let takeawayAverageWaitingTime = 0;
    let deliveryAverageWaitingTime = 0;

    const clients: Client[] = [];

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
        counterWaitingTime,
        selfserviceWaitingTime,
        onlineWaitingTime,
        takeawayWaitingTime,
        deliveryWaitingTime,
        counterAverageWaitingTime,
        selfserviceAverageWaitingTime,
        onlineAverageWaitingTime,
        takeawayAverageWaitingTime,
        deliveryAverageWaitingTime,
        clients: [...clients],
      },
    ];

    let clientsQuantity = 0;
    let clientToDestroy: Client | null = null;
    let clientToUpdate: Client | null = null;

    for (let i = 1; i < n; i++) {
      id = i + 1;
      [event, clock] = this.getNextEvent({ ...queueSimulationRows[queueSimulationRows.length - 1] });

      counterArrival = { ...counterArrival, rnd: null, time: null };
      selfserviceArrival = { ...selfserviceArrival, rnd: null, time: null };
      onlineArrival = { ...onlineArrival, rnd: null, time: null };
      takeawayArrival = { ...takeawayArrival, rnd: null, time: null };
      deliveryArrival = { ...deliveryArrival, rnd: null, time: null };
      counterEndOfService = { rnd: null, time: null, nextTime: null };
      selfserviceEndOfService = { rnd: null, time: null, nextTime: null };
      onlineEndOfService = { rnd: null, time: null, nextTime: null };
      takeawayEndOfService = { rnd: null, time: null, nextTime: null };
      deliveryEndOfService = { rnd: null, time: null, nextTime: null };

      switch (event) {
        case EventEnum.LLEG_MOST: {
          clientsQuantity++;

          counterArrival = this.generateNextEvent(counterArrivalFrecuency, clock);

          const idleServerId = this.getIdleServerId([counter1, counter2, counter3, counter4, counter5]);

          if (!idleServerId) {
            counterQueue++;

            clients.push({ id: clientsQuantity, state: ClientStateEnum.WAITING_COUNTER, arrivalTime: clock });
            break;
          }

          counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);

          switch (idleServerId) {
            case 1: {
              counter1 = { ...counter1, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_1, arrivalTime: clock });
              break;
            }
            case 2: {
              counter2 = { ...counter2, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_2, arrivalTime: clock });
              break;
            }
            case 3: {
              counter3 = { ...counter3, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_3, arrivalTime: clock });
              break;
            }
            case 4: {
              counter4 = { ...counter4, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              clients.push();
              break;
            }
            case 5: {
              counter5 = { ...counter5, state: ServerStateEnum.ACTIVE, nextEndOfService: counterEndOfService.nextTime };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_5, arrivalTime: clock });
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

            clients.push({ id: clientsQuantity, state: ClientStateEnum.WAITING_SELFSERVICE, arrivalTime: clock });
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

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_SELFSERVICE_1, arrivalTime: clock });
              break;
            }
            case 2: {
              selfservice2 = {
                ...selfservice2,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: selfserviceEndOfService.nextTime,
              };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_SELFSERVICE_2, arrivalTime: clock });
              break;
            }
            case 3: {
              selfservice3 = {
                ...selfservice3,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: selfserviceEndOfService.nextTime,
              };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_SELFSERVICE_3, arrivalTime: clock });
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

            clients.push({ id: clientsQuantity, state: ClientStateEnum.WAITING_ONLINE, arrivalTime: clock });
            break;
          }

          onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);

          switch (idleServerId) {
            case 1: {
              online1 = { ...online1, state: ServerStateEnum.ACTIVE, nextEndOfService: onlineEndOfService.nextTime };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_ONLINE_1, arrivalTime: clock });
              break;
            }
            case 2: {
              online2 = { ...online2, state: ServerStateEnum.ACTIVE, nextEndOfService: onlineEndOfService.nextTime };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_ONLINE_2, arrivalTime: clock });
              break;
            }
            case 3: {
              online3 = { ...online3, state: ServerStateEnum.ACTIVE, nextEndOfService: onlineEndOfService.nextTime };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_ONLINE_3, arrivalTime: clock });
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

            clients.push({ id: clientsQuantity, state: ClientStateEnum.WAITING_TAKEAWAY, arrivalTime: clock });
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

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_TAKEAWAY_1, arrivalTime: clock });
              break;
            }
            case 2: {
              takeaway2 = {
                ...takeaway2,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: takeawayEndOfService.nextTime,
              };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_TAKEAWAY_2, arrivalTime: clock });
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

            clients.push({ id: clientsQuantity, state: ClientStateEnum.WAITING_DELIVERY, arrivalTime: clock });
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

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_DELIVERY_1, arrivalTime: clock });
              break;
            }
            case 2: {
              delivery2 = {
                ...delivery2,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: deliveryEndOfService.nextTime,
              };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_DELIVERY_2, arrivalTime: clock });
              break;
            }
            case 3: {
              delivery3 = {
                ...delivery3,
                state: ServerStateEnum.ACTIVE,
                nextEndOfService: deliveryEndOfService.nextTime,
              };

              clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_DELIVERY_3, arrivalTime: clock });
              break;
            }
          }

          break;
        }
        case EventEnum.FIN_MOST_1: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_COUNTER_1),
            state: null,
            arrivalTime: null,
          };

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter1 = { ...counter1, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_1,
            };

            counterWaitingTime = truncateDecimals(
              counterWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            counterAverageWaitingTime =
              counterWaitingTime === 0 ? 0 : truncateDecimals((clock / counterWaitingTime) * 100, 2);
            break;
          }

          counter1 = { ...counter1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_MOST_2: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_COUNTER_2),
            state: null,
            arrivalTime: null,
          };

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter2 = { ...counter2, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_2,
            };

            counterWaitingTime = truncateDecimals(
              counterWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );

            break;
          }

          counter2 = { ...counter2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_MOST_3: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_COUNTER_3),
            state: null,
            arrivalTime: null,
          };

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter3 = { ...counter3, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_3,
            };

            counterWaitingTime = truncateDecimals(
              counterWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            counterAverageWaitingTime =
              counterWaitingTime === 0 ? 0 : truncateDecimals((clock / counterWaitingTime) * 100, 2);
            break;
          }

          counter3 = { ...counter3, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_MOST_4: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_COUNTER_4),
            state: null,
            arrivalTime: null,
          };

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter4 = { ...counter4, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_4,
            };

            counterWaitingTime = truncateDecimals(
              counterWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            counterAverageWaitingTime =
              counterWaitingTime === 0 ? 0 : truncateDecimals((clock / counterWaitingTime) * 100, 2);
            break;
          }

          counter4 = { ...counter4, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_MOST_5: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_COUNTER_5),
            state: null,
            arrivalTime: null,
          };

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter5 = { ...counter5, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_5,
            };

            counterWaitingTime = truncateDecimals(
              counterWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            counterAverageWaitingTime =
              counterWaitingTime === 0 ? 0 : truncateDecimals((clock / counterWaitingTime) * 100, 2);
            break;
          }

          counter5 = { ...counter5, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_AUTO_1: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_SELFSERVICE_1),
            state: null,
            arrivalTime: null,
          };

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);

            selfservice1 = { ...selfservice1, nextEndOfService: selfserviceEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_SELFSERVICE),
              state: ClientStateEnum.IN_SELFSERVICE_1,
            };

            selfserviceWaitingTime = truncateDecimals(
              selfserviceWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            selfserviceAverageWaitingTime =
              selfserviceWaitingTime === 0 ? 0 : truncateDecimals((clock / selfserviceWaitingTime) * 100, 2);
            break;
          }

          selfservice1 = { ...selfservice1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_AUTO_2: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_SELFSERVICE_2),
            state: null,
            arrivalTime: null,
          };

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);
            selfservice2 = { ...selfservice2, nextEndOfService: selfserviceEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_SELFSERVICE),
              state: ClientStateEnum.IN_SELFSERVICE_2,
            };

            selfserviceWaitingTime = truncateDecimals(
              selfserviceWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            selfserviceAverageWaitingTime =
              selfserviceWaitingTime === 0 ? 0 : truncateDecimals((clock / selfserviceWaitingTime) * 100, 2);
            break;
          }

          selfservice2 = { ...selfservice2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_AUTO_3: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_SELFSERVICE_3),
            state: null,
            arrivalTime: null,
          };

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);
            selfservice3 = { ...selfservice3, nextEndOfService: selfserviceEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_SELFSERVICE),
              state: ClientStateEnum.IN_SELFSERVICE_3,
            };

            selfserviceWaitingTime = truncateDecimals(
              selfserviceWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            selfserviceAverageWaitingTime =
              selfserviceWaitingTime === 0 ? 0 : truncateDecimals((clock / selfserviceWaitingTime) * 100, 2);
            break;
          }

          selfservice3 = { ...selfservice3, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_ONLINE_1: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_ONLINE_1),
            state: null,
            arrivalTime: null,
          };

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online1 = { ...online1, nextEndOfService: onlineEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_ONLINE),
              state: ClientStateEnum.IN_ONLINE_1,
            };

            onlineWaitingTime = truncateDecimals(onlineWaitingTime + clock - (clientToUpdate.arrivalTime as number), 2);
            onlineAverageWaitingTime =
              onlineWaitingTime === 0 ? 0 : truncateDecimals((clock / onlineWaitingTime) * 100, 2);
            break;
          }

          online1 = { ...online1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_ONLINE_2: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_ONLINE_2),
            state: null,
            arrivalTime: null,
          };

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online2 = { ...online2, nextEndOfService: onlineEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_ONLINE),
              state: ClientStateEnum.IN_ONLINE_2,
            };

            onlineWaitingTime = truncateDecimals(onlineWaitingTime + clock - (clientToUpdate.arrivalTime as number), 2);
            onlineAverageWaitingTime =
              onlineWaitingTime === 0 ? 0 : truncateDecimals((clock / onlineWaitingTime) * 100, 2);
            break;
          }

          online2 = { ...online2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_ONLINE_3: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_ONLINE_3),
            state: null,
            arrivalTime: null,
          };

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online3 = { ...online3, nextEndOfService: onlineEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_ONLINE),
              state: ClientStateEnum.IN_ONLINE_3,
            };

            onlineWaitingTime = truncateDecimals(onlineWaitingTime + clock - (clientToUpdate.arrivalTime as number), 2);
            onlineAverageWaitingTime =
              onlineWaitingTime === 0 ? 0 : truncateDecimals((clock / onlineWaitingTime) * 100, 2);
            break;
          }

          online3 = { ...online3, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_LLEVAR_1: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_TAKEAWAY_1),
            state: null,
            arrivalTime: null,
          };

          if (takeawayQueue > 0) {
            takeawayQueue--;

            takeawayEndOfService = this.generateNextEvent(takeawayEndOfServiceFrecuency, clock);
            takeaway1 = { ...takeaway1, nextEndOfService: takeawayEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_TAKEAWAY),
              state: ClientStateEnum.IN_TAKEAWAY_1,
            };

            takeawayWaitingTime = truncateDecimals(
              takeawayWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            takeawayAverageWaitingTime =
              takeawayWaitingTime === 0 ? 0 : truncateDecimals((clock / takeawayWaitingTime) * 100, 2);
            break;
          }

          takeaway1 = { ...takeaway1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_LLEVAR_2: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_TAKEAWAY_2),
            state: null,
            arrivalTime: null,
          };

          if (takeawayQueue > 0) {
            takeawayQueue--;

            takeawayEndOfService = this.generateNextEvent(takeawayEndOfServiceFrecuency, clock);
            takeaway2 = { ...takeaway2, nextEndOfService: takeawayEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_TAKEAWAY),
              state: ClientStateEnum.IN_TAKEAWAY_2,
            };

            takeawayWaitingTime = truncateDecimals(
              takeawayWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            takeawayAverageWaitingTime =
              takeawayWaitingTime === 0 ? 0 : truncateDecimals((clock / takeawayWaitingTime) * 100, 2);
            break;
          }

          takeaway2 = { ...takeaway2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_DELI_1: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_DELIVERY_1),
            state: null,
            arrivalTime: null,
          };

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery1 = { ...delivery1, nextEndOfService: deliveryEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_DELIVERY),
              state: ClientStateEnum.IN_DELIVERY_1,
            };

            deliveryWaitingTime = truncateDecimals(
              deliveryWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            deliveryAverageWaitingTime =
              deliveryWaitingTime === 0 ? 0 : truncateDecimals((clock / deliveryWaitingTime) * 100, 2);
            break;
          }

          delivery1 = { ...delivery1, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_DELI_2: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_DELIVERY_2),
            state: null,
            arrivalTime: null,
          };

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery2 = { ...delivery2, nextEndOfService: deliveryEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_DELIVERY),
              state: ClientStateEnum.IN_DELIVERY_2,
            };

            deliveryWaitingTime = truncateDecimals(
              deliveryWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            deliveryAverageWaitingTime =
              deliveryWaitingTime === 0 ? 0 : truncateDecimals((clock / deliveryWaitingTime) * 100, 2);
            break;
          }

          delivery2 = { ...delivery2, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
        case EventEnum.FIN_DELI_3: {
          clientToDestroy = {
            ...this.getNextClient(clients, ClientStateEnum.IN_DELIVERY_3),
            state: null,
            arrivalTime: null,
          };

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery3 = { ...delivery3, nextEndOfService: deliveryEndOfService.nextTime };

            clientToUpdate = {
              ...this.getNextClient(clients, ClientStateEnum.WAITING_DELIVERY),
              state: ClientStateEnum.IN_DELIVERY_3,
            };

            deliveryWaitingTime = truncateDecimals(
              deliveryWaitingTime + clock - (clientToUpdate.arrivalTime as number),
              2
            );
            deliveryAverageWaitingTime =
              deliveryWaitingTime === 0 ? 0 : truncateDecimals((clock / deliveryWaitingTime) * 100, 2);
            break;
          }

          delivery3 = { ...delivery3, state: ServerStateEnum.IDLE, nextEndOfService: null };
          break;
        }
      }

      if (clientToDestroy) {
        clients[clientToDestroy.id - 1] = clientToDestroy;
      }

      if (clientToUpdate) {
        clients[clientToUpdate.id - 1] = clientToUpdate;
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
        counterWaitingTime,
        selfserviceWaitingTime,
        onlineWaitingTime,
        takeawayWaitingTime,
        deliveryWaitingTime,
        counterAverageWaitingTime,
        selfserviceAverageWaitingTime,
        onlineAverageWaitingTime,
        takeawayAverageWaitingTime,
        deliveryAverageWaitingTime,
        clients: [...clients],
      });
    }

    const lastRow = queueSimulationRows[queueSimulationRows.length - 1];

    const completedQueueSimulationRows = queueSimulationRows.map((row) => {
      while (row.clients?.length < lastRow.clients?.length) {
        row.clients.push({ id: -1, state: null, arrivalTime: null });
      }
      return row;
    });

    const splicedSimulationRows = completedQueueSimulationRows.splice(from - 1, to - from + 1).concat(lastRow);

    return of(splicedSimulationRows);
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
    return servers.find(({ state }) => state === ServerStateEnum.IDLE)?.id;
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
    return clients
      .filter((client) => client.state === state && client.arrivalTime)
      .reduce((client, currentClient) =>
        currentClient.arrivalTime && client.arrivalTime && currentClient.arrivalTime < client.arrivalTime
          ? currentClient
          : client
      );
  }
}
