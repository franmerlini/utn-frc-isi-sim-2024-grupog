import { EventEnum } from '@grupog/libs/shared/enum';

export type QueueSimulationEvent = (typeof EventEnum)[keyof typeof EventEnum];
