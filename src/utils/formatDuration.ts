/**
 * Formats a duration in seconds to a mm:ss string.
 * Returns '--:--' for null (unknown), 'Loading...' for 0 (pending).
 */
export function formatDuration(seconds: number | null): string {
  if (seconds === null) return '--:--'
  if (!seconds) return 'Loading...'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
