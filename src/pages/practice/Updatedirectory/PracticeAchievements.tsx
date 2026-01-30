import { useState, useRef } from 'react';
import { Trophy, Edit2, Trash2, Upload, X, Check } from 'lucide-react';
import type { Clinic } from '../../../types';

interface Achievement {
    id: string;
    title: string;
    year: string;
    image?: string;
}

export default function PracticeAchievements({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    const [achievements, setAchievements] = useState<Achievement[]>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (clinicData as any).achievements ? (clinicData as any).achievements.map((a: any, i: number) => ({
            id: i.toString(),
            title: a.title,
            year: a.year || new Date().getFullYear().toString()
        })) : []
    );

    // Form State
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
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

        setPreview(URL.createObjectURL(selected));
    };

    const handleSaveItem = () => {
        if (!title) {
            alert('Title is required');
            return;
        }

        if (editingId) {
            setAchievements(prev => prev.map(a =>
                a.id === editingId
                    ? { ...a, title, year, image: preview || a.image }
                    : a
            ));
            setEditingId(null);
        } else {
            setAchievements(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    title,
                    year,
                    image: preview || undefined
                }
            ]);
        }

        setTitle('');
        setYear('');
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const startEdit = (item: Achievement) => {
        setTitle(item.title);
        setYear(item.year);
        setPreview(item.image || null);
        setEditingId(item.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: string) => {
        setAchievements(prev => prev.filter(x => x.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setTitle('');
            setYear('');
            setPreview(null);
        }
    };

    const handleSaveAndNext = () => {
        console.log('Saving Achievements:', achievements);
        onNext();
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Awards & Achievements</h2>
                    <p className="text-sm text-gray-500">Showcase your clinic's recognition.</p>
                </div>
            </div>

            {/* ADD / EDIT FORM */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 mb-8 shadow-sm">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                    {editingId ? 'Edit Achievement' : 'Add New Achievement'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* LEFT: Inputs */}
                    <div className="md:col-span-8 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Achievement Title <span className="text-orange-500">*</span>
                            </label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Best Dental Clinic 2023"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                Year Received
                            </label>
                            <input
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                placeholder="e.g. 2023"
                                className="w-full md:w-1/3 rounded-xl border border-gray-200 px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            />
                        </div>
                    </div>

                    {/* RIGHT: Upload */}
                    <div className="md:col-span-4">
                        <label className="text-sm font-medium text-gray-700 block mb-1">
                            Certificate Image (Optional)
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {preview ? (
                            <div className="relative rounded-xl border border-gray-200 overflow-hidden h-32 bg-gray-50 flex items-center justify-center group">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-full w-full object-contain"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-1.5 bg-white rounded-lg text-gray-700 hover:text-orange-600"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setPreview(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="p-1.5 bg-white rounded-lg text-gray-700 hover:text-orange-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition group text-center p-2"
                            >
                                <Upload className="mb-2 text-gray-400 group-hover:text-orange-500 transition" />
                                <span className="text-xs text-gray-500 group-hover:text-orange-600 font-medium">Click to upload image</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100 gap-3">
                    {editingId && (
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setTitle('');
                                setYear('');
                                setPreview(null);
                            }}
                            className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSaveItem}
                        className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    >
                        {editingId ? <><Check size={16} /> Update</> : <><Upload size={16} /> Add to List</>}
                    </button>
                </div>
            </div>

            {/* ACHIEVEMENTS LIST */}
            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-6 min-h-[200px]">
                <h3 className="font-bold text-gray-800 mb-4">Added Achievements ({achievements.length})</h3>

                {achievements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <Trophy className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">No achievements added yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map(a => (
                            <div
                                key={a.id}
                                className={`flex items-center gap-4 bg-white p-4 rounded-xl border transition group
                                    ${editingId === a.id ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-300'}
                                `}
                            >
                                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                    {a.image ? (
                                        <img src={a.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <Trophy className="w-5 h-5 text-yellow-600" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 truncate" title={a.title}>{a.title}</p>
                                    {a.year && (
                                        <p className="text-xs text-gray-500 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">
                                            {a.year}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => startEdit(a)}
                                        disabled={!!editingId}
                                        className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-500 transition disabled:opacity-30"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(a.id)}
                                        className="p-2 hover:bg-orange-50 rounded-lg text-gray-400 hover:text-orange-500 transition"
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