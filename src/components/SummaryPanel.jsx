/**
 * 모서리가 잘린 요약 박스.
 * @param {{ variant?: 'solid' | 'glass', className?: string, children: React.ReactNode }} props
 */
export default function SummaryPanel({ variant = 'solid', className = '', children }) {
  return (
    <div className={`panel ${className}`.trim()}>
      <div className={`panel__inner panel__inner--${variant}`}>{children}</div>
    </div>
  );
}

/**
 * 요약 박스 한 줄.
 * @param {{ label: string, value: React.ReactNode, tone?: 'gold' | 'plain' }} props
 */
export function SummaryRow({ label, value, tone = 'gold' }) {
  return (
    <div className="panel__row">
      <span className="panel__label">{label}</span>
      <b className={`panel__value panel__value--${tone}`}>{value}</b>
    </div>
  );
}
