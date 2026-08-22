/**
 * 시간 슬롯 배열을 "시(hour)" 단위 줄로 묶는다.
 * 디자인의 시간표는 한 줄에 같은 시간대(12시대, 13시대 …)끼리 놓는 구조다.
 *
 * @param {{ time: string }[]} slots
 * @returns {{ hour: string, slots: object[] }[]}
 */
export function groupSlotsByHour(slots) {
  const rows = [];
  const rowByHour = new Map();

  for (const slot of slots) {
    const hour = slot.time.split(':')[0];
    if (!rowByHour.has(hour)) {
      const row = { hour, slots: [] };
      rowByHour.set(hour, row);
      rows.push(row);
    }
    rowByHour.get(hour).slots.push(slot);
  }

  return rows;
}
