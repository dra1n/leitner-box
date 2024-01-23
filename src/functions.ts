import * as R from 'ramda';
import {
  integer,
  LeitnerBox,
  LeitnerBoxConfig,
  LeitnerDecks,
  CardIdentity,
  Card,
  LeitnerLesson
} from './types';
import {
  assert,
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
  cardLens: R.Lens<LeitnerBox, Card[]>,
  box: LeitnerBox,
  card: Card
): LeitnerBox => {
  return card
    ? R.over<LeitnerBox, Card[]>(cardLens, R.append<Card>(card), box)
    : box;
};

const findAndRemove = (
  findLens: R.Lens<LeitnerBox, Card>,
  updateLens: R.Lens<LeitnerBox, Card[]>,
  identity: CardIdentity,
  box: LeitnerBox
): [LeitnerBox, Card] | null => {
  const card = R.view(findLens, box);

  return card ? [R.over(updateLens, R.reject(identity), box), card] : null; // Return null when the card is not found
};

const findAndRemoveInLessons = (
  findLens: (i: number) => R.Lens<LeitnerBox, Card>,
  updateLens: (i: number) => R.Lens<LeitnerBox, Card[]>,
  identity: CardIdentity,
  box: LeitnerBox
): [LeitnerBox, Card] | null => {
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
): [LeitnerBox, Card] => {
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

  assert(
    rawWorkingDecks.length === count + 2,
    `Initial decks number doesn't fit repetitions count. Must be ${count + 2}`
  );

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

export const getCurrentLesson = (box: LeitnerBox): integer => box.currentLesson;

export const setCurrentLesson = (
  box: LeitnerBox,
  currentLesson: integer
): LeitnerBox => {
  const currentLessonLens = R.lensProp<LeitnerBox, 'currentLesson'>(
    'currentLesson'
  );

  return R.set(currentLessonLens, currentLesson, box);
};

export const isLastLessonForCard = (
  box: LeitnerBox,
  identity: CardIdentity
): boolean => {
  const { cards } = box.decks.lessons.find(
    ({ repeatOn }) => repeatOn[repeatOn.length - 1] === box.currentLesson
  ) as LeitnerLesson;

  return cards.some(identity);
};

export const getCardsForLesson = (box: LeitnerBox, lesson: integer): Card[] => {
  return box.decks.lessons.reduce<Card[]>(
    (result, { repeatOn, cards }) =>
      repeatOn.includes(lesson) ? [...result, ...cards] : result,
    []
  );
};

export const getCardsForCurrentLesson = (box: LeitnerBox): Card[] =>
  getCardsForLesson(box, box.currentLesson);

export const addToUnknown = R.partial(addCardTo, [unknownLens]);
export const addToLearned = R.partial(addCardTo, [learnedLens]);
export const addToLessons = (box: LeitnerBox, card: Card): LeitnerBox =>
  addCardTo(lessonsLens(box.currentLesson), box, card);

export const moveToUnknown = R.pipe(removeCard, R.apply(addToUnknown));
export const moveToLearned = R.pipe(removeCard, R.apply(addToLearned));
export const moveToLessons = R.pipe(removeCard, R.apply(addToLessons));
