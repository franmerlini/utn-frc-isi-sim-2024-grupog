export const truncateDecimals = (number: number, digits: number): number => {
  const multiplier = Math.pow(10, digits);
  return Math.trunc(number * multiplier) / multiplier;
};
