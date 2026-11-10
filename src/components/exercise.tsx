'use client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Checkbox,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { exerciseList, exerciseProgress, updateExercise, moduleStatus } from '@/lib/progress';
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
  const exercises = exerciseList(module);
  const [selectedId, setSelectedId] = useState(exercises[0].id);
  const exercise = exercises.find((e) => e.id === selectedId) ?? exercises[0];
  const draft = exerciseProgress(module, progress, exercise.id);
  const status = moduleStatus(module, progress);
  const reviewed =
    draft.response.trim().length > 0 && exercise.criteria.every((_, i) => draft.review[i]);
  return (
    <div className="practice-body">
      <label htmlFor="exercise-picker">Choose an exercise</label>
      <select
        id="exercise-picker"
        value={exercise.id}
        onChange={(e) => setSelectedId(e.target.value)}
        className="exercise-picker"
      >
        {exercises.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>
      <p className="small muted">
        {status.reviewedExercises} of {exercises.length} exercises reviewed. Complete any{' '}
        {status.requiredExercises} to finish this module. Each draft saves separately.
      </p>
      <h2>{exercise.title}</h2>
      <p className="exercise-prompt">{exercise.prompt}</p>
      {active && (
        <TextField
          key={exercise.id}
          id="exercise-response"
          label="Your response"
          multiline
          minRows={9}
          value={draft.response}
          disabled={locked}
          placeholder="Work through the problem in your own words. Include your reasoning, tradeoffs, and how you would verify the result."
          slotProps={{
            htmlInput: {
              maxLength: 30000,
              className: 'resize-none',
              'aria-describedby': 'response-save-status',
            },
          }}
          onChange={(e) => {
            const value = e.target.value;
            changeModule(module, (p) =>
              updateExercise(module, p, exercise.id, { response: value, review: [] }),
            );
          }}
        />
      )}
      <div className="response-meta">
        <span role="status" id="response-save-status">
          {issue
            ? 'Saved in this session only; check storage status above.'
            : saving
              ? 'Saving in this browser…'
              : 'Saved in this browser'}
        </span>
        <span>{draft.response.length.toLocaleString()} / 30,000</span>
      </div>
      <Accordion className="reference-answer" disableGutters>
        <AccordionSummary
          expandIcon={<Icon name="chevron" size={16} />}
          aria-controls="reference-content"
          id="reference-heading"
        >
          Compare with a reference approach
        </AccordionSummary>
        <AccordionDetails id="reference-content">
          <p>{exercise.reference}</p>
        </AccordionDetails>
      </Accordion>
      <fieldset className="self-review" disabled={locked}>
        <legend>Review your own work</legend>
        <p>This is self-assessment. Your response is not automatically graded or executed.</p>
        {exercise.criteria.map((criterion, index) => (
          <label key={criterion} className="review-check">
            <Checkbox
              disabled={locked}
              checked={draft.review[index] ?? false}
              onChange={(e) => {
                const checked = e.target.checked;
                changeModule(module, (p) => {
                  const current = exerciseProgress(module, p, exercise.id);
                  return updateExercise(module, p, exercise.id, {
                    ...current,
                    review: exercise.criteria.map((_, i) =>
                      i === index ? checked : !!current.review[i],
                    ),
                  });
                });
              }}
            />
            <span>{criterion}</span>
          </label>
        ))}
      </fieldset>
      {reviewed && (
        <Alert severity="success" sx={{ mt: 3 }}>
          Response written and self-review complete.
        </Alert>
      )}
    </div>
  );
}
