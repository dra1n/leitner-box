import { createLeitnerBox } from '../src';

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
  });
});
