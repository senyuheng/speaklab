import { describe, it, expect } from 'vitest';
import { similarity } from '../src/lib/similarity';

describe('similarity (bigram Dice coefficient)', () => {
  it('identical strings score 100', () => {
    expect(similarity('hello world', 'hello world')).toBe(100);
  });

  it('unrelated strings score near 0', () => {
    expect(similarity('aaa', 'bbbb')).toBe(0);
  });

  it('ignores case and punctuation', () => {
    expect(similarity("Hi, I'm Alex.", "hi im alex")).toBeGreaterThanOrEqual(50);
  });

  it('empty input scores 0', () => {
    expect(similarity('', 'abc')).toBe(0);
    expect(similarity('abc', '')).toBe(0);
  });

  it('supports Japanese', () => {
    expect(similarity('こんにちは', 'こんにちは')).toBe(100);
    expect(similarity('私は学生です', 'わたしはがくせいです')).toBeGreaterThan(0);
  });
});
