export type Bonus = "DL" | "TL" | "DW" | "TW" | null;

export type Square = {
  letter: string | null;       // the letter on the square
  bonus: Bonus;              // the bonus for this square
  used: boolean;            // whether bonus has already been applied
};

export interface PlayerInformation {
  playerId: number,
  score: number,
  tilesRack: string[]
}

export interface GameState {
  isStarted : boolean;
  outcome: 'draw' | { winnerId: number } | null;
  playerTurn: number;
  numOfPlayers: number;
}