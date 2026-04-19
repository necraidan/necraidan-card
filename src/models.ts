export interface Link {
  label: string;
  url: string;
}

export interface CardData {
  name: string;
  handle: string;
  role: string;
  links: Link[];
}

export const cardData: CardData = {
  name: 'Benjamin Auzanneau',
  handle: '@necraidan',
  role: 'Web Builder · Podcaster · Chronicler',
  links: [
    { label: '  Twitter', url: 'https://twitter.com/necraidan' },
    { label: '  Bluesky', url: 'https://bsky.app/profile/necraidan.bsky.social' },
    { label: '   GitHub', url: 'https://github.com/necraidan' },
    { label: ' LinkedIn', url: 'https://linkedin.com/in/bauzanneau/' },
    { label: '      Web', url: 'https://necraidan.com' },
    { label: '  Podcast', url: 'https://front-end-chronicles.github.io/' },
    { label: '      DEV', url: 'https://dev.to/necraidan' },
    { label: '     Blog', url: 'https://616.earth' },
  ],
};
