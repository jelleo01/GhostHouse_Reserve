import { useCallback, useState } from 'react';
import { createReservation } from '../api/reservationApi';

/**
 * 예약 제출 훅.
 *
 * submit() 은 성공하면 생성된 예약 객체를, 실패하면 null 을 돌려준다.
 * (실패 사유는 error 에 담긴다 — 화면에서 try/catch 를 쓸 필요가 없다.)
 *
 * @returns {{ submit: (input: import('../api/reservationApi').ReservationInput) => Promise<import('../api/reservationApi').Reservation|null>,
 *             submitting: boolean, error: Error|null, resetError: () => void }}
 */
export function useCreateReservation() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const resetError = useCallback(() => setError(null), []);

  const submit = useCallback(async (input) => {
    setSubmitting(true);
    setError(null);
    try {
      return await createReservation(input);
    } catch (caught) {
      setError(caught);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, error, resetError };
}
