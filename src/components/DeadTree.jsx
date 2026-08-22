/**
 * 홈 화면 좌우에 서 있는 앙상한 고목.
 * 오른쪽 나무는 부모 요소에서 transform: scaleX(-1) 로 뒤집어 쓴다.
 */
export default function DeadTree({ width, height, trunkWidth = 22 }) {
  return (
    <svg viewBox="0 0 170 700" width={width} height={height} aria-hidden="true">
      <g stroke="#04060c" fill="none" strokeLinecap="round">
        <path d="M46 700 C52 600 34 520 50 430 C60 372 42 320 32 262" strokeWidth={trunkWidth} />
        <path d="M44 500 C82 476 104 438 112 392" strokeWidth="12" />
        <path d="M112 392 C124 372 146 362 158 366" strokeWidth="7" />
        <path d="M112 408 C126 416 136 430 138 446" strokeWidth="6" />
        <path d="M43 420 C14 392 8 352 16 312" strokeWidth="11" />
        <path d="M16 312 C8 292 10 270 20 256" strokeWidth="6" />
        <path d="M38 344 C64 322 78 292 80 258" strokeWidth="9" />
        <path d="M80 258 C90 238 108 230 118 236" strokeWidth="5.5" />
        <path d="M80 276 C92 288 96 302 96 316" strokeWidth="4.5" />
        <path d="M32 262 C28 238 34 212 46 196" strokeWidth="8" />
        <path d="M46 196 C56 180 56 160 48 146" strokeWidth="5" />
        <path d="M46 214 C66 200 76 178 76 158" strokeWidth="5" />
        <path d="M76 158 C84 142 98 138 108 142" strokeWidth="3.5" />
        <path d="M40 232 C22 216 14 196 16 176" strokeWidth="4.5" />
        <path d="M48 146 C58 134 58 118 52 106" strokeWidth="3.5" />
      </g>
    </svg>
  );
}
