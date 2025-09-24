"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
// ----- CONFIG -----
const WORD_FILE = "Dictionary.txt";
const OUTPUT_FILE = "bloom.bin";
const bitArraySize = 6697464;
const numberOfHashFunctions = 17; // number of hash functions
const seeds = Array.from({ length: numberOfHashFunctions }, (_, i) => 31 + i * 2); // simple polynomial seeds
// Using this as the optimal k value calculator: https://hur.st/bloomfilter
// number of words = 279496
// probablity of false positive = 0.000010019 (1 in 99808)
// buffer size = 6697464 (817.56KiB)
// number of hash functions = 17
// ----- FUNCTIONS -----
const hashWord = (word, seed, size) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
        // IMPORTANT REMINDER THAT THIS IS A CASE SENSITIVE FUNCTION
        const lowerCaseWord = word.toLowerCase();
        hash = (hash * seed + lowerCaseWord.charCodeAt(i)) % size;
    }
    return hash;
};
// Load words file and clean
const words = (0, fs_1.readFileSync)(WORD_FILE, "utf-8").split("\n").map((word) => {
    return word.trim();
}).filter(Boolean);
console.log(`Loaded ${words.length} words`);
// Create bit array
const bitArray = new Uint8Array(bitArraySize);
// Flip index in bit array for each word hash
for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < numberOfHashFunctions; j++) {
        const index = hashWord(words[i], seeds[j], bitArraySize);
        bitArray[index] = 1;
    }
}
// ----- PACK INTO BYTES -----
const byteLength = Math.ceil(bitArraySize / 8);
const buffer = Buffer.alloc(byteLength);
for (let i = 0; i < bitArraySize; i++) {
    if (bitArray[i] === 1) {
        buffer[Math.floor(i / 8)] |= 1 << (i % 8);
    }
}
// Write binary file
(0, fs_1.writeFileSync)(OUTPUT_FILE, buffer);
console.log(`Bloom filter exported as ${OUTPUT_FILE} (${buffer.length} bytes)`);
// Write Metadata file 
const metadata = {
    bitArraySize,
    numberOfHashFunctions,
    seeds
};
(0, fs_1.writeFileSync)("bloom-metadata.json", JSON.stringify(metadata, null, 2));
console.log(`Metadata exported as bloom-metadata.json`);
