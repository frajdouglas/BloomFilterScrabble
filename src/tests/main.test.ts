import { drawTiles } from "../utils/drawTiles"
import { exchangeTiles } from "../utils/exchangeTiles"
import { shuffleBag } from "../utils/shuffleBag"
import { getPotentialWords } from "../utils/getPotentialWords"
import { createSquareBoardWithBonus } from "../utils/createSquareBoardWithBonus"

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

    test('Horizontal placed word with no connections returns just that word', () => {
        const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
        const board = createSquareBoardWithBonus(15)
        board[0][2].letter = "T"
        board[0][3].letter = "U"
        board[0][4].letter = "R"
        board[0][5].letter = "N"
        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['TURN'])
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
        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN'])
    })

    test('Horizontal placed word with vertical and horizontal connections returns the connected horizontal word and vertical words', () => {
        const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
        const board = createSquareBoardWithBonus(15)
        // Horizontal Letter Placements 
        board[0][0].letter= "R"
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
        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN', 'TUNE', 'NO'])
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

        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN', 'TIRE'])
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

        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN', 'TIRE'])
    })

    test('Vertical placed word with Vertical connections returns the connected vertical word', () => {
        const newWordCoordsArray = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]
        const board = createSquareBoardWithBonus(15)
        board[0][0].letter = "R"
        board[1][0].letter = "E"
        board[2][0].letter = "T"
        board[3][0].letter = "U"
        board[4][0].letter = "R"
        board[5][0].letter = "N"
        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN'])
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

    const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)

    // Expect both horizontal and vertical words created by the single letter
    expect(wordsToValidate).toEqual(['CAT','SAT'])
})

})

