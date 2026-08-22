/**
 * 얇은 fetch 래퍼. HTTP 세부사항은 전부 여기에만 둔다.
 * (인증 헤더, 공통 에러 포맷 같은 게 생기면 이 파일만 고치면 된다.)
 */

/** 서버 주소. .env 의 VITE_API_BASE_URL 로 바꿀 수 있다. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class ApiError extends Error {
  constructor(message, { status = 0, body = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * @param {string} path  '/reservations' 처럼 API_BASE_URL 뒤에 붙는 경로
 * @param {{ method?: string, body?: unknown, signal?: AbortSignal, headers?: Record<string,string> }} [options]
 * @returns {Promise<any>} 파싱된 JSON (본문이 없으면 null)
 */
export async function requestJson(path, options = {}) {
  const { method = 'GET', body, signal, headers } = options;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? null : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.', { status: 0 });
  }

  const text = await response.text();
  const data = text ? safeParseJson(text) : null;

  if (!response.ok) {
    throw new ApiError(data?.message ?? `요청에 실패했습니다. (${response.status})`, {
      status: response.status,
      body: data,
    });
  }

  return data;
}
