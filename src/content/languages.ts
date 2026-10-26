import { q, type Language, type Tier, type Question, type Source } from './types';

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

export function languageQuestion(language: Language, tier: Tier): Question {
  const id = `language-${language}-${tier}`;
  if (tier === 'junior') {
    const snippets: Record<Language, string> = {
      javascript:
        'const values = [2, 4, 6];\nconst result = values.filter(n => n > 2).length;\nconsole.log(result);',
      typescript:
        'const values: number[] = [2, 4, 6];\nconst result = values.filter(n => n > 2).length;\nconsole.log(result);',
      python: 'values = [2, 4, 6]\nresult = len([n for n in values if n > 2])\nprint(result)',
      java: 'var values = java.util.List.of(2, 4, 6);\nlong result = values.stream().filter(n -> n > 2).count();\nSystem.out.println(result);',
      csharp:
        'int[] values = [2, 4, 6];\nint result = values.Count(n => n > 2);\nConsole.WriteLine(result); // System.Linq imported',
      go: 'values := []int{2, 4, 6}\nresult := 0\nfor _, n := range values {\n    if n > 2 { result++ }\n}\nfmt.Println(result)',
    };
    return q(
      id,
      'What value does this code print? Assume the shown imports and enclosing function are present.',
      [
        '2',
        'Only 4 and 6 satisfy the strictly-greater-than condition, so the matching count is 2.',
      ],
      [
        ['3', 'There are three input values, but 2 does not satisfy the filter.'],
        ['10', 'Ten is the sum of the matching values, not their count.'],
        ['1', 'Both 4 and 6 pass; the condition is not limited to the final element.'],
      ],
      snippets[language],
    );
  }
  if (tier === 'mid') {
    const snippets: Record<Language, string> = {
      javascript:
        'const original = { profile: { name: "Ada" } };\nconst copy = { ...original };\ncopy.profile.name = "Grace";\nconsole.log(original.profile.name);',
      typescript:
        'const original = { profile: { name: "Ada" } };\nconst copy = { ...original };\ncopy.profile.name = "Grace";\nconsole.log(original.profile.name);',
      python:
        'original = {"profile": {"name": "Ada"}}\ncopy = original.copy()\ncopy["profile"]["name"] = "Grace"\nprint(original["profile"]["name"])',
      java: 'var nested = new java.util.HashMap<String, String>();\nnested.put("name", "Ada");\nvar original = new java.util.HashMap<String, java.util.Map<String, String>>();\noriginal.put("profile", nested);\nvar copy = new java.util.HashMap<>(original);\ncopy.get("profile").put("name", "Grace");\nSystem.out.println(original.get("profile").get("name"));',
      csharp:
        'var original = new Dictionary<string, Dictionary<string, string>> {\n  ["profile"] = new() { ["name"] = "Ada" }\n};\nvar copy = new Dictionary<string, Dictionary<string, string>>(original);\ncopy["profile"]["name"] = "Grace";\nConsole.WriteLine(original["profile"]["name"]);',
      go: 'original := map[string]map[string]string{\n    "profile": {"name": "Ada"},\n}\ncopy := make(map[string]map[string]string)\nfor k, v := range original { copy[k] = v }\ncopy["profile"]["name"] = "Grace"\nfmt.Println(original["profile"]["name"])',
    };
    return q(
      id,
      'What is printed, and what does this reveal about the copy?',
      [
        'Grace; the nested object is shared',
        'The outer container is copied, but the nested mutable object still refers to the same data. Copy each modified nested level for isolation.',
      ],
      [
        [
          'Ada; every nested value is duplicated',
          'These operations do not recursively duplicate nested mutable objects.',
        ],
        [
          'Grace; strings themselves were mutated',
          'The nested entry was reassigned. String mutability is not the source of this aliasing.',
        ],
        ['A missing-key error', 'The profile and name entries exist in both outer containers.'],
      ],
      snippets[language],
    );
  }
  const snippets: Record<Language, string> = {
    javascript:
      'async function spend(accountId, amount) {\n  const balance = await db.readBalance(accountId);\n  if (balance >= amount) {\n    await db.writeBalance(accountId, balance - amount);\n    return true;\n  }\n  return false;\n}',
    typescript:
      'async function spend(accountId: string, amount: number) {\n  const balance = await db.readBalance(accountId);\n  if (balance >= amount) {\n    await db.writeBalance(accountId, balance - amount);\n    return true;\n  }\n  return false;\n}',
    python:
      'async def spend(account_id, amount):\n    balance = await db.read_balance(account_id)\n    if balance >= amount:\n        await db.write_balance(account_id, balance - amount)\n        return True\n    return False',
    java: 'boolean spend(String accountId, int amount) {\n  int balance = db.readBalance(accountId);\n  if (balance >= amount) {\n    db.writeBalance(accountId, balance - amount);\n    return true;\n  }\n  return false;\n}',
    csharp:
      'async Task<bool> Spend(string accountId, int amount) {\n  int balance = await db.ReadBalance(accountId);\n  if (balance >= amount) {\n    await db.WriteBalance(accountId, balance - amount);\n    return true;\n  }\n  return false;\n}',
    go: 'func spend(id string, amount int) bool {\n    balance := db.ReadBalance(id)\n    if balance >= amount {\n        db.WriteBalance(id, balance-amount)\n        return true\n    }\n    return false\n}',
  };
  return q(
    id,
    'Two application instances may spend the same account balance concurrently. Inputs are validated and amounts are positive integers. Which change protects the balance invariant?',
    [
      'Use a database-atomic conditional update and verify one row changed',
      'An atomic update such as balance = balance - amount WHERE balance >= amount makes the check and write indivisible across application instances.',
    ],
    [
      [
        'Add a process-local mutex only',
        'A local lock does not coordinate independent processes or application instances.',
      ],
      [
        'Read the balance twice before writing',
        'Another request can still change the balance between the last read and write.',
      ],
      [
        'Retry every request indefinitely',
        'Retrying an unsafe operation may multiply effects and does not establish atomicity.',
      ],
    ],
    snippets[language],
  );
}
