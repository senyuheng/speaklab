import { describe, it, expect } from 'vitest';
import { similarity } from '../src/lib/similarity';

describe('similarity（bigram Dice 系数）', () => {
  it('完全一致为 100', () => {
    expect(similarity('hello world', 'hello world')).toBe(100);
  });

  it('完全不相关接近 0', () => {
    expect(similarity('aaa', 'bbbb')).toBe(0);
  });

  it('忽略大小写与标点', () => {
    expect(similarity("Hi, I'm Alex.", "hi im alex")).toBeGreaterThanOrEqual(50);
  });

  it('空输入为 0', () => {
    expect(similarity('', 'abc')).toBe(0);
    expect(similarity('abc', '')).toBe(0);
  });

  it('日语支持', () => {
    expect(similarity('こんにちは', 'こんにちは')).toBe(100);
    expect(similarity('私は学生です', 'わたしはがくせいです')).toBeGreaterThan(0);
  });
});
