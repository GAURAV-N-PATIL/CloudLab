// Pulls an 11-character video ID or a playlist ID out of a YouTube URL.
// Returns null when the URL isn't recognisable, so callers can fall back to a plain link.
export function youtubeVideoId(url) {
  try {
    const u = new URL(url)
    let id = null
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1)
    else if (u.hostname.endsWith('youtube.com')) id = u.searchParams.get('v') ?? u.pathname.split('/embed/')[1]
    return id && /^[\w-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}

export function youtubePlaylistId(url) {
  try {
    const id = new URL(url).searchParams.get('list')
    return id && /^[\w-]+$/.test(id) ? id : null
  } catch {
    return null
  }
}
