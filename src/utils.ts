import * as R from 'ramda';

export const fib = (n: number): number => (n === 0 ? 0 : fib(n - 1) + n + 1);

const range = (count: number) => {
  return [...Array(count).keys()];
};

export const buildRepeatLessons = (count: number, repetitions: number) => {
  const lessons = [];

  for (let i = 0; i < count; i++) {
    const a = [];

    for (let j = 1; j <= repetitions; j++) {
      a.push((i + fib(j)) % count);
    }

    lessons.push(a);
  }

  return lessons;
};

export const buildEmptyDecks = (count: number) => {
  return range(count + 2).map((_) => []);
};

export const lensMatchIdentity = (identity: (arg: unknown) => boolean) =>
  R.lens(R.find(identity), (val, arr, idx = R.findIndex(identity, arr)) =>
    R.update(idx > -1 ? idx : R.length(arr), val, arr)
  );

export const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};
