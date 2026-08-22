/**
 * 홈 화면 배경 — 별 · 달 · 흘러가는 구름 · 바닥 보랏빛 안개.
 * (움직임은 전부 CSS 애니메이션이라 상태가 필요 없다.)
 */
export default function NightSky() {
  return (
    <>
      {/* 별 */}
      <div className="home__star home__star--1" />
      <div className="home__star home__star--2" />
      <div className="home__star home__star--3" />
      <div className="home__star home__star--4" />
      <div className="home__star home__star--5" />

      {/* 보름달 */}
      <div className="home__moon" />

      {/* 구름 (아래 → 위 순서) */}
      <div className="home__cloud home__cloud--low">
        <svg viewBox="0 0 260 52" width="260" height="52" aria-hidden="true">
          <path
            d="M8 38 Q26 14 58 22 Q82 2 116 18 Q152 6 180 26 Q216 22 244 40 Q222 54 194 44 Q164 58 134 46 Q102 58 74 46 Q40 54 8 38 Z"
            fill="#2f3660"
            opacity="0.42"
          />
        </svg>
      </div>
      <div className="home__cloud home__cloud--high">
        <svg viewBox="0 0 220 44" width="220" height="44" aria-hidden="true">
          <path
            d="M6 30 Q24 8 52 16 Q76 0 104 14 Q140 4 168 22 Q192 20 212 32 Q190 44 164 36 Q136 48 108 38 Q78 48 52 36 Q26 44 6 30 Z"
            fill="#454d7c"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* 바닥 쪽 빛번짐 */}
      <div className="home__ground-glow" />
      <div className="home__haze" />
    </>
  );
}
