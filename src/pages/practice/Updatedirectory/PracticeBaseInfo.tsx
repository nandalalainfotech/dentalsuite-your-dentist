import { useState } from 'react';
import { Upload, Image, Save } from 'lucide-react';
import { InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

interface PracticeFormData {
    name: string;
    specialization: string;
    tagline: string;
    establishmentDate: string;
    description: string;
    logo: string;
    bannerImage: string;
}

export default function PracticeBaseInfo({ clinicData }: { clinicData: Clinic }) {
    const [formData, setFormData] = useState<PracticeFormData>({
        name: clinicData.name || '',
        specialization: clinicData.specialities?.[0] || 'Dentistry',
        tagline: clinicData.tagline || '',
        establishmentDate: clinicData.establishedYear ? `${clinicData.establishedYear}-01-01` : '',
        description: clinicData.description || '',
        logo: clinicData.logo || '',
        bannerImage: ''
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (field: keyof PracticeFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHasChanges(false);
        setIsSaving(false);
    };

    const handleLogoUpload = () => {
        // Simulate logo upload
        const mockLogo = '/uploaded-logo.jpg';
        handleInputChange('logo', mockLogo);
    };

    const handleBannerUpload = () => {
        // Simulate banner upload
        const mockBanner = '/uploaded-banner.jpg';
        handleInputChange('bannerImage', mockBanner);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your clinic's identity and primary details.</p>
                </div>
                {hasChanges && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-shrink-0">
                    <div
                        onClick={handleLogoUpload}
                        className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-orange-400 transition group relative"
                    >
                        {formData.logo ? (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                                <span className="text-orange-600 text-xs font-medium">Logo</span>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-6 h-6 mb-2 group-hover:text-orange-500" />
                                <span className="text-xs font-medium">Upload Logo</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <div
                        onClick={handleBannerUpload}
                        className="w-full md:w-64 h-32 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-orange-400 transition group relative"
                    >
                        {formData.bannerImage ? (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">Banner</span>
                            </div>
                        ) : (
                            <>
                                <Image className="w-6 h-6 mb-2 group-hover:text-orange-500" />
                                <span className="text-xs font-medium">Upload Banner Image</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup
                    label="Practice Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                />
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Specialization</label>
                    <select
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                    >
                        <option>Dentistry</option>
                        <option>General Practice</option>
                        <option>Orthodontics</option>
                        <option>Pediatrics</option>
                        <option>Oral Surgery</option>
                    </select>
                </div>
                <InputGroup
                    label="Tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                />
                <InputGroup
                    label="Establishment Date"
                    type="date"
                    value={formData.establishmentDate}
                    onChange={(e) => handleInputChange('establishmentDate', e.target.value)}
                />
            </div>

            <div className="space-y-2 mt-6">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">About the Practice</label>
                <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none transition"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
            </div>

            {hasChanges && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-300 px-6 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2 active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
}