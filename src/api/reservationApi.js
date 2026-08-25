import { ApiError } from './apiClient';
import { mockCreateReservation, mockFetchAvailability } from './mockReservationApi';
import { hasSupabaseConfig, supabase } from './supabaseClient';

/**
 * @typedef {{ time: string, status: 'open' | 'reserved', remaining: number | null }} Slot
 * @typedef {{ date: string, slots: Slot[] }} Availability
 * @typedef {{ date: string, time: string, people: number, name: string, phone: string }} ReservationInput
 * @typedef {{ id: string|null, code: string|null, createdAt: string|null,
 *             date: string, time: string, people: number, name: string, phone: string }} Reservation
 */

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const RPC_ERROR_CODES = [
  'SLOT_TAKEN',
  'INVALID_PEOPLE',
  'INVALID_TIME',
  'INVALID_NAME',
  'INVALID_PHONE',
];

const ERROR_MESSAGES = {
  SLOT_TAKEN: '방금 다른 분이 예약했습니다. 다른 시간을 선택해주세요.',
  INVALID_PEOPLE: '예약 인원은 2명부터 4명까지 선택해주세요.',
  INVALID_TIME: '예약 시간을 다시 선택해주세요.',
  INVALID_NAME: '학번 2자리와 한글 이름을 입력해주세요.',
  INVALID_PHONE: '전화번호를 확인해주세요.',
};

function getClient() {
  if (!hasSupabaseConfig || !supabase) {
    throw new ApiError('Supabase 연결 정보를 .env에 입력해주세요.', {
      code: 'CONFIGURATION_ERROR',
    });
  }
  return supabase;
}

function toApiError(error) {
  const detail = [error?.message, error?.details, error?.hint].filter(Boolean).join(' ');
  const code = RPC_ERROR_CODES.find((candidate) => detail.includes(candidate));

  if (code) {
    return new ApiError(ERROR_MESSAGES[code], {
      code,
      status: code === 'SLOT_TAKEN' ? 409 : 400,
      body: error,
    });
  }

  return new ApiError('연결을 확인해주세요.', {
    code: 'NETWORK_ERROR',
    body: error,
  });
}

async function runRpc(name, params, signal) {
  let request = getClient().rpc(name, params);
  if (signal) request = request.abortSignal(signal);

  let response;
  try {
    response = await request;
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw toApiError(error);
  }

  if (response.error) throw toApiError(response.error);
  return response.data;
}

/**
 * @param {{ date: string, signal?: AbortSignal }} params
 * @returns {Promise<Availability>}
 */
export async function fetchAvailability({ date, signal } = {}) {
  if (USE_MOCK) return mockFetchAvailability({ date, signal });

  const rows = await runRpc('get_availability', { p_date: date }, signal);
  return normalizeAvailability(rows, date);
}

/**
 * @param {ReservationInput} input
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Reservation>}
 */
export async function createReservation(input, options = {}) {
  const payload = {
    date: input.date,
    time: input.time,
    people: input.people,
    name: input.name.replace(/\s/g, ''),
    phone: input.phone.replace(/\D/g, ''),
  };

  if (USE_MOCK) return mockCreateReservation(payload, options);

  const rows = await runRpc(
    'create_reservation',
    {
      p_date: payload.date,
      p_time: payload.time,
      p_people: payload.people,
      p_name: payload.name,
      p_phone: payload.phone,
    },
    options.signal
  );

  return normalizeReservation(Array.isArray(rows) ? rows[0] : rows, payload);
}

function normalizeAvailability(rows, fallbackDate) {
  const list = Array.isArray(rows) ? rows : [];
  return {
    date: fallbackDate,
    slots: list
      .map((row) => ({
        time: String(row?.slot_time ?? '').slice(0, 5),
        status: row?.status === 'taken' ? 'reserved' : 'open',
        remaining: row?.status === 'taken' ? 0 : null,
      }))
      .filter((slot) => Boolean(slot.time)),
  };
}

function normalizeReservation(raw, payload) {
  return {
    id: raw?.id ?? null,
    code: raw?.code ?? null,
    createdAt: raw?.created_at ?? null,
    date: raw?.event_date ?? payload.date,
    time: String(raw?.slot_time ?? payload.time).slice(0, 5),
    people: raw?.people ?? payload.people,
    name: raw?.name ?? payload.name,
    phone: raw?.phone ?? payload.phone,
  };
}
