/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks'; // Import Redux Hook
import { usePracticeAuth } from '../../hooks/usePracticeAuth'; // Keep for update logic
import { User, Mail, Phone, MapPin, Building, FileText } from 'lucide-react';
import type { Practice } from '../../types/auth';

// --- Reusable UI Components ---

const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-6 border-b border-gray-100 pb-2">
        <h3 className="text-lg font-bold leading-6 text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
);

const Label = ({ children, required, htmlFor }: { children: React.ReactNode; required?: boolean; htmlFor?: string }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
        {children} {required && <span className="text-red-500">*</span>}
    </label>
);

const Input = ({ icon, textarea = false, className = "", id, ...props }: any) => {
    const baseClasses = "block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 px-3 border transition-all duration-200";

    return (
        <div className="relative">
            {textarea ? (
                <textarea id={id} className={`${baseClasses} ${className}`} rows={3} {...props} />
            ) : (
                <div className="relative">
                    <input id={id} className={`${baseClasses} ${icon ? 'pl-10' : ''} ${className}`} {...props} />
                    {icon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            {icon}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <div className="relative">
        <select
            className="block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 px-3 border transition-all duration-200 appearance-none"
            {...props}
        >
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
        </div>
    </div>
);

// --- Main Component ---

const PractiveViewProfile = () => {
    // 1. Get Data from Redux (Matches Dashboard Logic)
    const user = useAppSelector((state) => state.user.auth.user);
    const practice = user as Practice | null;
    

    // 2. Auth Hook for Update Actions
    const { updateProfile } = usePracticeAuth();

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Form State
    const [form, setForm] = useState({
        businessName: '',
        abnAcn: '',
        businessType: 'general_dentistry',
        email: '',
        phone: '',
        firstName: '',
        middleName: '',
        lastName: '',
        faxNumber: '',
        altPhone: '',
        altEmail: '',
        address: '',
        address1: '',
        address2: '',
        landmark: '',
        city: '',
        state: 'NSW',
        postCode: '',
        country: 'Australia',
    });

    // Sync Form with Redux Data
    useEffect(() => {
        if (practice) {
            setForm({
                businessName: practice.business_name || practice.practiceName || '', 
                abnAcn: practice.abnNumber || '',
                businessType: practice.practiceType || 'general_dentistry',
                email: practice.email || '',
                phone: practice.phone || '',
                firstName: practice.firstName || '',
                middleName: '',
                lastName: practice.lastName || '',
                faxNumber: '',
                altPhone: practice.mobileNumber || '',
                altEmail: '',
                address: practice.address || '',
                address1: '',
                address2: '',
                landmark: '',
                city: practice.city || '',
                state: practice.practiceState || 'NSW',
                postCode: practice.practicePostcode || '',
                country: 'Australia',
            });
            if (practice.practiceLogo) {
                setLogoPreview(practice.practiceLogo);
            }
        }
    }, [practice]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            if (evt.target?.result && typeof evt.target.result === 'string') {
                setLogoPreview(evt.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateProfile({
                practiceName: form.businessName,
                abnNumber: form.abnAcn,
                practiceType: form.businessType as any,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                mobileNumber: form.altPhone,
                phone: form.phone,
                address: form.address,
                city: form.city,
                practiceState: form.state as any,
                practicePostcode: form.postCode,
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            
            {/* Page Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Practice Profile</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your practice details and contact information.</p>
                </div>
                <button
                    type="button"
                    className="inline-flex justify-center items-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
                    onClick={() => alert("Contact support to delete account")}
                >
                    Request Account Deletion
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* --- Section 1: Identity & Logo --- */}
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Logo Upload */}
                        <div className="col-span-1">
                            <Label>Business Logo</Label>
                            <div className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-6 py-8 hover:bg-gray-50 transition-colors bg-white">
                                {logoPreview ? (
                                    <div className="relative h-32 w-32 mb-4 overflow-hidden rounded-full ring-4 ring-gray-100 shadow-sm">
                                        <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                                        <User size={48} />
                                    </div>
                                )}
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md font-semibold text-orange-600 hover:text-orange-500 focus-within:outline-none"
                                >
                                    <span>Upload new logo</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                            </div>
                        </div>

                        {/* Basic Details */}
                        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <Label required htmlFor="businessName">Business Name</Label>
                                <Input
                                    id="businessName"
                                    name="businessName"
                                    value={form.businessName}
                                    onChange={handleChange}
                                    placeholder="e.g. Sydney Dental Care"
                                    icon={<Building size={18} />}
                                />
                            </div>

                            <div>
                                <Label required htmlFor="abnAcn">ABN / ACN</Label>
                                <Input
                                    id="abnAcn"
                                    name="abnAcn"
                                    value={form.abnAcn}
                                    onChange={handleChange}
                                    placeholder="12 345 678 901"
                                    icon={<FileText size={18} />}
                                />
                            </div>

                            <div>
                                <Label htmlFor="businessType">Business Type</Label>
                                <Select
                                    id="businessType"
                                    name="businessType"
                                    value={form.businessType}
                                    onChange={handleChange}
                                >
                                    <option value="general_dentistry">Dental Practices</option>
                                    <option value="general_practice">General Practice</option>
                                    <option value="allied_health">Allied Health</option>
                                    <option value="specialist">Specialist Clinic</option>
                                </Select>
                            </div>

                            <div>
                                <Label required htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    icon={<Mail size={18} />}
                                />
                            </div>

                            <div>
                                <Label required htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    icon={<Phone size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* --- Section 2: Contact Information --- */}
                <div>
                    <SectionHeader title="Contact Information" description="Address and secondary contact details." />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <Label required htmlFor="firstName">First Name</Label>
                            <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input id="middleName" name="middleName" value={form.middleName} onChange={handleChange} />
                        </div>
                        <div>
                            <Label required htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <Label required htmlFor="address">Full Address</Label>
                            <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="Search address..." icon={<MapPin size={18} />} />
                        </div>

                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" value={form.city} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="state">State</Label>
                            <Select id="state" name="state" value={form.state} onChange={handleChange}>
                                <option>NSW</option>
                                <option>VIC</option>
                                <option>QLD</option>
                                <option>SA</option>
                                <option>WA</option>
                                <option>TAS</option>
                                <option>NT</option>
                                <option>ACT</option>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="postCode">Post Code</Label>
                            <Input id="postCode" name="postCode" value={form.postCode} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* --- Form Actions --- */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PractiveViewProfile;