/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import {
    X, CloudUpload,
    Bold, Italic, Underline, List, AlignLeft,
    AlignCenter, AlignRight, Link as LinkIcon,
    Undo, Redo, Info, Edit2, Phone, Mail, MapPin, Building,
    Loader2
} from 'lucide-react';
import toast from "react-hot-toast";

import { useAppDispatch } from '../../../../store/hooks';
import { updateDirectoryInfo } from '../../../../features/directory/directory.slice';
import type { DirectoryProfile } from '../../../../features/directory/directory.types';

interface PracticeFormData {
    profession_type: string;
    practice_name: string; // Single Source of Truth
    name: string; 
    email: string;
    abn_acn: string;
    address: string;
    phoneNumber: string;
    altPhoneNumber: string;
    banner: string | null;
    logo: string | null;
    description: string;
}

export default function PracticeBaseInfo({ clinicData, onNext }: { clinicData: DirectoryProfile, onNext: () => void }) {
    const dispatch = useAppDispatch();
    
    // File state for preview logic
    const [, setLogoFile] = useState<File | null>(null);
    const [, setBannerFile] = useState<File | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<PracticeFormData>({
        profession_type: '', 
        practice_name: '',
        name: '',
        email: '',
        abn_acn: '',
        address: '',
        phoneNumber: '',
        altPhoneNumber: '',
        banner: null,
        logo: null,
        description: '',
    });

    useEffect(() => {
        if (clinicData) {
            // Combine First/Last name for the single input field
            const fullName = [clinicData.first_name, clinicData.last_name].filter(Boolean).join(' ');

            setFormData({
                // --- Core Info (Parent Table) ---
                profession_type: clinicData.practice_type || '', 
                email: clinicData.email || '',
                abn_acn: clinicData.abn_number || '', 
                address: clinicData.address || '', 
                phoneNumber: clinicData.practice_phone || '', 
                altPhoneNumber: clinicData.mobile || '', 
                practice_name: clinicData.practice_name || '', // Correctly reading from Parent
                logo: clinicData.logo || null,                 // Correctly reading from Parent

                // --- Base Info (Child Table) ---
                description: clinicData.description || '',
                banner: clinicData.banner_image || null,
                
                // Calculated
                name: fullName,
            });
        }
    }, [clinicData]);

    const handleInputChange = (field: keyof PracticeFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Image Handlers
    const handleImageUpload = (field: 'logo' | 'banner', event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (field === 'logo') setLogoFile(file);
        if (field === 'banner') setBannerFile(file);

        const reader = new FileReader();
        reader.onload = () => handleInputChange(field, reader.result as string); // Convert to Base64
        reader.readAsDataURL(file);
    };

    const removeImage = (field: 'logo' | 'banner') => {
        if (field === 'logo') setLogoFile(null);
        if (field === 'banner') setBannerFile(null);
        // @ts-ignore
        handleInputChange(field, null); 
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Logic: Split "Contact Person Name" back into first and last name for DB
            const nameParts = formData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Construct Payload
            await dispatch(updateDirectoryInfo({
                id: clinicData.id,
                data: {
                    // --- DESTINATION: Parent Table (practice_info) ---
                    practice_name: formData.practice_name, // Name is now only here
                    logo: formData.logo,                   // Logo is now only here
                    practice_type: formData.profession_type,
                    first_name: firstName,
                    last_name: lastName,
                    email: formData.email,
                    abn_number: formData.abn_acn,
                    address: formData.address,
                    practice_phone: formData.phoneNumber,
                    mobile: formData.altPhoneNumber,

                    // --- DESTINATION: Child Table (practice_base_info) ---
                    formatted_address: formData.address, // Syncing address to child for display convenience
                    description: formData.description,
                    banner_image: formData.banner  
                }
            })).unwrap();

            toast.success("Profile updated successfully!");
            onNext();
        } catch (error: any) {
            console.error("Save failed:", error);
            toast.error(error.message || "Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Header Section */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <Info className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your practice's core identity, contact details, and branding.</p>
                </div>
            </div>

            {/* Main Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <FormInput
                    label="Profession Type"
                    value={formData.profession_type}
                    onChange={(val: string) => handleInputChange('profession_type', val)}
                    icon={<Building size={16} />}
                />
                <FormInput
                    label="Company Name"
                    required
                    value={formData.practice_name}
                    placeholder="e.g. City Dental Care"
                    onChange={(val: string) => handleInputChange('practice_name', val)}
                />
                <FormInput
                    label="Email Address"
                    required
                    value={formData.email}
                    placeholder="admin@clinic.com"
                    onChange={(val: string) => handleInputChange('email', val)}
                    icon={<Mail size={16} />}
                />
                <FormInput
                    label="ABN/ACN Number"
                    required
                    value={formData.abn_acn}
                    placeholder="11 digits"
                    onChange={(val: string) => handleInputChange('abn_acn', val)}
                />
                <FormInput
                    label="Contact Person Name"
                    required
                    value={formData.name}
                    placeholder="Full Name"
                    onChange={(val: string) => handleInputChange('name', val)}
                />
                <FormInput
                    label="Address"
                    required
                    value={formData.address}
                    placeholder="Full Street Address"
                    onChange={(val: string) => handleInputChange('address', val)}
                    icon={<MapPin size={16} />}
                />
                <FormInput
                    label="Phone Number"
                    required
                    value={formData.phoneNumber}
                    placeholder="+61 ..."
                    onChange={(val: string) => handleInputChange('phoneNumber', val)}
                    icon={<Phone size={16} />}
                />
                <FormInput
                    label="Alt. Phone Number (Mobile)"
                    value={formData.altPhoneNumber}
                    placeholder="(Optional)"
                    onChange={(val: string) => handleInputChange('altPhoneNumber', val)}
                />
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <ModernImageUploader
                    label="Clinic Logo"
                    required
                    image={formData.logo}
                    onUpload={(e: any) => handleImageUpload('logo', e)}
                    onRemove={() => removeImage('logo')}
                />
                <ModernImageUploader
                    label="Banner Image"
                    required
                    image={formData.banner}
                    onUpload={(e: any) => handleImageUpload('banner', e)}
                    onRemove={() => removeImage('banner')}
                />
            </div>

            {/* Description Editor */}
            <div className="mb-10">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    About the Practice <span className="text-orange-500">*</span>
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500 transition shadow-sm">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                        <ToolbarBtn icon={<Undo size={15} />} />
                        <ToolbarBtn icon={<Redo size={15} />} />
                        <div className="w-px h-5 bg-gray-300 mx-2 self-center" />
                        <ToolbarBtn icon={<Bold size={15} />} />
                        <ToolbarBtn icon={<Italic size={15} />} />
                        <ToolbarBtn icon={<Underline size={15} />} />
                        <div className="w-px h-5 bg-gray-300 mx-2 self-center" />
                        <ToolbarBtn icon={<AlignLeft size={15} />} />
                        <ToolbarBtn icon={<AlignCenter size={15} />} />
                        <ToolbarBtn icon={<AlignRight size={15} />} />
                        <div className="w-px h-5 bg-gray-300 mx-2 self-center" />
                        <ToolbarBtn icon={<List size={15} />} />
                        <ToolbarBtn icon={<LinkIcon size={15} />} />
                    </div>
                    <textarea
                        rows={6}
                        className="w-full p-4 outline-none text-gray-700 resize-y text-sm leading-relaxed"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Write a brief description about your clinic's history, values, and mission..."
                    />
                </div>
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
                    onClick={handleSave}
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

// --- SUB COMPONENTS ---

function FormInput({
    label, required, value, onChange, placeholder, icon
}: {
    label: string, required?: boolean, value: string, onChange: (v: string) => void, placeholder?: string, icon?: React.ReactNode
}) {
    return (
        <div className="w-full space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>{label} {required && <span className="text-orange-500">*</span>}</span>
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition shadow-sm bg-gray-50/30 focus:bg-white`}
                />
            </div>
        </div>
    );
}

function ModernImageUploader({
    label, required, image, onUpload, onRemove,
}: {
    label: string, required?: boolean, image: any, onUpload: (e: any) => void, onRemove: () => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const Image = typeof image === 'string' ? image : image?.url;

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-orange-500">*</span>}
                </label>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onUpload}
            />

            {!Image ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[160px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 transition group bg-gray-50/50 hover:bg-orange-50/10"
                >
                    <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 group-hover:border-orange-200 group-hover:text-orange-500 rounded-full flex items-center justify-center mb-3 transition">
                        <CloudUpload className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG (Max 5MB)</p>
                </div>
            ) : (
                <div className="relative h-[160px] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden group">
                    <img
                        src={Image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2.5 rounded-lg transition border border-white/20"
                            title="Change Image"
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="bg-red-500/80 backdrop-blur-md hover:bg-red-600 text-white p-2.5 rounded-lg transition border border-white/20"
                            title="Remove Image"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ToolbarBtn({ icon }: { icon: React.ReactNode }) {
    return (
        <button type="button" className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition">
            {icon}
        </button>
    );
}