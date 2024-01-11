import * as R from 'ramda';
import {
  LeitnerBox,
  LeitnerBoxConfig,
  LeitnerDecks,
  CardIdentity
} from './types';
import {
  fib,
  buildEmptyDecks,
  buildRepeatLessons,
  lensMatchIdentity
} from './utils';

const unknownLens = R.lensPath(['decks', 'unknown']);
const learnedLens = R.lensPath(['decks', 'learned']);
const lessonsLens = (index: number) =>
  R.lensPath(['decks', 'lessons', index, 'cards']);

const addCardTo = (
  cardLens: R.Lens<LeitnerBox, unknown[]>,
  box: LeitnerBox,
  card: unknown
): LeitnerBox => {
  return card
    ? R.over<LeitnerBox, unknown[]>(cardLens, R.append<unknown>(card), box)
    : box;
};

const findAndRemove = (
  findLens: R.Lens<LeitnerBox, unknown>,
  updateLens: R.Lens<LeitnerBox, unknown[]>,
  identity: CardIdentity,
  box: LeitnerBox
): [LeitnerBox, unknown] | null => {
  const card = R.view(findLens, box);

  return card ? [R.over(updateLens, R.reject(identity), box), card] : null; // Return null when the card is not found
};

const findAndRemoveInLessons = (
  findLens: (i: number) => R.Lens<LeitnerBox, unknown>,
  updateLens: (i: number) => R.Lens<LeitnerBox, unknown[]>,
  identity: CardIdentity,
  box: LeitnerBox
): [LeitnerBox, unknown] | null => {
  for (let i = 0; i < box.decks.lessons.length; i++) {
    const result = findAndRemove(findLens(i), updateLens(i), identity, box);

    if (result) {
      return result;
    }
  }

  return null;
};

const removeCard = (
  box: LeitnerBox,
  identity: CardIdentity
): [LeitnerBox, unknown] => {
  const findInUnknownLens = R.compose(unknownLens, lensMatchIdentity(identity));
  const findInLearnedLens = R.compose(learnedLens, lensMatchIdentity(identity));
  const findInLessonsLens = (index: number) =>
    R.compose(lessonsLens(index), lensMatchIdentity(identity));

  const result =
    findAndRemove(findInUnknownLens, unknownLens, identity, box) ||
    findAndRemove(findInLearnedLens, learnedLens, identity, box) ||
    findAndRemoveInLessons(findInLessonsLens, lessonsLens, identity, box);

  return result || [box, null];
};

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
  const currentLessonLens = R.lensProp<LeitnerBox, 'currentLesson'>(
    'currentLesson'
  );

  return R.set(currentLessonLens, currentLesson, box);
};

export const addToUnknown = R.partial(addCardTo, [unknownLens]);
export const addToLearned = R.partial(addCardTo, [learnedLens]);
export const addToLessons = (box: LeitnerBox, card: unknown): LeitnerBox =>
  addCardTo(lessonsLens(box.currentLesson), box, card);

export const moveToUnknown = R.pipe(removeCard, R.apply(addToUnknown));
export const moveToLearned = R.pipe(removeCard, R.apply(addToLearned));
export const moveToLessons = R.pipe(removeCard, R.apply(addToLessons));
