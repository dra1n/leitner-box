export type integer = number;
export type Card = unknown;

export interface LeitnerBoxConfig {
  repetitions?: integer;
  currentLesson?: integer;
  initialDecks?: Card[][];
}

export interface LeitnerLesson {
  repeatOn: integer[];
  cards: Card[];
}

export interface LeitnerDecks {
  unknown: Card[];
  learned: Card[];
  lessons: LeitnerLesson[];
}

export interface LeitnerBox {
  count: number;
  repetitions: number;
  currentLesson: number;
  decks: LeitnerDecks;
}

export interface CardIdentity {
  (card: Card): boolean;
}

export interface CardInfo {
  deck: 'unknown' | 'learned' | 'lessons' | 'undefined';
  repetitionsLeft?: number;
}
