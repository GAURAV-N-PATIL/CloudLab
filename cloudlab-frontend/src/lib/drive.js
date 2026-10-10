// Google Drive helpers. Files are embedded with Drive's preview URL, so no API key or OAuth is needed.
// The file must be shared as "Anyone with the link: Viewer" or the embed will show a sign-in page.
const DRIVE_ID = /^[A-Za-z0-9_-]{10,}$/

export function isValidDriveId(id) {
  return typeof id === 'string' && DRIVE_ID.test(id)
}

// Returns the iframe URL, or null when there is no valid file ID (never builds a URL from bad input).
export function drivePreviewUrl(id) {
  return isValidDriveId(id) ? `https://drive.google.com/file/d/${id}/preview` : null
}

export function driveViewUrl(id) {
  return isValidDriveId(id) ? `https://drive.google.com/file/d/${id}/view` : null
}

// A resource opens in the viewer only when it is switched on AND has a usable file ID.
export function isResourceAvailable(resource) {
  return resource?.available === true && isValidDriveId(resource.googleDriveFileId)
}
