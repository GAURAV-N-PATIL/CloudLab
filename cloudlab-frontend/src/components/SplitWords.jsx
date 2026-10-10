// Splits a headline into masked words so GSAP can slide each one up.
// `accent` is an optional phrase from the text whose words get the blue accent colour.
// The visible spans are hidden from screen readers; the wrapper carries the full text.
export default function SplitWords({ text, accent, as: Tag = 'span', className }) {
  const words = text.split(' ')
  const accentWords = accent ? accent.split(' ') : []
  const accentStart = accentWords.length
    ? words.findIndex((_, i) => accentWords.every((w, k) => words[i + k] === w))
    : -1

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => {
        const isAccent = accentStart >= 0 && i >= accentStart && i < accentStart + accentWords.length
        return (
          <span key={i} className={`split-word${isAccent ? ' split-word--accent' : ''}`} aria-hidden="true">
            <span className="split-word__inner">{word}</span>
          </span>
        )
      })}
    </Tag>
  )
}
