/**
 * 예약 확인증을 canvas 로 그려서 PNG 로 내려받는다.
 * (원본 디자인의 saveTicket() 로직을 그대로 옮긴 것)
 *
 * @param {{ name: string, phone: string, people: number|null, time: string|null,
 *           code: string|null }} reservation
 */
export function saveTicketImage({ name, phone, people, time, code }) {
  const WIDTH = 340;
  const HEIGHT = 430;
  const SCALE = 2;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;

  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  // 배경
  ctx.fillStyle = '#0d1122';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 모서리 잘린 테두리
  const pad = 14;
  const cut = 14;
  ctx.beginPath();
  ctx.moveTo(pad + cut, pad);
  ctx.lineTo(WIDTH - pad, pad);
  ctx.lineTo(WIDTH - pad, HEIGHT - pad - cut);
  ctx.lineTo(WIDTH - pad - cut, HEIGHT - pad);
  ctx.lineTo(pad, HEIGHT - pad);
  ctx.lineTo(pad, pad + cut);
  ctx.closePath();
  ctx.strokeStyle = '#f5d84c';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 제목
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f5d84c';
  ctx.font = "34px 'Kirang Haerang','Song Myung',serif";
  ctx.fillText('귀신의 집', WIDTH / 2, 84);

  ctx.fillStyle = '#9aa0b8';
  ctx.font = "12px 'Noto Sans KR',sans-serif";
  ctx.fillText('예 약 확 인 증', WIDTH / 2, 110);

  // 점선
  ctx.strokeStyle = '#3a4260';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(44, 136);
  ctx.lineTo(WIDTH - 44, 136);
  ctx.stroke();
  ctx.setLineDash([]);

  // 항목
  const rows = [
    ['예약번호', code ?? '', '#f5d84c'],
    ['대표자', name, '#e8e8ef'],
    ['연락처', phone, '#e8e8ef'],
    ['인원', `${people ?? ''}명`, '#f5d84c'],
    ['시간', time ?? '', '#f5d84c'],
  ];

  let y = 176;
  for (const [label, value, color] of rows) {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#9aa0b8';
    ctx.font = "13px 'Noto Sans KR',sans-serif";
    ctx.fillText(label, 48, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = color;
    ctx.font = "700 15px 'Noto Sans KR',sans-serif";
    ctx.fillText(value, WIDTH - 48, y);

    y += 44;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#7c84a0';
  ctx.font = "11px 'Noto Sans KR',sans-serif";
  ctx.fillText('입장 시 직원에게 보여주세요', WIDTH / 2, HEIGHT - 44);

  // 다운로드
  const link = document.createElement('a');
  link.download = '귀신의집-예약확인증.png';
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
