export const shufflePairs = (pairs) => {
  return [...pairs].sort(() => Math.random() - 0.5);
};
