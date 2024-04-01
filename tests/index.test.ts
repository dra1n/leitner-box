import {
  Card,
  LeitnerBox,
  addToLearned,
  addToLessons,
  addToUnknown,
  createLeitnerBox,
  integer,
  moveToLearned,
  moveToLessons,
  moveToUnknown,
  isLastLessonForCard,
  getCurrentLesson,
  setCurrentLesson,
  getCardInfo,
  getCardsForCurrentLesson,
  getCardsForLesson
} from '../src';

describe('API', () => {
  describe('createLeitnerBox', () => {
    describe('with default parameters', () => {
      it('should have meta info', () => {
        const leitnerBox = createLeitnerBox();

        expect(leitnerBox.repetitions).toEqual(3);
        expect(leitnerBox.count).toEqual(10);
      });

      it('should have empty "learned" and "unknown" decks', () => {
        const leitnerBox = createLeitnerBox();

        expect(leitnerBox.decks.unknown).toEqual([]);
        expect(leitnerBox.decks.learned).toEqual([]);
      });

      it('should have empty decks with lesson repetition info', () => {
        const leitnerBox = createLeitnerBox();

        const firstLessonDeck = leitnerBox.decks.lessons[0];
        const lastLessonDeck =
          leitnerBox.decks.lessons[leitnerBox.decks.lessons.length - 1];

        expect(firstLessonDeck.cards).toEqual([]);
        expect(firstLessonDeck.repeatOn).toEqual([2, 5, 9]);

        expect(lastLessonDeck.cards).toEqual([]);
        expect(lastLessonDeck.repeatOn).toEqual([1, 4, 8]);
      });

      it('should have current lesson set to 0', () => {
        const leitnerBox = createLeitnerBox();

        expect(leitnerBox.currentLesson).toEqual(0);
      });
    });

    describe('with predefined parameters', () => {
      describe('current lesson', () => {
        it('sets current lesson', () => {
          const leitnerBox = createLeitnerBox({ currentLesson: 5 });

          expect(leitnerBox.currentLesson).toEqual(5);
        });
      });

      describe('repetitions', () => {
        it('is used to create leitner decks', () => {
          const leitnerBox = createLeitnerBox({ repetitions: 2 });

          const firstLessonDeck = leitnerBox.decks.lessons[0];
          const lastLessonDeck =
            leitnerBox.decks.lessons[leitnerBox.decks.lessons.length - 1];

          expect(firstLessonDeck.cards).toEqual([]);
          expect(firstLessonDeck.repeatOn).toEqual([2, 5]);

          expect(lastLessonDeck.cards).toEqual([]);
          expect(lastLessonDeck.repeatOn).toEqual([1, 4]);
        });

        it('is accessible via property', () => {
          const leitnerBox = createLeitnerBox({ repetitions: 2 });

          expect(leitnerBox.repetitions).toEqual(2);
        });
      });

      describe('initial decks', () => {
        it('takes unknown deck as the first item in the array', () => {
          const initialDecks = [
            ['unk', 'nown'],
            ['a', 'b'],
            ['c', 'd'],
            [],
            [],
            ['e'],
            ['f', 'g'],
            ['lea', 'rnd']
          ];
          const leitnerBox = createLeitnerBox({ initialDecks, repetitions: 2 });

          expect(leitnerBox.decks.unknown).toEqual(['unk', 'nown']);
        });

        it('takes learned deck as the last item in the array', () => {
          const initialDecks = [
            ['unk', 'nown'],
            ['a', 'b'],
            ['c', 'd'],
            [],
            [],
            ['e'],
            ['f', 'g'],
            ['lea', 'rnd']
          ];
          const leitnerBox = createLeitnerBox({ initialDecks, repetitions: 2 });

          expect(leitnerBox.decks.learned).toEqual(['lea', 'rnd']);
        });

        it('takes decks for repetition as middle part of the array', () => {
          /* The size of the decks for repetition should equal `fib(repetitions) + 1` */
          const initialDecks = [
            ['unk', 'nown'],
            ['a', 'b'],
            ['c', 'd'],
            [],
            [],
            ['e'],
            ['f', 'g'],
            ['lea', 'rnd']
          ];
          const leitnerBox = createLeitnerBox({ initialDecks, repetitions: 2 });

          const firstLessonDeck = leitnerBox.decks.lessons[0];
          const lastLessonDeck =
            leitnerBox.decks.lessons[leitnerBox.decks.lessons.length - 1];

          expect(firstLessonDeck.cards).toEqual(['a', 'b']);
          expect(firstLessonDeck.repeatOn).toEqual([2, 5]);

          expect(lastLessonDeck.cards).toEqual(['f', 'g']);
          expect(lastLessonDeck.repeatOn).toEqual([1, 4]);
        });
      });
    });
  });

  describe('setCurrentLesson', () => {
    let initialLeitnerBox: LeitnerBox;

    beforeEach(() => {
      initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 3
      });
    });

    it('updates current lesson', () => {
      const leitnerBox = setCurrentLesson(initialLeitnerBox, 4);

      expect(leitnerBox.currentLesson).toEqual(4);
    });

    it('returns new leitner box', () => {
      const leitnerBox = setCurrentLesson(initialLeitnerBox, 4);

      expect(leitnerBox === initialLeitnerBox).toBeFalsy();
    });
  });

  describe('isLastLessonForCard', () => {
    it('returns true if this is the last repetition for the card', () => {
      const initialDecks = [
        ['unk', 'nown'],
        ['a', 'b'],
        ['c', 'd'],
        [],
        [],
        ['e'],
        ['f', 'g'],
        ['lea', 'rnd']
      ];
      const leitnerBox = createLeitnerBox({
        initialDecks,
        currentLesson: 5,
        repetitions: 2
      });
      const cardIdentity = (card: Card) => card === 'a';
      const cardsForRepetition = getCardsForCurrentLesson(leitnerBox);

      expect(cardsForRepetition).toContain('a');
      expect(isLastLessonForCard(leitnerBox, cardIdentity)).toEqual(true);
    });

    it('returns false if this is not the last repetition for the card', () => {
      const initialDecks = [
        ['unk', 'nown'],
        ['a', 'b'],
        ['c', 'd'],
        [],
        [],
        ['e'],
        ['f', 'g'],
        ['lea', 'rnd']
      ];
      const leitnerBox = createLeitnerBox({
        initialDecks,
        currentLesson: 2,
        repetitions: 2
      });
      const cardIdentity = (card: Card) => card === 'a';
      const cardsForRepetition = getCardsForCurrentLesson(leitnerBox);

      expect(cardsForRepetition).toContain('a');
      expect(isLastLessonForCard(leitnerBox, cardIdentity)).toEqual(false);
    });
  });

  describe('getCurrentLesson', () => {
    it('returns current lesson', () => {
      const leitnerBox = createLeitnerBox({
        currentLesson: 1,
        repetitions: 3
      });

      expect(getCurrentLesson(leitnerBox)).toEqual(1);
    });
  });

  describe('getCardsForLesson', () => {
    it('return cards collection for the given lesson', () => {
      const leitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [2], cards: [] },
      //   { repeatOn: [0], cards: ['a'] },
      //   { repeatOn: [1], cards: [] }
      // ]
      expect(getCardsForLesson(leitnerBox, 0)).toEqual(['a']);
    });

    it('works for multiple repetitions', () => {
      const leitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], [], [], [], []],
        repetitions: 2
      });

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [2, 5], cards: [] },
      //   { repeatOn: [3, 0], cards: ['a'] },
      //   { repeatOn: [4, 1], cards: [] }
      // ]
      expect(getCardsForLesson(leitnerBox, 0)).toEqual(['a']);
      expect(getCardsForLesson(leitnerBox, 3)).toEqual(['a']);
      expect(getCardsForLesson(leitnerBox, 1)).toEqual([]);
    });

    it('return returns empty collection if the asked lesson is empty', () => {
      const leitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [2], cards: [] },
      //   { repeatOn: [0], cards: ['a'] },
      //   { repeatOn: [1], cards: [] }
      // ]
      expect(getCardsForLesson(leitnerBox, 1)).toEqual([]);
    });
  });

  describe('getCardInfo', () => {
    it('returns "unknown" deck info if card is in "unknown" section', () => {
      let leitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 2
      });

      leitnerBox = addToUnknown(leitnerBox, 'a');

      expect(getCardInfo(leitnerBox, (c) => c === 'a')).toEqual(
        expect.objectContaining({
          deck: 'unknown'
        })
      );

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [2, 5], cards: [] },
      //   { repeatOn: [3, 0], cards: ['a'] },
      //   { repeatOn: [4, 1], cards: [] }
      // ]
      // expect(getCardsForCurrentLesson(leitnerBox)).toEqual(['a']);
    });

    it('returns "learned" deck info if card is in "learned" section', () => {
      let leitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 2
      });

      leitnerBox = addToLearned(leitnerBox, 'a');

      expect(getCardInfo(leitnerBox, (c) => c === 'a')).toEqual(
        expect.objectContaining({
          deck: 'learned'
        })
      );
    });

    it('returns "lessons" deck info if card is in "lessons" section', () => {
      let leitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 2
      });

      leitnerBox = addToLessons(leitnerBox, 'a');

      expect(getCardInfo(leitnerBox, (c) => c === 'a')).toEqual(
        expect.objectContaining({
          deck: 'lessons'
        })
      );
    });

    it('returns the number of repetitions left for a lesson', () => {
      let leitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 2
      });

      leitnerBox = addToLessons(leitnerBox, 'a');

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [ 2, 5 ], cards: [ 'a' ] },
      //   { repeatOn: [ 3, 0 ], cards: [] },
      //   ...
      // ]

      expect(getCardInfo(leitnerBox, (c) => c === 'a')).toEqual(
        expect.objectContaining({
          deck: 'lessons',
          repetitionsLeft: 2
        })
      );
    });

    it('takes into account current lesson when returns number of repetitions left', () => {
      let leitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 2
      });

      leitnerBox = addToLessons(leitnerBox, 'a');
      leitnerBox = setCurrentLesson(leitnerBox, 3);

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [ 2, 5 ], cards: [ 'a' ] },
      //   { repeatOn: [ 3, 0 ], cards: [] },
      //   ...
      // ]

      expect(getCardInfo(leitnerBox, (c) => c === 'a')).toEqual(
        expect.objectContaining({
          deck: 'lessons',
          repetitionsLeft: 1
        })
      );
    });

    it('returns 1 if this is the last lesson for a card', () => {
      let leitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 2
      });

      leitnerBox = addToLessons(leitnerBox, 'a');
      leitnerBox = setCurrentLesson(leitnerBox, 5);

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [ 2, 5 ], cards: [ 'a' ] },
      //   { repeatOn: [ 3, 0 ], cards: [] },
      //   ...
      // ]

      expect(getCardInfo(leitnerBox, (c) => c === 'a')).toEqual(
        expect.objectContaining({
          deck: 'lessons',
          repetitionsLeft: 1
        })
      );
    });
  });

  describe('getCardsForCurrentLesson', () => {
    it('return cards collection for the current lesson', () => {
      const leitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [2], cards: [] },
      //   { repeatOn: [0], cards: ['a'] },
      //   { repeatOn: [1], cards: [] }
      // ]
      expect(getCardsForCurrentLesson(leitnerBox)).toEqual(['a']);
    });

    it('works for multiple repetitions', () => {
      const leitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], [], [], [], []],
        repetitions: 2
      });

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [2, 5], cards: [] },
      //   { repeatOn: [3, 0], cards: ['a'] },
      //   { repeatOn: [4, 1], cards: [] }
      // ]
      expect(getCardsForCurrentLesson(leitnerBox)).toEqual(['a']);
    });

    it('return returns empty collection if the asked lesson is empty', () => {
      const leitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], [], ['a'], []],
        repetitions: 1
      });

      // leitnerBox.decks.lessons):
      //
      // [
      //   { repeatOn: [2], cards: [] },
      //   { repeatOn: [0], cards: [] },
      //   { repeatOn: [1], cards: ['a'] }
      // ]
      expect(getCardsForCurrentLesson(leitnerBox)).toEqual([]);
    });
  });

  describe('addToUnknown', () => {
    let initialLeitnerBox: LeitnerBox;

    beforeEach(() => {
      initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 3
      });
    });

    it('adds a card to unknown list', () => {
      const newCard = 'a';

      const leitnerBox = addToUnknown(initialLeitnerBox, newCard);

      expect(leitnerBox.decks.unknown).toEqual(['a']);
    });

    it('adds a card to the end of the unknown list', () => {
      initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [['a'], [], [], [], []],
        repetitions: 1
      });

      const newCard = 'b';

      const leitnerBox = addToUnknown(initialLeitnerBox, newCard);

      expect(leitnerBox.decks.unknown).toEqual(['a', 'b']);
    });

    it('returns a new leitner box', () => {
      const newCard = 'a';

      const leitnerBox = addToUnknown(initialLeitnerBox, newCard);

      expect(leitnerBox === initialLeitnerBox).toBeFalsy();
    });

    it('does nothing if the card has falsy value', () => {
      const newCard = null;

      const leitnerBox = addToUnknown(initialLeitnerBox, newCard);

      expect(leitnerBox === initialLeitnerBox).toBeTruthy();
    });
  });

  describe('addToLearned', () => {
    let initialLeitnerBox: LeitnerBox;

    beforeEach(() => {
      initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 3
      });
    });

    it('adds a card to the learned list', () => {
      const newCard = 'a';

      const leitnerBox = addToLearned(initialLeitnerBox, newCard);

      expect(leitnerBox.decks.learned).toEqual(['a']);
    });

    it('adds a card to the end of the learned list', () => {
      initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], [], [], ['a']],
        repetitions: 1
      });

      const newCard = 'b';

      const leitnerBox = addToLearned(initialLeitnerBox, newCard);

      expect(leitnerBox.decks.learned).toEqual(['a', 'b']);
    });

    it('returns a new leitner box', () => {
      const newCard = 'a';

      const leitnerBox = addToLearned(initialLeitnerBox, newCard);

      expect(leitnerBox === initialLeitnerBox).toBeFalsy();
    });

    it('does nothing if the card has falsy value', () => {
      const newCard = null;

      const leitnerBox = addToLearned(initialLeitnerBox, newCard);

      expect(leitnerBox === initialLeitnerBox).toBeTruthy();
    });
  });

  describe('addToLessons', () => {
    let initialLeitnerBox: LeitnerBox;
    let currentLesson: integer;

    beforeEach(() => {
      currentLesson = 1;
      initialLeitnerBox = createLeitnerBox({
        currentLesson,
        repetitions: 3
      });
    });

    it('adds a card to the right lesson box', () => {
      const newCard = 'a';

      const leitnerBox = addToLessons(initialLeitnerBox, newCard);

      expect(leitnerBox.decks.lessons[leitnerBox.currentLesson].cards).toEqual([
        'a'
      ]);
    });

    it('adds a card to the end of the lesson box', () => {
      initialLeitnerBox = createLeitnerBox({
        currentLesson,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });

      const newCard = 'b';

      const leitnerBox = addToLessons(initialLeitnerBox, newCard);

      expect(leitnerBox.decks.lessons[leitnerBox.currentLesson].cards).toEqual([
        'a',
        'b'
      ]);
    });

    it('returns a new leitner box', () => {
      const newCard = 'a';

      const leitnerBox = addToLessons(initialLeitnerBox, newCard);

      expect(leitnerBox === initialLeitnerBox).toBeFalsy();
    });

    it('does nothing if the card has falsy value', () => {
      const newCard = null;

      const leitnerBox = addToLessons(initialLeitnerBox, newCard);

      expect(leitnerBox === initialLeitnerBox).toBeTruthy();
    });
  });

  describe('moveToUnknown', () => {
    it('should be able to move card from the "unknown" section [not recommended]', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [['a'], [], [], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToUnknown(initialLeitnerBox, identity);

      expect(leitnerBox.decks.unknown).toEqual(['a']);
    });

    it('should be able to move card from the "learned" section', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], [], [], ['a']],
        repetitions: 1
      });
      const leitnerBox = moveToUnknown(initialLeitnerBox, identity);

      expect(leitnerBox.decks.unknown).toEqual(['a']);
    });

    it('should be able to move card from the "lessons" section', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToUnknown(initialLeitnerBox, identity);

      expect(leitnerBox.decks.unknown).toEqual(['a']);

      leitnerBox.decks.lessons.forEach(({ cards }) => {
        expect(cards).toEqual([]);
      });
    });

    it("returns the same leitner box if value wasn't found", () => {
      const identity = (c: Card) => c === 'b';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToUnknown(initialLeitnerBox, identity);

      expect(leitnerBox).toEqual(initialLeitnerBox);
    });
  });

  describe('moveToLearned', () => {
    it('should be able to move card from the "unknown" section [not recommended]', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [['a'], [], [], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToLearned(initialLeitnerBox, identity);

      expect(leitnerBox.decks.learned).toEqual(['a']);
    });

    it('should be able to move card from the "learned" section [not recommended]', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], [], [], ['a']],
        repetitions: 1
      });
      const leitnerBox = moveToLearned(initialLeitnerBox, identity);

      expect(leitnerBox.decks.learned).toEqual(['a']);
    });

    it('should be able to move card from the "lessons" section', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToLearned(initialLeitnerBox, identity);

      expect(leitnerBox.decks.learned).toEqual(['a']);

      leitnerBox.decks.lessons.forEach(({ cards }) => {
        expect(cards).toEqual([]);
      });
    });

    it("returns the same leitner box if value wasn't found", () => {
      const identity = (c: Card) => c === 'b';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToLearned(initialLeitnerBox, identity);

      expect(leitnerBox).toEqual(initialLeitnerBox);
    });
  });

  describe('moveToLessons', () => {
    it('should be able to move card from the "unknown" section', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [['a'], [], [], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToLessons(initialLeitnerBox, identity);

      expect(leitnerBox.decks.unknown).toEqual([]);
      expect(leitnerBox.decks.lessons[leitnerBox.currentLesson].cards).toEqual([
        'a'
      ]);
    });

    it('should be able to move card from the "learned" section [not recommended]', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], [], [], ['a']],
        repetitions: 1
      });
      const leitnerBox = moveToLessons(initialLeitnerBox, identity);

      expect(leitnerBox.decks.learned).toEqual([]);
      expect(leitnerBox.decks.lessons[leitnerBox.currentLesson].cards).toEqual([
        'a'
      ]);
    });

    it('should be able to move card from the "lessons" section [not recommended]', () => {
      const identity = (c: Card) => c === 'a';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToLessons(initialLeitnerBox, identity);

      expect(leitnerBox.decks.lessons[1].cards).toEqual([]);
      expect(leitnerBox.decks.lessons[leitnerBox.currentLesson].cards).toEqual([
        'a'
      ]);
    });

    it("returns the same leitner box if value wasn't found", () => {
      const identity = (c: Card) => c === 'b';
      const initialLeitnerBox = createLeitnerBox({
        currentLesson: 0,
        initialDecks: [[], [], ['a'], [], []],
        repetitions: 1
      });
      const leitnerBox = moveToLessons(initialLeitnerBox, identity);

      expect(leitnerBox).toEqual(initialLeitnerBox);
    });
  });
});
