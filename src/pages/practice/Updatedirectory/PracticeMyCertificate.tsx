import { useState, useEffect, useRef } from 'react';
import { Upload, X, Save, Edit2 } from 'lucide-react';
import type { Clinic } from '../../../types';

interface Certificate {
    name: string;
    img: string;
}

export default function PracticeMyCertificate({ clinicData }: { clinicData: Clinic }) {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [newCertName, setNewCertName] = useState('');
    const [newCertImage, setNewCertImage] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!hasChanges && clinicData) {
            console.log("clinicData=============>", clinicData);

            const typedClinic = clinicData as { certificate?: Certificate[]; certificates?: Certificate[] };
            const incomingData = typedClinic.certificate ?? typedClinic.certificates;

            if (Array.isArray(incomingData)) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCertificates(incomingData);
            }
        }
    }, [clinicData, hasChanges]);

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

        setHasChanges(true);
        resetForm();
    };

    const handleEdit = (index: number) => {
        const cert = certificates[index];
        setNewCertName(cert.name);
        setNewCertImage(cert.img);
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        setCertificates(prev => prev.filter((_, i) => i !== index));
        setHasChanges(true);

        if (editingIndex === index) {
            resetForm();
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        setHasChanges(false);
        setIsSaving(false);
    };

    const resetForm = () => {
        setNewCertName('');
        setNewCertImage(null);
        setEditingIndex(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your clinic's awards and accreditations.
                    </p>
                </div>

                {hasChanges && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>

            {/* ADD / EDIT FORM */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    {editingIndex !== null ? 'Edit Certificate' : 'Add New Certificate'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* NAME */}
                    <div className="md:col-span-7 space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
                            Certificate Name
                        </label>
                        <input
                            type="text"
                            value={newCertName}
                            onChange={(e) => setNewCertName(e.target.value)}
                            placeholder="e.g. ISO 9001 Certified"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                        />
                    </div>

                    {/* IMAGE */}
                    <div className="md:col-span-5 space-y-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                            Attachment
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        {/* UPLOAD BOX (ALWAYS VISIBLE) */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-[120px] border-2 border-dashed rounded-xl flex items-center justify-between px-6 cursor-pointer hover:border-orange-400 transition bg-gray-50"
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    Choose an image or drag & drop it here.
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    JPG, PNG (Max 5MB)
                                </p>
                            </div>

                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Upload className="text-orange-500" size={18} />
                            </div>
                        </div>

                        {/* PREVIEW AT BOTTOM */}
                        {newCertImage && (
                            <div className="relative w-[140px] h-[100px] rounded-xl border bg-white shadow-sm overflow-hidden">
                                <img
                                    src={newCertImage}
                                    alt="Certificate Preview"
                                    className="w-full h-full object-cover"
                                />

                                {/* REMOVE IMAGE */}
                                <button
                                    onClick={() => {
                                        setNewCertImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-orange-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                <div className="mt-4 flex justify-end gap-3">
                    {editingIndex !== null && (
                        <button
                            onClick={resetForm}
                            className="px-5 py-2.5 rounded-xl text-sm border border-gray-300 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    )}

                    <button
                        onClick={handleAddOrUpdate}
                        className="bg-gray-900 text-white hover:bg-black px-6 py-2.5 rounded-xl text-sm font-medium"
                    >
                        {editingIndex !== null ? 'Update Certificate' : 'Add to List'}
                    </button>
                </div>
            </div>

            {/* LIST */}
            <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase ml-1">
                    Current Certificates ({certificates.length})
                </h3>

                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {certificates.map((cert, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 border overflow-hidden">
                                        <img
                                            src={cert.img}
                                            alt={cert.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) =>
                                            (e.currentTarget.src =
                                                'https://placehold.co/100?text=Error')
                                            }
                                        />
                                    </div>
                                    <span className="font-medium text-sm text-gray-900">
                                        {cert.name}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                        title="Delete"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 text-sm">
                            No certifications added yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
