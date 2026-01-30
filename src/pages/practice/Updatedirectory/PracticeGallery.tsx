import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Edit2, Image as ImageIcon, Check } from 'lucide-react';
import type { Clinic } from '../../../types/clinic';

interface GalleryImage {
    id: string;
    file?: File;
    preview: string;
    caption: string;
}

export default function PracticeGallery({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<GalleryImage[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempCaption, setTempCaption] = useState('');

    /* ---------- LOAD INITIAL DATA ---------- */
    useEffect(() => {
        // Mocking existing gallery data from clinicData if available
        // In a real app, map clinicData.gallery to GalleryImage[]
    }, [clinicData]);

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
        setImages(prev => {
            const newImages = prev.filter(img => img.id !== id);
            // Revoke URL to prevent memory leak
            const removed = prev.find(img => img.id === id);
            if (removed && removed.file) URL.revokeObjectURL(removed.preview);
            return newImages;
        });
    };

    /* ---------- SAVE CAPTION ---------- */
    const saveCaption = (id: string) => {
        setImages(prev =>
            prev.map(img =>
                img.id === id ? { ...img, caption: tempCaption } : img
            )
        );
        setEditingId(null);
        setTempCaption('');
    };

    /* ---------- SAVE & NEXT ---------- */
    const handleSaveAndNext = () => {
        console.log('Saving Gallery:', images);
        // API call logic here...
        onNext();
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Clinic Gallery</h2>
                    <p className="text-sm text-gray-500">Showcase your practice environment.</p>
                </div>
            </div>

            {/* UPLOAD BOX */}
            <div className="mb-8">
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
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition group"
                >
                    <div className="w-12 h-12 bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 rounded-full flex items-center justify-center mb-4 transition">
                        <Upload size={24} />
                    </div>
                    <p className="font-medium text-gray-700 group-hover:text-orange-700">
                        Choose images or drag & drop them here.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG (Max 5MB each)
                    </p>
                </div>
            </div>

            {/* GALLERY GRID */}
            <div className="bg-gray-50 rounded-xl p-6 min-h-[200px] border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">Uploaded Photos ({images.length})</h3>
                </div>

                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-400 h-40">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">No photos added yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map(img => (
                            <div key={img.id} className="relative group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="aspect-square relative">
                                    <img
                                        src={img.preview}
                                        alt={img.caption || "Gallery"}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-start justify-end p-2 gap-1">
                                        <button
                                            onClick={() => {
                                                setEditingId(img.id);
                                                setTempCaption(img.caption);
                                            }}
                                            className="p-1.5 bg-white rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition"
                                            title="Edit Caption"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => removeImage(img.id)}
                                            className="p-1.5 bg-white rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition"
                                            title="Remove"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* CAPTION AREA */}
                                <div className="p-2 text-center h-10 flex items-center justify-center">
                                    {img.caption ? (
                                        <p className="text-xs text-gray-600 truncate px-1 w-full" title={img.caption}>
                                            {img.caption}
                                        </p>
                                    ) : (
                                        <span className="text-[10px] text-gray-400 italic">No caption</span>
                                    )}
                                </div>

                                {/* EDIT OVERLAY */}
                                {editingId === img.id && (
                                    <div className="absolute inset-0 bg-white/95 p-3 flex flex-col items-center justify-center z-10">
                                        <p className="text-xs font-bold text-gray-700 mb-2">Edit Caption</p>
                                        <input
                                            value={tempCaption}
                                            onChange={(e) => setTempCaption(e.target.value)}
                                            placeholder="Enter caption..."
                                            autoFocus
                                            className="w-full border border-gray-300 px-2 py-1.5 text-xs rounded mb-2 outline-none focus:border-orange-500"
                                            onKeyDown={(e) => e.key === 'Enter' && saveCaption(img.id)}
                                        />
                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs py-1.5 rounded transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => saveCaption(img.id)}
                                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs py-1.5 rounded transition flex items-center justify-center gap-1"
                                            >
                                                <Check size={12} /> Save
                                            </button>
                                        </div>
                                    </div>
                                )}
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