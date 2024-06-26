import { BooleanProbability } from './boolean-probability.model';
import { Client } from './client.model';
import { Event } from './event.model';
import { QueueSimulationEvent } from './queue-simulation-event.model';
import { Server } from './server.model';

export type QueueSimulationRow = {
  id: number;
  event: QueueSimulationEvent;
  clock: number | null;

  counterArrival: Event | null;
  selfserviceArrival: Event | null;
  onlineArrival: Event | null;
  takeawayArrival: Event | null;
  deliveryArrival: Event | null;
  electricityOutage: Event | null;

  counterEndOfService: Event | null;
  selfserviceEndOfService: Event | null;
  onlineEndOfService: Event | null;
  takeawayEndOfService: Event | null;
  deliveryEndOfService: Event | null;
  dessertProbability: BooleanProbability;
  dessertEndOfService: Event | null;
  electricityAvailability: Event | null;

  counter1: Server;
  counter2: Server;
  counter3: Server;
  counter4: Server;
  counter5: Server;
  selfservice1: Server;
  selfservice2: Server;
  selfservice3: Server;
  online1: Server;
  online2: Server;
  online3: Server;
  takeaway1: Server;
  takeaway2: Server;
  delivery1: Server;
  delivery2: Server;
  delivery3: Server;
  dessert: Server;

  counterQueue: number;
  selfserviceQueue: number;
  onlineQueue: number;
  takeawayQueue: number;
  deliveryQueue: number;
  dessertQueue: number;

  counterWaitingTime: number;
  selfserviceWaitingTime: number;
  onlineWaitingTime: number;
  takeawayWaitingTime: number;
  deliveryWaitingTime: number;
  counterAverageWaitingTime: number;
  selfserviceAverageWaitingTime: number;
  onlineAverageWaitingTime: number;
  takeawayAverageWaitingTime: number;
  deliveryAverageWaitingTime: number;
  counterUtilizationTime: number;
  selfserviceUtilizationTime: number;
  onlineUtilizationTime: number;
  takeawayUtilizationTime: number;
  deliveryUtilizationTime: number;
  dessertUtilizationTime: number;
  counterAverageUtilizationTime: number;
  selfserviceAverageUtilizationTime: number;
  onlineAverageUtilizationTime: number;
  takeawayAverageUtilizationTime: number;
  deliveryAverageUtilizationTime: number;
  dessertAverageUtilizationTime: number;
  counterServedClients: number;
  selfserviceServedClients: number;
  onlineServedClients: number;
  takeawayServedClients: number;
  deliveryServedClients: number;
  dessertServedClients: number;
  servedClients: number;

  clients: Client[];
};
