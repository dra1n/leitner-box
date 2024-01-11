export type integer = number;
export type Card = unknown;

export interface LeitnerBoxConfig {
  repetitions?: integer;
  currentLesson?: integer;
  initialDecks?: Array<Array<Card>>;
}

export interface LeitnerLesson {
  repeatOn: Array<integer>;
  cards: Array<Card>;
}

export interface LeitnerDecks {
  unknown: Array<Card>;
  learned: Array<Card>;
  lessons: Array<LeitnerLesson>;
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
