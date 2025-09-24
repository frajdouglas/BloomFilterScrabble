"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const metadata = (0, fs_1.readFileSync)('bloom-metadata.json', 'utf-8');
const metadataJson = JSON.parse(metadata);
console.log(metadataJson, 'Metadata Loaded');
const { bitArraySize, seeds } = metadataJson;
const buffer = (0, fs_1.readFileSync)('bloom.bin');
const hashWord = (word, seed, size) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
        // IMPORTANT REMINDER THAT THIS IS A CASE SENSITIVE FUNCTION
        const lowerCaseWord = word.toLowerCase();
        hash = (hash * seed + lowerCaseWord.charCodeAt(i)) % size;
    }
    return hash;
};
const isBitSet = (buffer, bitIndex) => {
    const byteIndex = Math.floor(bitIndex / 8);
    const bitPosition = bitIndex % 8;
    return (buffer[byteIndex] & (1 << bitPosition)) !== 0;
};
const checkWord = (query, buffer, bitArraySize, seeds) => {
    // create indexes
    for (let i = 0; i < seeds.length; i++) {
        const index = hashWord(query, seeds[i], bitArraySize);
        if (!isBitSet(buffer, index)) {
            // Definitely False
            return false;
        }
    }
    // Probably True
    return true;
};
const word = "redoooubt";
if (checkWord(word, buffer, bitArraySize, seeds)) {
    console.log(`${word} might be in the dictionary`);
}
else {
    console.log(`${word} is definitely not in the dictionary`);
}
