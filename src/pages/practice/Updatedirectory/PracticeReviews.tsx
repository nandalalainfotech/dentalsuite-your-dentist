import { MessageSquareQuote, Star, Quote } from 'lucide-react';
import type { Clinic } from '../../../types';

interface ReviewItem {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

export default function PracticeReviews({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {

    // FIX: Cast 'clinicData.reviews' to unknown then to ReviewItem[] to bypass the type error
    const reviews: ReviewItem[] = (clinicData.reviews as unknown as ReviewItem[]) ?? [];

    const handleSaveAndNext = () => {
        // In a real app, you might want to save edits here
        onNext();
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageSquareQuote className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Patient Reviews</h2>
                    <p className="text-sm text-gray-500">What patients say about this clinic.</p>
                </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="mb-8">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm">No reviews available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="p-5 rounded-xl border border-gray-100 bg-white hover:shadow-sm hover:border-orange-100 transition duration-200"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm">
                                            {review.patientName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-tight">
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

            {/* FOOTER ACTIONS */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button
                    type="button"
                    onClick={onNext}
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition"
                >
                    Skip
                </button>
                <button
                    onClick={handleSaveAndNext}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition"
                >
                    Save & Next
                </button>
            </div>
        </div>
    );
}