import React from 'react'

const SkeletonCard = () => {
  return (
        <div className="animate-pulse border rounded-xl p-4 space-y-4">
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 rounded-lg"></div>

      {/* Title */}
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>

      {/* Author */}
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>

      {/* Price */}
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}

export default SkeletonCard