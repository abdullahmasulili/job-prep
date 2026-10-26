import { q, type Language, type Tier, type Question, type Source } from './types';

export const languages: {
  id: Language;
  label: string;
  short: string;
  description: string;
  source: Source;
}[] = [
  {
    id: 'dart',
    label: 'Dart',
    short: 'Da',
    description: 'Flutter mobile applications',
    source: { label: 'Dart language', url: 'https://dart.dev/language' },
  },
  {
    id: 'kotlin',
    label: 'Kotlin',
    short: 'Kt',
    description: 'Android and Kotlin Multiplatform',
    source: { label: 'Kotlin language', url: 'https://kotlinlang.org/docs/home.html' },
  },
  {
    id: 'swift',
    label: 'Swift',
    short: 'Sw',
    description: 'Native iOS applications',
    source: {
      label: 'The Swift programming language',
      url: 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/',
    },
  },
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
  if (language === 'dart' || language === 'kotlin' || language === 'swift') {
    const code = {
      dart: {
        junior: 'String? name;\nprint(name?.length ?? 0);',
        mid: 'class Profile { String name = "Ada"; }\nvoid main() {\n  final original = Profile();\n  final copy = original;\n  copy.name = "Grace";\n  print(original.name);\n}',
        senior:
          'final requestedId = selectedId;\nfinal result = await loadJob(requestedId);\nstate = result; // selectedId may have changed during await',
      },
      kotlin: {
        junior: 'val name: String? = null\nprintln(name?.length ?: 0)',
        mid: 'class Profile(var name: String)\nval original = Profile("Ada")\nval copy = original\ncopy.name = "Grace"\nprintln(original.name)',
        senior:
          'val requestedId = selectedId\nval result = loadJob(requestedId) // suspending call\nstate.value = result // selectedId may have changed',
      },
      swift: {
        junior: 'let name: String? = nil\nprint(name?.count ?? 0)',
        mid: 'final class Profile { var name = "Ada" }\nlet original = Profile()\nlet copy = original\ncopy.name = "Grace"\nprint(original.name)',
        senior:
          'let requestedID = selectedID\nlet result = try await loadJob(requestedID)\nstate = result // selectedID may have changed during await',
      },
    }[language][tier];
    if (tier === 'junior')
      return q(
        id,
        'What does this nullable-value expression print?',
        [
          '0',
          'The optional value is absent, so the null-coalescing or Elvis operator supplies zero.',
        ],
        [
          ['null', 'The fallback replaces the absent length with zero before printing.'],
          [
            'An exception',
            'Optional access avoids dereferencing an absent value in this expression.',
          ],
          ['1', 'There is no name whose character count could produce one.'],
        ],
        code,
      );
    if (tier === 'mid')
      return q(
        id,
        'What is printed after assigning this class instance to a second variable?',
        [
          'Grace; both variables refer to the same instance',
          'Assignment aliases this mutable class instance. In Swift this example deliberately uses a class, rather than a value-type struct.',
        ],
        [
          [
            'Ada; assignment deep-copies the instance',
            'Assignment does not create an independent copy of this class instance.',
          ],
          [
            'A compile error because the binding is immutable',
            'The binding stays attached to the same instance; its declared mutable property can still change.',
          ],
          ['null', 'The initialized name is replaced by Grace, not removed.'],
        ],
        code,
      );
    return q(
      id,
      'The selected job can change while this request is suspended. What prevents a stale result from replacing the current screen?',
      [
        'Cancel superseded work and verify the request still owns the current state before committing',
        'Suspension allows other work to change selection. Cancellation plus an identity or generation check prevents obsolete state commits.',
      ],
      [
        [
          'Assume await makes the entire function atomic',
          'An asynchronous suspension does not make surrounding reads and writes indivisible.',
        ],
        [
          'Block the UI thread until the request returns',
          'Blocking harms responsiveness and avoids modeling ownership correctly.',
        ],
        [
          'Ignore every request error',
          'Suppressing failures does not prevent out-of-order results from replacing current state.',
        ],
      ],
      code,
    );
  }
  if (tier === 'junior') {
    const snippets = {
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
    const snippets = {
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
  const snippets = {
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
