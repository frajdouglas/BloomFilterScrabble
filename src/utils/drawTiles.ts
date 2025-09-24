

export const drawTiles = (tileBag: string[], playerTileRack: string[]): { remainingTilesInBag: string[]; newTileRack: string[] } => {
    if (!tileBag) return { remainingTilesInBag: [], newTileRack: [...playerTileRack] }
    let remainingTilesInBag = [...tileBag]
    let newTileRack = [...playerTileRack]
    while (newTileRack.length < 7 && remainingTilesInBag.length > 0) {
        const newTileFromBag = remainingTilesInBag.pop()
        if (newTileFromBag !== undefined) {
            newTileRack.push(newTileFromBag)
        }
    }
    return { remainingTilesInBag, newTileRack }
}