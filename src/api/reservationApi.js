/**
 * ============================================================================
 *  예약 도메인 API — 백엔드 연결 지점
 * ============================================================================
 *  화면(components / screens)은 절대 fetch 를 직접 부르지 않는다.
 *  이 파일의 두 함수만 쓴다.
 *
 *    1) fetchAvailability({ date })  … 예약 가능 시간 조회
 *    2) createReservation(input)     … 예약 제출
 *
 *  다음 주에 서버가 준비되면 할 일:
 *    - .env 에  VITE_API_BASE_URL=https://... , VITE_USE_MOCK=false  추가
 *    - 아래 엔드포인트 경로(PATHS)를 서버 스펙에 맞추기
 *    - 서버 응답 필드명이 다르면 normalize* 함수만 고치기
 *  → UI 코드는 한 줄도 건드릴 필요 없다.
 * ============================================================================
 */
import { requestJson } from './apiClient';
import { mockCreateReservation, mockFetchAvailability } from './mockReservationApi';

/**
 * @typedef {{ time: string, status: 'open' | 'reserved', remaining: number | null }} Slot
 * @typedef {{ date: string, slots: Slot[] }} Availability
 * @typedef {{ date: string, time: string, people: number, name: string, phone: string }} ReservationInput
 * @typedef {{ id: string|null, code: string|null, createdAt: string|null,
 *             date: string, time: string, people: number, name: string, phone: string }} Reservation
 */

/** mock 사용 여부. .env 에 VITE_USE_MOCK=false 를 넣으면 실제 서버를 부른다. */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const PATHS = {
  availability: '/reservations/availability',
  reservations: '/reservations',
};

/* --------------------------------- 조회 --------------------------------- */

/**
 * 특정 날짜의 예약 가능 시간 목록을 가져온다.
 * @param {{ date: string, signal?: AbortSignal }} params
 * @returns {Promise<Availability>}
 */
export async function fetchAvailability({ date, signal } = {}) {
  if (USE_MOCK) {
    return mockFetchAvailability({ date, signal });
  }

  const raw = await requestJson(`${PATHS.availability}?date=${encodeURIComponent(date)}`, {
    signal,
  });
  return normalizeAvailability(raw, date);
}

/* --------------------------------- 제출 --------------------------------- */

/**
 * 예약을 생성한다.
 * @param {ReservationInput} input
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Reservation>}
 */
export async function createReservation(input, options = {}) {
  const payload = {
    date: input.date,
    time: input.time,
    people: input.people,
    name: input.name.trim(),
    phone: input.phone,
  };

  if (USE_MOCK) {
    return mockCreateReservation(payload, options);
  }

  const raw = await requestJson(PATHS.reservations, {
    method: 'POST',
    body: payload,
    signal: options.signal,
  });
  return normalizeReservation(raw, payload);
}

/* ------------------------------- 응답 정규화 ------------------------------- */
/* 서버 필드명이 우리 UI와 달라도 여기서 흡수한다. */

function normalizeAvailability(raw, fallbackDate) {
  const list = Array.isArray(raw) ? raw : (raw?.slots ?? raw?.data ?? []);
  return {
    date: raw?.date ?? fallbackDate,
    slots: list.map(normalizeSlot).filter((slot) => Boolean(slot.time)),
  };
}

function normalizeSlot(raw) {
  // 서버가 ["12:30", "12:45"] 처럼 문자열 배열만 줄 수도 있다.
  if (typeof raw === 'string') {
    return { time: raw, status: 'open', remaining: null };
  }

  const time = raw.time ?? raw.slot ?? raw.startTime ?? '';
  const isReserved =
    raw.status === 'reserved' || raw.reserved === true || raw.available === false;

  return {
    time: String(time).slice(0, 5), // '12:30:00' → '12:30'
    status: isReserved ? 'reserved' : 'open',
    remaining: raw.remaining ?? raw.remainingSeats ?? null,
  };
}

function normalizeReservation(raw, payload) {
  return {
    id: raw?.id ?? raw?.reservationId ?? null,
    code: raw?.code ?? raw?.reservationCode ?? raw?.id ?? null,
    createdAt: raw?.createdAt ?? null,
    date: raw?.date ?? payload.date,
    time: (raw?.time ?? payload.time).slice(0, 5),
    people: raw?.people ?? payload.people,
    name: raw?.name ?? payload.name,
    phone: raw?.phone ?? payload.phone,
  };
}
