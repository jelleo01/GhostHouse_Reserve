import { Fragment } from 'react';

const STEPS = ['① 인원·시간', '② 정보', '③ 완료'];

/**
 * 상단 진행 표시기.
 * @param {{ current: 1 | 2 | 3 }} props
 */
export default function StepIndicator({ current }) {
  return (
    <div className="step-indicator">
      {STEPS.map((label, index) => (
        <Fragment key={label}>
          {index > 0 && <span className="step-indicator__bar" />}
          <span className={`step-indicator__item${index + 1 === current ? ' is-current' : ''}`}>
            {label}
          </span>
        </Fragment>
      ))}
    </div>
  );
}
