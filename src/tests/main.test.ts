import { drawTiles } from "../utils/drawTiles"
import { exchangeTiles } from "../utils/exchangeTiles"
import { shuffleBag } from "../utils/shuffleBag"
import { getPotentialWords } from "../utils/getPotentialWords"
import { createSquareBoardWithBonus } from "../utils/createSquareBoardWithBonus"
import type { Square } from "../types/board"

describe('drawTiles', () => {
    test('Returned bag should have 7 elements fewer if it had more than 7 to begin with', () => {
        const bag = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I']
        const playerTileRack: string[] = []
        expect(drawTiles(bag, playerTileRack, 7)).toEqual({ remainingTilesInBag: ['Q'], newTileRack: ['I', 'U', 'Y', 'T', 'R', 'E', 'W'] })
    })

    test('Returned bag should have 0 elements fewer if it had fewer than 8 to begin with', () => {
        const bag = ['Q', 'W', 'E', 'R']
        const playerTileRack: string[] = []
        expect(drawTiles(bag, playerTileRack, 7)).toEqual({ remainingTilesInBag: [], newTileRack: ['R', 'E', 'W', 'Q'] })
    })

    test('Number of tiles returned by function matches the request number of new tiles', () => {
        const bag = ['Q', 'W', 'E', 'R']
        const playerTileRack: string[] = []
        expect(drawTiles(bag, playerTileRack, 2)).toEqual({ remainingTilesInBag: ['Q', 'W'], newTileRack: ['R', 'E'] })
    })

    test('Inputs are not mutated', () => {
        const bag = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I']
        const playerTileRack: string[] = []
        const { remainingTilesInBag, newTileRack } = drawTiles(bag, playerTileRack, 7)
        // Test references are different
        expect(remainingTilesInBag).not.toBe(bag);
        expect(newTileRack).not.toBe(playerTileRack);

        expect(bag).toEqual(['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I']);
        expect(playerTileRack).toEqual([]);
    })
})

describe('exchangeTiles', () => {
    test('Returns the same bag and tile rack if the bag has fewer than 7 tiles left', () => {
        const bag = ['Q', 'W', 'R', 'T', 'Y', 'U'];
        const playerTileRack = ['E'];
        const tilesToExchange = ['E'];

        expect(exchangeTiles(bag, playerTileRack, tilesToExchange)).toEqual({
            remainingTilesInBag: ['Q', 'W', 'R', 'T', 'Y', 'U'],
            newTileRack: ['E'],
        });
    })

    test('Exchanges tiles if the bag has at least  7 tiles left', () => {
        const bag = ['Q', 'W', 'R', 'T', 'Y', 'U', 'P'];
        const playerTileRack = ['E'];
        const tilesToExchange = ['E'];

        expect(exchangeTiles(bag, playerTileRack, tilesToExchange)).toEqual(
            expect.objectContaining({
                newTileRack: ['P'],
            })
        );
    })

    test('Exchanging 3 tiles updates the bag and rack correctly', () => {
        const bag = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O']; // at least 7 tiles
        const playerTileRack = ['A', 'B', 'C'];
        const tilesToExchange = ['A', 'B', 'C'];

        const { remainingTilesInBag, newTileRack } = exchangeTiles(bag, playerTileRack, tilesToExchange);

        // The new rack should have the same number of tiles as exchanged
        expect(newTileRack).toHaveLength(3);

        // The bag length should stay the same
        expect(remainingTilesInBag).toHaveLength(bag.length);

        // Bag + rack together should equal original bag + original rack
        const allTilesAfterExchange = [...remainingTilesInBag, ...newTileRack];
        const expectedTiles = [...bag, ...playerTileRack];
        expect(allTilesAfterExchange.sort()).toEqual(expectedTiles.sort());
    });

    test('Inputs are not mutated', () => {
        const bag = ['Q', 'W', 'R', 'T', 'Y', 'U', 'P'];
        const playerTileRack = ['E'];
        const tilesToExchange = ['E'];

        const { remainingTilesInBag, newTileRack } = exchangeTiles(bag, playerTileRack, tilesToExchange)

        expect(remainingTilesInBag).not.toBe(bag);
        expect(newTileRack).not.toBe(playerTileRack);
        expect(tilesToExchange).toBe(tilesToExchange);
    })
})

describe('shuffleBag', () => {
    test('returns an empty array if input is falsy', () => {
        expect(shuffleBag([])).toEqual([]);
    });

    test('returns an array of the same length', () => {
        const bag = ['A', 'B', 'C', 'D'];
        const result = shuffleBag([...bag]);
        expect(result).toHaveLength(bag.length);
    });

    test('contains the same elements after shuffling', () => {
        const bag = ['A', 'B', 'C', 'D', 'E'];
        const result = shuffleBag([...bag]);
        expect(result.sort()).toEqual(bag.sort());
    });

    test('does not mutate the original array reference', () => {
        const bag = ['A', 'B', 'C', 'D'];
        const copy = [...bag];
        const result = shuffleBag(copy);

        expect(result).not.toBe(copy);
        expect(result.sort()).toEqual(copy.sort());
    });

    test('order changes in most cases', () => {
        const bag = Array.from({ length: 20 }, (_, i) => i.toString());
        const result = shuffleBag([...bag]);

        // It's possible (rarely) that the shuffle returns the same order.
        const sameOrder = result.every((val, i) => val === bag[i]);
        expect(sameOrder).toBe(false);
    });
});

describe('getPotentialWords', () => {

    test('Tile placements with no neighbours and no isFirstMove flag returns error', () => {
        const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
        const board = createSquareBoardWithBonus(15)
        board[0][2].letter = "T"
        board[0][3].letter = "U"
        board[0][4].letter = "R"
        board[0][5].letter = "N"
        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(false)
        if (result.success === false) {
            expect(result.error).toBe("Tiles must connect to existing words")
        }
    })


    test('Horizontal placed word with no connections returns just that word', () => {
        const newWordCoordsArray = [[7, 4], [7, 5], [7, 6], [7, 7]]
        const board = createSquareBoardWithBonus(15)
        board[7][4].letter = "T"
        board[7][5].letter = "U"
        board[7][6].letter = "R"
        board[7][7].letter = "N"
        const result = getPotentialWords(board, newWordCoordsArray, true)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            expect(wordsToValidate).toEqual(['TURN'])
        }
    })

    test('Horizontal placed word with horizontal connections returns the connected horizontal word', () => {
        const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
        const board = createSquareBoardWithBonus(15)
        board[0][0].letter = "R"
        board[0][1].letter = "E"
        board[0][2].letter = "T"
        board[0][3].letter = "U"
        board[0][4].letter = "R"
        board[0][5].letter = "N"
        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            expect(wordsToValidate).toEqual(['RETURN'])
        }
    })

    test('Horizontal placed word with vertical and horizontal connections returns the connected horizontal word and vertical words', () => {
        const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
        const board = createSquareBoardWithBonus(15)
        // Horizontal Letter Placements 
        board[0][0].letter = "R"
        board[0][1].letter = "E"
        board[0][2].letter = "T"
        board[0][3].letter = "U"
        board[0][4].letter = "R"
        board[0][5].letter = "N"
        // Vertical Letter Placements 
        board[1][2].letter = "U"
        board[2][2].letter = "N"
        board[3][2].letter = "E"
        board[1][5].letter = "O"
        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            expect(wordsToValidate).toEqual(['RETURN', 'TUNE', 'NO'])
        }
    })

    test('Horizontal word placement correctly detects cross connections', () => {
        const newWordCoordsArray = [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]]
        const board = createSquareBoardWithBonus(15)
        // Horizontal Letter Placements 
        board[5][0].letter = "R"
        board[5][1].letter = "E"
        board[5][2].letter = "T"
        board[5][3].letter = "U"
        board[5][4].letter = "R"
        board[5][5].letter = "N"
        // Vertical Letter Placements 
        board[3][4].letter = "T"
        board[4][4].letter = "I"
        board[5][4].letter = "R"
        board[6][4].letter = "E"

        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            expect(wordsToValidate).toEqual(['RETURN', 'TIRE'])
        }
    })

    test('Vertical word placement correctly detects cross connections', () => {
        const newWordCoordsArray = [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]]
        const board = createSquareBoardWithBonus(15)
        // Horizontal Letter Placements 
        board[0][5].letter = "R"
        board[1][5].letter = "E"
        board[2][5].letter = "T"
        board[3][5].letter = "U"
        board[4][5].letter = "R"
        board[5][5].letter = "N"
        // Vertical Letter Placements 
        board[4][3].letter = "T"
        board[4][4].letter = "I"
        board[4][5].letter = "R"
        board[4][6].letter = "E"

        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            expect(wordsToValidate).toEqual(['RETURN', 'TIRE'])
        }
    })

    test('Vertical placed word with Vertical connections returns the connected vertical word', () => {
        const newWordCoordsArray = [[2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]]
        const board = createSquareBoardWithBonus(15)
        board[2][7].letter = "R"
        board[3][7].letter = "E"
        board[4][7].letter = "T"
        board[5][7].letter = "U"
        board[6][7].letter = "R"
        board[7][7].letter = "N"
        const result = getPotentialWords(board, newWordCoordsArray, true)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            expect(wordsToValidate).toEqual(['RETURN'])
        }
    })

    test('Single letter place returns the connected vertical and horizontal words', () => {
        const newWordCoordsArray = [[2, 2]]
        const board = createSquareBoardWithBonus(15)

        // Horizontal word already on board
        board[2][0].letter = "C"
        board[2][1].letter = "A"
        // Vertical word already on board
        board[0][2].letter = "S"
        board[1][2].letter = "A"

        // Place the new letter
        board[2][2].letter = "T" // completes horizontal "CAT" and vertical "SAT"

        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            expect(wordsToValidate).toEqual(['CAT', 'SAT'])
        }
    })

    test('Correct score counts with no bonuses', () => {
        const newWordCoordsArray = [[4, 8], [4, 9], [4, 10], [4, 11]]
        const board = createSquareBoardWithBonus(15)

        board[3][8].letter = "A"

        board[4][8].letter = "T"
        board[4][9].letter = "U"
        board[4][10].letter = "R"
        board[4][11].letter = "N"
        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            const totalScore = result.words.reduce((sum, w) => sum + w.score, 0);
            expect(wordsToValidate).toEqual(['TURN', 'AT'])
            expect(totalScore).toBe(6)
        }
    })

    test('Correct score counts with DL bonus ', () => {
        const newWordCoordsArray = [[6, 6], [6, 5], [6, 4], [6, 3]]
        const board = createSquareBoardWithBonus(15)
        board[5][3].letter = "A"

        board[6][3].letter = "T"
        board[6][4].letter = "U"
        board[6][5].letter = "R"
        board[6][6].letter = "N"
        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            const totalScore = result.words.reduce((sum, w) => sum + w.score, 0);
            expect(wordsToValidate).toEqual(['TURN', 'AT'])
            expect(totalScore).toBe(7)
        }
    })

    test('Correct score counts with TL bonus ', () => {
        const newWordCoordsArray = [[5, 2], [5, 3], [5, 4], [5, 5]]
        const board = createSquareBoardWithBonus(15)
        board[4][2].letter = "A"

        board[5][2].letter = "T"
        board[5][3].letter = "U"
        board[5][4].letter = "R"
        board[5][5].letter = "N"
        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            const totalScore = result.words.reduce((sum, w) => sum + w.score, 0);
            expect(wordsToValidate).toEqual(['TURN', 'AT'])
            expect(totalScore).toBe(8)
        }
    })

    test('Correct score counts with DW bonus ', () => {
        const newWordCoordsArray = [[1, 1], [1, 2], [1, 3]]
        const board = createSquareBoardWithBonus(15)
        board[1][1].letter = "A"
        board[1][2].letter = "X"
        board[1][3].letter = "E"

        board[2][3].letter = "L"

        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            const totalScore = result.words.reduce((sum, w) => sum + w.score, 0);
            expect(wordsToValidate).toEqual(['AXE', 'EL'])
            expect(totalScore).toBe(22)
        }
    })

    test('Correct score counts with TW bonus ', () => {
        const newWordCoordsArray = [[0, 0], [0, 1], [0, 2]]
        const board = createSquareBoardWithBonus(15)
        board[0][0].letter = "A"
        board[0][1].letter = "X"
        board[0][2].letter = "E"

        board[1][2].letter = "T"

        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            const totalScore = result.words.reduce((sum, w) => sum + w.score, 0);
            expect(wordsToValidate).toEqual(['AXE', 'ET'])
            expect(totalScore).toBe(32)
        }
    })

    test('Correct score counts with TW bonus and DW bonus and multiple words ', () => {
        const newWordCoordsArray = [[3, 7], [4, 7], [5, 7], [6, 7]]
        const board = createSquareBoardWithBonus(15)
        board[3][7].letter = "H"
        board[4][7].letter = "A"
        board[5][7].letter = "V"
        board[6][7].letter = "E"

        board[4][8].letter = "G"
        board[4][9].letter = "E"

        const result = getPotentialWords(board, newWordCoordsArray, false)
        expect(result.success).toBe(true)
        if (result.success) {
            const wordsToValidate = result.words.map((item) => item.word)
            const totalScore = result.words.reduce((sum, w) => sum + w.score, 0);
            expect(wordsToValidate).toEqual(['HAVE', 'AGE'])
            expect(totalScore).toBe(27)
        }
    })

})

describe("getPotentialWords - placement validation", () => {

    test("rejects first move if it does not cover the center", () => {
        const board = createSquareBoardWithBonus(15)
        // Place letters at (7,5) and (7,6) which are near center row,
        // but do NOT include the true center (7,7)
        board[7][5].letter = "H"
        board[7][6].letter = "I"

        const result = getPotentialWords(board, [[7, 5], [7, 6]], true)
        expect(result.success).toBe(false)
        if (result.success === false) {
            expect(result.error).toBe("First word must cover the center square")
        }
    })

    test("accepts first move if it covers the center", () => {
        const board = createSquareBoardWithBonus(15)
        // Middle of a 15x15 board is (7,7)
        board[7][7].letter = "A"
        board[7][8].letter = "T"

        const result = getPotentialWords(board, [[7, 7], [7, 8]], true)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.words.length).toBeGreaterThan(0)
        }
    })


    test("accepts a single-letter placement as first move", () => {
        const board = createSquareBoardWithBonus(15)
        board[7][7].letter = "A"
        const result = getPotentialWords(board, [[7, 7]], true)
        expect(result.success).toBe(true)
    })

    test("accepts a single-letter placement as a move after first", () => {
        const board = createSquareBoardWithBonus(15)
        board[7][7].letter = "A"

        board[7][8].letter = "B"

        const result = getPotentialWords(board, [[7, 8]], false)
        expect(result.success).toBe(true)
    })

    test("accepts horizontal continuous placement", () => {
        const board = createSquareBoardWithBonus(15)
        board[2][1].letter = "A"
        board[2][2].letter = "B"
        board[2][3].letter = "C"

        board[2][4].letter = "D"

        const result = getPotentialWords(board, [[2, 1], [2, 2], [2, 3]], false)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.words.length).toBeGreaterThan(0)
        }
    })

    test("accepts vertical continuous placement", () => {
        const board = createSquareBoardWithBonus(15)
        board[1][4].letter = "A"
        board[2][4].letter = "B"
        board[3][4].letter = "C"

        board[4][4].letter = "D"

        const result = getPotentialWords(board, [[1, 4], [2, 4], [3, 4]], false)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.words.length).toBeGreaterThan(0)
        }
    })

    test("rejects diagonal placement", () => {
        const board = createSquareBoardWithBonus(15)
        board[1][1].letter = "A"
        board[2][2].letter = "B"
        board[3][3].letter = "C"

        board[0][1].letter = "D"

        const result = getPotentialWords(board, [[1, 1], [2, 2], [3, 3]], false)
        expect(result.success).toBe(false)
        if (result.success === false) {
            expect(result.error).toBe("Tiles must be placed in a single row or column")
        }
    })

    test("rejects gappy placement (missing cell)", () => {
        const board = createSquareBoardWithBonus(15)
        board[1][1].letter = "A"

        board[2][1].letter = "B"
        board[2][3].letter = "C"
        const result = getPotentialWords(board, [[2, 1], [2, 3]], false)
        expect(result.success).toBe(false)
        if (result.success === false) {
            expect(result.error).toBe("Tiles must be placed in a single row or column")
        }
    })

    test("rejects duplicate coordinates", () => {
        const board = createSquareBoardWithBonus(15)
        board[2][3].letter = "A"
        board[2][4].letter = "B"
        board[2][5].letter = "C"

        const result = getPotentialWords(board, [[2, 3], [2, 3], [2, 4]], false)
        expect(result.success).toBe(false)
        if (result.success === false) {
            expect(result.error).toBe("Tiles must be placed in a single row or column")
        }
    })

    test("accepts unsorted input (normalizes with sort)", () => {
        const board = createSquareBoardWithBonus(15)
        board[2][1].letter = "A"
        board[2][2].letter = "B"
        board[2][3].letter = "C"

        board[2][4].letter = "D"

        const result = getPotentialWords(board, [[2, 3], [2, 1], [2, 2]], false)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.words.length).toBeGreaterThan(0)
        }
    })

    test("rejects disconnected placements", () => {
        const board = createSquareBoardWithBonus(15)
        board[5][5].letter = "A"
        // Place letters away from the existing 'A'
        board[1][1].letter = "B"
        board[1][2].letter = "C"
        const result = getPotentialWords(board, [[1, 1], [1, 2]], false)
        expect(result.success).toBe(false)
        if (result.success === false) {
            expect(result.error).toBe("Tiles must connect to existing words")
        }
    })

})