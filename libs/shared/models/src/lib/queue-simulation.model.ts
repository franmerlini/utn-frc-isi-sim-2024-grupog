export type QueueSimulation = {
  n: number;
  from: number;
  to: number;
  counterArrivalFrecuency: number;
  selfserviceArrivalFrecuency: number;
  onlineArrivalFrecuency: number;
  takewayArrivalFrecuency: number;
  deliveryArrivalFrecuency: number;
  counterEndOfServiceFrecuency: number;
  selfserviceEndOfServiceFrecuency: number;
  onlineEndOfServiceFrecuency: number;
  takeawayEndOfServiceFrecuency: number;
  deliveryEndOfServiceFrecuency: number;
};
