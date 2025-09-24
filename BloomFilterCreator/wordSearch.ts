import { readFileSync } from "fs";

const metadata = readFileSync('bloom-metadata.json', 'utf-8');
const metadataJson = JSON.parse(metadata)

console.log(metadataJson, 'Metadata Loaded')

const { bitArraySize, seeds } = metadataJson

const buffer = readFileSync('bloom.bin')

const hashWord = (word: string, seed: number, size: number): number => {
    let hash = 0
    for (let i = 0; i < word.length; i++) {
        // IMPORTANT REMINDER THAT THIS IS A CASE SENSITIVE FUNCTION
        const lowerCaseWord = word.toLowerCase()
        hash = (hash * seed + lowerCaseWord.charCodeAt(i)) % size
    }
    return hash
}

const isBitSet = (buffer: Buffer, bitIndex: number): boolean => {
    const byteIndex = Math.floor(bitIndex / 8)
    const bitPosition = bitIndex % 8

    return (buffer[byteIndex] & (1 << bitPosition)) !== 0;

}

const checkWord = (query: string, buffer: Buffer, bitArraySize: number, seeds: number[]): boolean => {

    // create indexes
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

const word = "redoooubt";
if (checkWord(word, buffer, bitArraySize, seeds)) {
    console.log(`${word} might be in the dictionary`);
} else {
    console.log(`${word} is definitely not in the dictionary`);
}