import Image from 'next/image'
import './blocks.css'

interface GalleryItem {
  imageURL?: string | null
  alt?: string | null
}

interface GalleryProps {
  items: GalleryItem[]
}

export default function Gallery({ items }: GalleryProps) {
  if (!items?.length) return null

  return (
    <section className="gallery">
      <div className="gallery__inner container">
        <div className="gallery__grid">
          {items.map((item, index) => (
            <figure key={index} className="gallery__item">
              {item.imageURL ? (
                <div className="gallery__image cover-wrap cover-wrap--268x244">
                  <Image
                    src={item.imageURL}
                    alt={item.alt || `Image ${index + 1}`}
                    fill
                  />
                </div>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
