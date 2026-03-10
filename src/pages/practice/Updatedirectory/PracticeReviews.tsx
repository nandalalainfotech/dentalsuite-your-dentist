/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { MessageSquareQuote, Star, Quote, Loader2, User } from 'lucide-react';
import type { PracticeInfo } from '../../../types/clinic';

interface ReviewItem {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date?: string;
    image?: string;
}

export default function PracticeReviews({ clinicData, onNext }: { clinicData: PracticeInfo, onNext: () => void }) {
    
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // --- 1. Load & Parse Data ---
    useEffect(() => {
        if (clinicData) {
            const rawData = (clinicData as any).testimonials || (clinicData as any).directory_testimonials;
            
            let parsedData: any[] = [];

            if (typeof rawData === 'string') {
                try {
                    parsedData = JSON.parse(rawData);
                } catch (e) {
                    console.error("Failed to parse reviews JSON", e);
                    parsedData = [];
                }
            } else if (Array.isArray(rawData)) {
                parsedData = rawData;
            }

            const formattedReviews = parsedData.map((r: any, index: number) => ({
                id: r.id || index.toString(),
                patientName: r.name || "Anonymous",
                rating: r.rating || 5, 
                comment: r.message || r.content || "No review text.",
                date: r.date || "Recently",
                image: r.profile_image
            }));

            setReviews(formattedReviews);
        }
    }, [clinicData]);

    const handleSaveAndNext = () => {
        setIsSaving(true);
        setTimeout(() => {
            console.log('Reviews acknowledged');
            setIsSaving(false);
            onNext();
        }, 500);
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">

            {/* HEADER */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <MessageSquareQuote className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Patient Reviews</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage how reviews appear on your public profile.</p>
                </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        Recent Feedback <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{reviews.length}</span>
                    </h3>
                </div>

                {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border border-gray-100 rounded-xl bg-gray-50/20 text-center">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                            <MessageSquareQuote className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm">No reviews available yet.</p>
                        <p className="text-gray-400 text-xs mt-1">Patient feedback will appear here once submitted.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-orange-200 hover:shadow-md transition-all duration-300 group"
                            >
                                {/* Header: User & Rating */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm overflow-hidden shrink-0">
                                            {review.image ? (
                                                <img src={review.image} alt={review.patientName} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 opacity-60" />
                                            )}
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm leading-tight">
                                                {review.patientName}
                                            </h4>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {review.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current mr-1" />
                                        <span className="text-xs font-bold text-yellow-700">{review.rating}.0</span>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="relative pl-3 border-l-2 border-orange-100">
                                    <Quote className="absolute -top-1 -left-2 w-3 h-3 text-orange-400 bg-white" />
                                    <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                                        "{review.comment}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button
                    type="button"
                    onClick={onNext}
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition"
                >
                    Skip
                </button>
                <button
                    onClick={handleSaveAndNext}
                    disabled={isSaving}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        'Save & Next'
                    )}
                </button>
            </div>
        </div>
    );
}