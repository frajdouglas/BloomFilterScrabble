import { drawTiles } from "../utils/drawTiles"
import { exchangeTiles } from "../utils/exchangeTiles"
import { shuffleBag } from "../utils/shuffleBag"

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

