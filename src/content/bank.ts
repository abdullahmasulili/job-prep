import type { Exercise, Question } from './types';

export type Item = {
  id: string;
  topic: string;
  prompt: string;
  options: [string, string, string, string];
  answer: number;
  reasons: [string, string, string, string];
  code?: string;
};

export function bank(items: Item[]): Question[] {
  return items.map(({ options, answer, reasons, ...item }) => ({
    ...item,
    choices: options.map((text, i) => ({ text, explanation: reasons[i] })),
    correct: answer,
  }));
}

export type RoleBank = {
  fundamentals: Question[];
  practical: Question[];
  fundamentalsExercises: Exercise[];
  practicalExercises: Exercise[];
};
