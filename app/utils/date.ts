// "2026-11-14" -> "14 novembre 2026", "" when missing or invalid.
// A date only string is UTC midnight: format it in UTC too
export function formatDate(value?: string) {
  const parsed = value ? new Date(value) : null
  return parsed && !Number.isNaN(parsed.getTime())
    ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(parsed)
    : ''
}
