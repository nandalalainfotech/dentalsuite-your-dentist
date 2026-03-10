/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../../store/hooks';
import { updatePracticeProfile } from '../../../store/slices/practiceSlice';
import type { PracticeInfo } from '../../../types/clinic';
import toast from "react-hot-toast";

interface GalleryImage {
    id: string;
    file?: File;
    preview: string;
    caption: string;
}

export default function PracticeGallery({ clinicData, onNext }: { clinicData: PracticeInfo, onNext: () => void }) {
    const dispatch = useAppDispatch();
    const inputRef = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({ image: false });

    /* ---------- LOAD INITIAL DATA ---------- */
    useEffect(() => {
        if (!clinicData || images.length > 0) return;

        const rawGallery =
            (clinicData as any).directory_gallery_posts ??
            clinicData.gallery ??
            [];

        if (!Array.isArray(rawGallery) || rawGallery.length === 0) {
            setImages([]);
            return;
        }

        const flattenedGallery = rawGallery.flat();

        const loadedImages = flattenedGallery.map((img: any, i: number) => {
            let url = "";

            if (typeof img === "string") {
                url = img;
            } else if (Array.isArray(img?.image) && img.image.length > 0) {
                url = img.image[0]?.url || "";
            } else if (img?.image?.url) {
                url = img.image.url;
            } else if (img?.url) {
                url = img.url;
            }

            return {
                id: img?.id?.toString() || i.toString(),
                preview: url || "",
                caption: img?.caption || "",
            };
        });

        setImages(loadedImages);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clinicData]);

    /* ---------- FILE UPLOAD ---------- */
    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        setErrors(prev => ({ ...prev, image: false }));

        Array.from(files).forEach(file => {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                alert('Only JPG & PNG allowed');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Max 5MB per image');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prev => [
                    ...prev,
                    {
                        id: Date.now().toString() + Math.random(),
                        file,
                        preview: e.target?.result as string,
                        caption: ''
                    }
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    /* ---------- DELETE ---------- */
    const removeImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    /* ---------- SAVE & NEXT ---------- */
    const handleSaveAndNext = async () => {

        const newErrors = {
            image: images.length === 0
        };

        setErrors(newErrors);

        if (newErrors.image) {
            toast.error("Please upload at least one image");
            return;
        }

        setIsSaving(true);

        try {
            const formData = new FormData();

            const galleryData = images.map(img => ({
                image: img.preview,
                caption: img.caption
            }));

            formData.append(
                "directory_gallery_posts",
                JSON.stringify(galleryData)
            );

            await dispatch(updatePracticeProfile(formData)).unwrap();

            console.log("Gallery Saved");

            onNext();

        } catch (error) {
            console.error("Failed to save gallery:", error);
            toast.error("Failed to save gallery. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
            
            {/* HEADER */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <ImageIcon className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Practice Gallery</h2>
                    <p className="text-gray-500 text-sm mt-1">Showcase your practice environment.</p>
                </div>
            </div>

            {/* UPLOAD BOX */}
            <div className="mb-10">
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
                    className={`
                        relative h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group
                        ${errors.image
                            ? "border-red-300 bg-red-50/30"
                            : "border-gray-200 bg-gray-50/30 hover:border-orange-400 hover:bg-orange-50/5"
                        }
                    `}
                >
                    <div className="w-12 h-12 bg-white shadow-sm border border-gray-100 group-hover:border-orange-200 rounded-full flex items-center justify-center mb-4 transition-all duration-300">
                        <Upload className={`w-6 h-6 transition-colors ${errors.image ? "text-red-400" : "text-gray-400 group-hover:text-orange-500"}`} />
                    </div>

                    <h3 className={`font-semibold text-lg mb-1 transition-colors ${errors.image ? "text-red-600" : "text-gray-900 group-hover:text-orange-600"}`}>
                        Click to upload photos
                    </h3>
                    
                    <p className="text-sm text-gray-500 group-hover:text-gray-600">
                        or drag & drop them here
                    </p>

                    <p className="text-xs text-gray-400 mt-4 px-3 py-1 bg-white rounded-full border border-gray-100">
                        JPG, PNG (Max 5MB each)
                    </p>

                    {errors.image && (
                        <div className="absolute bottom-4 text-red-500 text-xs font-medium flex items-center gap-1">
                            <X size={12} /> Please upload at least one image
                        </div>
                    )}
                </div>
            </div>

            {/* GALLERY GRID */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        Uploaded Photos <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{images.length}</span>
                    </h3>
                </div>

                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border border-gray-100 rounded-xl bg-gray-50/20 text-center">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium text-sm">No photos added yet.</p>
                        <p className="text-gray-400 text-xs mt-1">Uploaded images will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map(img => (
                            <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <img
                                    src={img.preview}
                                    alt={img.caption || "Gallery"}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg"
                                        title="Remove Image"
                                    >
                                        <X size={18} />
                                    </button>
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