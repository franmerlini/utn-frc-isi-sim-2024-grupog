export const DistributionEnum = {
  UNIFORM: 1,
  NORMAL: 2,
  EXPONENTIAL: 3,
} as const;

export type Distribution = (typeof DistributionEnum)[keyof typeof DistributionEnum];
