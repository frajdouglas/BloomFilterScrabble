export const drawTiles = (tileBag: string[], playerTileRack: string[], numberOfTilesToDraw: number): { remainingTilesInBag: string[]; newTileRack: string[] } => {
    if (!tileBag) return { remainingTilesInBag: [], newTileRack: [...playerTileRack] }
    let remainingTilesInBag = [...tileBag]
    let newTileRack = [...playerTileRack]
    let numberOfTilesDrawn = 0
    while (newTileRack.length < 7 && remainingTilesInBag.length > 0 && numberOfTilesDrawn !== numberOfTilesToDraw) {
        const newTileFromBag = remainingTilesInBag.pop()
        if (newTileFromBag !== undefined) {
            newTileRack.push(newTileFromBag)
            numberOfTilesDrawn++
        }
        
    }
    return { remainingTilesInBag, newTileRack }
}