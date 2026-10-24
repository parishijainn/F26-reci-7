import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { matchGuess } from '../src/wordle';

// Recitation Part 1: follow along with your TA, filling in the todos below.
// Problem set Task 1: keep adding properties until `npm run mutants:wordle`
// kills every mutant. Read the spec in src/wordle/matchGuess.ts.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The result always has exactly five colors.
// (invariant, algebraic, metamorphic, differential, or conditional)

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Step 1: a generator for five-letter uppercase words.
// const word = ...
const wordfrom = (letters: string) =>
  fc.array(fc.constantFrom(...letters), { minLength: 5, maxLength: 5 }).map(cs => cs.join(''));
const word = wordfrom('ABC');

describe('matchGuess', () => {
  //it.todo('returns exactly five colors');
  it('returns exactly five colors', () =>{
    fc.assert(
      fc.property(word, word, (secret, guess) =>{
        expect(matchGuess(secret, guess)).toHaveLength(5);
      }),
    );
  })
  // it.todo('only uses the colors G, Y, B');
  it('only uses the colors G, Y, B', () =>{
    fc.assert(
      fc.property(word, word, (secret, guess) =>{
        const result = matchGuess(secret, guess);
        for (const c of result){
          expect(['G', 'Y', 'B']).toContain(c);
        }
      }),
    );
  })
  // it.todo('guessing the secret gives all greens');
  it('guessing the secret gives all greens', () => {
    fc.assert(
      fc.property(word, w => {
        expect(matchGuess(w, w)).toEqual(['G','G','G','G','G']);
      }),
    );
  });
  // it.todo('never credits a letter more times than the secret contains it');
   
  // Pattern: invariant. A letter cannot be credited more than it appears in the secret.
  it('never credits a letter more times than the secret contains it', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        const result = matchGuess(secret, guess);

        for (const letter of new Set(guess)) {
          const credited = [...guess].filter(
            (c, i) => c === letter && result[i] !== 'B'
          ).length;

          const available = [...secret].filter(
            c => c === letter
          ).length;

          expect(credited).toBeLessThanOrEqual(available);
        }
      }),
    );
  });

  
  // Pattern: differential. A misplaced letter should be yellow.
  it('marks misplaced letters yellow', () => {
    expect(matchGuess('ABCDE', 'EABCD'))
      .toEqual(['Y', 'Y', 'Y', 'Y', 'Y']);
  });

  // Pattern: invariant. Letters absent from the secret are black.
  it('marks absent letters black', () => {
    expect(matchGuess('ABCDE', 'FGHIJ'))
      .toEqual(['B', 'B', 'B', 'B', 'B']);
  });

  // Pattern: differential. Repeated letters cannot be overcounted.
  it('respects duplicate letter counts', () => {
    expect(matchGuess('AABCD', 'AAAAA'))
      .toEqual(['G', 'G', 'B', 'B', 'B']);
  });

  // Pattern: differential. Greens take priority over yellows.
  it('prioritizes exact matches over misplaced matches', () => {
    expect(matchGuess('AABCD', 'BAAAA'))
      .toEqual(['Y', 'G', 'Y', 'B', 'B']);
  });

  // Pattern: differential. Exact matches consume letters before yellow matches.
  it('reserves letters for green matches first', () => {
    expect(matchGuess('AABCD', 'BAAAA'))
      .toEqual(['Y', 'G', 'Y', 'B', 'B']);

    expect(matchGuess('BAAAA', 'AABCD'))
      .toEqual(['Y', 'G', 'Y', 'B', 'B']);
  });

  
  // Pattern: differential. Guess and secret are not interchangeable.
it('handles different letter counts in secret and guess', () => {
  expect(matchGuess('AABCD', 'ABCDE'))
    .toEqual(['G', 'Y', 'Y', 'Y', 'B']);

  expect(matchGuess('ABCDE', 'AABCD'))
  .toEqual(['G', 'B', 'Y', 'Y', 'Y']);
});




// describe('matchGuess', () => {
//   it.todo('returns exactly five colors');
//   it.todo('only uses the colors G, Y, B');
//   it.todo('guessing the secret gives all greens');
//   it.todo('never credits a letter more times than the secret contains it');
});
