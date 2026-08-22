import { useEffect, useMemo, useRef } from 'react';
import { groupSlotsByHour } from '../utils/slots';
import './TimeWheel.css';

const ITEM_HEIGHT = 40;
/** 스크롤이 멈췄다고 판단하는 시간(ms) */
const SETTLE_DELAY = 120;

const clampIndex = (index, length) => Math.max(0, Math.min(length - 1, index));

/**
 * 휠 한 줄(시 또는 분).
 *
 * 굴리는 도중에도 가운데 칸이 바뀌는 즉시 onPick 을 부른다 —
 * 그래서 아래 요약("2명 · 15:45")과 강조 표시가 손가락을 따라 실시간으로 움직인다.
 *
 * @param {{ items: {value: string, label: string, reserved: boolean}[],
 *           activeValue: string, onPick: (value: string) => void, label: string }} props
 */
function WheelColumn({ items, activeValue, onPick, label }) {
  const listRef = useRef(null);
  const settleTimer = useRef(null);
  /** 사용자가 지금 이 휠을 굴리는 중인지 (굴리는 동안은 위치를 건드리면 안 된다) */
  const rolling = useRef(false);

  const index = items.findIndex((item) => item.value === activeValue);

  // 값이 밖에서 바뀌면(다른 휠 조작 등) 해당 항목을 가운데로 굴려준다.
  useEffect(() => {
    const list = listRef.current;
    if (!list || index < 0 || rolling.current) return;

    const target = index * ITEM_HEIGHT;
    if (Math.abs(list.scrollTop - target) > 2) list.scrollTop = target;
  }, [index]);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;

    rolling.current = true;

    const landed = items[clampIndex(Math.round(list.scrollTop / ITEM_HEIGHT), items.length)];
    if (landed && landed.value !== activeValue) onPick(landed.value);

    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      rolling.current = false;
    }, SETTLE_DELAY);
  };

  return (
    <div className="wheel__list" ref={listRef} onScroll={handleScroll} aria-label={label}>
      <div className="wheel__pad" />
      {items.map((item, itemIndex) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={itemIndex === index}
          className={
            'wheel__item' +
            (itemIndex === index ? ' is-active' : '') +
            (item.reserved ? ' is-reserved' : '')
          }
          onClick={() => onPick(item.value)}
        >
          {item.label}
        </button>
      ))}
      <div className="wheel__pad" />
    </div>
  );
}

/**
 * 시간 드럼 선택기.
 * 예약 가능 시간 목록(slots)만 받아서 시/분 휠을 만든다 —
 * 어떤 시간이 열려 있는지는 전부 slots 가 결정한다(= 서버가 결정한다).
 *
 * @param {{ slots: {time: string, status: string}[],
 *           value: string | null,
 *           onChange: (time: string) => void }} props
 */
export default function TimeWheel({ slots, value, onChange }) {
  const rows = useMemo(() => groupSlotsByHour(slots), [slots]);

  const hours = useMemo(
    () =>
      rows.map((row) => ({
        value: row.hour,
        label: row.hour,
        reserved: row.slots.every((slot) => slot.status !== 'open'),
      })),
    [rows]
  );

  // 아직 고른 시간이 없으면 첫 예약 가능 시간을 가리킨다(값을 바꾸지는 않는다)
  const fallback = useMemo(
    () => (slots.find((slot) => slot.status === 'open') ?? slots[0])?.time ?? null,
    [slots]
  );

  const current = value ?? fallback;
  if (!current) return null;

  const [hour, minute] = current.split(':');
  const row = rows.find((item) => item.hour === hour);

  const minutes = (row?.slots ?? []).map((slot) => ({
    value: slot.time.split(':')[1],
    label: slot.time.split(':')[1],
    reserved: slot.status !== 'open',
  }));

  const pickHour = (nextHour) => {
    const nextRow = rows.find((item) => item.hour === nextHour);
    if (!nextRow) return;

    // 같은 '분'이 그 시간대에도 있으면 유지, 없으면 그 시간대의 첫 예약 가능 시간
    const next =
      nextRow.slots.find((slot) => slot.time.endsWith(`:${minute}`)) ??
      nextRow.slots.find((slot) => slot.status === 'open') ??
      nextRow.slots[0];

    if (next) onChange(next.time);
  };

  const pickMinute = (nextMinute) => {
    const next = row?.slots.find((slot) => slot.time === `${hour}:${nextMinute}`);
    if (next) onChange(next.time);
  };

  return (
    <div className="wheel">
      <div className="wheel__band" />
      <WheelColumn items={hours} activeValue={hour} onPick={pickHour} label="시" />
      <span className="wheel__colon">:</span>
      <WheelColumn items={minutes} activeValue={minute} onPick={pickMinute} label="분" />
    </div>
  );
}
