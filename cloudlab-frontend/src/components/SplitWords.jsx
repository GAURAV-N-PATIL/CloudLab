// Splits a headline into masked words so GSAP can slide each one up.
// The visible spans are hidden from screen readers; the wrapper carries the full text.
export default function SplitWords({ text, as: Tag = 'span', className }) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="split-word" aria-hidden="true">
          <span className="split-word__inner">{word}</span>
        </span>
      ))}
    </Tag>
  )
}
