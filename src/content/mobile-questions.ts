import { q, type MobileStack, type Tier } from './types';

type Answer = [string, string];
type Check = { prompt: string; correct: Answer; others: [Answer, Answer, Answer] };
const checks: Record<MobileStack, Check> = {
  flutter: {
    prompt:
      'A Flutter widget starts a network request inside build. Parent updates trigger repeated requests. What should change?',
    correct: [
      'Move request ownership outside build and render observable state',
      'Flutter can call build repeatedly. Own the request in a lifecycle-aware state holder or initialization path and dispose owned resources.',
    ],
    others: [
      [
        'Make every widget stateful',
        'StatefulWidget alone does not stop side effects inside repeated build calls.',
      ],
      [
        'Treat build as a one-time initialization callback',
        'Build is a rendering method and may run many times during a widget’s lifetime.',
      ],
      [
        'Call setState inside build to mark the request started',
        'Mutating render state during build creates further lifecycle problems rather than establishing safe request ownership.',
      ],
    ],
  },
  'react-native': {
    prompt:
      'A React Native screen refreshes on AppState changes. Revisiting it causes duplicate refreshes. Which ownership fix is appropriate?',
    correct: [
      'Remove the AppState subscription in effect cleanup and control overlapping refreshes',
      'AppState.addEventListener returns a subscription. Remove it when its owner unmounts, and prevent obsolete overlapping results from committing.',
    ],
    others: [
      [
        'Add a new subscription on each render',
        'Repeated subscriptions accumulate listeners and increase duplicate callbacks.',
      ],
      [
        'Assume AppState automatically removes listeners on navigation',
        'Listener cleanup depends on the owning component or service, not a universal navigation guarantee.',
      ],
      [
        'Use browser document.visibilityState on both platforms',
        'React Native uses native app lifecycle APIs; browser document state is not a portable mobile lifecycle contract.',
      ],
    ],
  },
  kmp: {
    prompt:
      'A KMP shared repository needs platform-protected storage on Android and iOS. Where should the platform dependency live?',
    correct: [
      'Use a common interface with injected platform implementations or expect/actual declarations',
      'commonMain stays independent of Android-only and Apple-only APIs. Platform source sets supply the concrete implementation; either native or shared UI can consume the shared logic.',
    ],
    others: [
      [
        'Import an Android Context directly into commonMain',
        'Android-only APIs are not available to every common source-set target.',
      ],
      [
        'Require every screen to use Compose Multiplatform',
        'Sharing Kotlin business logic does not require sharing the user interface.',
      ],
      [
        'Compile only Android because Kotlin guarantees identical iOS integration',
        'Each target has its own compilation and runtime integration boundaries that need verification.',
      ],
    ],
  },
  'android-kotlin': {
    prompt:
      'An Android ViewModel retained a job ID through rotation. The OS later kills the process. What restoration strategy is sound?',
    correct: [
      'Save small restoration keys and reload durable data when a new process starts',
      'A ViewModel survives configuration changes within a process, not process death. Saved state can restore small UI keys; durable repositories own persisted records.',
    ],
    others: [
      [
        'Keep the ID only in the ViewModel field',
        'The entire in-memory ViewModel disappears when the process is killed.',
      ],
      [
        'Store the Activity in a singleton',
        'Retaining an Activity risks leaks and cannot make process memory survive termination.',
      ],
      [
        'Disable rotation to prevent process death',
        'Configuration changes and OS process termination are separate events.',
      ],
    ],
  },
  'android-java': {
    prompt:
      'A Java Fragment observes data and retains its view binding after onDestroyView. What should change?',
    correct: [
      'Observe with the view lifecycle owner and clear view references at onDestroyView',
      'A Fragment can outlive its view. Tie UI observers to the view lifecycle and release the old view so recreation does not leak or update stale UI.',
    ],
    others: [
      [
        'Keep the old binding until the whole process exits',
        'The stale view can remain retained and receive updates after its visible lifetime ends.',
      ],
      [
        'Move the binding to a static field',
        'A static reference extends retention and does not establish lifecycle-safe ownership.',
      ],
      [
        'Assume the Fragment and view always share a lifetime',
        'The Fragment view has a distinct lifecycle and can be destroyed while the Fragment remains.',
      ],
    ],
  },
  ios: {
    prompt:
      'A Swift model stores a closure that strongly captures that same model. What should you inspect?',
    correct: [
      'The reference ownership cycle and whether a weak capture or explicit callback teardown fits',
      'ARC releases objects when strong ownership ends. An owner retaining a closure that strongly retains the owner can form a cycle; choose capture and cleanup based on the required lifetime.',
    ],
    others: [
      [
        'Assume ARC collects every reference cycle automatically',
        'Automatic reference counting does not collect a closed cycle of strong references by itself.',
      ],
      [
        'Change every capture to unowned regardless of lifetime',
        'An unowned reference requires the referenced object to remain alive; using it without that guarantee can crash.',
      ],
      [
        'Move all model work to the main actor to release the cycle',
        'Actor isolation controls concurrent access, not the ownership graph that retains objects.',
      ],
    ],
  },
};

export function platformQuestion(stack: MobileStack, tier: Tier) {
  const check = checks[stack];
  return q(`mobile-${stack}-${tier}-boundary`, check.prompt, check.correct, check.others);
}
