import SummaryPanel, { SummaryRow } from '../components/SummaryPanel';
import { saveTicketImage } from '../utils/ticket';
import './DoneScreen.css';

/**
 * 4단계: 예약 완료
 *
 * @param {{
 *   name: string,
 *   phone: string,
 *   people: number | null,
 *   time: string | null,
 *   code: string | null,
 *   onRestart: () => void,
 * }} props
 */
export default function DoneScreen({ name, phone, people, time, code, onRestart }) {
  return (
    <div className="done">
      <div className="done__check">✓</div>
      <h2 className="done__title">예약이 완료되었습니다</h2>

      <div className="done__code" aria-label={`예약번호 ${code ?? ''}`}>
        <span className="done__code-label">예약번호</span>
        <strong>{code ?? '확인 중'}</strong>
      </div>

      <SummaryPanel variant="glass" className="done__panel">
        <SummaryRow label="대표자" value={name} tone="plain" />
        <SummaryRow label="연락처" value={phone} tone="plain" />
        <SummaryRow label="인원" value={`${people ?? ''}명`} />
        <SummaryRow label="시간" value={time ?? ''} />
      </SummaryPanel>

      <p className="done__note">이미지로 저장해 입장 시 보여주세요</p>
      <p className="done__privacy">예약 정보는 행사 종료 후 파기됩니다.</p>

      <div className="done__actions">
        <button
          type="button"
          className="done__button done__button--primary"
          onClick={() => saveTicketImage({ name, phone, people, time, code })}
        >
          이미지로 저장
        </button>
        <button type="button" className="done__button done__button--ghost" onClick={onRestart}>
          처음으로
        </button>
      </div>
    </div>
  );
}
