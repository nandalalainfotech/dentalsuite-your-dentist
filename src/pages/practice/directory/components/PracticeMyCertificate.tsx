/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Edit2, FileText, Check, Loader2, Award } from 'lucide-react';
import toast from "react-hot-toast";

// 1. Redux Imports
import { useAppDispatch } from '../../../../store/hooks';
import { updateDirectoryCertifications } from '../../../../features/directory/directory.slice';
import type { DirectoryProfile } from '../../../../features/directory/directory.types';

interface Certificate {
    id?: string;
    name: string;
    img: string; // Base64 or URL
}

export default function PracticeMyCertificate({ clinicData, onNext }: { clinicData: DirectoryProfile, onNext: () => void }) {
    const dispatch = useAppDispatch();

    // --- State ---
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [newCertName, setNewCertName] = useState('');
    const [newCertImage, setNewCertImage] = useState<string | null>(null);
    const [, setNewCertFile] = useState<File | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    
    // Validation State
    const [errors, setErrors] = useState({ name: false, image: false });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Populate data directly from Hasura DB array
    useEffect(() => {
        if (!clinicData?.practice_certifications) {
            setCertificates([]);
            return;
        }

        const formattedCerts = clinicData.practice_certifications.map((c: any, index: number) => ({
            id: c.id || index.toString(),
            name: c.title || "Untitled",
            img: c.image_url || "",
        }));

        setCertificates(formattedCerts);
    }, [clinicData]);

    // --- Handlers ---

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setNewCertFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setNewCertImage(reader.result as string); // Save as Base64 string for DB
            setErrors(prev => ({ ...prev, image: false }));
        };
        reader.readAsDataURL(file);
    };

    const handleAddOrUpdate = () => {
        const newErrors = {
            name: !newCertName?.trim(),
            image: !newCertImage
        };
        setErrors(newErrors);

        if (newErrors.name || newErrors.image) {
            toast.error("Please fill in all required fields");
            return;
        }

        const newCert = {
            name: newCertName,
            img: newCertImage as string
        };

        if (editingIndex !== null) {
            setCertificates(prev =>
                prev.map((cert, i) => i === editingIndex ? { ...cert, ...newCert } : cert)
            );
            toast.success("Certificate updated");
            setEditingIndex(null);
        } else {
            setCertificates(prev => [...prev, newCert]);
            toast.success("Certificate added");
        }

        resetForm();
    };

    const handleEdit = (index: number) => {
        const cert = certificates[index];
        setNewCertName(cert.name);
        setNewCertImage(cert.img);
        setEditingIndex(index);
        
        // Scroll to form
        document.getElementById('cert-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleDelete = (index: number) => {
        setCertificates(prev => prev.filter((_, i) => i !== index));
        if (editingIndex === index) resetForm();
        toast.success("Certificate removed");
    };

    const resetForm = () => {
        setNewCertName('');
        setNewCertImage(null);
        setNewCertFile(null);
        setEditingIndex(null);
        setErrors({ name: false, image: false });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSaveAndNext = async () => {
        if (certificates.length === 0) {
            toast.error("Please add at least one certificate");
            return;
        }

        const newErrors = {
            name: !newCertName?.trim(),
            image: !newCertImage && editingIndex !== null ? false : !newCertImage
        };

        if (editingIndex !== null) {
             setErrors(newErrors);
            if (newErrors.name) {
                toast.error("Certificate name is required");
                 return;
            }
        }

        setIsSaving(true);

        try {
            // Map local state to DB snake_case fields
            const dbCertificates = certificates.map(c => ({
                title: c.name,
                image_url: c.img
            }));

            // Dispatch to Hasura
            await dispatch(updateDirectoryCertifications({
                practiceId: clinicData.id,
                certifications: dbCertificates
            })).unwrap();

            toast.success("Certificates saved successfully!");
            onNext();
        } catch (error: any) {
            console.error("Failed to save certificates:", error);
            toast.error(error.message || "Failed to save certificates");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">

            {/* Header */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <Award className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
                    <p className="text-gray-500 text-sm mt-1">Upload your medical board registrations, licenses, or awards.</p>
                </div>
            </div>

            {/* Editor Form */}
            <div id="cert-form" className="bg-gray-50/50 border border-gray-200 rounded-xl p-6 mb-8 focus-within:ring-1 focus-within:ring-orange-200 transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        {editingIndex !== null ? 'Editing Certificate' : 'Add New Certificate'}
                    </h3>
                    {editingIndex !== null && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                            Editing Mode
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* LEFT: Name Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Certificate Name<span className="text-orange-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={newCertName}
                                onChange={(e) => {
                                    setNewCertName(e.target.value);
                                    if(e.target.value) setErrors(p => ({...p, name: false}));
                                }}
                                placeholder="e.g. Medical Board Registration"
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition
                                    ${errors.name
                                        ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50"
                                        : "border-gray-200 bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                    }`
                                }
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">Name is required</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleAddOrUpdate}
                                className="flex-1 bg-gray-900 text-white hover:bg-black px-6 py-3 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
                            >
                                {editingIndex !== null ? (
                                    <><Check className="w-4 h-4" /> Update Certificate</>
                                ) : (
                                    <><FileText className="w-4 h-4" /> Add to List</>
                                )}
                            </button>

                            {editingIndex !== null && (
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
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        {!newCertImage ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`h-[140px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition bg-white
                                    ${errors.image
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-200 hover:border-orange-300 hover:bg-gray-50/10"
                                    } group`
                                }
                            >
                                <div className="w-10 h-10 bg-gray-100 text-gray-400 group-hover:text-orange-500 rounded-full flex items-center justify-center mb-2 transition shadow-sm">
                                    <Upload className="w-5 h-5 transition" />
                                </div>
                                <p className="text-sm font-medium text-gray-600 group-hover:text-orange-500">Click to upload</p>
                                <p className="text-xs text-gray-400 mt-1">JPG or PNG</p>
                            </div>
                        ) : (
                            <div className="relative h-[140px] rounded-xl border border-gray-200 bg-white overflow-hidden group shadow-sm">
                                <img
                                    src={newCertImage}
                                    alt="Preview"
                                    className="w-full h-full object-contain p-2"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-lg transition border border-white/20"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setNewCertImage(null);
                                            setNewCertFile(null);
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

            {/* LIST AREA */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    Your Certificates <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{certificates.length}</span>
                </h3>

                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certificates.map((cert, index) => (
                            <div
                                key={index}
                                className={`
                                    relative p-4 rounded-xl border transition-all duration-200 bg-white flex items-center gap-4 group
                                    ${editingIndex === index 
                                        ? 'border-orange-500 ring-2 ring-orange-100 shadow-md' 
                                        : 'border-gray-200 hover:border-orange-200 hover:shadow-md'
                                    }
                                `}
                            >
                                {/* Thumbnail */}
                                <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                                    <img
                                        src={cert.img}
                                        alt={cert.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Text Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate pr-4">{cert.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Verified Document</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(index)}
                                        disabled={editingIndex !== null}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-30"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                        <FileText className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium text-sm">No certificates added yet.</p>
                        <p className="text-gray-400 text-xs">Use the form above to add your first certificate.</p>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
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

// Helper component for icon
function Trash2({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
        </svg>
    );
}