import {
  q,
  type Language,
  type MobileStack,
  type Source,
  type TechnicalTrack,
  type Tier,
  type Blueprint,
} from './types';
import { platformQuestion } from './mobile-questions';
import { languages } from './languages';

type Stack = {
  id: MobileStack;
  label: string;
  group: 'Cross-platform' | 'Native';
  description: string;
  languages: Language[];
  source: Source;
  concepts: string;
  lifecycle: string;
  boundary: string;
  testing: string;
};

export const mobileStacks: Stack[] = [
  {
    id: 'flutter',
    label: 'Flutter',
    group: 'Cross-platform',
    description: 'Dart · Android and iOS',
    languages: ['dart'],
    source: { label: 'Flutter app architecture', url: 'https://docs.flutter.dev/app-architecture' },
    concepts:
      'Dart null safety, immutable widget configuration, State ownership, layout constraints, and Future/Stream error handling',
    lifecycle:
      'Keep build free of side effects. Release owned controllers and subscriptions in dispose, and prevent an obsolete asynchronous result from updating a removed widget.',
    boundary:
      'Wrap platform plugins or platform channels behind a repository interface; handle permission denial and unavailable platform implementations explicitly.',
    testing:
      'Use unit tests for Dart logic, widget tests for loading/error/retry states and semantics, and integration tests on Android and iOS for plugin behavior.',
  },
  {
    id: 'react-native',
    label: 'React Native',
    group: 'Cross-platform',
    description: 'TypeScript or JavaScript · Android and iOS',
    languages: ['typescript', 'javascript'],
    source: {
      label: 'React Native documentation',
      url: 'https://reactnative.dev/docs/getting-started',
    },
    concepts:
      'React state and effects, native View/Text controls, list virtualization, JavaScript work, and native UI responsiveness',
    lifecycle:
      'Remove AppState subscriptions when their owner unmounts. Revalidate stale data on foreground entry, and cancel or ignore obsolete requests rather than committing results to the wrong screen.',
    boundary:
      'Keep native modules behind an explicit typed interface. Verify Android and iOS implementations, permission flows, and compatibility with the app’s React Native architecture.',
    testing:
      'Test state transitions and rendered behavior, then exercise native modules, navigation, accessibility, and release-build performance on both platforms.',
  },
  {
    id: 'kmp',
    label: 'Kotlin Multiplatform (KMP)',
    group: 'Cross-platform',
    description: 'Kotlin · Shared logic with native or shared UI',
    languages: ['kotlin'],
    source: {
      label: 'Kotlin Multiplatform documentation',
      url: 'https://kotlinlang.org/docs/multiplatform/get-started.html',
    },
    concepts:
      'commonMain and platform source sets, Kotlin null safety, structured concurrency, Flow, and Android/iOS interoperability',
    lifecycle:
      'Give shared asynchronous work an explicit owner. Propagate cancellation across the UI boundary and stop collecting state when the platform screen no longer owns it.',
    boundary:
      'Keep business logic in commonMain. Inject platform implementations through interfaces or expect/actual declarations in Android and iOS source sets; shared logic does not require shared UI.',
    testing:
      'Test shared logic in commonTest and platform adapters in target tests. Compile and exercise Android and iOS integrations, including cancellation and Swift-facing error contracts.',
  },
  {
    id: 'android-kotlin',
    label: 'Android (Kotlin)',
    group: 'Native',
    description: 'Kotlin · Jetpack Compose and Android SDK',
    languages: ['kotlin'],
    source: {
      label: 'Android architecture guide',
      url: 'https://developer.android.com/topic/architecture',
    },
    concepts:
      'Kotlin null safety, Compose state and recomposition, ViewModel state holders, coroutines, Flow, and Android component lifecycles',
    lifecycle:
      'Collect UI state with lifecycle awareness. A ViewModel can survive configuration changes but does not itself persist through process death; save small restoration keys and reload durable data.',
    boundary:
      'Keep Activity and UI references out of long-lived repositories. Use Android permission and background-work APIs within their lifecycle and scheduling constraints.',
    testing:
      'Use unit tests for ViewModel/repository logic and instrumented Compose or UI tests for rotation, state restoration, permissions, and accessibility.',
  },
  {
    id: 'android-java',
    label: 'Android (Java)',
    group: 'Native',
    description: 'Java · Views, activities, and Android SDK',
    languages: ['java'],
    source: {
      label: 'Android activities and lifecycle',
      url: 'https://developer.android.com/guide/components/activities/activity-lifecycle',
    },
    concepts:
      'Java references and null handling, Activity/Fragment and view lifecycles, ViewModel/LiveData, RecyclerView, and executor-based background work',
    lifecycle:
      'A Fragment can outlive its view. Release view references at onDestroyView and observe with the view lifecycle owner. Restore state after recreation rather than relying on Activity fields.',
    boundary:
      'Run blocking work on an executor, return UI updates to the main thread, and cancel or ignore callbacks whose view owner has gone away. Do not retain an Activity in a singleton.',
    testing:
      'Test Java domain logic and state holders independently. Use instrumented tests for view recreation, RecyclerView behavior, permission denial, and main-thread responsiveness.',
  },
  {
    id: 'ios',
    label: 'iOS (Swift)',
    group: 'Native',
    description: 'Swift · SwiftUI, UIKit, and Apple SDKs',
    languages: ['swift'],
    source: {
      label: 'SwiftUI model data',
      url: 'https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app',
    },
    concepts:
      'Swift optionals, value and reference semantics, SwiftUI state and identity, UIKit lifecycle, ARC, and async/await actor isolation',
    lifecycle:
      'Give state a stable owner across view updates. Respect task cancellation when a screen disappears, isolate UI state to the main actor, and inspect closure ownership for reference cycles.',
    boundary:
      'Wrap URLSession, Keychain, notifications, and other Apple APIs behind focused interfaces. Handle denied permission and app scene changes without assuming continuous background execution.',
    testing:
      'Use Swift Testing or XCTest for model logic and XCUITest for navigation, Dynamic Type, VoiceOver labels, permission handling, and restoration on supported iOS devices.',
  },
];

export function mobileStackFor(id: MobileStack) {
  const stack = mobileStacks.find((s) => s.id === id);
  if (!stack) throw new Error('Choose a supported mobile stack.');
  return stack;
}

export function mobileTrack(id: MobileStack, tier: Tier): TechnicalTrack {
  const stack = mobileStackFor(id);
  const prefix = `mobile-${id}-${tier}`;
  const scenario = {
    junior:
      'Build a searchable saved-jobs screen with loading, empty, error, and retry states. Preserve the selected job when navigating back, and explain what happens if the user leaves while a request is pending.',
    mid: 'Design an offline-capable job application draft flow. Persist edits locally, synchronize safely after reconnecting, resolve conflicting edits explicitly, and handle expired authentication and interrupted uploads.',
    senior:
      'Design a mobile job-application platform used by intermittently connected clients across multiple app versions. Define synchronization and API compatibility contracts, protect sensitive data, and plan a staged release with crash, startup, memory, and interaction-latency measurements.',
  }[tier];
  const reference = `${stack.label}: ${stack.lifecycle} ${stack.boundary} ${tier === 'junior' ? 'Represent loading, content, empty, and error states explicitly. Keep request ownership separate from the rendered list, preserve stable item identifiers, and test a late response after navigation.' : tier === 'mid' ? 'Persist draft changes before acknowledging them locally. Use stable operation IDs for retries, distinguish pending and confirmed changes, and reconcile conflicts using a documented policy. Secure tokens in platform storage and require server-side authorization.' : 'Treat installed clients as independently deployed consumers. Define additive API changes, schema migrations, bounded retry queues, conflict semantics, and rollout stop conditions. Measure real-device release builds against a baseline and test old clients during server changes.'} ${stack.testing}`;
  return {
    learn: [
      {
        title: `Know the ${stack.label} model`,
        body: `Explain ${stack.concepts}. Relate each concept to ${tier === 'junior' ? 'one screen and its data flow' : tier === 'mid' ? 'a feature with multiple screens and a repository' : 'module ownership, interoperability, and a migration strategy'}.`,
      },
      { title: 'Own state and asynchronous work', body: stack.lifecycle },
      {
        title:
          tier === 'senior'
            ? 'Define sharing and platform boundaries'
            : 'Use platform capabilities deliberately',
        body: stack.boundary,
      },
      {
        title: 'Make the experience accessible',
        body: 'Provide meaningful screen-reader labels, scalable text, adequate touch targets, and a focus order that follows the task. Check safe areas, the keyboard, rotation, and denied permissions on actual target platforms.',
      },
    ],
    build: [
      {
        title:
          tier === 'junior'
            ? 'Model screen states before wiring requests'
            : tier === 'mid'
              ? 'Define offline and synchronization contracts'
              : 'Design for independent client releases',
        body: scenario,
      },
      {
        title: 'Handle interruption and protect data',
        body: 'Mobile processes can be suspended or killed. Persist necessary user work, avoid secrets in logs or plain preferences, and define retry behavior after reconnecting. A hidden button never replaces server authorization.',
      },
      { title: 'Verify platform behavior', body: stack.testing },
      {
        title: 'Measure before optimizing',
        body: `Profile ${tier === 'junior' ? 'scrolling and main-thread work on the jobs screen' : tier === 'mid' ? 'cold start, list rendering, memory, and network requests on a representative device' : 'release-build startup, crashes, memory growth, and user-visible latency by platform and app version'}. Use evidence to choose an improvement and remeasure under the same workload.`,
      },
    ],
    task: `${stack.label}: ${scenario}`,
    reference,
    questions: [
      q(
        `${prefix}-ownership`,
        `In ${stack.label}, what should happen when a screen no longer owns its asynchronous work?`,
        [
          'Cancel or detach owned work and prevent obsolete results from changing screen state',
          stack.lifecycle,
        ],
        [
          [
            'Keep every subscription alive indefinitely',
            'Unbounded subscriptions can leak owners, duplicate events, and deliver obsolete state.',
          ],
          [
            'Assume navigation cancels all networking automatically',
            'Cancellation depends on the actual owner and API contract; navigation alone is not a universal guarantee.',
          ],
          [
            'Catch every failure and render success',
            'Suppressing failure misrepresents state and leaves no useful recovery path.',
          ],
        ],
      ),
      platformQuestion(stack.id, tier),
      q(
        `${prefix}-state`,
        tier === 'junior'
          ? `A ${stack.label} jobs request returns no results. What should the screen show?`
          : tier === 'mid'
            ? `A ${stack.label} draft exists locally while synchronization is pending. What should users see?`
            : `An older ${stack.label} client is still installed during an API rollout. What protects users?`,
        tier === 'junior'
          ? [
              'An empty state distinct from loading and error, with a useful next action',
              'A completed request with zero matches is valid data and should not leave the loading indicator running.',
            ]
          : tier === 'mid'
            ? [
                'The saved local draft with an explicit pending-sync status and recovery actions',
                'Local persistence and server confirmation are separate facts; make queued work and conflicts visible.',
              ]
            : [
                'A compatible API contract and tested migrations across supported client versions',
                'Installed clients upgrade independently, so server and storage changes need compatibility and recovery plans.',
              ],
        [
          [
            'Show success regardless of the actual state',
            'A success message must correspond to confirmed behavior rather than hide missing work.',
          ],
          [
            'Keep loading forever',
            'An indefinite spinner obscures the outcome and offers no way to recover.',
          ],
          [
            'Delete the local data immediately',
            'Deleting user work is not a substitute for modeling empty, pending, or incompatible states.',
          ],
        ],
      ),
      q(
        `${prefix}-retry`,
        tier === 'junior'
          ? 'A job request fails on a weak connection. What is a useful recovery?'
          : tier === 'mid'
            ? 'The server saved an application but the response timed out. How should a retry avoid duplication?'
            : 'Several app versions can retry queued application submissions. What contract is needed?',
        tier === 'junior'
          ? [
              'Show a recoverable error and allow a deliberate retry',
              'Keep existing useful data, explain the failure, and let the user retry without creating duplicate side effects.',
            ]
          : [
              'Use a stable operation ID and server-side deduplication with a retrievable result',
              'A timeout does not prove failure; the same logical operation must retain its identity across retries and app restarts.',
            ],
        [
          [
            'Generate a new operation ID for every retry',
            'New identities make a repeated logical action look like a separate submission.',
          ],
          [
            'Assume every timeout means nothing was saved',
            'The response can be lost after the server has already committed the operation.',
          ],
          [
            'Retry in a tight loop forever',
            'Unbounded retries consume battery and bandwidth and can amplify a server incident.',
          ],
        ],
      ),
      q(
        `${prefix}-security`,
        'Where should a mobile app keep authentication secrets, and who authorizes access?',
        [
          'Use platform-protected credential storage and server-side authorization for every protected operation',
          'Protected storage reduces exposure at rest; only the server can enforce ownership of remote records.',
        ],
        [
          [
            'Store tokens in logs to simplify debugging',
            'Logs are frequently exported and must not become a credential store.',
          ],
          [
            'Hide another user’s data only in the UI',
            'A modified client can bypass UI restrictions; the server must verify authorization.',
          ],
          [
            'Embed a reusable service secret in the app binary',
            'Distributed binaries can be inspected; an embedded shared secret cannot remain confidential.',
          ],
        ],
      ),
      q(
        `${prefix}-testing`,
        `Which verification strategy fits ${stack.label}?`,
        [
          'Test logic and screen states, then verify platform integrations on supported targets',
          stack.testing,
        ],
        [
          [
            'Test only a successful network response',
            'Offline, cancellation, permissions, and restoration failures remain untested.',
          ],
          [
            'Treat a cross-platform unit test as proof of all native behavior',
            'Platform integrations have runtime behavior that a shared logic test does not execute.',
          ],
          [
            'Use only debug-build performance impressions',
            'Debug tooling changes runtime behavior; measure representative release builds and workloads.',
          ],
        ],
      ),
      q(
        `${prefix}-delivery`,
        tier === 'senior'
          ? 'A release increases startup latency and crashes for one device group. What should you do?'
          : 'A long jobs list stutters during scrolling. What should you investigate first?',
        tier === 'senior'
          ? [
              'Pause the rollout, compare affected cohorts, and use a tested mitigation or rollback plan',
              'Release gates and segmented telemetry let you limit user impact and investigate the actual regression.',
            ]
          : [
              'Profile rendering and main-thread work on a representative device before changing the list',
              'A measured bottleneck helps distinguish excessive rendering, image work, layout, and blocking computation.',
            ],
        [
          [
            'Rewrite the entire application immediately',
            'A large rewrite adds risk before the actual bottleneck or failure has been identified.',
          ],
          [
            'Assume the shared framework guarantees fast native behavior',
            'Framework choice does not establish acceptable startup, memory use, or interaction latency.',
          ],
          [
            'Measure only network speed on a development machine',
            'Network timing alone does not explain device-specific rendering or startup problems.',
          ],
        ],
      ),
    ],
  };
}

export function fullstackMobile(stackId: MobileStack, tier: Tier): Blueprint {
  const stack = mobileStackFor(stackId);
  const track = mobileTrack(stackId, tier);
  return {
    title: `Mobile development · ${stack.label}`,
    description:
      'Extend your web and server preparation to a mobile client, including lifecycle, offline work, and API integration.',
    steps: [track.learn[0], track.learn[1], track.learn[2], ...track.build.slice(0, 3)],
    questions: [track.questions[1], ...track.questions.slice(3, 6)],
    exercise: {
      title: 'Connect a mobile client to your backend',
      prompt: `${track.task} Connect the mobile client to your chosen backend language through an explicit API. Explain authentication, retry semantics, and compatibility with the web client. Mobile code uses ${languages.find((l) => l.id === stack.languages[0])!.label}; the selected backend language stays separate.`,
      reference: track.reference,
      criteria: [
        'I defined the mobile/API contract and state ownership.',
        'I handled interruption, offline work, and authorization.',
        'I described platform tests and compatibility checks with the web client.',
      ],
    },
    sources: [
      stack.source,
      { label: 'HTTP semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
    ],
  };
}
