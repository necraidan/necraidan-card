import chalk from 'chalk';
import { describe, expect, it } from 'vitest';
import { buildBottomBorder, drawBox, type BorderChars } from './box.js';

const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '');

const boldChars: BorderChars = {
  topLeft: '┏', topRight: '┓', bottomLeft: '┗', bottomRight: '┛', horizontal: '━', vertical: '┃',
};

describe('buildBottomBorder', () => {
  it('builds a plain bottom border without cornerLabel', () => {
    const result = stripAnsi(buildBottomBorder(boldChars, chalk.reset, 5));
    expect(result).toBe('┗━━━━━┛');
  });

  it('embeds the cornerLabel at the right', () => {
    const result = stripAnsi(buildBottomBorder(boldChars, chalk.reset, 10, 'v1.0.0'));
    expect(result).toContain('v1.0.0');
    expect(result).toMatch(/^┗━+\s+v1\.0\.0\s+┛$/);
  });

  it('handles a cornerLabel that fills the entire width', () => {
    const result = stripAnsi(buildBottomBorder(boldChars, chalk.reset, 6, 'v1.0'));
    expect(result).toContain('v1.0');
    expect(result).toContain('┗');
    expect(result).toContain('┛');
  });
});
describe('drawBox', () => {
  it('wraps lines with bold borders by default', () => {
    const result = stripAnsi(drawBox(['hello'], { contentWidth: 5 }));
    expect(result).toContain('┏━━━━━━━┓');
    expect(result).toContain('┗━━━━━━━┛');
    expect(result).toContain('┃ hello ┃');
  });

  it('uses single border style', () => {
    const result = stripAnsi(drawBox(['hi'], { contentWidth: 2, borderStyle: 'single' }));
    expect(result).toContain('┌────┐');
    expect(result).toContain('└────┘');
    expect(result).toContain('│ hi │');
  });

  it('uses double border style', () => {
    const result = stripAnsi(drawBox(['hi'], { contentWidth: 2, borderStyle: 'double' }));
    expect(result).toContain('╔════╗');
    expect(result).toContain('╚════╝');
    expect(result).toContain('║ hi ║');
  });

  it('uses round border style', () => {
    const result = stripAnsi(drawBox(['hi'], { contentWidth: 2, borderStyle: 'round' }));
    expect(result).toContain('╭────╮');
    expect(result).toContain('╰────╯');
    expect(result).toContain('│ hi │');
  });

  it('applies padding', () => {
    const result = stripAnsi(drawBox(['hi'], { contentWidth: 2, padding: 2 }));
    expect(result).toContain('┃  hi  ┃');
    expect(result).toContain('┏━━━━━━┓');
  });

  it('applies margin', () => {
    const result = stripAnsi(drawBox(['hi'], { contentWidth: 2, margin: 3 }));
    const lines = result.split('\n').filter((l) => l.trim().startsWith('┏'));
    expect(lines[0]).toMatch(/^ {3}┏/);
  });

  it('renders multiple lines', () => {
    const result = stripAnsi(drawBox(['line1', 'line2'], { contentWidth: 5 }));
    expect(result).toContain('┃ line1 ┃');
    expect(result).toContain('┃ line2 ┃');
  });

  it('embeds a cornerLabel in the bottom border', () => {
    const result = stripAnsi(drawBox(['hello'], { contentWidth: 5, cornerLabel: 'v1.0.0' }));
    expect(result).toContain('v1.0.0');
    const bottomLine = result.split('\n').find((l) => l.includes('┗'));
    expect(bottomLine).toBeDefined();
    expect(bottomLine).toContain('v1.0.0');
  });
});
