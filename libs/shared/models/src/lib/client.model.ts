import { ClientState } from './client-state.model';

export type Client = {
  id: number;
  state: ClientState | null;
  arrivalTime: number | null;
};
