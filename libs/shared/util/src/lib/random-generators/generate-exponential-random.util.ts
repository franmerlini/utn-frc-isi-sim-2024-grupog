export const generateExponentialRandom = (lambda: number): number => {
  let u = 0;
  while (u === 0) u = Math.random();
  return -Math.log(u) / lambda;
};
