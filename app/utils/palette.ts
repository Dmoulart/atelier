// the suggested colors of the NewsHero's band and of the highlighted TextBlocks, taken from the
// atelier's paintings. Any other color can be picked
export const palette = [
  { name: 'Rose poudré', value: '#dcc3ba' },
  { name: 'Crème', value: '#f2ebe2' },
  { name: 'Sauge', value: '#b3b89c' },
  { name: 'Sarcelle', value: '#2f5f5e' },
  { name: 'Feuillage', value: '#4a6743' },
  { name: 'Terracotta', value: '#a4532f' },
  { name: 'Prune', value: '#74407a' },
  // aliceblue, the highlighted TextBlocks' original color
  { name: 'Bleu ciel', value: '#f0f8ff' },
] as const

const INK = '#23201d'

// WCAG relative luminance of a "#rrggbb" color
function luminance(hex: string) {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** whether ink reads better than white on this background */
export function isLightColor(hex: string) {
  const bg = luminance(hex)
  // contrast with ink vs contrast with white
  return (bg + 0.05) / (luminance(INK) + 0.05) > 1.05 / (bg + 0.05)
}
