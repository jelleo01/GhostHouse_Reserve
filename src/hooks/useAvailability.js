import { useCallback, useEffect, useState } from 'react';
import { fetchAvailability } from '../api/reservationApi';

/**
 * 예약 가능 시간 조회 훅.
 * 화면은 slots / loading / error / reload 만 알면 되고,
 * 어디서 어떻게 데이터를 가져오는지는 전혀 모른다.
 *
 * @param {string} date 'YYYY-MM-DD'
 * @returns {{ slots: object[], loading: boolean, error: Error|null, reload: () => void }}
 */
export function useAvailability(date) {
  const [reloadToken, setReloadToken] = useState(0);

  /** 지금 필요한 요청을 나타내는 키. 응답이 이 키와 같아지면 로딩이 끝난 것이다. */
  const requestKey = `${date}#${reloadToken}`;

  const [result, setResult] = useState({ key: null, slots: [], error: null });

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetchAvailability({ date, signal: controller.signal })
      .then((availability) => {
        if (!active) return;
        setResult({ key: requestKey, slots: availability.slots, error: null });
      })
      .catch((caught) => {
        if (!active || caught.name === 'AbortError') return;
        setResult({ key: requestKey, slots: [], error: caught });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [date, requestKey]);

  return {
    slots: result.slots,
    loading: result.key !== requestKey,
    error: result.error,
    reload,
  };
}
