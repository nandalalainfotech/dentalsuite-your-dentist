import { useState } from 'react';
import { MessageSquareQuote, Star, Plus, Trash2, Quote } from 'lucide-react';
import type { Clinic } from '../../../types';

interface ReviewItem {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PracticeReviews({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    // Initial state with some mock data or empty array based on clinicData
    const [reviews, setReviews] = useState<ReviewItem[]>([
        {
            id: '1',
            patientName: 'Alice Johnson',
            rating: 5,
            comment: 'Great experience! The staff was very professional and the facility is top-notch.',
            date: '2023-11-15'
        },
        {
            id: '2',
            patientName: 'Michael Smith',
            rating: 4,
            comment: 'Good service, friendly environment. Wait time was a bit long but worth it.',
            date: '2024-01-10'
        }
    ]);

    // Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');

    const handleAddReview = () => {
        if (!newName.trim() || !newComment.trim()) return;

        const newReview: ReviewItem = {
            id: Date.now().toString(),
            patientName: newName,
            rating: newRating,
            comment: newComment,
            date: new Date().toISOString().split('T')[0]
        };

        setReviews(prev => [newReview, ...prev]);

        // Reset form
        setNewName('');
        setNewComment('');
        setNewRating(5);
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    const handleSaveAndNext = () => {
        console.log('Saving Reviews:', reviews);
        onNext();
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <MessageSquareQuote className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Patient Reviews</h2>
                        <p className="text-sm text-gray-500">Highlight patient satisfaction.</p>
                    </div>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Review
                    </button>
                )}
            </div>

            {/* ADD REVIEW FORM */}
            {isAdding && (
                <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Add New Review</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Patient Name</label>
                            <input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Rating</label>
                            <div className="flex gap-1 items-center h-[42px]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        className="focus:outline-none transform hover:scale-110 transition"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm text-gray-500 font-medium">{newRating}/5</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Comment</label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write the patient's feedback here..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-orange-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleAddReview}
                            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition shadow-sm"
                        >
                            Save Review
                        </button>
                    </div>
                </div>
            )}

            {/* REVIEWS LIST */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm">No reviews added yet.</p>
                        <button onClick={() => setIsAdding(true)} className="text-orange-500 text-sm font-medium hover:underline mt-2">
                            Add the first review manually
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="group p-5 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition bg-white relative">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm">
                                            {review.patientName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 leading-tight">{review.patientName}</h4>
                                            <p className="text-xs text-gray-400">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>

                                <div className="relative pl-4">
                                    <Quote className="absolute top-0 left-0 w-3 h-3 text-gray-300 transform -scale-x-100" />
                                    <p className="text-sm text-gray-600 italic leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>

                                {/* Delete Button (Visible on Hover) */}
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="absolute top-4 right-4 p-2 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-orange-500 hover:border-orange-200 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
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