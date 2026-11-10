import type { Language, Source } from './types';

export const languages: {
  id: Language;
  label: string;
  short: string;
  description: string;
  source: Source;
}[] = [
  {
    id: 'typescript',
    label: 'TypeScript',
    short: 'TS',
    description: 'Typed web applications',
    source: {
      label: 'TypeScript handbook',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    },
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    short: 'JS',
    description: 'Browser and server development',
    source: {
      label: 'MDN JavaScript guide',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    },
  },
  {
    id: 'python',
    label: 'Python',
    short: 'Py',
    description: 'APIs, services, and automation',
    source: { label: 'Python tutorial', url: 'https://docs.python.org/3/tutorial/' },
  },
  {
    id: 'java',
    label: 'Java',
    short: 'Jv',
    description: 'Enterprise services and APIs',
    source: { label: 'Java learning portal', url: 'https://dev.java/learn/' },
  },
  {
    id: 'csharp',
    label: 'C#',
    short: 'C#',
    description: '.NET services and applications',
    source: {
      label: 'C# language documentation',
      url: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
    },
  },
  {
    id: 'go',
    label: 'Go',
    short: 'Go',
    description: 'Concurrent services and infrastructure',
    source: { label: 'Go language specification', url: 'https://go.dev/ref/spec' },
  },
];
