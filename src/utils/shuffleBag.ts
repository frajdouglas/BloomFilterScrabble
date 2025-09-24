// Using the Fisher–Yates Shuffle Algorithm
export const shuffleBag = (tileBag: string[]) => {
    if (!tileBag || tileBag.length === 0) return []
    let tileBagCopy = [...tileBag]
    for (let i = tileBagCopy.length - 1; i > 0; i--) {
        const indexToSwap = Math.floor(Math.random() * tileBagCopy.length)
        const valueToSwap = tileBagCopy[indexToSwap]
        tileBagCopy[indexToSwap] = tileBagCopy[i]
        tileBagCopy[i] = valueToSwap

    }
    return tileBagCopy
}