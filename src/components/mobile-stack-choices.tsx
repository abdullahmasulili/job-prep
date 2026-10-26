import { Radio } from '@mui/material';
import { mobileStacks } from '@/content/mobile';
import type { MobileStack } from '@/content/types';

export function MobileStackChoices({
  value,
  onChange,
  disabled,
}: {
  value: MobileStack | null;
  onChange: (stack: MobileStack) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="choice-fieldset mobile-stack-choices" disabled={disabled}>
      <legend>Mobile stack</legend>
      {(['Cross-platform', 'Native'] as const).map((group) => (
        <div key={group} className="stack-group">
          <h3>{group === 'Native' ? 'Native Android & iOS' : group}</h3>
          <div className="language-choices">
            {mobileStacks
              .filter((stack) => stack.group === group)
              .map((stack) => (
                <label
                  className={`choice-card language-choice ${value === stack.id ? 'selected' : ''}`}
                  key={stack.id}
                >
                  <Radio
                    className="choice-radio"
                    name="mobile-stack"
                    value={stack.id}
                    checked={value === stack.id}
                    disabled={disabled}
                    onChange={() => onChange(stack.id)}
                  />
                  <span>
                    <strong>{stack.label}</strong>
                    <span className="choice-description">{stack.description}</span>
                  </span>
                </label>
              ))}
          </div>
        </div>
      ))}
    </fieldset>
  );
}
