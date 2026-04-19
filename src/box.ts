import chalk, { type ChalkInstance } from 'chalk';

export type BorderStyle = 'bold' | 'single' | 'double' | 'round';

interface BorderChars {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
}

const BORDER_CHARS: Record<BorderStyle, BorderChars> = {
  bold: { topLeft: '┏', topRight: '┓', bottomLeft: '┗', bottomRight: '┛', horizontal: '━', vertical: '┃' },
  single: { topLeft: '┌', topRight: '┐', bottomLeft: '└', bottomRight: '┘', horizontal: '─', vertical: '│' },
  double: { topLeft: '╔', topRight: '╗', bottomLeft: '╚', bottomRight: '╝', horizontal: '═', vertical: '║' },
  round: { topLeft: '╭', topRight: '╮', bottomLeft: '╰', bottomRight: '╯', horizontal: '─', vertical: '│' },
};

export interface BoxOptions {
  borderStyle?: BorderStyle;
  borderColor?: ChalkInstance;
  padding?: number;
  margin?: number;
  contentWidth: number;
}

export function drawBox(lines: string[], options: BoxOptions): string {
  const { borderStyle = 'bold', borderColor = chalk.white, padding = 1, margin = 0, contentWidth } = options;

  const chars = BORDER_CHARS[borderStyle];
  const pad = ' '.repeat(padding);
  const marginStr = ' '.repeat(margin);
  const innerWidth = contentWidth + padding * 2;

  const topBorder = borderColor(chars.topLeft + chars.horizontal.repeat(innerWidth) + chars.topRight);
  const bottomBorder = borderColor(chars.bottomLeft + chars.horizontal.repeat(innerWidth) + chars.bottomRight);
  const sideRow = (content: string) =>
    borderColor(chars.vertical) + pad + content + pad + borderColor(chars.vertical);

  const rows = [
    '',
    marginStr + topBorder,
    ...lines.map((l) => marginStr + sideRow(l)),
    marginStr + bottomBorder,
    '',
  ];

  return rows.join('\n');
}
