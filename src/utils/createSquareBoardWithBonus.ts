import type { Square, Bonus } from '../types/board';

export const createSquareBoardWithBonus = (size: number): Square[][] => {
  if (size !== 15) {
    throw new Error("Standard Scrabble board is 15x15");
  }

  const TW: [number, number][] = [
    [0,0],[0,7],[0,14],
    [7,0],[7,14],
    [14,0],[14,7],[14,14]
  ];

  const DW: [number, number][] = [
    [1,1],[2,2],[3,3],[4,4],
    [7,7], // center
    [10,10],[11,11],[12,12],[13,13],
    [1,13],[2,12],[3,11],[4,10],
    [10,4],[11,3],[12,2],[13,1]
  ];

  const TL: [number, number][] = [
    [1,5],[1,9],[5,1],[5,5],[5,9],[5,13],
    [9,1],[9,5],[9,9],[9,13],[13,5],[13,9]
  ];

  const DL: [number, number][] = [
    [0,3],[0,11],[2,6],[2,8],[3,0],[3,7],[3,14],
    [6,2],[6,6],[6,8],[6,12],
    [7,3],[7,11],
    [8,2],[8,6],[8,8],[8,12],
    [11,0],[11,7],[11,14],[12,6],[12,8],[14,3],[14,11]
  ];

  // Initialize empty board
  const board: Square[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({ letter: null, bonus: null, used: false }))
  );

  // Helper to set bonus at a list of coordinates
  const setBonus = (coords: [number, number][], bonusType: Bonus) => {
    coords.forEach(([r, c]) => {
      board[r][c].bonus = bonusType;
    });
  };

  setBonus(TW, "TW");
  setBonus(DW, "DW");
  setBonus(TL, "TL");
  setBonus(DL, "DL");

  return board;
};
