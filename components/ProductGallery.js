'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ images = [], title = '' }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use first image as fallback
  const imageList = images && images.length > 0 ? images : [];
  const selectedImage = imageList[selectedImageIndex] || '/placeholder.png';

  if (imageList.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center">
        <Image
          src={selectedImage}
          alt={title}
          width={900}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                index === selectedImageIndex
                  ? 'border-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}