export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)$/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be')
}
