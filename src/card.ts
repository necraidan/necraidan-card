import chalk from 'chalk';
import { logo } from './ascii/logo.js';
import { nickname } from './ascii/nickname.js';
import { drawBox } from './box.js';
import { cardData } from './models.js';
import { centerRaw, computeContentWidth, padLine, stripAnsi, visualWidth } from './utils.js';

const nec = chalk.hex('#00d4ff');
const dim = chalk.hex('#0099bb');
const accent = chalk.hex('#ff5fa2');

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
const styledRole = padLine(chalk.white(roleCentered), roleCentered, contentWidth);

// Links
const maxLinkWidth = Math.max(...cardData.links.map(({ label, url }) => visualWidth(`${label}:  ${url}`)));
const linkBlockPad = ' '.repeat(Math.floor((contentWidth - maxLinkWidth) / 2));

const styledLinks = cardData.links.map(({ label, url }) => {
  const raw = `${linkBlockPad}${label}:  ${url}`;
  return padLine(`${linkBlockPad}${chalk.white.bold(label + ':')}  ${chalk.cyan(url)}`, raw, contentWidth);
});

// Logo block
const styledLogoLines = logoLines.map((l) => padLine(accent(l), stripAnsi(l), contentWidth));

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
  }) + '\n',
);
