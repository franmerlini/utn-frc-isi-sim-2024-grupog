import { ServerStateEnum } from '@grupog/libs/shared/enum';

export type ServerState = (typeof ServerStateEnum)[keyof typeof ServerStateEnum];
