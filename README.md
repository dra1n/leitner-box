# leitner-box

This library implements a data-structure that supports the next workflow (taken from [wikipedia](https://en.wikipedia.org/wiki/Leitner_system))

> With this method, there are 12 boxes. One is the Current Deck, one is the Retired Deck, and the remaining 10 boxes are named with these numbers:
> 
> * 0-2-5-9
> * 1-3-6-0
> * 2-4-7-1
> * 3-5-8-2
> * 4-6-9-3
> * 5-7-0-4
> * 6-8-1-5
> * 7-9-2-6
> * 8-0-3-7
> * 9-1-4-8
> 
> Learning sessions are numbered from 0 to 9, then the numbering starts over again (i.e. 0, 1, 2, ..., 8, 9, 0, 1, 2, ...).
> 
> All cards begin in Deck Current. All cards in Deck Current are done at every learning session.
> 
> If a learner is successful at a card from Deck Current, it gets transferred to the deck that begins with that session's number. For example, if this is session 0, a successful card in Deck Current moves to box 0-2-5-9; If this is session 3, a successful card from Deck Current moves to box 3-5-8-2.
> 
> A box of cards is reviewed when its name contains the current session number. For example, if this is session 0, boxes 0-2-5-9, 1-3-6-0, 5-7-0-4, and 8-0-3-7 are done because they all contain the number 0.
> 
> If a reviewed card isn't successful, it moves back to Deck Current.
> 
> If a reviewed card is successful and the last number of its box matches the current session number, then that card moves to the Retired Deck. For example, if this is session 9 and you're reviewing box 0-2-5-9, then any successful cards from this box will move to the Retired Deck.
> 
> If a reviewed card is successful and the last number of its box doesn't match the current session number, then that card stays where it is.
> 
> The effect is identical to a 5-box Leitner system, however, whereas in that system each box represents the proficiency level of its contents, here each box represents the session in which it is done.

## Usage

Basic flow might look something like this

```js
export {
  addToUnknown,
  createLeitnerBox,
  moveToLearned,
  moveToLessons,
  setCurrentLesson,
  isLastLessonForCard,
  getCardsForCurrentLesson
} from 'leitner-box';

let cards = [
  { word: "learn", translation: "aprender" }
  { word: "box", translation: "caja" }
];

let leitnerBox = createLeitnerBox();

cards.forEach(card => {
  leitnerBox = addToUnknown(leitnerBox, card);
});

// then, after initial acquaintance we move cards from "unknown" to "lessons"
// for subsequent repetitions
cards.forEach(card => {
  const identity = ({ word }) => word === card.word;
  leitnerBox = moveToLessons(leitnerBox, identity);
});

// then, after we done with unknown we might want to move to the repetition
cards = getCardsForCurrentLesson(leitnerBox);

// and at some point switch current lesson
leitnerBox = setCurrentLesson(leitnerBox, (getCurrentLesson(leitnerBox) + 1) % 9);

// at the end we might want to put cards into "learned" box
// make sure to check if this is the last repetition for the card
cards.forEach(card => {
  const identity = ({ word }) => word === card.word;

  if (isLastLessonForCard(leitnerBox, identity)) {
    leitnerBox = moveToLearned(leitnerBox, identity);
  }
});
```

For more examples please consider looking into [specs](https://github.com/dra1n/leitner-box/blob/main/tests/index.test.ts)

## Development notes

To create a new version do the following steps

* Bump version in `package.json`
* Create a new tag (for example `git tag v1.0.10`)
* Push tags into origin `git push origin --tags`
