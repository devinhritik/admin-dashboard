'use client';

export default function ProductReviews({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">No reviews yet</p>
      </div>
    );
  }

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-3xl font-bold text-blue-600">
              {avgRating}
              <span className="text-lg">⭐</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-800">
                  {review.reviewerName || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">
                  {review.date ? new Date(review.date).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
              <div className="text-lg">
                {'⭐'.repeat(review.rating)}
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-gray-700 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}