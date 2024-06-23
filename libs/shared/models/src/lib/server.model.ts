import { ServerState } from './server-state.model';

export type Server = {
  id: number;
  state: ServerState;
  nextEndOfService: number | null;
};
