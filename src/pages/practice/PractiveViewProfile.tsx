/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';

// --- Reusable UI Components (Defined outside to prevent re-renders) ---

const SectionHeader = ({ title, description }: { title: string; description?: string }) => (
    <div className="mb-6 border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
);

const Label = ({ children, required, htmlFor }: { children: React.ReactNode; required?: boolean; htmlFor?: string }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
        {children} {required && <span className="text-red-500">*</span>}
    </label>
);

const Input = ({
    icon,
    textarea = false,
    className = "",
    id,
    ...props
}: {
    icon?: React.ReactNode;
    textarea?: boolean;
    className?: string;
    [key: string]: any;
}) => {
    const baseClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 px-3 border";

    return (
        <div className="relative rounded-md shadow-sm">
            {textarea ? (
                <textarea
                    id={id}
                    className={`${baseClasses} ${className}`}
                    rows={3}
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    className={`${baseClasses} ${icon ? 'pr-10' : ''} ${className}`}
                    {...props}
                />
            )}
            {icon && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                    {icon}
                </div>
            )}
        </div>
    );
};

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 px-3 border bg-white"
        {...props}
    >
        {children}
    </select>
);

const PencilIcon = (
    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

// --- Main Component ---

const PractiveViewProfile = () => {
    const { practice, updateProfile } = usePracticeAuth();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        // Basic Info
        businessName: '',
        abnAcn: '',
        businessType: 'general_dentistry',
        email: '',
        phone: '',
        // Contact Information
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

    useEffect(() => {
        if (practice) {
            setForm({
                businessName: practice.practiceName || '',
                abnAcn: practice.abnNumber || '',
                businessType: practice.practiceType || 'general_dentistry',
                email: practice.email || '',
                phone: practice.practicePhone || '',
                firstName: practice.firstName || '',
                middleName: '',
                lastName: practice.lastName || '',
                faxNumber: '',
                altPhone: practice.mobileNumber || '',
                altEmail: '',
                address: practice.practiceAddress || '',
                address1: '',
                address2: '',
                landmark: '',
                city: practice.practiceCity || '',
                state: practice.practiceState || 'NSW',
                postCode: practice.practicePostcode || '',
                country: 'Australia',
            });
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
        if (!practice) return;

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
                practicePhone: form.phone,
                practiceAddress: form.address,
                practiceCity: form.city,
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

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Deleted! (API integration required)');
        }
    };

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Basic Info
                        </h2>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* --- Basic Info Card --- */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                        <div className="px-4 py-6 sm:p-8">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3">
                                {/* Logo Column */}
                                <div className="col-span-1 flex flex-col items-center lg:items-start">
                                    <Label>Business Logo</Label>
                                    <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6 w-full max-w-xs bg-gray-50">
                                        <div className="text-center">
                                            {logoPreview ? (
                                                <div className="relative h-32 w-32 mx-auto overflow-hidden rounded-full ring-4 ring-white shadow-md">
                                                    <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="mx-auto h-24 w-24 text-gray-300">
                                                    <svg className="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md font-semibold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2 hover:text-orange-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                                                </label>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields Column */}
                                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <Label required htmlFor="businessName">Business Name</Label>
                                        <Input
                                            id="businessName"
                                            name="businessName"
                                            value={form.businessName}
                                            onChange={handleChange}
                                            placeholder="e.g. Sydney Dental Care"
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
                                            icon={PencilIcon}
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
                                            icon={PencilIcon}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Contact Info Card --- */}
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
                        <div className="px-4 py-6 sm:p-8">
                            <SectionHeader
                                title="Contact Information"
                            />

                            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <Label required htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="middleName">Middle Name</Label>
                                    <Input
                                        id="middleName"
                                        name="middleName"
                                        value={form.middleName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label required htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="faxNumber">Fax Number</Label>
                                    <Input
                                        id="faxNumber"
                                        name="faxNumber"
                                        value={form.faxNumber}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="altPhone">Alt. Phone</Label>
                                    <Input
                                        id="altPhone"
                                        name="altPhone"
                                        value={form.altPhone}
                                        onChange={handleChange}
                                        icon={PencilIcon}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="altEmail">Alt. Email</Label>
                                    <Input
                                        id="altEmail"
                                        type="email"
                                        name="altEmail"
                                        value={form.altEmail}
                                        onChange={handleChange}
                                        icon={PencilIcon}
                                    />
                                </div>

                                <div className="sm:col-span-2 lg:col-span-3">
                                    <Label required htmlFor="address">Full Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Search address..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address1">Address Line 1</Label>
                                    <Input
                                        id="address1"
                                        name="address1"
                                        value={form.address1}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="address2">Address Line 2</Label>
                                    <Input
                                        id="address2"
                                        name="address2"
                                        value={form.address2}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="landmark">Landmark</Label>
                                    <Input
                                        id="landmark"
                                        name="landmark"
                                        value={form.landmark}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Select
                                        id="state"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                    >
                                        <option>New South Wales</option>
                                        <option>Victoria</option>
                                        <option>Queensland</option>
                                        <option>South Australia</option>
                                        <option>Western Australia</option>
                                        <option>Tasmania</option>
                                        <option>Northern Territory</option>
                                        <option>Australian Capital Territory</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="postCode">Post Code</Label>
                                    <Input
                                        id="postCode"
                                        name="postCode"
                                        value={form.postCode}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-x-6">
                        <button
                            type="button"
                            className="text-sm font-semibold leading-6 text-gray-900 hover:text-orange-600 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-md bg-orange-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Saving...' : 'Save & Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PractiveViewProfile;