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
// the text that reads on these colors is computed in css: see the on-surface mixin in style/vars.scss
