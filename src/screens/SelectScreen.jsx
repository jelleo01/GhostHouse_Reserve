import { useEffect, useMemo } from 'react';
import BackButton from '../components/BackButton';
import StepIndicator from '../components/StepIndicator';
import TimeWheel from '../components/TimeWheel';
import { PEOPLE_OPTIONS } from '../constants/schedule';
import { useAvailability } from '../hooks/useAvailability';
import './SelectScreen.css';

/**
 * 2단계: 인원 · 시간 선택
 *
 * 예약 가능 시간은 useAvailability 훅으로만 받는다.
 * 이 컴포넌트는 fetch / mock / 서버 스펙을 전혀 모른다.
 *
 * @param {{
 *   date: string,
 *   people: number | null,
 *   time: string | null,
 *   onSelectPeople: (people: number) => void,
 *   onSelectTime: (time: string) => void,
 *   onBack: () => void,
 *   onNext: () => void,
 * }} props
 */
export default function SelectScreen({
  date,
  people,
  time,
  onSelectPeople,
  onSelectTime,
  onBack,
  onNext,
}) {
  const { slots, loading, error, reload } = useAvailability(date);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.time === time) ?? null,
    [slots, time]
  );

  // 시간표를 받아오면 휠이 가리키는 시간을 실제 값으로 확정해준다.
  // 고른 시간이 시간표에 없으면(날짜 변경 등) 다시 잡는다.
  useEffect(() => {
    if (loading || slots.length === 0 || selectedSlot) return;
    const firstOpen = slots.find((slot) => slot.status === 'open') ?? slots[0];
    onSelectTime(firstOpen.time);
  }, [loading, slots, selectedSlot, onSelectTime]);

  const timeReserved = selectedSlot !== null && selectedSlot.status !== 'open';
  const canGoNext = people !== null && selectedSlot !== null && !timeReserved;

  const summary =
    people === null
      ? '인원을 선택해주세요'
      : selectedSlot === null
        ? '시간을 선택해주세요'
        : `${people}명 · ${time}`;

  return (
    <div className="select">
      <div className="step-header">
        <BackButton onClick={onBack} />
        <StepIndicator current={1} />
        <span className="step-header__spacer" />
      </div>

      {/* -------------------------------- 인원수 -------------------------------- */}
      <div className="select__people">
        <h2 className="select__section-title">인원수</h2>
        <div className="select__people-row">
          {PEOPLE_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              className={`pick-btn pick-btn--people${people === count ? ' is-selected' : ''}`}
              aria-pressed={people === count}
              onClick={() => onSelectPeople(count)}
            >
              {count}명
            </button>
          ))}
        </div>
      </div>

      <div className="select__spacer" />

      {/* --------------------------------- 시간 --------------------------------- */}
      <div className="select__time">
        <h2 className="select__section-title">시간</h2>

        {loading && (
          <div className="select__time-state">
            <p className="status-text">예약 가능한 시간을 불러오는 중…</p>
          </div>
        )}

        {!loading && error && (
          <div className="select__time-state">
            <p className="status-text status-text--error">{error.message}</p>
            <button type="button" className="retry-button" onClick={reload}>
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && <TimeWheel slots={slots} value={time} onChange={onSelectTime} />}

        <p className="select__legend">
          {timeReserved ? (
            <span className="select__legend-warn">
              이 시간은 이미 예약됐어요. 다른 시간을 골라주세요
            </span>
          ) : (
            <>
              <span className="select__legend-chip">13:30</span>= 이미 예약된 시간
            </>
          )}
        </p>
      </div>

      <div className="select__spacer" />

      <div className="select__footer">
        <p className="select__summary">{summary}</p>
        <button type="button" className="cta cta--next" disabled={!canGoNext} onClick={onNext}>
          다음 ›
        </button>
      </div>
    </div>
  );
}
