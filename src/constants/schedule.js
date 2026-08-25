/**
 * 운영 정보 상수.
 * 화면(UI)에서 시간표를 직접 만들지 않고, 이 규칙 + API 응답으로만 만든다.
 */

/** 예약 대상 날짜(YYYY-MM-DD) — 세란제 당일 */
export const EVENT_DATE = '2026-09-03';

/** 인원 선택 옵션 */
export const PEOPLE_OPTIONS = [2, 3, 4];

/** 운영 시간: 12:30 ~ 20:30, 15분 간격 */
export const OPERATING_HOURS = {
  startHour: 12,
  startMinute: 30,
  endHour: 20,
  endMinute: 30,
  stepMinutes: 15,
};

/**
 * 운영 시간표 전체를 "HH:MM" 문자열 배열로 만든다.
 * ['12:30', '12:45', ... , '20:30']
 *
 * 백엔드가 붙으면 서버가 내려주는 목록을 쓰게 되고,
 * 이 함수는 mock 데이터 생성용으로만 남는다.
 */
export function buildTimeSlots() {
  const { startHour, startMinute, endHour, endMinute, stepMinutes } = OPERATING_HOURS;
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  const slots = [];
  for (let minutes = start; minutes <= end; minutes += stepMinutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  }
  return slots;
}

/** mock 전용: 이미 예약이 찬 시간대 (백엔드 연결 후에는 서버가 알려준다) */
export const MOCK_RESERVED_TIMES = [
  '12:45',
  '13:30',
  '14:00',
  '15:15',
  '16:45',
  '18:00',
  '19:15',
  '20:30',
];
