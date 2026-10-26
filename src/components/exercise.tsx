'use client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Checkbox,
  TextField,
} from '@mui/material';
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
  const reviewed =
    progress.response.trim().length > 0 &&
    module.exercise.criteria.every((_, i) => progress.review[i]);
  return (
    <div className="practice-body">
      <h2>{module.exercise.title}</h2>
      <p className="exercise-prompt">{module.exercise.prompt}</p>
      {active && (
        <TextField
          id="exercise-response"
          label="Your response"
          multiline
          minRows={9}
          value={progress.response}
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
            changeModule(module, (p) => ({ ...p, response: value }));
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
        <span>{progress.response.length.toLocaleString()} / 30,000</span>
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
          <p>{module.exercise.reference}</p>
        </AccordionDetails>
      </Accordion>
      <fieldset className="self-review" disabled={locked}>
        <legend>Review your own work</legend>
        <p>This is self-assessment. Your response is not automatically graded or executed.</p>
        {module.exercise.criteria.map((criterion, index) => (
          <label key={criterion} className="review-check">
            <Checkbox
              disabled={locked}
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
        <Alert severity="success" sx={{ mt: 3 }}>
          Response written and self-review complete.
        </Alert>
      )}
    </div>
  );
}
