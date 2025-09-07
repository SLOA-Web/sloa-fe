'use client'

import { useState } from 'react'
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
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>
          
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
              >
                <ChevronLeft size={32} />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
          
          <div className="relative w-full h-full max-w-4xl max-h-full">
            <Image
              src={urlFor(images[selectedImage]).width(1200).height(900).url()}
              alt={`${title} - Image ${selectedImage + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          
          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded">
            {selectedImage + 1} of {images.length}
          </div>
        </div>
      )}
    </>
  )
}
