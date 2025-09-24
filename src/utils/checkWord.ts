

export const hashWord = (word: string, seed: number, size: number): number => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
        let wordLowerCase = word.toLowerCase()
        hash = (hash * seed + wordLowerCase.charCodeAt(i)) % size
    }
    console.log(hash,'hash')

    return hash
}

export const isBitSet = (buffer: Uint8Array, bitIndex: number): boolean => {
    const byteIndex = Math.floor(bitIndex / 8)
    const bitPosition = bitIndex % 8
console.log(byteIndex, bitPosition, ' bit')
    return (buffer[byteIndex] & (1 << bitPosition)) !== 0;

}

export const checkWord = (query: string, buffer: Uint8Array, bitArraySize: number, seeds: number[]): boolean => {
console.log(query, buffer, bitArraySize, seeds )
    for (let i = 0; i < seeds.length; i++) {
        const index = hashWord(query, seeds[i], bitArraySize)
        if (!isBitSet(buffer, index)) {
            // Definitely False
            return false
        }
    }
    // Probably True
    return true
}