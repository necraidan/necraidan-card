import { describe, expect, it } from 'vitest';
import { drawBox } from './box.js';

const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '');

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
});
