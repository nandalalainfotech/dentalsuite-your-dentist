/* eslint-disable react-hooks/static-components */
import React, { useState, useEffect } from 'react';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';

const PractiveViewProfile = () => {
    const { practice, updateProfile } = usePracticeAuth();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [form, setForm] = useState({
        // Basic Info
        businessName: '',
        abnAcn: '',
        businessType: 'general_dentistry',
        // contactName: '',
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

    // Initialize form with practice data when component mounts or practice changes
    useEffect(() => {
        if (practice) {
            setForm({
                businessName: practice.practiceName || '',
                abnAcn: practice.abnNumber || '',
                businessType: practice.practiceType || 'general_dentistry',
                // contactName: `${practice.firstName} ${practice.lastName}` || '',
                email: practice.email || '',
                phone: practice.practicePhone || '',
                // Contact Information
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!practice) return;

        // Update practice profile with form data
        updateProfile({
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
    };

    const handleDelete = () => {
        // TODO: call API to delete
        if (confirm('Are you sure you want to delete your account?')) {
            alert('Deleted! (wire up your API here)');
        }
    };

    const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {children} {required && <span className="text-red-500">*</span>}
        </label>
    );

    const Input = ({ icon, textarea = false, ...props }: {
        icon?: React.ReactNode;
        textarea?: boolean;
        [key: string]: any
    }) => (
        <div className="relative">
            {textarea ? (
                <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    {...props}
                />
            ) : (
                <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    {...props}
                />
            )}
            {icon && (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </span>
            )}
        </div>
    );

    const PencilIcon = (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.4.25l-3.5 1a1 1 0 01-1.243-1.243l1-3.5a1 1 0 01.25-.4l9.9-9.9a2 2 0 012.828 0zM12 5l3 3M4 16h12" />
        </svg>
    );

    const SectionHeader = ({ children }: { children: React.ReactNode }) => (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold tracking-widest text-orange-600 uppercase">
                    {children}
                </h2>
            </div>
            <div className="mt-2 h-0.5 w-40 bg-orange-500" />
        </div>
    );

    return (
        <div className="mx-aut">
            {/* Top action */}
            <div className="mb-2 flex items-center justify-between">
                <div />
                <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600 focus:outline-none"
                >
                    Delete My Account
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* BASIC INFO */}
                <SectionHeader>BASIC INFO</SectionHeader>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Logo upload */}
                    <div className="flex flex-col items-start">
                        <span className="mb-2 text-sm font-medium text-gray-700">Business Logo</span>
                        <div className="relative">
                            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Business logo preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-20 w-20 text-gray-300"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.978 0-12 2.006-12 6v2h24v-2c0-3.994-8.022-6-12-6z" />
                                    </svg>
                                )}
                            </div>

                            <label
                                htmlFor="logo"
                                className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white shadow hover:bg-orange-600"
                                title="Upload logo"
                            >
                                <input id="logo" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                    <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.4.25l-3.5 1a1 1 0 01-1.243-1.243l1-3.5a1 1 0 01.25-.4l9.9-9.9a2 2 0 012.828 0zM12 5l3 3" />
                                </svg>
                            </label>
                        </div>
                    </div>

                    {/* Basic info fields - left column of right side */}
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <Label required>Business Name</Label>
                            <Input
                                name="businessName"
                                value={form.businessName}
                                onChange={handleChange}
                                placeholder="Enter business name"
                            />
                        </div>

                        <div>
                            <Label required>ABN / ACN Number</Label>
                            <Input
                                name="abnAcn"
                                value={form.abnAcn}
                                onChange={handleChange}
                                placeholder="Enter ABN / ACN"
                            />
                        </div>

                        <div>
                            <Label required={false}>Business Type</Label>
                            <select
                                name="businessType"
                                value={form.businessType}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option>Dental Practices</option>
                                <option>General Practice</option>
                                <option>Allied Health</option>
                                <option>Specialist Clinic</option>
                            </select>
                        </div>
                    </div>

                    {/* Basic info fields - right column of right side */}
                    <div className="grid grid-cols-1 gap-5">
                        {/* <div>
                            <Label required>Contact Name</Label>
                            <Input
                                name="contactName"
                                value={form.contactName}
                                onChange={handleChange}
                                icon={PencilIcon}
                                placeholder="Enter contact name"
                            />
                        </div> */}

                        <div>
                            <Label required>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </div>

                        <div>
                            <Label required>Phone No</Label>
                            <Input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                icon={PencilIcon}
                                placeholder="Enter phone"
                            />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 border-b border-gray-200" />

                {/* CONTACT INFORMATION */}
                <SectionHeader>CONTACT INFORMATION</SectionHeader>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <Label required>First Name</Label>
                        <Input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                        />
                    </div>

                    <div>
                        <Label required={false}>Middle Name</Label>
                        <Input
                            name="middleName"
                            value={form.middleName}
                            onChange={handleChange}
                            placeholder="Enter middle name"
                        />
                    </div>

                    <div>
                        <Label required>Last Name</Label>
                        <Input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                        />
                    </div>

                    <div>
                        <Label required={false}>Fax Number</Label>
                        <Input
                            name="faxNumber"
                            value={form.faxNumber}
                            onChange={handleChange}
                            placeholder="Enter fax number"
                        />
                    </div>

                    <div>
                        <Label required={false}>Alternate Phone Number</Label>
                        <Input
                            name="altPhone"
                            value={form.altPhone}
                            onChange={handleChange}
                            icon={PencilIcon}
                            placeholder="Enter alternate phone"
                        />
                    </div>

                    <div>
                        <Label required={false}>Alternate Email</Label>
                        <Input
                            type="email"
                            name="altEmail"
                            value={form.altEmail}
                            onChange={handleChange}
                            icon={PencilIcon}
                            placeholder="Enter alternate email"
                        />
                    </div>

                    <div>
                        <Label required>Address</Label>
                        <Input
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Search or enter address"
                        />
                    </div>

                    <div>
                        <Label required={false}>Address Line 1</Label>
                        <Input
                            name="address1"
                            value={form.address1}
                            onChange={handleChange}
                            placeholder="Enter address line 1"
                        />
                    </div>

                    <div>
                        <Label required={false}>Address Line 2</Label>
                        <Input
                            name="address2"
                            value={form.address2}
                            onChange={handleChange}
                            textarea
                            placeholder="Enter address line 2"
                        />
                    </div>

                    <div>
                        <Label required={false}>Landmark</Label>
                        <Input
                            name="landmark"
                            value={form.landmark}
                            onChange={handleChange}
                            placeholder="Enter landmark"
                        />
                    </div>

                    <div>
                        <Label>City</Label>
                        <Input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                        />
                    </div>

                    <div>
                        <Label>State</Label>
                        <select
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                            <option>New South Wales</option>
                            <option>Victoria</option>
                            <option>Queensland</option>
                            <option>South Australia</option>
                            <option>Western Australia</option>
                            <option>Tasmania</option>
                            <option>Northern Territory</option>
                            <option>Australian Capital Territory</option>
                        </select>
                    </div>

                    <div>
                        <Label>Country</Label>
                        <Input
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            placeholder="Enter country"
                        />
                    </div>

                    <div>
                        <Label>Post Code</Label>
                        <Input
                            name="postCode"
                            value={form.postCode}
                            onChange={handleChange}
                            placeholder="Enter post code"
                        />
                    </div>
                </div>

                {/* Footer actions */}
                <div className="mt-10 flex justify-end">
                    <button
                        type="submit"
                        className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow hover:bg-orange-600 focus:outline-none"
                    >
                        Save & Update
                    </button>
                </div>
            </form>
        </div>
        // </div>
    );
};

export default PractiveViewProfile;