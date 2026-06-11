import chalk from 'chalk';
import { logo } from './ascii/logo.js';
import { nickname } from './ascii/nickname.js';
import { drawBox } from './box.js';
import { cardData } from './models.js';
import { centerRaw, computeContentWidth, padLine, stripAnsi, visualWidth } from './utils.js';
import pkg from '../package.json' with { type: 'json' };

const { version } = pkg;

const nec = chalk.hex('#00e5ff');
const dim = chalk.hex('#0093a3');
const accent = chalk.hex('#ff00c8');
const gold = chalk.hex('#ffe600');
const white = chalk.hex('#fdfdfd');

// Chromatic-aberration glitch: map block density to the logo's CMY-split palette.
// Faint edge cells become the magenta/cyan fringe, solid cores stay white,
// with a yellow scanline jitter to keep the glitch alive.
const glitchLine = (line: string, row: number): string => {
  let out = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === ' ') {
      out += ' ';
      continue;
    }
    let color = white;
    if (ch === '░') color = accent;
    else if (ch === '▒') color = nec;
    else if (ch === '▓') color = (i + row) % 2 === 0 ? nec : accent;
    else if ((i * 3 + row * 7) % 23 === 0) color = gold;
    out += color(ch);
  }
  return out;
};

const nicknameLines = nickname.split('\n');
const logoLines = logo.split('\n');

const hrRaw = '────────────────────────────────────────────────────';

const allRawLines = [
  ...nicknameLines,
  hrRaw,
  cardData.name,
  cardData.handle,
  cardData.role,
  ...cardData.links.map(({ label, url }) => `${label}:  ${url}`),
  ...logoLines,
];

const contentWidth = computeContentWidth(allRawLines) + 1;

// Nickname block
const styledNicknameLines = nicknameLines.map((l) => {
  const raw = ' ' + stripAnsi(l);
  return padLine(chalk.white(' ' + l), raw, contentWidth);
});

// HR
const hrCentered = centerRaw(hrRaw, contentWidth);
const styledHr = padLine(dim(hrCentered), hrCentered, contentWidth);

// Identity
const nameCentered = centerRaw(cardData.name, contentWidth);
const handleCentered = centerRaw(cardData.handle, contentWidth);
const roleCentered = centerRaw(cardData.role, contentWidth);

const styledName = padLine(nec(nameCentered), nameCentered, contentWidth);
const styledHandle = padLine(dim(handleCentered), handleCentered, contentWidth);
const styledRole = padLine(gold(roleCentered), roleCentered, contentWidth);

// Links — right-align labels so the colon column lines up regardless of label length
const maxLabelWidth = Math.max(...cardData.links.map(({ label }) => visualWidth(label)));
const padLabel = (label: string) => ' '.repeat(maxLabelWidth - visualWidth(label)) + label;
const maxLinkWidth = Math.max(...cardData.links.map(({ label, url }) => visualWidth(`${padLabel(label)}:  ${url}`)));
const linkBlockPad = ' '.repeat(Math.floor((contentWidth - maxLinkWidth) / 2));

const styledLinks = cardData.links.map(({ label, url }) => {
  const padded = padLabel(label);
  const raw = `${linkBlockPad}${padded}:  ${url}`;
  return padLine(`${linkBlockPad}${chalk.white.bold(padded + ':')}  ${nec(url)}`, raw, contentWidth);
});

// Logo block
const styledLogoLines = logoLines.map((l, i) => padLine(glitchLine(l, i), stripAnsi(l), contentWidth));

// Empty line
const emptyLine = ' '.repeat(contentWidth);

const contentLines: string[] = [
  emptyLine,
  ...styledNicknameLines,
  emptyLine,
  styledHr,
  styledName,
  styledHandle,
  styledRole,
  styledHr,
  emptyLine,
  ...styledLinks,
  emptyLine,
  ...styledLogoLines,
  emptyLine,
  emptyLine,
];

process.stdout.write(
  drawBox(contentLines, {
    borderStyle: 'bold',
    borderColor: nec,
    padding: 1,
    margin: 3,
    contentWidth,
    cornerLabel: `v${version}`,
  }) + '\n',
);
