
import { drawTiles } from "./drawTiles";
import { shuffleBag } from "./shuffleBag";

export const exchangeTiles = (tileBag: string[], playerTileRack: string[], tilesToExchange: string[]): { remainingTilesInBag: string[]; newTileRack: string[] } => {
    if (!tileBag) return { remainingTilesInBag: [], newTileRack: [...playerTileRack] }
    if (tileBag.length < 7) return { remainingTilesInBag: [...tileBag], newTileRack: [...playerTileRack] }
   
    let tileBagCopy = [...tileBag]
    let tileRackCopy = [...playerTileRack]


    // remove tiles to exchange from tile rack
    tilesToExchange.forEach((letter) => {
        let indexToRemove = tileRackCopy.indexOf(letter)
        if (indexToRemove !== -1) {
            tileRackCopy.splice(indexToRemove, 1)
        }
        return tileRackCopy
    })

    // draw from tile bag
    const { remainingTilesInBag, newTileRack } = drawTiles(tileBagCopy, tileRackCopy, tilesToExchange.length)

    // add tiles to exchange to tile bag
    const newTileBag = [...remainingTilesInBag, ...tilesToExchange]

    // shuffle bag
    const shuffledBagWithExchangedTiles = shuffleBag(newTileBag)

    return { remainingTilesInBag: shuffledBagWithExchangedTiles, newTileRack }
}