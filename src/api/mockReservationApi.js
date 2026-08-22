/**
 * 백엔드가 없는 동안 쓰는 가짜 구현.
 * 실제 서버가 붙으면 .env 에 VITE_USE_MOCK=false 만 넣으면 되고,
 * 이 파일은 그대로 두거나 지워도 된다.
 */
import { buildTimeSlots, MOCK_RESERVED_TIMES } from '../constants/schedule';
import { ApiError } from './apiClient';

/** 세션 동안만 유지되는 "이미 예약된 시간" 목록 (새로고침하면 초기화) */
const bookedTimes = new Set(MOCK_RESERVED_TIMES);

let sequence = 1;

function createAbortError() {
  const error = new Error('요청이 취소되었습니다.');
  error.name = 'AbortError';
  return error;
}

/** 네트워크 지연 흉내 (AbortSignal 지원) */
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(createAbortError());
      },
      { once: true }
    );
  });
}

export async function mockFetchAvailability({ date, signal } = {}) {
  await delay(350, signal);

  return {
    date,
    slots: buildTimeSlots().map((time) => {
      const reserved = bookedTimes.has(time);
      return {
        time,
        status: reserved ? 'reserved' : 'open',
        remaining: reserved ? 0 : 4,
      };
    }),
  };
}

export async function mockCreateReservation(payload, { signal } = {}) {
  await delay(600, signal);

  if (bookedTimes.has(payload.time)) {
    throw new ApiError('방금 다른 팀이 예약했어요. 다른 시간을 선택해주세요.', { status: 409 });
  }
  bookedTimes.add(payload.time);

  const code = `M${String(sequence++).padStart(4, '0')}`;
  return {
    id: code,
    code,
    createdAt: new Date().toISOString(),
    ...payload,
  };
}
