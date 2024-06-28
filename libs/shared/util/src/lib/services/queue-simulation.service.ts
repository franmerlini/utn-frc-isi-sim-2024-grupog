import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ClientStateEnum, EventEnum, ServerStateEnum } from '@grupog/libs/shared/enum';
import {
  BooleanProbability,
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
      dessertPercent,
      counterEndOfServiceFrecuency,
      selfserviceEndOfServiceFrecuency,
      onlineEndOfServiceFrecuency,
      takeawayEndOfServiceFrecuency,
      deliveryEndOfServiceFrecuency,
      dessertEndOfServiceFrecuency,
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
    let dessertProbability: BooleanProbability = { rnd: null, value: null };
    let dessertEndOfService: Event = { rnd: null, time: null, nextTime: null };

    let counter1: Server = { id: 1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let counter2: Server = { id: 2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let counter3: Server = { id: 3, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let counter4: Server = { id: 4, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let counter5: Server = { id: 5, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let selfservice1: Server = { id: 1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let selfservice2: Server = { id: 2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let selfservice3: Server = { id: 3, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let online1: Server = { id: 1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let online2: Server = { id: 2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let online3: Server = { id: 3, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let takeaway1: Server = { id: 1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let takeaway2: Server = { id: 2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let delivery1: Server = { id: 1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let delivery2: Server = { id: 2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let delivery3: Server = { id: 3, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
    let dessert: Server = { id: 1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };

    let counterQueue = 0;
    let selfserviceQueue = 0;
    let onlineQueue = 0;
    let takeawayQueue = 0;
    let deliveryQueue = 0;
    let dessertQueue = 0;

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
    let counterUtilizationTime = 0;
    let selfserviceUtilizationTime = 0;
    let onlineUtilizationTime = 0;
    let takeawayUtilizationTime = 0;
    let deliveryUtilizationTime = 0;
    let dessertUtilizationTime = 0;
    let counterAverageUtilizationTime = 0;
    let selfserviceAverageUtilizationTime = 0;
    let onlineAverageUtilizationTime = 0;
    let takeawayAverageUtilizationTime = 0;
    let deliveryAverageUtilizationTime = 0;
    let dessertAverageUtilizationTime = 0;
    let counterServedClients = 0;
    let selfserviceServedClients = 0;
    let onlineServedClients = 0;
    let takeawayServedClients = 0;
    let deliveryServedClients = 0;
    let dessertServedClients = 0;
    let servedClients = 0;

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
        dessertProbability,
        dessertEndOfService,
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
        dessert,
        counterQueue,
        selfserviceQueue,
        onlineQueue,
        takeawayQueue,
        deliveryQueue,
        dessertQueue,
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
        counterUtilizationTime,
        selfserviceUtilizationTime,
        onlineUtilizationTime,
        takeawayUtilizationTime,
        deliveryUtilizationTime,
        dessertUtilizationTime,
        counterAverageUtilizationTime,
        selfserviceAverageUtilizationTime,
        onlineAverageUtilizationTime,
        takeawayAverageUtilizationTime,
        deliveryAverageUtilizationTime,
        dessertAverageUtilizationTime,
        counterServedClients,
        selfserviceServedClients,
        onlineServedClients,
        takeawayServedClients,
        deliveryServedClients,
        dessertServedClients,
        servedClients,
        clients: [...clients],
      },
    ];

    let clientsQuantity = 0;
    let clientToDestroy: Client | null = null;
    let clientToUpdate: Client | null = null;
    let clientToUpdate2: Client | null = null;

    for (let i = 1; i < n; i++) {
      id = i + 1;
      [event, clock] = this.getNextEvent({ ...queueSimulationRows[queueSimulationRows.length - 1] });

      counterArrival = { ...counterArrival, rnd: null, time: null };
      selfserviceArrival = { ...selfserviceArrival, rnd: null, time: null };
      onlineArrival = { ...onlineArrival, rnd: null, time: null };
      takeawayArrival = { ...takeawayArrival, rnd: null, time: null };
      deliveryArrival = { ...deliveryArrival, rnd: null, time: null };
      dessertProbability = { rnd: null, value: null };
      counterEndOfService = { rnd: null, time: null, nextTime: null };
      selfserviceEndOfService = { rnd: null, time: null, nextTime: null };
      onlineEndOfService = { rnd: null, time: null, nextTime: null };
      takeawayEndOfService = { rnd: null, time: null, nextTime: null };
      deliveryEndOfService = { rnd: null, time: null, nextTime: null };
      dessertEndOfService = { rnd: null, time: null, nextTime: null };

      clientToDestroy = null;
      clientToUpdate = null;
      clientToUpdate2 = null;

      switch (event) {
        case EventEnum.LLEG_MOST: {
          clientsQuantity++;

          counterArrival = this.generateNextEvent(counterArrivalFrecuency, clock);

          const idleServerId = this.getIdleServerId([counter1, counter2, counter3, counter4, counter5]);

          if (!idleServerId) {
            counterQueue++;

            clients.push({ id: clientsQuantity, state: ClientStateEnum.WAITING_COUNTER, arrivalTime: clock });
          } else {
            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);

            switch (idleServerId) {
              case 1: {
                counter1 = {
                  ...counter1,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: counterEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_1, arrivalTime: clock });
                break;
              }
              case 2: {
                counter2 = {
                  ...counter2,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: counterEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_2, arrivalTime: clock });
                break;
              }
              case 3: {
                counter3 = {
                  ...counter3,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: counterEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_3, arrivalTime: clock });
                break;
              }
              case 4: {
                counter4 = {
                  ...counter4,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: counterEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_4, arrivalTime: clock });
                break;
              }
              case 5: {
                counter5 = {
                  ...counter5,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: counterEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_COUNTER_5, arrivalTime: clock });
                break;
              }
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
          } else {
            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);

            switch (idleServerId) {
              case 1: {
                selfservice1 = {
                  ...selfservice1,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: selfserviceEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_SELFSERVICE_1, arrivalTime: clock });
                break;
              }
              case 2: {
                selfservice2 = {
                  ...selfservice2,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: selfserviceEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_SELFSERVICE_2, arrivalTime: clock });
                break;
              }
              case 3: {
                selfservice3 = {
                  ...selfservice3,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: selfserviceEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_SELFSERVICE_3, arrivalTime: clock });
                break;
              }
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
          } else {
            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);

            switch (idleServerId) {
              case 1: {
                online1 = {
                  ...online1,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: onlineEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_ONLINE_1, arrivalTime: clock });
                break;
              }
              case 2: {
                online2 = {
                  ...online2,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: onlineEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_ONLINE_2, arrivalTime: clock });
                break;
              }
              case 3: {
                online3 = {
                  ...online3,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: onlineEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_ONLINE_3, arrivalTime: clock });
                break;
              }
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
          } else {
            takeawayEndOfService = this.generateNextEvent(takeawayEndOfServiceFrecuency, clock);

            switch (idleServerId) {
              case 1: {
                takeaway1 = {
                  ...takeaway1,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: takeawayEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_TAKEAWAY_1, arrivalTime: clock });
                break;
              }
              case 2: {
                takeaway2 = {
                  ...takeaway2,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: takeawayEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_TAKEAWAY_2, arrivalTime: clock });
                break;
              }
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
          } else {
            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);

            switch (idleServerId) {
              case 1: {
                delivery1 = {
                  ...delivery1,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: deliveryEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_DELIVERY_1, arrivalTime: clock });
                break;
              }
              case 2: {
                delivery2 = {
                  ...delivery2,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: deliveryEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_DELIVERY_2, arrivalTime: clock });
                break;
              }
              case 3: {
                delivery3 = {
                  ...delivery3,
                  state: ServerStateEnum.ACTIVE,
                  beginOfService: clock,
                  nextEndOfService: deliveryEndOfService.nextTime,
                };

                clients.push({ id: clientsQuantity, state: ClientStateEnum.IN_DELIVERY_3, arrivalTime: clock });
                break;
              }
            }
          }

          break;
        }
        case EventEnum.FIN_MOST_1: {
          counterServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_COUNTER_1);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          counterWaitingTime = truncateDecimals(counterWaitingTime + clock - (currentClient.arrivalTime as number), 2);
          counterAverageWaitingTime =
            counterWaitingTime === 0 ? 0 : truncateDecimals(((counterWaitingTime / clock) * 100) / 5, 2);

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter1 = { ...counter1, beginOfService: clock, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_1,
            };
          } else {
            if (this.areAllServersIdle([counter2, counter3, counter4, counter5])) {
              counterUtilizationTime = truncateDecimals(
                counterUtilizationTime + clock - (counter1.beginOfService as number),
                2
              );
            }
            counterAverageUtilizationTime =
              counterUtilizationTime === 0 ? 0 : truncateDecimals(((counterUtilizationTime / clock) * 100) / 5, 2);

            counter1 = { ...counter1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_MOST_2: {
          counterServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_COUNTER_2);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          counterWaitingTime = truncateDecimals(counterWaitingTime + clock - (currentClient.arrivalTime as number), 2);
          counterAverageWaitingTime =
            counterWaitingTime === 0 ? 0 : truncateDecimals(((counterWaitingTime / clock) * 100) / 5, 2);

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter2 = { ...counter2, beginOfService: clock, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_2,
            };
          } else {
            if (this.areAllServersIdle([counter1, counter3, counter4, counter5])) {
              counterUtilizationTime = truncateDecimals(
                counterUtilizationTime + clock - (counter2.beginOfService as number),
                2
              );
            }
            counterAverageUtilizationTime =
              counterUtilizationTime === 0 ? 0 : truncateDecimals(((counterUtilizationTime / clock) * 100) / 5, 2);

            counter2 = { ...counter2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_MOST_3: {
          counterServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_COUNTER_3);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          counterWaitingTime = truncateDecimals(counterWaitingTime + clock - (currentClient.arrivalTime as number), 2);
          counterAverageWaitingTime =
            counterWaitingTime === 0 ? 0 : truncateDecimals(((counterWaitingTime / clock) * 100) / 5, 2);

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter3 = { ...counter3, beginOfService: clock, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_3,
            };
          } else {
            if (this.areAllServersIdle([counter1, counter2, counter4, counter5])) {
              counterUtilizationTime = truncateDecimals(
                counterUtilizationTime + clock - (counter3.beginOfService as number),
                2
              );
            }
            counterAverageUtilizationTime =
              counterUtilizationTime === 0 ? 0 : truncateDecimals(((counterUtilizationTime / clock) * 100) / 5, 2);

            counter3 = {
              ...counter3,
              state: ServerStateEnum.IDLE,
              beginOfService: null,
              nextEndOfService: null,
            };
          }

          break;
        }
        case EventEnum.FIN_MOST_4: {
          counterServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_COUNTER_4);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          counterWaitingTime = truncateDecimals(counterWaitingTime + clock - (currentClient.arrivalTime as number), 2);
          counterAverageWaitingTime =
            counterWaitingTime === 0 ? 0 : truncateDecimals(((counterWaitingTime / clock) * 100) / 5, 2);

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter4 = { ...counter4, beginOfService: clock, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_4,
            };
          } else {
            if (this.areAllServersIdle([counter1, counter2, counter3, counter5])) {
              counterUtilizationTime = truncateDecimals(
                counterUtilizationTime + clock - (counter4.beginOfService as number),
                2
              );
            }
            counterAverageUtilizationTime =
              counterUtilizationTime === 0 ? 0 : truncateDecimals(((counterUtilizationTime / clock) * 100) / 5, 2);

            counter4 = { ...counter4, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_MOST_5: {
          counterServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_COUNTER_5);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          counterWaitingTime = truncateDecimals(counterWaitingTime + clock - (currentClient.arrivalTime as number), 2);
          counterAverageWaitingTime =
            counterWaitingTime === 0 ? 0 : truncateDecimals(((counterWaitingTime / clock) * 100) / 5, 2);

          if (counterQueue > 0) {
            counterQueue--;

            counterEndOfService = this.generateNextEvent(counterEndOfServiceFrecuency, clock);
            counter5 = { ...counter5, beginOfService: clock, nextEndOfService: counterEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_COUNTER),
              state: ClientStateEnum.IN_COUNTER_5,
            };
          } else {
            if (this.areAllServersIdle([counter1, counter2, counter3, counter4])) {
              counterUtilizationTime = truncateDecimals(
                counterUtilizationTime + clock - (counter5.beginOfService as number),
                2
              );
            }
            counterAverageUtilizationTime =
              counterUtilizationTime === 0 ? 0 : truncateDecimals(((counterUtilizationTime / clock) * 100) / 5, 2);

            counter5 = { ...counter5, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_AUTO_1: {
          selfserviceServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_SELFSERVICE_1);

          dessertProbability = this.generateBooleanProbability(dessertPercent);

          if (dessertProbability.value === 'SI') {
            if (dessert.state === ServerStateEnum.ACTIVE) {
              dessertQueue++;
            } else {
              dessertEndOfService = this.generateNextEvent(dessertEndOfServiceFrecuency, clock);
              dessert = {
                ...dessert,
                state: ServerStateEnum.ACTIVE,
                beginOfService: clock,
                nextEndOfService: dessertEndOfService.nextTime,
              };
            }

            clientToUpdate2 = {
              ...currentClient,
              state: dessertQueue > 0 ? ClientStateEnum.WAITING_DESSERT : ClientStateEnum.IN_DESSERT,
            };
          } else {
            clientToDestroy = {
              ...currentClient,
              state: null,
              arrivalTime: null,
            };

            servedClients++;

            selfserviceWaitingTime = truncateDecimals(
              selfserviceWaitingTime + clock - (currentClient.arrivalTime as number),
              2
            );
            selfserviceAverageWaitingTime =
              selfserviceWaitingTime === 0 ? 0 : truncateDecimals(((selfserviceWaitingTime / clock) * 100) / 3, 2);
          }

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);

            selfservice1 = {
              ...selfservice1,
              beginOfService: clock,
              nextEndOfService: selfserviceEndOfService.nextTime,
            };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_SELFSERVICE),
              state: ClientStateEnum.IN_SELFSERVICE_1,
            };
          } else {
            if (this.areAllServersIdle([selfservice2, selfservice3])) {
              selfserviceUtilizationTime = truncateDecimals(
                selfserviceUtilizationTime + clock - (selfservice1.beginOfService as number),
                2
              );
            }
            selfserviceAverageUtilizationTime =
              selfserviceUtilizationTime === 0
                ? 0
                : truncateDecimals(((selfserviceUtilizationTime / clock) * 100) / 3, 2);

            selfservice1 = {
              ...selfservice1,
              state: ServerStateEnum.IDLE,
              beginOfService: null,
              nextEndOfService: null,
            };
          }

          break;
        }
        case EventEnum.FIN_AUTO_2: {
          selfserviceServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_SELFSERVICE_2);

          dessertProbability = this.generateBooleanProbability(dessertPercent);

          if (dessertProbability.value === 'SI') {
            if (dessert.state === ServerStateEnum.ACTIVE) {
              dessertQueue++;
            } else {
              dessertEndOfService = this.generateNextEvent(dessertEndOfServiceFrecuency, clock);
              dessert = {
                ...dessert,
                state: ServerStateEnum.ACTIVE,
                beginOfService: clock,
                nextEndOfService: dessertEndOfService.nextTime,
              };
            }

            clientToUpdate2 = {
              ...currentClient,
              state: dessertQueue > 0 ? ClientStateEnum.WAITING_DESSERT : ClientStateEnum.IN_DESSERT,
            };
          } else {
            clientToDestroy = {
              ...currentClient,
              state: null,
              arrivalTime: null,
            };

            servedClients++;

            selfserviceWaitingTime = truncateDecimals(
              selfserviceWaitingTime + clock - (currentClient.arrivalTime as number),
              2
            );
            selfserviceAverageWaitingTime =
              selfserviceWaitingTime === 0 ? 0 : truncateDecimals(((selfserviceWaitingTime / clock) * 100) / 3, 2);
          }

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);
            selfservice2 = {
              ...selfservice2,
              beginOfService: clock,
              nextEndOfService: selfserviceEndOfService.nextTime,
            };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_SELFSERVICE),
              state: ClientStateEnum.IN_SELFSERVICE_2,
            };
          } else {
            if (this.areAllServersIdle([selfservice1, selfservice3])) {
              selfserviceUtilizationTime = truncateDecimals(
                selfserviceUtilizationTime + clock - (selfservice2.beginOfService as number),
                2
              );
            }
            selfserviceAverageUtilizationTime =
              selfserviceUtilizationTime === 0
                ? 0
                : truncateDecimals(((selfserviceUtilizationTime / clock) * 100) / 3, 2);

            selfservice2 = {
              ...selfservice2,
              state: ServerStateEnum.IDLE,
              beginOfService: null,
              nextEndOfService: null,
            };
          }

          break;
        }
        case EventEnum.FIN_AUTO_3: {
          selfserviceServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_SELFSERVICE_3);

          dessertProbability = this.generateBooleanProbability(dessertPercent);

          if (dessertProbability.value === 'SI') {
            if (dessert.state === ServerStateEnum.ACTIVE) {
              dessertQueue++;
            } else {
              dessertEndOfService = this.generateNextEvent(dessertEndOfServiceFrecuency, clock);
              dessert = {
                ...dessert,
                state: ServerStateEnum.ACTIVE,
                beginOfService: clock,
                nextEndOfService: dessertEndOfService.nextTime,
              };
            }

            clientToUpdate2 = {
              ...currentClient,
              state: dessertQueue > 0 ? ClientStateEnum.WAITING_DESSERT : ClientStateEnum.IN_DESSERT,
            };
          } else {
            clientToDestroy = {
              ...currentClient,
              state: null,
              arrivalTime: null,
            };

            servedClients++;

            selfserviceWaitingTime = truncateDecimals(
              selfserviceWaitingTime + clock - (currentClient.arrivalTime as number),
              2
            );
            selfserviceAverageWaitingTime =
              selfserviceWaitingTime === 0 ? 0 : truncateDecimals(((selfserviceWaitingTime / clock) * 100) / 3, 2);
          }

          if (selfserviceQueue > 0) {
            selfserviceQueue--;

            selfserviceEndOfService = this.generateNextEvent(selfserviceEndOfServiceFrecuency, clock);
            selfservice3 = {
              ...selfservice3,
              beginOfService: clock,
              nextEndOfService: selfserviceEndOfService.nextTime,
            };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_SELFSERVICE),
              state: ClientStateEnum.IN_SELFSERVICE_3,
            };
          } else {
            if (this.areAllServersIdle([selfservice1, selfservice2])) {
              selfserviceUtilizationTime = truncateDecimals(
                selfserviceUtilizationTime + clock - (selfservice3.beginOfService as number),
                2
              );
            }
            selfserviceAverageUtilizationTime =
              selfserviceUtilizationTime === 0 ? 0 : truncateDecimals((selfserviceUtilizationTime / clock) * 100, 2);

            selfservice3 = {
              ...selfservice3,
              state: ServerStateEnum.IDLE,
              beginOfService: null,
              nextEndOfService: null,
            };
          }

          break;
        }
        case EventEnum.FIN_ONLINE_1: {
          onlineServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_ONLINE_1);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          onlineWaitingTime = truncateDecimals(onlineWaitingTime + clock - (currentClient.arrivalTime as number), 2);
          onlineAverageWaitingTime =
            onlineWaitingTime === 0 ? 0 : truncateDecimals(((onlineWaitingTime / clock) * 100) / 3, 2);

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online1 = { ...online1, beginOfService: clock, nextEndOfService: onlineEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_ONLINE),
              state: ClientStateEnum.IN_ONLINE_1,
            };
          } else {
            if (this.areAllServersIdle([online2, online3])) {
              onlineUtilizationTime = truncateDecimals(
                onlineUtilizationTime + clock - (online1.beginOfService as number),
                2
              );
            }
            onlineAverageUtilizationTime =
              onlineUtilizationTime === 0 ? 0 : truncateDecimals(((onlineUtilizationTime / clock) * 100) / 3, 2);

            online1 = { ...online1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_ONLINE_2: {
          onlineServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_ONLINE_2);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          onlineWaitingTime = truncateDecimals(onlineWaitingTime + clock - (currentClient.arrivalTime as number), 2);
          onlineAverageWaitingTime =
            onlineWaitingTime === 0 ? 0 : truncateDecimals(((onlineWaitingTime / clock) * 100) / 3, 2);

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online2 = { ...online2, beginOfService: clock, nextEndOfService: onlineEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_ONLINE),
              state: ClientStateEnum.IN_ONLINE_2,
            };
          } else {
            if (this.areAllServersIdle([online1, online3])) {
              onlineUtilizationTime = truncateDecimals(
                onlineUtilizationTime + clock - (online2.beginOfService as number),
                2
              );
            }
            onlineAverageUtilizationTime =
              onlineUtilizationTime === 0 ? 0 : truncateDecimals(((onlineUtilizationTime / clock) * 100) / 3, 2);

            online2 = { ...online2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_ONLINE_3: {
          onlineServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_ONLINE_3);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          onlineWaitingTime = truncateDecimals(onlineWaitingTime + clock - (currentClient.arrivalTime as number), 2);
          onlineAverageWaitingTime =
            onlineWaitingTime === 0 ? 0 : truncateDecimals(((onlineWaitingTime / clock) * 100) / 3, 2);

          if (onlineQueue > 0) {
            onlineQueue--;

            onlineEndOfService = this.generateNextEvent(onlineEndOfServiceFrecuency, clock);
            online3 = { ...online3, beginOfService: clock, nextEndOfService: onlineEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_ONLINE),
              state: ClientStateEnum.IN_ONLINE_3,
            };
          } else {
            if (this.areAllServersIdle([online1, online2])) {
              onlineUtilizationTime = truncateDecimals(
                onlineUtilizationTime + clock - (online3.beginOfService as number),
                2
              );
            }
            onlineAverageUtilizationTime =
              onlineUtilizationTime === 0 ? 0 : truncateDecimals(((onlineUtilizationTime / clock) * 100) / 3, 2);

            online3 = { ...online3, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_LLEVAR_1: {
          takeawayServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_TAKEAWAY_1);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          takeawayWaitingTime = truncateDecimals(
            takeawayWaitingTime + clock - (currentClient.arrivalTime as number),
            2
          );
          takeawayAverageWaitingTime =
            takeawayWaitingTime === 0 ? 0 : truncateDecimals(((takeawayWaitingTime / clock) * 100) / 2, 2);

          if (takeawayQueue > 0) {
            takeawayQueue--;

            takeawayEndOfService = this.generateNextEvent(takeawayEndOfServiceFrecuency, clock);
            takeaway1 = { ...takeaway1, beginOfService: clock, nextEndOfService: takeawayEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_TAKEAWAY),
              state: ClientStateEnum.IN_TAKEAWAY_1,
            };
          } else {
            if (this.areAllServersIdle([takeaway2])) {
              takeawayUtilizationTime = truncateDecimals(
                takeawayUtilizationTime + clock - (takeaway1.beginOfService as number),
                2
              );
            }
            takeawayAverageUtilizationTime =
              takeawayUtilizationTime === 0 ? 0 : truncateDecimals(((takeawayUtilizationTime / clock) * 100) / 2, 2);

            takeaway1 = { ...takeaway1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_LLEVAR_2: {
          takeawayServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_TAKEAWAY_2);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          takeawayWaitingTime = truncateDecimals(
            takeawayWaitingTime + clock - (currentClient.arrivalTime as number),
            2
          );
          takeawayAverageWaitingTime =
            takeawayWaitingTime === 0 ? 0 : truncateDecimals(((takeawayWaitingTime / clock) * 100) / 2, 2);

          if (takeawayQueue > 0) {
            takeawayQueue--;

            takeawayEndOfService = this.generateNextEvent(takeawayEndOfServiceFrecuency, clock);
            takeaway2 = { ...takeaway2, beginOfService: clock, nextEndOfService: takeawayEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_TAKEAWAY),
              state: ClientStateEnum.IN_TAKEAWAY_2,
            };
          } else {
            if (this.areAllServersIdle([takeaway1])) {
              takeawayUtilizationTime = truncateDecimals(
                takeawayUtilizationTime + clock - (takeaway2.beginOfService as number),
                2
              );
            }
            takeawayAverageUtilizationTime =
              takeawayUtilizationTime === 0 ? 0 : truncateDecimals(((takeawayUtilizationTime / clock) * 100) / 2, 2);

            takeaway2 = { ...takeaway2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_DELI_1: {
          deliveryServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_DELIVERY_1);

          dessertProbability = this.generateBooleanProbability(dessertPercent);

          if (dessertProbability.value === 'SI') {
            if (dessert.state === ServerStateEnum.ACTIVE) {
              dessertQueue++;
            } else {
              dessertEndOfService = this.generateNextEvent(dessertEndOfServiceFrecuency, clock);
              dessert = {
                ...dessert,
                state: ServerStateEnum.ACTIVE,
                beginOfService: clock,
                nextEndOfService: dessertEndOfService.nextTime,
              };
            }

            clientToUpdate2 = {
              ...currentClient,
              state: dessertQueue > 0 ? ClientStateEnum.WAITING_DESSERT : ClientStateEnum.IN_DESSERT,
            };
          } else {
            clientToDestroy = {
              ...currentClient,
              state: null,
              arrivalTime: null,
            };

            servedClients++;

            deliveryWaitingTime = truncateDecimals(
              deliveryWaitingTime + clock - (currentClient.arrivalTime as number),
              2
            );
            deliveryAverageWaitingTime =
              deliveryWaitingTime === 0 ? 0 : truncateDecimals(((deliveryWaitingTime / clock) * 100) / 3, 2);
          }

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery1 = { ...delivery1, beginOfService: clock, nextEndOfService: deliveryEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_DELIVERY),
              state: ClientStateEnum.IN_DELIVERY_1,
            };
          } else {
            if (this.areAllServersIdle([delivery2, delivery3])) {
              deliveryUtilizationTime = truncateDecimals(
                deliveryUtilizationTime + clock - (delivery1.beginOfService as number),
                2
              );
            }
            deliveryAverageUtilizationTime =
              deliveryUtilizationTime === 0 ? 0 : truncateDecimals(((deliveryUtilizationTime / clock) * 100) / 3, 2);

            delivery1 = { ...delivery1, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_DELI_2: {
          deliveryServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_DELIVERY_2);

          dessertProbability = this.generateBooleanProbability(dessertPercent);

          if (dessertProbability.value === 'SI') {
            if (dessert.state === ServerStateEnum.ACTIVE) {
              dessertQueue++;
            } else {
              dessertEndOfService = this.generateNextEvent(dessertEndOfServiceFrecuency, clock);
              dessert = {
                ...dessert,
                state: ServerStateEnum.ACTIVE,
                beginOfService: clock,
                nextEndOfService: dessertEndOfService.nextTime,
              };
            }

            clientToUpdate2 = {
              ...currentClient,
              state: dessertQueue > 0 ? ClientStateEnum.WAITING_DESSERT : ClientStateEnum.IN_DESSERT,
            };
          } else {
            clientToDestroy = {
              ...currentClient,
              state: null,
              arrivalTime: null,
            };

            servedClients++;

            deliveryWaitingTime = truncateDecimals(
              deliveryWaitingTime + clock - (currentClient.arrivalTime as number),
              2
            );
            deliveryAverageWaitingTime =
              deliveryWaitingTime === 0 ? 0 : truncateDecimals(((deliveryWaitingTime / clock) * 100) / 3, 2);
          }

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery2 = { ...delivery2, beginOfService: clock, nextEndOfService: deliveryEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_DELIVERY),
              state: ClientStateEnum.IN_DELIVERY_2,
            };
          } else {
            if (this.areAllServersIdle([delivery1, delivery3])) {
              deliveryUtilizationTime = truncateDecimals(
                deliveryUtilizationTime + clock - (delivery2.beginOfService as number),
                2
              );
            }
            deliveryAverageUtilizationTime =
              deliveryUtilizationTime === 0 ? 0 : truncateDecimals(((deliveryUtilizationTime / clock) * 100) / 3, 2);

            delivery2 = { ...delivery2, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_DELI_3: {
          deliveryServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_DELIVERY_3);

          dessertProbability = this.generateBooleanProbability(dessertPercent);

          if (dessertProbability.value === 'SI') {
            if (dessert.state === ServerStateEnum.ACTIVE) {
              dessertQueue++;
            } else {
              dessertEndOfService = this.generateNextEvent(dessertEndOfServiceFrecuency, clock);
              dessert = {
                ...dessert,
                state: ServerStateEnum.ACTIVE,
                beginOfService: clock,
                nextEndOfService: dessertEndOfService.nextTime,
              };
            }

            clientToUpdate2 = {
              ...currentClient,
              state: dessertQueue > 0 ? ClientStateEnum.WAITING_DESSERT : ClientStateEnum.IN_DESSERT,
            };
          } else {
            clientToDestroy = {
              ...currentClient,
              state: null,
              arrivalTime: null,
            };

            servedClients++;

            deliveryWaitingTime = truncateDecimals(
              deliveryWaitingTime + clock - (currentClient.arrivalTime as number),
              2
            );
            deliveryAverageWaitingTime =
              deliveryWaitingTime === 0 ? 0 : truncateDecimals(((deliveryWaitingTime / clock) * 100) / 3, 2);
          }

          if (deliveryQueue > 0) {
            deliveryQueue--;

            deliveryEndOfService = this.generateNextEvent(deliveryEndOfServiceFrecuency, clock);
            delivery3 = { ...delivery3, beginOfService: clock, nextEndOfService: deliveryEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_DELIVERY),
              state: ClientStateEnum.IN_DELIVERY_3,
            };
          } else {
            if (this.areAllServersIdle([delivery1, delivery2])) {
              deliveryUtilizationTime = truncateDecimals(
                deliveryUtilizationTime + clock - (delivery3.beginOfService as number),
                2
              );
            }
            deliveryAverageUtilizationTime =
              deliveryUtilizationTime === 0 ? 0 : truncateDecimals(((deliveryUtilizationTime / clock) * 100) / 3, 2);

            delivery3 = { ...delivery3, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }

          break;
        }
        case EventEnum.FIN_POSTRE: {
          dessertServedClients++;

          const currentClient = this.getCurrentClient(clients, ClientStateEnum.IN_DESSERT);

          clientToDestroy = {
            ...currentClient,
            state: null,
            arrivalTime: null,
          };

          servedClients++;

          if (dessertQueue > 0) {
            dessertQueue--;

            dessertEndOfService = this.generateNextEvent(dessertEndOfServiceFrecuency, clock);
            dessert = { ...dessert, beginOfService: clock, nextEndOfService: dessertEndOfService.nextTime };

            clientToUpdate = {
              ...this.getCurrentClient(clients, ClientStateEnum.WAITING_DESSERT),
              state: ClientStateEnum.IN_DESSERT,
            };
          } else {
            dessertUtilizationTime = truncateDecimals(
              dessertUtilizationTime + clock - (currentClient.arrivalTime as number),
              2
            );
            dessertAverageUtilizationTime =
              dessertUtilizationTime === 0 ? 0 : truncateDecimals((dessertUtilizationTime / clock) * 100, 2);

            dessert = { ...dessert, state: ServerStateEnum.IDLE, beginOfService: null, nextEndOfService: null };
          }
        }
      }

      if (clientToDestroy) {
        clients[clientToDestroy.id - 1] = clientToDestroy;
      }

      if (clientToUpdate) {
        clients[clientToUpdate.id - 1] = clientToUpdate;
      }

      if (clientToUpdate2) {
        clients[clientToUpdate2.id - 1] = clientToUpdate2;
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
        dessertProbability,
        dessertEndOfService,
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
        dessert,
        counterQueue,
        selfserviceQueue,
        onlineQueue,
        takeawayQueue,
        deliveryQueue,
        dessertQueue,
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
        counterUtilizationTime,
        selfserviceUtilizationTime,
        onlineUtilizationTime,
        takeawayUtilizationTime,
        deliveryUtilizationTime,
        dessertUtilizationTime,
        counterAverageUtilizationTime,
        selfserviceAverageUtilizationTime,
        onlineAverageUtilizationTime,
        takeawayAverageUtilizationTime,
        deliveryAverageUtilizationTime,
        dessertAverageUtilizationTime,
        counterServedClients,
        selfserviceServedClients,
        onlineServedClients,
        takeawayServedClients,
        deliveryServedClients,
        dessertServedClients,
        servedClients,
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

  private generateBooleanProbability(percent: number): BooleanProbability {
    if (!percent || percent < 0 || percent > 100) throw new Error('Invalid percent value.');
    const rnd = truncateDecimals(Math.random(), 2);
    return { rnd, value: rnd < percent / 100 ? 'SI' : 'NO' };
  }

  private generarRandomExponencialNegativa(frecuency: number, rnd: number): number {
    return (-1 / (frecuency / 60)) * Math.log(1 - rnd);
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

  private areAllServersIdle(servers: Server[]): boolean {
    return servers.every(({ state }) => state === ServerStateEnum.IDLE);
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
      dessert,
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
      {
        event: EventEnum.FIN_POSTRE as QueueSimulationEvent,
        time: dessert.nextEndOfService ?? -1,
      },
    ].filter(({ time }) => time > -1);
  }

  private getCurrentClient(clients: Client[], state: ClientState): Client {
    return clients
      .filter((client) => client.state === state && client.arrivalTime !== null)
      .reduce((client, currentClient) =>
        currentClient.arrivalTime && client.arrivalTime && currentClient.arrivalTime < client.arrivalTime
          ? currentClient
          : client
      );
  }
}
