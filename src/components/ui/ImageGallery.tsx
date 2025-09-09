'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/libs/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: { asset: { _ref: string; _type: 'reference' } }[]
  title: string
  className?: string
}

export default function ImageGallery({ images, title, className = '' }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedImage(index)
  const closeLightbox = () => setSelectedImage(null)
  
  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }
  
  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  if (!images || images.length === 0) return null

  // Responsive grid classes based on image count
  const getGridClasses = (count: number) => {
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2'
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    if (count === 4) return 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
    if (count === 5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3' // 6 images: 2x3 grid on large screens
  }

  return (
    <>
      <div className={`grid gap-2 ${getGridClasses(images.length)} ${className}`}>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={urlFor(image).width(400).height(400).url()}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <Lightbox
          images={images}
          title={title}
          selectedIndex={selectedImage}
          onClose={closeLightbox}
          onPrev={goToPrevious}
          onNext={goToNext}
        />
      )}
    </>
  )
}

// Dedicated lightbox with better z-index, padding, and accessibility
function Lightbox({
  images,
  title,
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: { asset: { _ref: string; _type: 'reference' } }[]
  title: string
  selectedIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  // Escape to close + lock body scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[120] flex items-center justify-center p-4 pt-32"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} image viewer`}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-10 inline-flex items-center justify-center h-10 w-10 rounded-full bg-black/40 backdrop-blur"
        aria-label="Close image viewer"
      >
        <X size={22} />
      </button>
          
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 inline-flex items-center justify-center h-10 w-10 rounded-full bg-black/40 backdrop-blur"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 inline-flex items-center justify-center h-10 w-10 rounded-full bg-black/40 backdrop-blur"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
          
      <div className="relative w-full h-full max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <Image
          src={urlFor(images[selectedIndex]).width(1600).height(1200).url()}
          alt={`${title} - Image ${selectedIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>
          
          {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded" onClick={(e) => e.stopPropagation()}>
        {selectedIndex + 1} of {images.length}
      </div>
    </div>
  )
}
