/** 010-0000-0000 형식 */
export const PHONE_PATTERN = /^01\d-\d{3,4}-\d{4}$/;

/** 입력값을 010-1234-5678 형태로 자동 정리 */
export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length > 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length > 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return digits;
}

export const isPhoneValid = (phone) => PHONE_PATTERN.test(phone);

/** 학번 2자리 + 한글 이름 2~6자 (학번과 이름 사이 공백은 허용) */
export const isNameValid = (name) => /^\d{2}\s*[가-힣]{2,6}$/.test(name.trim());
