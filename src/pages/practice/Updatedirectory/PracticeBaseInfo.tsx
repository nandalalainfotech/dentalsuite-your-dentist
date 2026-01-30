import React, { useState } from 'react';
import {
    X, ChevronUp, CloudUpload,
    Bold, Italic, Underline, List, AlignLeft,
    AlignCenter, AlignRight, Link as LinkIcon,
    Image as Undo, Redo
} from 'lucide-react';
import type { Clinic } from '../../../types/clinic';

interface PracticeFormData {
    professionType: string;
    companyName: string;
    email: string;
    abnNumber: string;
    contactName: string;
    address: string;
    phoneNumber: string;
    altPhoneNumber: string;
    bannerImage: string;
    logo: string;
    description: string;
}

// 1. Add onNext to props here
export default function PracticeBaseInfo({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    const [formData, setFormData] = useState<PracticeFormData>({
        professionType: 'Dental Specialist Practice',
        companyName: clinicData.name || '',
        email: clinicData.email || '',
        abnNumber: '',
        contactName: '',
        address: clinicData.address || '',
        phoneNumber: clinicData.phone || '',
        altPhoneNumber: '',
        bannerImage: '',
        logo: clinicData.logo || '',
        description: clinicData.description || ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (field: keyof PracticeFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (field: 'logo' | 'bannerImage', event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => handleInputChange(field, reader.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = (field: 'logo' | 'bannerImage') => {
        handleInputChange(field, '');
    };

    const handleSave = () => {
        console.log("Saving data:", formData);
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            onNext();
        }, 500);
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-orange-500">Basic Info</h2>
                <ChevronUp className="w-6 h-6 text-gray-400 cursor-pointer" />
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <FormInput
                    label="Profession Type"
                    required
                    isSelect
                    value={formData.professionType}
                    onChange={(val) => handleInputChange('professionType', val)}
                    options={['Dental Specialist Practice', 'General Dentistry', 'Orthodontics']}
                />
                <FormInput
                    label="Company Name"
                    required
                    value={formData.companyName}
                    placeholder="Practice Your dentist"
                    onChange={(val) => handleInputChange('companyName', val)}
                />
                <FormInput
                    label="Email ID"
                    required
                    value={formData.email}
                    placeholder="example@yopmail.com"
                    onChange={(val) => handleInputChange('email', val)}
                />
                <FormInput
                    label="ABN/ACN Number"
                    required
                    value={formData.abnNumber}
                    placeholder="11 digits ABN/ACN Number"
                    onChange={(val) => handleInputChange('abnNumber', val)}
                />
                <FormInput
                    label="Name"
                    required
                    value={formData.contactName}
                    placeholder="Enter your name"
                    onChange={(val) => handleInputChange('contactName', val)}
                />
                <FormInput
                    label="Address"
                    required
                    value={formData.address}
                    placeholder="Enter Your Address"
                    onChange={(val) => handleInputChange('address', val)}
                />
                <FormInput
                    label="Phone Number"
                    required
                    value={formData.phoneNumber}
                    placeholder="Enter Your Mobile number"
                    onChange={(val) => handleInputChange('phoneNumber', val)}
                />
                <FormInput
                    label="Alternate Phone Number"
                    value={formData.altPhoneNumber}
                    placeholder="Enter Alternate Phone Number"
                    onChange={(val) => handleInputChange('altPhoneNumber', val)}
                />
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <ImageUploader
                    label="Banner Image"
                    required
                    image={formData.bannerImage}
                    onUpload={(e) => handleImageUpload('bannerImage', e)}
                    onRemove={() => removeImage('bannerImage')}
                    id="banner-upload"
                />
                <ImageUploader
                    label="Logo"
                    required
                    image={formData.logo}
                    onUpload={(e) => handleImageUpload('logo', e)}
                    onRemove={() => removeImage('logo')}
                    id="logo-upload"
                />
            </div>

            {/* Description (Rich Text Editor Mock) */}
            <div className="mb-10">
                <label className="block text-sm text-gray-600 mb-2">
                    Description <span className="text-orange-500">*</span>
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                        <ToolbarBtn icon={<Undo size={14} />} />
                        <ToolbarBtn icon={<Redo size={14} />} />
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        <ToolbarBtn icon={<Bold size={14} />} />
                        <ToolbarBtn icon={<Italic size={14} />} />
                        <ToolbarBtn icon={<Underline size={14} />} />
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        <ToolbarBtn icon={<AlignLeft size={14} />} />
                        <ToolbarBtn icon={<AlignCenter size={14} />} />
                        <ToolbarBtn icon={<AlignRight size={14} />} />
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        <ToolbarBtn icon={<List size={14} />} />
                        <ToolbarBtn icon={<LinkIcon size={14} />} />
                    </div>
                    <textarea
                        rows={6}
                        className="w-full p-4 outline-none text-gray-700 resize-y"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Start typing here..."
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button
                    type="button"
                    onClick={onNext} // Allows skipping to next
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition"
                >
                    Skip
                </button>

                {/* 3. Attach the save handler */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save & Next'}
                </button>
            </div>
        </div>
    );
}

function FormInput({
    label, required, value, onChange, placeholder, isSelect, options
}: {
    label: string, required?: boolean, value: string, onChange: (v: string) => void, placeholder?: string, isSelect?: boolean, options?: string[]
}) {
    return (
        <div className="w-full">
            <label className="block text-sm text-gray-600 mb-2">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            {isSelect ? (
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none transition"
                    >
                        {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                        <ChevronUp className="w-4 h-4 rotate-180" />
                    </div>
                </div>
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                />
            )}
        </div>
    );
}

function ImageUploader({
    label, required, image, onUpload, onRemove, id
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    label: string, required?: boolean, image: string, onUpload: (e: any) => void, onRemove: () => void, id: string
}) {
    return (
        <div>
            <label className="block text-sm text-gray-600 mb-2">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-white flex flex-col items-center justify-center text-center hover:bg-gray-50 transition relative">
                <input
                    type="file"
                    id={id}
                    className="hidden"
                    accept="image/*"
                    onChange={onUpload}
                />
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
                    <CloudUpload className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">Choose a file or drag & drop it here.</h3>
                <p className="text-xs text-gray-400 mb-4">JPEG, PNG formats, up to 5 MB</p>
                <button
                    onClick={() => document.getElementById(id)?.click()}
                    className="px-4 py-2 border border-orange-400 text-orange-500 text-sm font-medium rounded-lg hover:bg-orange-50 transition"
                >
                    Browse File
                </button>
            </div>
            {image && (
                <div className="mt-4 relative inline-block group">
                    <img
                        src={image}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                        onClick={onRemove}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-100 hover:text-orange-500 transition"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    );
}

function ToolbarBtn({ icon }: { icon: React.ReactNode }) {
    return (
        <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition">
            {icon}
        </button>
    );
}