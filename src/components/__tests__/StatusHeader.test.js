import { describe, it, expect } from 'vitest';
import { formatTimeRemaining } from '../StatusHeader';

describe('formatTimeRemaining', () => {
  it('returns null for null input', () => {
    expect(formatTimeRemaining(null)).toBeNull();
  });

  it('returns null for zero', () => {
    expect(formatTimeRemaining(0)).toBeNull();
  });

  it('returns null for negative values', () => {
    expect(formatTimeRemaining(-5000)).toBeNull();
  });

  it('formats hours and minutes', () => {
    const ms = 2.5 * 60 * 60 * 1000; // 2h 30m
    expect(formatTimeRemaining(ms)).toBe('~2h 30m');
  });

  it('formats minutes only when under 1 hour', () => {
    const ms = 45 * 60 * 1000; // 45m
    expect(formatTimeRemaining(ms)).toBe('~45m');
  });

  it('formats exact hour', () => {
    const ms = 1 * 60 * 60 * 1000; // 1h 0m
    expect(formatTimeRemaining(ms)).toBe('~1h 0m');
  });
});
