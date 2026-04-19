import stringWidth from 'string-width';

export const stripAnsi = (s: string): string => s.replace(/\x1b\[[0-9;]*m/g, '');

export function visualWidth(s: string): number {
  return stringWidth(stripAnsi(s));
}

export function padLine(styledLine: string, rawContent: string, contentWidth: number): string {
  const w = visualWidth(rawContent);
  return styledLine + ' '.repeat(Math.max(0, contentWidth - w));
}

export function centerRaw(text: string, contentWidth: number): string {
  const pad = Math.floor((contentWidth - text.length) / 2);
  return ' '.repeat(Math.max(0, pad)) + text;
}

export function computeContentWidth(rawLines: string[]): number {
  return Math.max(...rawLines.map((l) => visualWidth(l)));
}
