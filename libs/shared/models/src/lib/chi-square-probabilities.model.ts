export type ChiSquareProbabilities = {
  [df: number]: {
    [significanceLevel: number]: number;
  };
};
