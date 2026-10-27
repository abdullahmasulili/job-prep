'use client';
import { useRef, useState } from 'react';
import type { PrepModule } from '@/content/types';
import { assessmentModule, getSession, startRetake } from '@/lib/sessions';
import { recordAttempt, scoreQuiz, attemptScore, type ModuleProgress } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { Icon } from './icons';
import { Alert, Radio } from '@mui/material';
import { Action } from './ui';

export function Quiz({ module, progress }: { module: PrepModule; progress: ModuleProgress }) {
  const { changeModule, locked } = useProgress();
  const [error, setError] = useState('');
  const questionRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const session = getSession(module, progress);
  const assessment = assessmentModule(module, progress);
  const latest = progress.attempts.at(-1);
  const latestScore = attemptScore(module, latest);
  const bestScore = attemptScore(module, progress.best);
  const submitted = progress.submitted && latestScore !== null;
  const passed = submitted && latestScore >= 75;
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      scoreQuiz(assessment, progress.answers);
    } catch {
      setError('Answer every question before checking your answers.');
      const index = assessment.questions.findIndex((q) => progress.answers[q.id] === undefined);
      questionRefs.current[index]?.querySelector('input')?.focus();
      return;
    }
    try {
      changeModule(module, (p) => recordAttempt(module, p, p.answers));
      setError('');
      requestAnimationFrame(() => {
        resultHeading.current?.focus();
        resultHeading.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      });
    } catch {
      setError('Your assessment could not be submitted. Your answers are still here. Try again.');
    }
  }
  return (
    <div className="practice-body">
      {submitted ? (
        <section className="quiz-result" aria-label="Assessment result">
          <h2 ref={resultHeading} tabIndex={-1}>
            {passed ? 'Assessment passed' : 'A useful place to practice'}
          </h2>
          <strong>{latestScore}%</strong>
          <p>
            {passed
              ? 'You met the practice threshold. Review the explanations, then apply what you learned in the exercise.'
              : 'Review the explanations below and revisit the preparation steps. You can try again whenever you’re ready.'}
          </p>
          <span className="result-best">Best result: {bestScore ?? latestScore}%</span>
          <Action
            type="button"
            disabled={locked}
            onClick={() => {
              setError('');
              changeModule(module, (p) => startRetake(module, p));
            }}
          >
            Try again
          </Action>
        </section>
      ) : (
        <div className="quiz-intro">
          <div>
            <h2>Check your understanding.</h2>
            <p>
              {assessment.questions.length} questions from a bank of {module.questions.length} · 75%
              to pass · No time limit
            </p>
            <p className="small muted">
              Retakes prioritize unseen questions, then the least recently practiced.
            </p>
          </div>
          <Icon name="book" size={24} />
        </div>
      )}
      <form noValidate onSubmit={submit} aria-label="Multiple-choice assessment">
        {assessment.questions.map((question, index) => (
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
                Question {index + 1} of {assessment.questions.length}
              </span>
              {question.prompt}
            </legend>
            {question.code && (
              <pre className="code-snippet" tabIndex={0} aria-label="Code for this question">
                <code>{question.code}</code>
              </pre>
            )}
            <div className="quiz-choices">
              {session.choiceOrders[question.id].map((choiceIndex, displayIndex) => {
                const choice = question.choices[choiceIndex];
                const selected = progress.answers[question.id] === choiceIndex;
                const correct = question.correct === choiceIndex;
                return (
                  <label
                    key={choiceIndex}
                    className={`quiz-choice ${selected ? 'selected' : ''} ${submitted && correct ? 'correct' : ''} ${submitted && selected && !correct ? 'incorrect' : ''}`}
                  >
                    <Radio
                      disabled={!!submitted || locked}
                      name={question.id}
                      value={choiceIndex}
                      checked={selected}
                      onChange={() => {
                        setError('');
                        changeModule(module, (p) => ({
                          ...p,
                          session,
                          answers: { ...p.answers, [question.id]: choiceIndex },
                        }));
                      }}
                    />
                    <span>
                      <span className="choice-letter" aria-hidden="true">
                        {String.fromCharCode(65 + displayIndex)}.
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
          <Alert severity="error" id="quiz-error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {!submitted && (
          <div className="quiz-actions">
            <span className="small muted">
              Answers save as you go. Explanations appear after checking.
            </span>
            <Action type="submit" variant="contained" disabled={locked}>
              Check answers <Icon name="check" size={17} />
            </Action>
          </div>
        )}
      </form>
      {submitted && (
        <p className="field-note">
          A passing quiz is one part of this module. Complete the preparation checklist and two
          self-reviewed exercises to finish the module.
        </p>
      )}
    </div>
  );
}
