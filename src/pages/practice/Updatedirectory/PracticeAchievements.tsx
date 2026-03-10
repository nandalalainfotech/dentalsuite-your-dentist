/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Edit2, Trash2, Upload, X, Check, Loader2, FileText } from 'lucide-react';
import { useAppDispatch } from '../../../store/hooks';
import { updatePracticeProfile } from '../../../store/slices/practiceSlice';
import type { PracticeInfo } from '../../../types/clinic';
import toast from "react-hot-toast";

interface Achievement {
    id: string;
    title: string;
    image?: string;
}

export default function PracticeAchievements({ clinicData, onNext }: { clinicData: PracticeInfo, onNext: () => void }) {
    const dispatch = useAppDispatch();

    // --- State ---
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load initial data
    useEffect(() => {
        if (!clinicData) {
            setAchievements([]);
            return;
        }

        const formattedAchievements =
            Array.isArray(clinicData.directory_achievements)
                ? clinicData.directory_achievements.map((a, index) => ({
                    id: a?.id || index.toString(),
                    title: a?.title || "",
                    image: a?.image || "",
                }))
                : [];

        setAchievements(formattedAchievements);

    }, [clinicData]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!['image/jpeg', 'image/png'].includes(selected.type)) {
            alert('Only JPG and PNG allowed');
            return;
        }

        if (selected.size > 5 * 1024 * 1024) {
            alert('Max file size is 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(selected);
    };

    const [errors, setErrors] = useState({
        title: false,
        image: false
    });

    const handleSaveItem = () => {

        const newErrors = {
            title: !title?.trim(),
            image: !preview
        };

        setErrors(newErrors);

        // Stop if validation fails
        if (Object.values(newErrors).some(Boolean)) {

            if (newErrors.title && newErrors.image) {
                toast.error("Title and image are required");
            } else if (newErrors.title) {
                toast.error("Title is required");
            } else if (newErrors.image) {
                toast.error("Image is required");
            }

            return;
        }

        const newItem = {
            id: editingId || Date.now().toString(),
            title,
            image: preview || undefined
        };

        if (editingId) {
            setAchievements(prev =>
                prev.map(a => a.id === editingId ? newItem : a)
            );
            setEditingId(null);
        } else {
            setAchievements(prev => [...prev, newItem]);
        }

        resetForm();

        // Clear errors after success
        setErrors({ title: false, image: false });
    };

    const resetForm = () => {
        setTitle('');
        setPreview(null);
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const startEdit = (item: Achievement) => {
        setTitle(item.title);
        setPreview(item.image || null);
        setEditingId(item.id);
        // Using scrollIntoView for better UX with the new layout
        document.getElementById('achievement-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleDelete = (id: string) => {
        setAchievements(prev => prev.filter(x => x.id !== id));
        if (editingId === id) resetForm();
    };

    //  SAVE HANDLER (RESTORED EXACTLY AS REQUESTED)
    const handleSaveAndNext = async () => {

        const titleError = !title;
        const imageError = !preview;

        // set red error UI
        setErrors({
            title: titleError,
            image: imageError
        });

        // show toast + stop save
        if (titleError || imageError) {
            toast.error("Please fill the required fields.");
            return;
        }

        setIsSaving(true);

        try {
            const formData = new FormData();

            const achievementsList = achievements.map(a => ({
                title: a.title,
                attachments: a.image
            }));

            formData.append('directory_achievements', JSON.stringify(achievementsList));

            await dispatch(updatePracticeProfile(formData)).unwrap();

            console.log('Achievements Saved');
            onNext();

        } catch (error) {
            console.error("Failed to save achievements:", error);
            toast.error("Failed to save. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">

            {/* HEADER */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <Trophy className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Awards & Achievements</h2>
                    <p className="text-gray-500 text-sm mt-1">Showcase your clinic's recognition.</p>
                </div>
            </div>

            {/* ADD / EDIT FORM */}
            <div id="achievement-form" className="bg-gray-50/50 border border-gray-200 rounded-xl p-6 mb-8 focus-within:ring-1 focus-within:ring-orange-200 transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        {editingId ? 'Edit Achievement' : 'Add New Achievement'}
                    </h3>
                    {editingId && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                            Editing Mode
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* LEFT: Title Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Achievement Title <span className="text-orange-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setErrors(prev => ({ ...prev, title: false }));
                                }}
                                placeholder="e.g. Best Dental Clinic 2026"
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition
                                    ${errors.title
                                        ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50"
                                        : "border-gray-200 bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                    }`
                                }
                            />
                            {errors.title && <p className="text-xs text-red-500 mt-1">Title is required</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleSaveItem}
                                className="flex-1 bg-gray-900 text-white hover:bg-black px-6 py-3 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
                            >
                                {editingId ? (
                                    <><Check className="w-4 h-4" /> Update</>
                                ) : (
                                    <><FileText className="w-4 h-4" /> Add to List</>
                                )}
                            </button>

                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    className="px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Image Upload */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Attachment (Image) <span className="text-orange-500">*</span>
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            required
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {!preview ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`h-[140px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition group bg-white
                                    ${errors.image
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/10"}
                                        `}
                            >
                                <div className="w-10 h-10 bg-gray-100 text-gray-400 group-hover:text-orange-500 rounded-full flex items-center justify-center mb-2 transition shadow-sm">
                                    <Upload className="w-5 h-5 transition" />
                                </div>
                                <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Click to upload</p>
                                <p className="text-xs text-gray-400 mt-1">JPG or PNG</p>
                            </div>
                        ) : (
                            <div className="relative h-[140px] rounded-xl border border-gray-200 bg-white overflow-hidden group shadow-sm">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-contain p-2"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                        className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-lg transition border border-white/20"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreview(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="bg-red-500/80 backdrop-blur-md hover:bg-red-600 text-white p-2 rounded-lg transition border border-white/20"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                        {errors.image && <p className="text-xs text-red-500 mt-1">Image is required</p>}
                    </div>
                </div>
            </div>

            {/* ACHIEVEMENTS LIST */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    Your Achievements <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{achievements.length}</span>
                </h3>

                {achievements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                        <Trophy className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium text-sm">No achievements added yet.</p>
                        <p className="text-gray-400 text-xs">Use the form above to add your first award.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map(a => (
                            <div
                                key={a.id}
                                className={`
                                    relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 bg-white group
                                    ${editingId === a.id
                                        ? 'border-orange-500 ring-2 ring-orange-100 shadow-md'
                                        : 'border-gray-200 hover:border-orange-200 hover:shadow-md'
                                    }
                                `}
                            >
                                {/* Image Container */}
                                <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden p-1">
                                    {a.image ? (
                                        <img
                                            src={a.image}
                                            alt={a.title}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Trophy className="w-6 h-6 text-orange-200" />
                                    )}
                                </div>

                                {/* Text Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate mb-0.5" title={a.title}>
                                        {a.title}
                                    </h4>
                                    <p className="text-xs text-gray-500">Achievement</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => startEdit(a)}
                                        disabled={!!editingId}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-30"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(a.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
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