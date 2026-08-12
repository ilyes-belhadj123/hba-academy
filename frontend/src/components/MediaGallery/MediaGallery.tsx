import { useState } from 'react'
import { isVideoUrl } from '../../utils/media'
import './MediaGallery.css'

interface MediaGalleryProps {
  mediaUrls: string[]
  batchSize?: number
}

export function MediaGallery({ mediaUrls, batchSize = 9 }: MediaGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(batchSize)

  if (mediaUrls.length === 0) {
    return <p className="media-gallery__empty">Aucun média disponible pour le moment.</p>
  }

  const visibleMedia = mediaUrls.slice(0, visibleCount)
  const hasMore = visibleCount < mediaUrls.length

  return (
    <div className="media-gallery">
      <div className="media-gallery__grid">
        {visibleMedia.map((url) =>
          isVideoUrl(url) ? (
            <video key={url} className="media-gallery__item" controls preload="none" src={url} />
          ) : (
            <img key={url} className="media-gallery__item" src={url} alt="" loading="lazy" />
          ),
        )}
      </div>

      {hasMore && (
        <button
          type="button"
          className="media-gallery__load-more"
          onClick={() => setVisibleCount((count) => count + batchSize)}
        >
          Voir plus
        </button>
      )}
    </div>
  )
}
