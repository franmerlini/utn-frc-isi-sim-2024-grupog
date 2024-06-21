import { State } from './state.model';

export type Client = {
  id: number;
  state: State | null;
  arrivalTime: number | null;
};
