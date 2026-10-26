'use client';
import { useRef, useState } from 'react';
import type { PrepModule } from '@/content/types';
import { recordAttempt, scoreQuiz, type ModuleProgress } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { Icon } from './icons';

export function Quiz({ module, progress }: { module: PrepModule; progress: ModuleProgress }) {
  const { changeModule, locked } = useProgress();
  const [error, setError] = useState('');
  const questionRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const latest = progress.attempts.at(-1);
  const submitted = progress.submitted && latest?.version === module.version;
  const passed = submitted && latest.score >= 75;
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      scoreQuiz(module, progress.answers);
      changeModule(module, (p) => recordAttempt(module, p, p.answers));
      setError('');
      requestAnimationFrame(() => {
        resultHeading.current?.focus();
        resultHeading.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      });
    } catch {
      setError('Answer every question before checking your answers.');
      const index = module.questions.findIndex((q) => progress.answers[q.id] === undefined);
      questionRefs.current[index]?.querySelector('input')?.focus();
    }
  }
  return (
    <div className="practice-body">
      {submitted ? (
        <section className="quiz-result" aria-label="Assessment result">
          <h2 ref={resultHeading} tabIndex={-1}>
            {passed ? 'Assessment passed' : 'A useful place to practice'}
          </h2>
          <strong>{latest.score}%</strong>
          <p>
            {passed
              ? 'You met the practice threshold. Review the explanations, then apply what you learned in the exercise.'
              : 'Review the explanations below and revisit the preparation steps. You can try again whenever you’re ready.'}
          </p>
          <span className="result-best">
            Best result:{' '}
            {progress.best?.version === module.version ? progress.best.score : latest.score}%
          </span>
          <button
            type="button"
            className="button secondary"
            disabled={locked}
            onClick={() => {
              setError('');
              changeModule(module, (p) => ({ ...p, submitted: false, answers: {} }));
            }}
          >
            Try again
          </button>
        </section>
      ) : (
        <div className="quiz-intro">
          <div>
            <h2>Check your understanding.</h2>
            <p>4 questions · 75% to pass · No time limit</p>
          </div>
          <Icon name="book" size={24} />
        </div>
      )}
      <form noValidate onSubmit={submit} aria-label="Multiple-choice assessment">
        {module.questions.map((question, index) => (
          <fieldset
            data-question-id={question.id}
            className="quiz-question"
            key={question.id}
            ref={(el) => {
              questionRefs.current[index] = el;
            }}
            disabled={!!submitted || locked}
            aria-describedby={
              error && progress.answers[question.id] === undefined ? 'quiz-error' : undefined
            }
          >
            <legend>
              <span className="question-index">
                Question {index + 1} of {module.questions.length}
              </span>
              {question.prompt}
            </legend>
            {question.code && (
              <pre className="code-snippet" tabIndex={0} aria-label="Code for this question">
                <code>{question.code}</code>
              </pre>
            )}
            <div className="quiz-choices">
              {question.choices.map((choice, choiceIndex) => {
                const selected = progress.answers[question.id] === choiceIndex;
                const correct = question.correct === choiceIndex;
                return (
                  <label
                    key={choiceIndex}
                    className={`quiz-choice ${selected ? 'selected' : ''} ${submitted && correct ? 'correct' : ''} ${submitted && selected && !correct ? 'incorrect' : ''}`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={choiceIndex}
                      checked={selected}
                      onChange={() => {
                        setError('');
                        changeModule(module, (p) => ({
                          ...p,
                          answers: { ...p.answers, [question.id]: choiceIndex },
                        }));
                      }}
                    />
                    <span>
                      <span className="choice-letter" aria-hidden="true">
                        {String.fromCharCode(65 + choiceIndex)}.
                      </span>
                      {choice.text}
                      {submitted && (
                        <>
                          <span className="choice-explanation">{choice.explanation}</span>
                          {correct ? (
                            <span className="choice-result">Correct answer</span>
                          ) : selected ? (
                            <span className="choice-result">Your answer · Review this concept</span>
                          ) : null}
                        </>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
        {error && (
          <p className="form-error" id="quiz-error" role="alert">
            {error}
          </p>
        )}
        {!submitted && (
          <div className="quiz-actions">
            <span className="small muted">
              Answers save as you go. Explanations appear after checking.
            </span>
            <button type="submit" className="button primary" disabled={locked}>
              Check answers <Icon name="check" size={17} />
            </button>
          </div>
        )}
      </form>
      {submitted && (
        <p className="field-note">
          A passing quiz is one part of this module. Complete the preparation checklist and
          self-reviewed exercise to finish the module.
        </p>
      )}
    </div>
  );
}
