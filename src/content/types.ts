export type Role = 'frontend' | 'backend' | 'fullstack' | 'mobile';
export type Tier = 'junior' | 'mid' | 'senior';
export type Language =
  'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'go' | 'dart' | 'kotlin' | 'swift';
export type MobileStack =
  'flutter' | 'react-native' | 'kmp' | 'android-kotlin' | 'android-java' | 'ios';
export type ProfileConfig = {
  role: Role;
  tier: Tier;
  language: Language;
  mobileStack?: MobileStack;
};
export type Choice = { text: string; explanation: string };
export type Question = {
  id: string;
  prompt: string;
  code?: string;
  choices: Choice[];
  correct: number;
};
export type Step = { title: string; body: string };
export type Source = { label: string; url: string };
export type PrepModule = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  minutes: number;
  optional?: boolean;
  version: number;
  steps: Step[];
  questions: Question[];
  exercise: { title: string; prompt: string; reference: string; criteria: string[] };
  sources: Source[];
};
export type Blueprint = Omit<PrepModule, 'id' | 'subtitle' | 'minutes' | 'version' | 'optional'>;
export type TechnicalTrack = {
  learn: Step[];
  build: Step[];
  task: string;
  reference: string;
  questions: Question[];
};

type Answer = [text: string, explanation: string];
export function q(
  id: string,
  prompt: string,
  answer: Answer,
  others: [Answer, Answer, Answer],
  code?: string,
): Question {
  const offset = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
  const choices = [answer, ...others].map(([text, explanation]) => ({ text, explanation }));
  return {
    id,
    prompt,
    code,
    choices: [...choices.slice(offset), ...choices.slice(0, offset)],
    correct: (4 - offset) % 4,
  };
}
export const sources = {
  mdn: { label: 'MDN curriculum', url: 'https://developer.mozilla.org/en-US/curriculum/' },
  sfia: {
    label: 'SFIA development competencies',
    url: 'https://sfia-online.org/en/sfia-9/skills/programming-software-development',
  },
  security: { label: 'OWASP Top 10:2025', url: 'https://top10.owasp.org/2025/' },
  ai: {
    label: 'Reviewing AI code responsibly',
    url: 'https://docs.github.com/en/copilot/responsible-use/inline-suggestions',
  },
  http: { label: 'HTTP semantics (RFC 9110)', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
  sql: {
    label: 'PostgreSQL transaction isolation',
    url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
  },
  a11y: { label: 'W3C accessibility tutorials', url: 'https://www.w3.org/WAI/tutorials/' },
};
