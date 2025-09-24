// Using the Fisher–Yates Shuffle Algorithm
export const shuffleBag = (tileBag: string[]) => {
    if (!tileBag) return []
    for (let i = tileBag.length; i > 0; i--) {
        const indexToSwap = Math.floor(Math.random() * tileBag.length)
        const valueToSwap = tileBag[indexToSwap]
        tileBag[indexToSwap] = tileBag[i]
        tileBag[i] = valueToSwap

    }
    return tileBag
}