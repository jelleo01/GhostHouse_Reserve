import { useState } from 'react';
import BackButton from '../components/BackButton';
import StepIndicator from '../components/StepIndicator';
import SummaryPanel, { SummaryRow } from '../components/SummaryPanel';
import { useCreateReservation } from '../hooks/useCreateReservation';
import { formatPhone, isNameValid, isPhoneValid } from '../utils/phone';
import './FormScreen.css';

/**
 * 3단계: 대표자 정보 입력 + 예약 제출
 *
 * 실제 전송은 useCreateReservation 훅이 담당한다.
 * 이 컴포넌트는 어떤 API를 부르는지 모른다.
 *
 * @param {{
 *   date: string,
 *   people: number | null,
 *   time: string | null,
 *   name: string,
 *   phone: string,
 *   onChange: (patch: object) => void,
 *   onBack: () => void,
 *   onSubmitted: (reservation: object) => void,
 * }} props
 */
export default function FormScreen({
  date,
  people,
  time,
  name,
  phone,
  onChange,
  onBack,
  onSubmitted,
}) {
  const [confirmed, setConfirmed] = useState(false);
  const { submit, submitting, error } = useCreateReservation();

  const nameValid = isNameValid(name);
  const phoneValid = isPhoneValid(phone);
  const canSubmit = nameValid && phoneValid && confirmed && !submitting;

  const handleSubmit = async () => {
    const reservation = await submit({ date, time, people, name, phone });
    if (reservation) onSubmitted(reservation);
  };

  return (
    <div className="form">
      <div className="step-header">
        <BackButton onClick={onBack} />
        <StepIndicator current={2} />
        <span className="step-header__spacer" />
      </div>

      <h2 className="form__title">대표자</h2>

      <div className="form__field">
        <label className="form__label" htmlFor="reservation-name">
          학번 + 이름
        </label>
        <input
          id="reservation-name"
          className="form__input"
          value={name}
          placeholder="22 원혁재"
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </div>

      <div className="form__field">
        <label className="form__label" htmlFor="reservation-phone">
          전화번호
        </label>
        <input
          id="reservation-phone"
          className="form__input"
          value={phone}
          placeholder="010-0000-0000"
          inputMode="tel"
          onChange={(event) => onChange({ phone: formatPhone(event.target.value) })}
        />
        <p className="form__hint">
          {phone && !phoneValid ? '010-0000-0000 형식으로 입력해주세요' : ''}
        </p>
      </div>

      <div className="form__spacer" />

      <SummaryPanel variant="solid">
        <SummaryRow label="인원" value={`${people ?? ''}명`} />
        <SummaryRow label="시간" value={time ?? ''} />
      </SummaryPanel>

      <button
        type="button"
        className={`confirm-row${confirmed ? ' is-on' : ''}`}
        aria-pressed={confirmed}
        onClick={() => setConfirmed((prev) => !prev)}
      >
        <span className="confirm-box">✓</span>위 예약 내용이 맞습니다
      </button>

      <div className="form__submit-row">
        {error && <p className="status-text status-text--error">{error.message}</p>}
        <button
          type="button"
          className="cta cta--submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {submitting ? '예약 중…' : '예약하기'}
        </button>
      </div>
    </div>
  );
}
