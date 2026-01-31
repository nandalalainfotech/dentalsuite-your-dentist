import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, Save, Loader2 } from 'lucide-react';
import type { Clinic } from '../../types';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';
import { clinics } from '../../data/clinics'; // Source of Truth
import ClinicEditor from './Updatedirectory/ClinicEditor';
import ClinicProfilePreview from './Updatedirectory/ClinicProfilePreview';

export default function DirectoryView() {
    const { practice: authPractice, isAuthenticated } = usePracticeAuth();
    
    // View State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Data State - Initialize with the first clinic from your file to prevent null errors
    const [activeClinic, setActiveClinic] = useState<Clinic>(clinics[0]);

    // --- EFFECT: Sync Auth User with Clinics.ts Data ---
    useEffect(() => {
        if (isAuthenticated && authPractice) {
            // 1. Search for the logged-in user in your clinics.ts file
            const matchedClinic = clinics.find(c => 
                c.email === authPractice.email || 
                c.id === authPractice.id
            );

            if (matchedClinic) {
                console.log("Loaded clinic from file:", matchedClinic.name);
                setActiveClinic(matchedClinic);
            } else {
                console.warn("Logged in user not found in clinics.ts. Showing default demo clinic.");
                // If user exists in Auth but not in Data file, show the first clinic from file
                setActiveClinic(clinics[0]);
            }
        } else {
            // 2. Not logged in? Show the first clinic from file (Demo Mode)
            setActiveClinic(clinics[0]);
        }
    }, [isAuthenticated, authPractice]);

    const handleSave = () => {
        setIsSaving(true);
        
        // Simulate API call
        setTimeout(() => {
            console.log("Saved Data:", activeClinic);
            setIsSaving(false);
            setIsEditing(false);
        }, 800);
    };

    if (!activeClinic) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full max-w-full overflow-x-hidden animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-screen">
            
            {/* Top Bar Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {isEditing ? "Update Directory" : "My Directory"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {isEditing
                            ? `Editing profile for: ${activeClinic.name}`
                            : "This is how your clinic appears to patients on the website."}
                    </p>
                </div>

                {isEditing ? (
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 transition"
                        >
                            <ArrowLeft className="w-4 h-4" /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-gray-200 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 flex items-center gap-2 transition transform active:scale-95"
                    >
                        <Edit3 className="w-4 h-4" /> Update Directory
                    </button>
                )}
            </div>

            {/* Main Content Switcher */}
            <div className="w-full max-w-full relative">
                {isEditing ? (
                    <ClinicEditor 
                        clinicData={activeClinic} 
                    />
                ) : (
                    <ClinicProfilePreview clinicData={activeClinic} />
                )}
            </div>
        </div>
    );
}