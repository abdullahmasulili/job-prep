# Question bank expansion

The user approved implementing the preceding review: remove answer cues, provide
120–160 core questions per path, varied retakes, and more practical exercises.
This document records implementation choices within that authorization.

Use the existing local-only application and authored content. Each profile gets
120 core questions: aptitude 24, fundamentals 36 (including 12 language items),
practical 36, interview 24. AI remains optional. Shared foundations are permitted;
each tier also includes distinct tasks reflecting its responsibility.

Questions have stable IDs, topics, four plausible choices, and explanations.
Avoid padding, synonym duplicates, trivia, and obvious length/wording cues.
Review choice-length heuristics across every bank. Include code reading, concrete
failure diagnosis, numerical reasoning, and constrained tradeoffs.

Choose authored banks and topic-balanced 12-question sessions over simply making
every quiz longer or generating live questions. Authored banks are reviewable and
work offline; short sessions keep the existing experience usable. Retakes prefer
unseen and least recently seen items, shuffle order and choices, and persist the
session so reload never changes a draft. Store canonical choice indices. Preserve
the best passing score and the latest 20 attempt snapshots. Old content scores
remain historical and cannot satisfy the new version.

Each module offers at least three distinct exercises; technical modules offer
four and interviews six. Keep the original exercise and draft, add independently
saved responses/reviews by exercise ID, and require two reviewed exercises for
module completion. Explain this requirement in the UI. Self-review remains
explicit; no runtime execution or AI grading is introduced.

Preserve existing profile isolation, storage locking, recovery, accessibility,
and optional AI semantics. Validate new stored fields while accepting old saves.
Verify bank counts, duplicates, cue susceptibility, session diversity, reload,
correct scoring after shuffling, bounded history, and independent exercise drafts.
