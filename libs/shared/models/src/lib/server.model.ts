import { ServerState } from './server-state.model';

export type Server = {
  id: number;
  state: ServerState;
  beginOfService: number | null;
  nextEndOfService: number | null;
};
