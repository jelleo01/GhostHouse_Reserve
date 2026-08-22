export default function BackButton({ onClick }) {
  return (
    <button type="button" className="back-button" aria-label="뒤로" onClick={onClick}>
      ‹
    </button>
  );
}
