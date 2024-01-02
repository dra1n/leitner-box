export const fib = (n: number): number => (n === 0 ? 0 : fib(n - 1) + n + 1);

const range = (count: number) => {
  return [...Array(count).keys()];
};

export const buildRepeatLessons = (count: number, repetitions: number) => {
  const labels = [];

  for (let i = 0; i < count; i++) {
    const a = [];

    for (let j = 0; j < repetitions + 1; j++) {
      a.push((i + fib(j)) % count);
    }

    labels.push(a);
  }

  return labels;
};

export const buildEmptyDecks = (count: number) => {
  return range(count + 2).map((_) => []);
};
