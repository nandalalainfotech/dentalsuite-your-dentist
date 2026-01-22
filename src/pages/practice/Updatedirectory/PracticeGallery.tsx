import React, { useState } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import { SectionHeader } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

interface GalleryImage {
    id: string;
    url: string;
    caption: string;
}

export default function PracticeGallery({ clinicData }: { clinicData: Clinic }) {
    const [images, setImages] = useState<GalleryImage[]>([
        { id: '1', url: '/placeholder-clinic-1.jpg', caption: 'Reception Area' },
        { id: '2', url: '/placeholder-clinic-2.jpg', caption: 'Treatment Room' },
        { id: '3', url: '/placeholder-clinic-3.jpg', caption: 'Waiting Area' }
    ]);
    const [editingImage, setEditingImage] = useState<string | null>(null);
    const [newCaption, setNewCaption] = useState('');

    const handleAddImage = () => {
        const newImage: GalleryImage = {
            id: Date.now().toString(),
            url: '/placeholder-new.jpg',
            caption: 'New Photo'
        };
        setImages([...images, newImage]);
    };

    const handleDeleteImage = (id: string) => {
        setImages(images.filter(img => img.id !== id));
    };

    const handleEditCaption = (id: string, caption: string) => {
        setEditingImage(id);
        setNewCaption(caption);
    };

    const handleSaveCaption = (id: string) => {
        setImages(images.map(img =>
            img.id === id ? { ...img, caption: newCaption } : img
        ));
        setEditingImage(null);
        setNewCaption('');
    };

    return (
        <div className="max-w-5xl mx-auto">
            <SectionHeader title="Gallery" desc="Photos of clinic facilities." actionLabel="Upload" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-xs text-center px-2">{image.caption}</span>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                                onClick={() => handleEditCaption(image.id, image.caption)}
                                className="p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-white transition"
                            >
                                <Edit2 className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                                onClick={() => handleDeleteImage(image.id)}
                                className="p-1.5 bg-white/90 rounded-lg shadow-sm hover:bg-red-50 transition"
                            >
                                <X className="w-3 h-3 text-red-500" />
                            </button>
                        </div>
                        {editingImage === image.id && (
                            <div className="absolute inset-0 bg-white/95 rounded-xl p-2 flex flex-col justify-center">
                                <input
                                    type="text"
                                    value={newCaption}
                                    onChange={(e) => setNewCaption(e.target.value)}
                                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded mb-2"
                                    placeholder="Caption"
                                />
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleSaveCaption(image.id)}
                                        className="flex-1 bg-orange-500 text-white text-xs px-2 py-1 rounded hover:bg-orange-600 transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingImage(null)}
                                        className="flex-1 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div
                    onClick={handleAddImage}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-orange-400 transition cursor-pointer"
                >
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Add Photo</span>
                </div>
            </div>
        </div>
    );
} 