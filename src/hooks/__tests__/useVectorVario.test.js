import { describe, it, expect } from 'vitest';
import { addToBuffer } from '../useVectorVario';

const WINDOW = 60000; // 1 minute window for tests

describe('addToBuffer', () => {
  it('appends to an empty buffer', () => {
    const point = { time: 1000, value: 42 };
    const result = addToBuffer([], point, WINDOW);
    expect(result).toEqual([point]);
  });

  it('keeps points within the window', () => {
    const now = 100000;
    const existing = [
      { time: now - 30000, value: 1 }, // 30s ago, within window
      { time: now - 10000, value: 2 }, // 10s ago, within window
    ];
    const newPoint = { time: now, value: 3 };
    const result = addToBuffer(existing, newPoint, WINDOW);
    expect(result).toEqual([...existing, newPoint]);
  });

  it('prunes points outside the window', () => {
    const now = 200000;
    const old = { time: now - 70000, value: 1 };  // 70s ago, outside 60s window
    const recent = { time: now - 5000, value: 2 }; // 5s ago, within window
    const newPoint = { time: now, value: 3 };

    const result = addToBuffer([old, recent], newPoint, WINDOW);
    expect(result).toEqual([recent, newPoint]);
  });

  it('does not mutate the original array', () => {
    const original = [{ time: 1000, value: 1 }];
    const frozen = [...original];
    addToBuffer(original, { time: 2000, value: 2 }, WINDOW);
    expect(original).toEqual(frozen);
  });
});
