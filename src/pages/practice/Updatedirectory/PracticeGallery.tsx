import React, { useRef, useState } from 'react';
import { Upload, X, Edit2 } from 'lucide-react';
import type { Clinic } from '../../../types/clinic';

interface GalleryImage {
    id: string;
    file: File;
    preview: string;
    caption: string;
}

export default function PracticeGallery({ clinicData }: { clinicData: Clinic }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<GalleryImage[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [caption, setCaption] = useState('');

    /* ---------- FILE UPLOAD ---------- */
    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const validFiles: GalleryImage[] = [];

        Array.from(files).forEach(file => {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                alert('Only JPG & PNG allowed');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Max 5MB per image');
                return;
            }

            validFiles.push({
                id: Date.now().toString() + Math.random(),
                file,
                preview: URL.createObjectURL(file),
                caption: ''
            });
        });

        setImages(prev => [...prev, ...validFiles]);
    };

    /* ---------- DELETE ---------- */
    const removeImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    /* ---------- SAVE CAPTION ---------- */
    const saveCaption = (id: string) => {
        setImages(prev =>
            prev.map(img =>
                img.id === id ? { ...img, caption } : img
            )
        );
        setEditingId(null);
        setCaption('');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Gallery</h2>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium">
                    Save & Next
                </button>
            </div>

            {/* UPLOAD BOX */}
            <div className="bg-white rounded-2xl border p-6">

                <p className="text-sm font-medium text-gray-700 mb-2">Gallery Images</p>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />

                <div
                    onClick={() => inputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-6 flex items-center justify-between
                     cursor-pointer hover:border-orange-400 transition"
                >
                    <div>
                        <p className="font-medium text-gray-700">
                            Choose images or drag & drop them here.
                        </p>
                        <p className="text-xs text-gray-400">
                            JPG, PNG (Max 5MB each)
                        </p>
                    </div>

                    <div className="bg-orange-100 p-3 rounded-xl">
                        <Upload className="text-orange-500" />
                    </div>
                </div>
            </div>

            {/* GALLERY */}
            <div className="bg-gray-50 rounded-2xl p-6 min-h-[260px]">

                <h3 className="font-semibold text-orange-500 mb-4">Gallery</h3>

                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-500 h-full">
                        <p>No gallery available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map(img => (
                            <div key={img.id} className="relative group">

                                <img
                                    src={img.preview}
                                    className="aspect-square object-cover rounded-xl border"
                                />

                                {/* ACTIONS */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => {
                                            setEditingId(img.id);
                                            setCaption(img.caption);
                                        }}
                                        className="p-1.5 bg-white rounded-lg shadow"
                                    >
                                        <Edit2 className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="p-1.5 bg-white rounded-lg shadow"
                                    >
                                        <X className="w-3 h-3 text-red-500" />
                                    </button>
                                </div>

                                {/* CAPTION EDIT */}
                                {editingId === img.id && (
                                    <div className="absolute inset-0 bg-white/95 rounded-xl p-2 flex flex-col justify-center">
                                        <input
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            placeholder="Caption"
                                            className="border px-2 py-1 text-xs rounded mb-2"
                                        />
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => saveCaption(img.id)}
                                                className="flex-1 bg-orange-500 text-white text-xs py-1 rounded"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 bg-gray-200 text-xs py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {img.caption && (
                                    <p className="text-xs text-center mt-1 text-gray-600">
                                        {img.caption}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
