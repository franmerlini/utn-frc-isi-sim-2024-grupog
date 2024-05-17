export const PolicyEnum = {
  FIXED_ORDER_AMOUNT: 1,
  VARIABLE_ORDER_AMOUNT: 2,
} as const;

export type Policy = (typeof PolicyEnum)[keyof typeof PolicyEnum];
