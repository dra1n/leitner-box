import { LeitnerBox, createLeitnerBox, setCurrentLesson } from '../src';

describe('API', () => {
  describe('createLeitnerBox', () => {
    describe('with default parameters', () => {
      it('should have meta info', () => {
        const leinterBox = createLeitnerBox();

        expect(leinterBox.repetitions).toEqual(3);
        expect(leinterBox.count).toEqual(10);
      });

      it('should have empty "learned" and "unknown" decks', () => {
        const leinterBox = createLeitnerBox();

        expect(leinterBox.decks.unknown).toEqual([]);
        expect(leinterBox.decks.learned).toEqual([]);
      });

      it('should have empty decks with lesson repetition info', () => {
        const leinterBox = createLeitnerBox();

        const firstLessonDeck = leinterBox.decks.lessons[0];
        const lastLessonDeck =
          leinterBox.decks.lessons[leinterBox.decks.lessons.length - 1];

        expect(firstLessonDeck.cards).toEqual([]);
        expect(firstLessonDeck.repeatOn).toEqual([0, 2, 5, 9]);

        expect(lastLessonDeck.cards).toEqual([]);
        expect(lastLessonDeck.repeatOn).toEqual([9, 1, 4, 8]);
      });

      it('should have current lesson set to 0', () => {
        const leinterBox = createLeitnerBox();

        expect(leinterBox.currentLesson).toEqual(0);
      });
    });

    describe('with predefined parameters', () => {
      describe('current lesson', () => {
        it('sets current lesson', () => {
          const leinterBox = createLeitnerBox({ currentLesson: 5 });

          expect(leinterBox.currentLesson).toEqual(5);
        });
      });

      describe('repetitions', () => {
        it('is used to create leitner decks', () => {
          const leinterBox = createLeitnerBox({ repetitions: 2 });

          const firstLessonDeck = leinterBox.decks.lessons[0];
          const lastLessonDeck =
            leinterBox.decks.lessons[leinterBox.decks.lessons.length - 1];

          expect(firstLessonDeck.cards).toEqual([]);
          expect(firstLessonDeck.repeatOn).toEqual([0, 2, 5]);

          expect(lastLessonDeck.cards).toEqual([]);
          expect(lastLessonDeck.repeatOn).toEqual([5, 1, 4]);
        });

        it('is accessible via property', () => {
          const leinterBox = createLeitnerBox({ repetitions: 2 });

          expect(leinterBox.repetitions).toEqual(2);
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
          const leinterBox = createLeitnerBox({ initialDecks, repetitions: 2 });

          expect(leinterBox.decks.unknown).toEqual(['unk', 'nown']);
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
          const leinterBox = createLeitnerBox({ initialDecks, repetitions: 2 });

          expect(leinterBox.decks.learned).toEqual(['lea', 'rnd']);
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
          const leinterBox = createLeitnerBox({ initialDecks, repetitions: 2 });

          const firstLessonDeck = leinterBox.decks.lessons[0];
          const lastLessonDeck =
            leinterBox.decks.lessons[leinterBox.decks.lessons.length - 1];

          expect(firstLessonDeck.cards).toEqual(['a', 'b']);
          expect(firstLessonDeck.repeatOn).toEqual([0, 2, 5]);

          expect(lastLessonDeck.cards).toEqual(['f', 'g']);
          expect(lastLessonDeck.repeatOn).toEqual([5, 1, 4]);
        });
      });
    });
  });

  describe('setCurrentLesson', () => {
    let initialLeinterBox: LeitnerBox;

    beforeEach(() => {
      initialLeinterBox = createLeitnerBox({
        currentLesson: 0,
        repetitions: 3
      });
    });

    it('updates current lesson', () => {
      const leitnerBox = setCurrentLesson(initialLeinterBox, 4);

      expect(leitnerBox.currentLesson).toEqual(4);
    });

    it('returns new leitner box', () => {
      const leitnerBox = setCurrentLesson(initialLeinterBox, 4);

      expect(leitnerBox === initialLeinterBox).toBeFalsy();
    });
  });
});
