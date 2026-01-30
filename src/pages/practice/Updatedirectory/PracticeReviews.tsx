import { MessageSquareQuote, Star, Quote } from 'lucide-react';
import type { Clinic } from '../../../types';

interface ReviewItem {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

export default function PracticeReviews({ clinicData }: { clinicData: Clinic }) {

    // Use reviews from clinicData (fallback to empty array)
    const reviews: ReviewItem[] = clinicData.reviews ?? [];

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageSquareQuote className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Patient Reviews</h2>
                    <p className="text-sm text-gray-500">What patients say about this clinic</p>
                </div>
            </div>

            {/* REVIEWS LIST */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">No reviews available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-5 rounded-xl border border-gray-100 bg-white"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm">
                                        {review.patientName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">
                                            {review.patientName}
                                        </h4>
                                        <p className="text-xs text-gray-400">
                                            {review.date}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex text-yellow-400 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating
                                                ? 'fill-current'
                                                : 'text-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="relative pl-4">
                                <Quote className="absolute top-0 left-0 w-3 h-3 text-gray-300 transform -scale-x-100" />
                                <p className="text-sm text-gray-600 italic leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
