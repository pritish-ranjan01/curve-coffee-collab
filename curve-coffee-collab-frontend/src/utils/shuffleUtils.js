export const shufflePairs = (pairs) => {
  const allMembers = [];
  pairs.forEach((pair) => {
    allMembers.push(pair.member1);
    allMembers.push(pair.member2);
  });

  const shuffledMembers = [...allMembers].sort(() => Math.random() - 0.5);

  const newPairs = [];
  for (let i = 0; i < shuffledMembers.length; i += 2) {
    newPairs.push({
      member1: shuffledMembers[i],
      member2: shuffledMembers[i + 1],
    });
  }

  return newPairs;
};
