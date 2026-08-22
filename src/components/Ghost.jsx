/**
 * 유령 아이콘. 홈 화면에서 크기/눈 모양/입 유무만 바뀌며 재사용된다.
 */
export default function Ghost({
  width,
  height,
  fill = '#e6ebff',
  eyeCx = [14, 26],
  eyeRx = 2.6,
  eyeRy = 3.4,
  mouth = false,
  className,
}) {
  return (
    <svg viewBox="0 0 40 50" width={width} height={height} className={className} aria-hidden="true">
      <path
        d="M20 3 C31 3 38 12 38 24 L38 47 L32.5 40 L27 47.5 L21 40 L15 47.5 L9.5 40 L2 46 L2 24 C2 12 9 3 20 3 Z"
        fill={fill}
      />
      <ellipse cx={eyeCx[0]} cy="22" rx={eyeRx} ry={eyeRy} fill="#161b2e" />
      <ellipse cx={eyeCx[1]} cy="22" rx={eyeRx} ry={eyeRy} fill="#161b2e" />
      {mouth && <ellipse cx="20" cy="31" rx="3" ry="2.2" fill="#161b2e" opacity="0.65" />}
    </svg>
  );
}
