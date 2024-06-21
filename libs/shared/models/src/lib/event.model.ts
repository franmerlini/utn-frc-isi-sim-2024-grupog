import { EventEnum } from '@grupog/libs/shared/enum';

export type Event = (typeof EventEnum)[keyof typeof EventEnum];
