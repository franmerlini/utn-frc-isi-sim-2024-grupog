export const generateUniformRandom = (a: number, b: number): number => {
  return Math.random() * (b - a) + a;
};
