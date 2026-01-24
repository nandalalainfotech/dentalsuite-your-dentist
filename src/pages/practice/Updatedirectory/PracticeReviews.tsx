import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Clinic } from '../../../types/clinic';

interface ReviewItem {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PracticeReviews({ clinicData }: { clinicData: Clinic }) {
    const [reviews] = useState<ReviewItem[]>([
        {
            id: '1',
            patientName: 'Alice J.',
            rating: 5,
            comment: 'Great experience! The staff was very professional.',
            date: '2024-01-15'
        },
        {
            id: '2',
            patientName: 'Bob M.',
            rating: 4,
            comment: 'Good service, friendly environment.',
            date: '2024-01-10'
        }
    ]);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Reviews</h2>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="p-5 rounded-xl border border-gray-200 bg-gray-50/50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-gray-900">{review.patientName}</span>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">"{review.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
