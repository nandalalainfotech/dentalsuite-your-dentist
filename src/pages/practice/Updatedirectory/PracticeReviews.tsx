import { useState } from 'react';
import { Star, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { SectionHeader, InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

interface ReviewItem {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

export default function PracticeReviews({ clinicData }: { clinicData: Clinic }) {
    const [reviews, setReviews] = useState<ReviewItem[]>([
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
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [editingReview, setEditingReview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        patientName: '',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleAddReview = () => {
        if (formData.patientName && formData.comment) {
            const newReview: ReviewItem = {
                id: Date.now().toString(),
                ...formData
            };
            setReviews([...reviews, newReview]);
            setFormData({
                patientName: '',
                rating: 5,
                comment: '',
                date: new Date().toISOString().split('T')[0]
            });
            setIsAddingReview(false);
        }
    };

    const handleEditReview = (review: ReviewItem) => {
        setEditingReview(review.id);
        setFormData({
            patientName: review.patientName,
            rating: review.rating,
            comment: review.comment,
            date: review.date
        });
    };

    const handleUpdateReview = () => {
        if (formData.patientName && formData.comment && editingReview) {
            setReviews(reviews.map(review => 
                review.id === editingReview 
                    ? { ...review, ...formData }
                    : review
            ));
            setEditingReview(null);
            setFormData({
                patientName: '',
                rating: 5,
                comment: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
    };

    const handleDeleteReview = (id: string) => {
        setReviews(reviews.filter(review => review.id !== id));
    };

    const renderStars = (rating: number, onChange?: (rating: number) => void) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 cursor-pointer transition-colors ${
                        star <= rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 hover:text-yellow-200'
                    }`}
                    onClick={() => onChange?.(star)}
                />
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader 
                title="Reviews" 
                desc="Patient feedback." 
                actionLabel="Add Review"
                onActionClick={() => setIsAddingReview(true)}
            />
            
            {isAddingReview && (
                <div className="mb-6 p-5 rounded-xl border border-orange-200 bg-orange-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Review</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputGroup
                            label="Patient Name"
                            value={formData.patientName}
                            onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Rating</label>
                            {renderStars(formData.rating, (rating) => setFormData({...formData, rating}))}
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Comment</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none transition"
                            value={formData.comment}
                            onChange={(e) => setFormData({...formData, comment: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddReview}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                        >
                            Add Review
                        </button>
                        <button
                            onClick={() => setIsAddingReview(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 relative group">
                        {editingReview === review.id ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputGroup
                                        label="Patient Name"
                                        value={formData.patientName}
                                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Rating</label>
                                        {renderStars(formData.rating, (rating) => setFormData({...formData, rating}))}
                                    </div>
                                </div>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none transition"
                                    value={formData.comment}
                                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpdateReview}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setEditingReview(null)}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={() => handleEditReview(review)}
                                        className="p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-white transition"
                                    >
                                        <Edit2 className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-red-50 transition"
                                    >
                                        <Trash2 className="w-3 h-3 text-red-500" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-gray-900">{review.patientName}</span>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">{review.date}</span>
                                </div>
                                <p className="text-sm text-gray-600">"{review.comment}"</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}