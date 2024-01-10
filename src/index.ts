import {
  fib,
  buildEmptyDecks,
  buildRepeatLessons,
  lensMatchIdentity
} from './utils';
import * as R from 'ramda';

export type integer = number;

export interface LeitnerBoxConfig {
  repetitions?: integer;
  currentLesson?: integer;
  initialDecks?: Array<Array<unknown>>;
}

export interface LeitnerLesson {
  repeatOn: Array<integer>;
  cards: Array<unknown>;
}

export interface LeitnerDecks {
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

export interface CardIdentity {
  (card: unknown): boolean;
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

const unknownLens = R.lensPath(['decks', 'unknown']);
const learnedLens = R.lensPath(['decks', 'learned']);
const lessonsLens = (index: number) =>
  R.lensPath(['decks', 'lessons', index, 'cards']);

export const setCurrentLesson = (
  box: LeitnerBox,
  currentLesson: number
): LeitnerBox => {
  const currentLessonLens = R.lensProp<LeitnerBox, 'currentLesson'>(
    'currentLesson'
  );

  return R.set(currentLessonLens, currentLesson, box);
};

export const addToUnknown = (box: LeitnerBox, card: unknown): LeitnerBox => {
  return R.over<LeitnerBox, unknown[]>(unknownLens, R.append(card), box);
};

export const addToLearned = (box: LeitnerBox, card: unknown): LeitnerBox => {
  return R.over<LeitnerBox, unknown[]>(learnedLens, R.append(card), box);
};
export const addToLessons = (box: LeitnerBox, card: unknown): LeitnerBox => {
  return R.over<LeitnerBox, unknown[]>(
    lessonsLens(box.currentLesson),
    R.append(card),
    box
  );
};

const moveToSection = (
  box: LeitnerBox,
  identity: CardIdentity,
  addToSection: (box: LeitnerBox, card: unknown) => LeitnerBox
): LeitnerBox => {
  let card: unknown;
  let updatedBox: LeitnerBox;

  const findInUnknownLens = R.compose(unknownLens, lensMatchIdentity(identity));
  const findInLearnedLens = R.compose(learnedLens, lensMatchIdentity(identity));
  const findInLessonsLens = (index: number) =>
    R.compose(lessonsLens(index), lensMatchIdentity(identity));
  // Search for card in 'unknown'
  card = R.view(findInUnknownLens, box);

  if (card) {
    updatedBox = R.over<LeitnerBox, unknown[]>(
      unknownLens,
      R.reject(identity),
      box
    );

    return addToSection(updatedBox, card);
  }

  // Search for card in 'learned'
  card = R.view(findInLearnedLens, box);

  if (card) {
    updatedBox = R.over<LeitnerBox, unknown[]>(
      learnedLens,
      R.reject(identity),
      box
    );

    return addToSection(updatedBox, card);
  }

  // Search for card in 'lessons'
  for (let i = 0; i < box.decks.lessons.length; i++) {
    card = R.view(findInLessonsLens(i), box);

    if (card) {
      updatedBox = R.over<LeitnerBox, unknown[]>(
        lessonsLens(i),
        R.reject(identity),
        box
      );

      return addToSection(updatedBox, card);
    }
  }

  return box;
};

export const moveToUnknown = (box: LeitnerBox, identity: CardIdentity) => {
  return moveToSection(box, identity, addToUnknown);
};

export const moveToLearned = (box: LeitnerBox, identity: CardIdentity) => {
  return moveToSection(box, identity, addToLearned);
};
