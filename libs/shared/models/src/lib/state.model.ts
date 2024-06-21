import { StateEnum } from '@grupog/libs/shared/enum';

export type State = (typeof StateEnum)[keyof typeof StateEnum];
