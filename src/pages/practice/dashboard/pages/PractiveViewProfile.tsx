/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { updatePracticeProfile } from '../../../../features/dashboard/dashboard.slice';
import { User, Mail, Phone, MapPin, Building, FileText, Settings } from 'lucide-react';

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

const Input = ({ icon, textarea = false, className = "", id, disabled = false, ...props }: any) => {
    const baseClasses = "block w-full rounded-lg border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5 px-3 border transition-all duration-200";
    return (
        <div className="relative">
            {textarea ? (
                <textarea id={id} disabled={disabled} className={`${baseClasses} ${className}`} rows={3} {...props} />
            ) : (
                <div className="relative">
                    <input id={id} disabled={disabled} className={`${baseClasses} ${icon ? 'pl-10' : ''} ${className}`} {...props} />
                    {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</div>}
                </div>
            )}
        </div>
    );
};

// --- Main Component ---
const PractiveViewProfile = () => {
    const dispatch = useAppDispatch();

    const { profile, isLoading } = useAppSelector((state) => state.dashboard);

    // Different section uses different command
    // This isImpersonating command enables view only for superadmin in practice dashboard  
    // The SUPER_ADMIN_VIEW command enables view, add, edit and delete for superadmin in practice dashboard

    // const isImpersonating = sessionStorage.getItem("isImpersonating") === "true";
    // const isReadOnly = isImpersonating;
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const isReadOnly = user?.type === "SUPER_ADMIN_VIEW";

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        businessName: '',
        abnAcn: '',
        businessType: '',
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        altPhone: '',
        address: '',
        city: '',
        state: '',
        postCode: '',
    });

    // Sync Form with DB Data
    useEffect(() => {
        if (profile) {
            setForm({
                businessName: profile.practiceName || '',
                abnAcn: profile.abnNumber || '',
                businessType: profile.practiceType || '',
                email: profile.email || '',
                phone: profile.phone || '',
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                altPhone: profile.mobile || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                postCode: profile.postcode || '',
            });

            if (profile.logo) {
                setLogoPreview(profile.logo);
            }
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (isReadOnly) return;
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) return;

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

        if (isReadOnly) return;
        if (!profile?.id) return;

        setIsSubmitting(true);

        try {
            await dispatch(updatePracticeProfile({
                id: profile.id,
                data: {
                    practiceName: form.businessName,
                    abnNumber: form.abnAcn,
                    practiceType: form.businessType,
                    email: form.email,
                    phone: form.phone,
                    firstName: form.firstName,
                    lastName: form.lastName,
                    mobile: form.altPhone,
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    postcode: form.postCode,
                    logo: logoPreview || undefined
                }
            })).unwrap();

            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && !profile) return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;

    return (
        <div className="max-w-5xl mx-auto">

            {/* 🔔 Admin View Banner */}
            {isReadOnly && (
                <div className="mb-6 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 text-sm">
                    You are viewing this practice as Super Admin (Read Only Mode)
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Practice Profile</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your practice details and contact information.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Identity Section */}
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Logo Upload */}
                        <div className="col-span-1">
                            <Label>Business Logo</Label>

                            <div className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-6 py-8 bg-white">

                                {logoPreview ? (
                                    <div className="relative h-32 w-32 mb-4 overflow-hidden rounded-full ring-4 ring-gray-100 shadow-sm">
                                        <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                                        <User size={48} />
                                    </div>
                                )}

                                {!isReadOnly && (
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-orange-600 hover:text-orange-500">
                                        <span>Upload new logo</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoChange} />
                                    </label>
                                )}

                                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                            </div>
                        </div>

                        {/* Business Details */}
                        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

                            <div className="sm:col-span-2">
                                <Label required htmlFor="businessName">Business Name</Label>
                                <Input disabled={isReadOnly} id="businessName" name="businessName" value={form.businessName} onChange={handleChange} icon={<Building size={18} />} />
                            </div>

                            <div>
                                <Label required htmlFor="abnAcn">ABN / ACN</Label>
                                <Input disabled={isReadOnly} id="abnAcn" name="abnAcn" value={form.abnAcn} onChange={handleChange} icon={<FileText size={18} />} />
                            </div>

                            <div>
                                <Label htmlFor="businessType">Business Type</Label>
                                <Input disabled={isReadOnly} id="businessType" name="businessType" value={form.businessType} onChange={handleChange} icon={<Settings size={18} />} />
                            </div>

                            <div>
                                <Label required htmlFor="email">Email Address</Label>
                                <Input disabled={isReadOnly} id="email" type="email" name="email" value={form.email} onChange={handleChange} icon={<Mail size={18} />} />
                            </div>

                            <div>
                                <Label required htmlFor="phone">Phone Number</Label>
                                <Input disabled={isReadOnly} id="phone" type="tel" name="phone" value={form.phone} onChange={handleChange} icon={<Phone size={18} />} />
                            </div>

                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Contact Section */}
                <div>

                    <SectionHeader title="Contact Information" description="Address and secondary contact details." />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div>
                            <Label required htmlFor="firstName">First Name</Label>
                            <Input disabled={isReadOnly} id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
                        </div>

                        <div>
                            <Label required htmlFor="lastName">Last Name</Label>
                            <Input disabled={isReadOnly} id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
                        </div>

                        <div>
                            <Label htmlFor="altPhone">Mobile / Alt Phone</Label>
                            <Input disabled={isReadOnly} id="altPhone" name="altPhone" value={form.altPhone} onChange={handleChange} />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <Label required htmlFor="address">Full Address</Label>
                            <Input disabled={isReadOnly} id="address" name="address" value={form.address} onChange={handleChange} icon={<MapPin size={18} />} />
                        </div>

                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input disabled={isReadOnly} id="city" name="city" value={form.city} onChange={handleChange} />
                        </div>

                        <div>
                            <Label htmlFor="state">State</Label>
                            <Input disabled={isReadOnly} id="state" name="state" value={form.state} onChange={handleChange} />
                        </div>

                        <div>
                            <Label htmlFor="postCode">Post Code</Label>
                            <Input disabled={isReadOnly} id="postCode" name="postCode" value={form.postCode} onChange={handleChange} />
                        </div>

                    </div>

                </div>

                {/* Actions */}
                {!isReadOnly && (
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                        <button type="button" onClick={() => window.location.reload()} className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2" disabled={isSubmitting}>
                            Cancel
                        </button>

                        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 disabled:opacity-70 transition-all">
                            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </div>
                )}

            </form>
        </div>
    );
};

export default PractiveViewProfile;