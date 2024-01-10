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
