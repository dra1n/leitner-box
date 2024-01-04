import { fib, buildEmptyDecks, buildRepeatLessons } from './utils';
import { lensProp, set } from 'ramda';

type integer = number;

interface LeitnerBoxConfig {
  repetitions?: integer;
  currentLesson?: integer;
  initialDecks?: Array<Array<unknown>>;
}

interface LeitnerLesson {
  repeatOn: Array<integer>;
  cards: Array<unknown>;
}

interface LeitnerDecks {
  unknown: Array<unknown>;
  learned: Array<unknown>;
  lessons: Array<LeitnerLesson>;
}

export interface LeitnerBox {
  count: number;
  repetitions: number;
  currentLesson: number;
  decks: LeitnerDecks;
}

export const createLeitnerBox = ({
  repetitions = 3,
  currentLesson = 0,
  initialDecks
}: LeitnerBoxConfig = {}): LeitnerBox => {
  const count = fib(repetitions) + 1;
  const repeatOn = buildRepeatLessons(count, repetitions);
  const rawWorkingDecks = initialDecks || buildEmptyDecks(count);

  const decks: LeitnerDecks = {
    unknown: rawWorkingDecks[0],
    learned: rawWorkingDecks[rawWorkingDecks.length - 1],
    lessons: rawWorkingDecks.slice(1, -1).map((deck, index) => ({
      repeatOn: repeatOn[index],
      cards: deck
    }))
  };

  return {
    count,
    repetitions,
    currentLesson,
    decks
  };
};

export const setCurrentLesson = (
  box: LeitnerBox,
  currentLesson: number
): LeitnerBox => {
  const currentLessonLens = lensProp<LeitnerBox, 'currentLesson'>(
    'currentLesson'
  );

  return set(currentLessonLens, currentLesson, box);
};
