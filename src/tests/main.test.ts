import { drawTiles } from "../utils/drawTiles"
import { exchangeTiles } from "../utils/exchangeTiles"
import { shuffleBag } from "../utils/shuffleBag"
import { getPotentialWords } from "../utils/getPotentialWords"

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

describe.only('getPotentialWords', () => {

    test('Horizontal placed word with no connections returns just that word', () => {
        const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
        const board = Array.from({ length: 15 }, () => Array(15).fill(null))
        board[0][2] = "T"
        board[0][3] = "U"
        board[0][4] = "R"
        board[0][5] = "N"
        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['TURN'])
    })

    test('Horizontal placed word with horizontal connections returns the connected horizontal word', () => {
        const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
        const board = Array.from({ length: 15 }, () => Array(15).fill(null))
        board[0][0] = "R"
        board[0][1] = "E"
        board[0][2] = "T"
        board[0][3] = "U"
        board[0][4] = "R"
        board[0][5] = "N"
        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN'])
    })

    test('Horizontal placed word with vertical and horizontal connections returns the connected horizontal word and vertical words', () => {
        const newWordCoordsArray = [[0, 2], [0, 3], [0, 4], [0, 5]]
        const board = Array.from({ length: 15 }, () => Array(15).fill(null))
        // Horizontal Letter Placements 
        board[0][0] = "R"
        board[0][1] = "E"
        board[0][2] = "T"
        board[0][3] = "U"
        board[0][4] = "R"
        board[0][5] = "N"
        // Vertical Letter Placements 
        board[1][2] = "U"
        board[2][2] = "N"
        board[3][2] = "E"
        board[1][5] = "O"
        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN', 'TUNE', 'NO'])
    })

    test('Horizontal word placement correctly detects cross connections', () => {
        const newWordCoordsArray = [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]]
        const board = Array.from({ length: 15 }, () => Array(15).fill(null))
        // Horizontal Letter Placements 
        board[5][0] = "R"
        board[5][1] = "E"
        board[5][2] = "T"
        board[5][3] = "U"
        board[5][4] = "R"
        board[5][5] = "N"
        // Vertical Letter Placements 
        board[3][4] = "T"
        board[4][4] = "I"
        board[5][4] = "R"
        board[6][4] = "E"

        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN', 'TIRE'])
    })

    test('Vertical word placement correctly detects cross connections', () => {
        const newWordCoordsArray = [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]]
        const board = Array.from({ length: 15 }, () => Array(15).fill(null))
        // Horizontal Letter Placements 
        board[0][5] = "R"
        board[1][5] = "E"
        board[2][5] = "T"
        board[3][5] = "U"
        board[4][5] = "R"
        board[5][5] = "N"
        // Vertical Letter Placements 
        board[4][3] = "T"
        board[4][4] = "I"
        board[4][5] = "R"
        board[4][6] = "E"

        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN', 'TIRE'])
    })

    test('Vertical placed word with Vertical connections returns the connected vertical word', () => {
        const newWordCoordsArray = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]
        const board = Array.from({ length: 15 }, () => Array(15).fill(null))
        board[0][0] = "R"
        board[1][0] = "E"
        board[2][0] = "T"
        board[3][0] = "U"
        board[4][0] = "R"
        board[5][0] = "N"
        const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)
        expect(wordsToValidate).toEqual(['RETURN'])
    })

test('Single letter place returns the connected vertical and horizontal words', () => {
    const newWordCoordsArray = [[2, 2]]
    const board = Array.from({ length: 15 }, () => Array(15).fill(null))

    // Horizontal word already on board
    board[2][0] = "C"
    board[2][1] = "A"
    // Vertical word already on board
    board[0][2] = "S"
    board[1][2] = "A"

    // Place the new letter
    board[2][2] = "T" // completes horizontal "CAT" and vertical "SAT"

    const { wordsToValidate } = getPotentialWords(board, newWordCoordsArray)

    // Expect both horizontal and vertical words created by the single letter
    expect(wordsToValidate).toEqual(['CAT','SAT'])
})

})

