import { describe, expect, it } from 'vitest';
import { centerRaw, computeContentWidth, padLine, stripAnsi, visualWidth } from './utils.js';

describe('stripAnsi', () => {
  it('removes ANSI escape codes', () => {
    expect(stripAnsi('\x1b[32mhello\x1b[0m')).toBe('hello');
  });

  it('leaves plain strings untouched', () => {
    expect(stripAnsi('hello')).toBe('hello');
  });
});

describe('visualWidth', () => {
  it('returns the visible length of a plain string', () => {
    expect(visualWidth('hello')).toBe(5);
  });

  it('ignores ANSI codes when measuring width', () => {
    expect(visualWidth('\x1b[32mhello\x1b[0m')).toBe(5);
  });

  it('measures block characters as width 1', () => {
    expect(visualWidth('░▒▓█')).toBe(4);
  });
});

describe('padLine', () => {
  it('pads a line to the target content width', () => {
    const result = padLine('hi', 'hi', 10);
    expect(result).toBe('hi' + ' '.repeat(8));
  });

  it('does not truncate if line is already at content width', () => {
    const result = padLine('hello', 'hello', 5);
    expect(result).toBe('hello');
  });

  it('does not add negative padding', () => {
    const result = padLine('toolong', 'toolong', 3);
    expect(result).toBe('toolong');
  });
});

describe('centerRaw', () => {
  it('centers a short string in the content width', () => {
    const result = centerRaw('hi', 10);
    expect(result).toBe('    hi');
  });

  it('does not add negative padding for strings longer than contentWidth', () => {
    const result = centerRaw('hello world', 5);
    expect(result).toBe('hello world');
  });
});

describe('computeContentWidth', () => {
  it('returns the width of the widest line', () => {
    expect(computeContentWidth(['hello', 'world!!', 'hi'])).toBe(7);
  });

  it('ignores ANSI codes when computing width', () => {
    expect(computeContentWidth(['\x1b[32mhello\x1b[0m', 'world!!'])).toBe(7);
  });
});
