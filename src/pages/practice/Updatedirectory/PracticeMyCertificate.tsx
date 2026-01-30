import { useState, useEffect, useRef } from 'react';
import { Upload, X, Edit2, FileText, Check } from 'lucide-react';
import type { Clinic } from '../../../types';

interface Certificate {
    name: string;
    img: string;
}

// Added onNext to props
export default function PracticeMyCertificate({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    // Form State
    const [newCertName, setNewCertName] = useState('');
    const [newCertImage, setNewCertImage] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Load initial data
    useEffect(() => {
        if (clinicData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const typedClinic = clinicData as any;
            const incomingData = typedClinic.certificate ?? typedClinic.certificates;

            if (Array.isArray(incomingData) && incomingData.length > 0 && certificates.length === 0) {
                setCertificates(incomingData);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clinicData]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setNewCertImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleAddOrUpdate = () => {
        if (!newCertName || !newCertImage) {
            alert('Please provide both a name and an image.');
            return;
        }

        if (editingIndex !== null) {
            setCertificates(prev =>
                prev.map((cert, i) =>
                    i === editingIndex
                        ? { name: newCertName, img: newCertImage }
                        : cert
                )
            );
            setEditingIndex(null);
        } else {
            setCertificates(prev => [
                ...prev,
                { name: newCertName, img: newCertImage }
            ]);
        }

        resetForm();
    };

    const handleEdit = (index: number) => {
        const cert = certificates[index];
        setNewCertName(cert.name);
        setNewCertImage(cert.img);
        setEditingIndex(index);
        // Scroll to top to see form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (index: number) => {
        setCertificates(prev => prev.filter((_, i) => i !== index));
        if (editingIndex === index) {
            resetForm();
        }
    };

    const resetForm = () => {
        setNewCertName('');
        setNewCertImage(null);
        setEditingIndex(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSaveAndNext = () => {
        console.log('Saving certificates:', certificates);
        onNext();
    };

    return (
        <div className="w-full space-y-6">

            {/* ADD / EDIT FORM */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {editingIndex !== null ? 'Edit Certificate' : 'Add Certificate'}
                        </h2>
                        <p className="text-sm text-gray-500">Upload medical registrations or licenses.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT: Name Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Certificate Name
                            </label>
                            <input
                                type="text"
                                value={newCertName}
                                onChange={(e) => setNewCertName(e.target.value)}
                                placeholder="e.g. Medical Board Registration"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleAddOrUpdate}
                                className="flex-1 bg-gray-900 text-white hover:bg-black px-6 py-3 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
                            >
                                {editingIndex !== null ? (
                                    <><Check className="w-4 h-4" /> Update</>
                                ) : (
                                    <><FileText className="w-4 h-4" /> Add to List</>
                                )}
                            </button>

                            {editingIndex !== null && (
                                <button
                                    onClick={resetForm}
                                    className="px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Image Upload */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Attachment (Image)
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        {!newCertImage ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-[140px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition group"
                            >
                                <div className="w-10 h-10 bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 rounded-full flex items-center justify-center mb-2 transition">
                                    <Upload size={20} />
                                </div>
                                <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Click to upload</p>
                                <p className="text-xs text-gray-400 mt-1">JPG or PNG</p>
                            </div>
                        ) : (
                            <div className="relative h-[140px] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden group">
                                <img
                                    src={newCertImage}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-lg"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setNewCertImage(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="bg-orange-500/80 backdrop-blur-sm hover:bg-orange-600 text-white p-2 rounded-lg"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CERTIFICATE LIST */}
            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-gray-800 font-bold mb-4">
                    Uploaded Certificates ({certificates.length})
                </h3>

                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certificates.map((cert, index) => (
                            <div
                                key={index}
                                className={`bg-white p-4 rounded-xl border shadow-sm flex items-center gap-4 transition
                                    ${editingIndex === index ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-200'}
                                `}
                            >
                                <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                    <img
                                        src={cert.img}
                                        alt={cert.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">{cert.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Image File</p>
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(index)}
                                        disabled={editingIndex !== null}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-30"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No certificates added yet.</p>
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
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