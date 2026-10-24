import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { mergeIntervals, type Interval } from '../src/intervals';

// Recitation Part 2 (groups) and problem set Task 2.
// Read the spec in src/intervals/mergeIntervals.ts, then check your progress
// with `npm run mutants:intervals`.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The output is sorted.
// (invariant, algebraic, metamorphic, differential, or conditional)

// A first attempt at a generator. It has a problem: run the tests and read
// the counterexample.
const interval: fc.Arbitrary<Interval> =
  fc.tuple(fc.integer({ min: -20, max: 20 }),
           fc.integer({ min: 0, max: 20 }))
    .map(([start, length]) => [start, start + length]);

const intervalList = fc.array(interval);

describe('mergeIntervals', () => {
  // Pattern: invariant. Every input interval lies inside some output interval.
  it('every input interval lies inside some output interval', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        const uncovered = xs.filter(([s, e]) => !out.some(([a, b]) => a <= s && e <= b));
        expect(uncovered).toEqual([]);
      }),
    );
  });
  // Pattern: invariant. Output intervals must not overlap or touch.
  it('merges touching intervals', () => {
    fc.assert(
      fc.property(fc.integer({ min: -20, max: 20 }), n => {
        const xs: Interval[] = [[n, n + 2], [n + 2, n + 4]];
        const out = mergeIntervals(xs);

        expect(out).toEqual([[n, n + 4]]);
      }),
    );
  });

  // Pattern: differential. Integer neighbors must not merge.
  it('does not merge intervals with a gap', () => {
    fc.assert(
      fc.property(fc.integer({ min: -20, max: 20 }), n => {
        const xs: Interval[] = [[n, n], [n + 1, n + 1]];
        const out = mergeIntervals(xs);

        expect(out).toEqual(xs);
      }),
    );
  });

  // Pattern: invariant. The input must not be modified.
  it('does not modify the original input', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const original = xs.map(([s, e]): Interval => [s, e]);

        mergeIntervals(xs);

        expect(xs).toEqual(original);
      }),
    );
  });

  // Pattern: metamorphic. Reversing input order does not change the result.
  it('reversing intervals gives the same result', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        expect(mergeIntervals([...xs].reverse()))
          .toEqual(mergeIntervals(xs));
      }),
    );
  });

  // Pattern: algebraic. Merging twice gives the same result.
  it('merging twice gives the same result', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const once = mergeIntervals(xs);
        expect(mergeIntervals(once)).toEqual(once);
      }),
    );
  });

  // Pattern: conditional. Already sorted, disjoint intervals stay unchanged.
  it('preserves already disjoint intervals', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -20, max: 20 }),
        fc.array(fc.integer({ min: 1, max: 5 }), { maxLength: 8 }),
        (start, gaps) => {
          const xs: Interval[] = [];
          let pos = start;

          for (const gap of gaps) {
            xs.push([pos, pos]);
            pos += gap;
          }

          expect(mergeIntervals(xs)).toEqual(xs);
        },
      ),
    );
  });



  // Add your properties here. Aim for at least one of each pattern:
  // invariant, algebraic, metamorphic, differential, conditional.
});
