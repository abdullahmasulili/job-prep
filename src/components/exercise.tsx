'use client';
import { useEffect, useRef } from 'react';
import type { PrepModule } from '@/content/types';
import type { ModuleProgress } from '@/lib/progress';
import { useProgress } from './progress-provider';
import { Icon } from './icons';

export function Exercise({
  module,
  progress,
  active,
}: {
  module: PrepModule;
  progress: ModuleProgress;
  active: boolean;
}) {
  const { changeModule, locked, saving, issue } = useProgress();
  const response = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const element = response.current;
    if (!element || !active) return;
    let lastWidth = element.clientWidth;
    const resize = () => {
      element.style.height = 'auto';
      element.style.height = `${Math.max(220, element.scrollHeight + 2)}px`;
    };
    resize();
    const observer = new ResizeObserver(() => {
      if (element.clientWidth !== lastWidth) {
        lastWidth = element.clientWidth;
        resize();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [progress.response, active]);
  const reviewed =
    progress.response.trim().length > 0 &&
    module.exercise.criteria.every((_, i) => progress.review[i]);
  return (
    <div className="practice-body">
      <h2>{module.exercise.title}</h2>
      <p className="exercise-prompt">{module.exercise.prompt}</p>
      <label className="response-label" htmlFor="exercise-response">
        Your response
      </label>
      <textarea
        ref={response}
        id="exercise-response"
        className="response-input resize-none"
        placeholder="Work through the problem in your own words. Include your reasoning, tradeoffs, and how you would verify the result."
        value={progress.response}
        maxLength={30000}
        disabled={locked}
        onChange={(e) => {
          const value = e.target.value;
          changeModule(module, (p) => ({ ...p, response: value }));
        }}
      />
      <div className="response-meta">
        <span role="status">
          {issue
            ? 'Saved in this session only; check storage status above.'
            : saving
              ? 'Saving in this browser…'
              : 'Saved in this browser'}
        </span>
        <span>{progress.response.length.toLocaleString()} / 30,000</span>
      </div>
      <details className="reference-answer">
        <summary>Compare with a reference approach</summary>
        <p>{module.exercise.reference}</p>
      </details>
      <fieldset className="self-review" disabled={locked}>
        <legend>Review your own work</legend>
        <p>This is self-assessment. Your response is not automatically graded or executed.</p>
        {module.exercise.criteria.map((criterion, index) => (
          <label key={criterion} className="review-check">
            <input
              type="checkbox"
              checked={progress.review[index] ?? false}
              onChange={(e) => {
                const checked = e.target.checked;
                changeModule(module, (p) => ({
                  ...p,
                  review: module.exercise.criteria.map((_, i) =>
                    i === index ? checked : !!p.review[i],
                  ),
                }));
              }}
            />
            <span>{criterion}</span>
          </label>
        ))}
      </fieldset>
      {reviewed && (
        <p className="exercise-complete">
          <Icon name="check" size={17} />
          Response written and self-review complete.
        </p>
      )}
    </div>
  );
}
