import { ClientStateEnum } from '@grupog/libs/shared/enum';

export type ClientState = (typeof ClientStateEnum)[keyof typeof ClientStateEnum];
