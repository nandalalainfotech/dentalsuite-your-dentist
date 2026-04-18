/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Loader2, Edit3, CheckCircle } from 'lucide-react'; 
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchDirectory } from '../../../../features/directory/directory.slice';
import { usePracticePermissions } from '../../../../features/permissions/Permissions.hooks';
import PracticeEditor from '../components/PracticeEditor';
import PracticeProfilePreview from '../components/PracticeProfilePreview';
import type { DirectoryProfile } from '../../../../features/directory/directory.types';

export default function DirectoryView() {
    const dispatch = useAppDispatch();
    
    const userState = useAppSelector((state: any) => state.auth.user);
    const authPracticeId = userState?.practiceId || userState?.user?.practiceId || userState?.id || userState?.user?.id;
    const { canEdit } = usePracticePermissions(authPracticeId);
    const canEditDirectory = canEdit('directory');

    // 2. Get Directory Data
    const { data: directoryData, isLoading } = useAppSelector((state: any) => state.directory);

    useEffect(() => {
        if (!authPracticeId) return;
        
        if (isLoading) return;

        if (!directoryData || directoryData.id !== authPracticeId) {
            dispatch(fetchDirectory(authPracticeId));
        }
    }, [authPracticeId, directoryData?.id, isLoading, dispatch]);

    // 4. Local State for Edit Mode
    const [isEditing, setIsEditing] = useState(() => {
        return localStorage.getItem('is_directory_editing') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('is_directory_editing', String(isEditing));
    }, [isEditing]);

    const toggleEditMode = (mode: boolean) => {
        setIsEditing(mode);
        if (!mode) localStorage.removeItem('clinic_editor_active_tab');
    };

    // --- RENDER GUARDS ---

    // Guard 1: Missing Auth ID (User needs to relogin)
    if (!authPracticeId) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <p className="text-red-500">Error: No Practice ID found. Please log out and log in again.</p>
            </div>
        );
    }

    // Guard 2: Loading State (only show full screen loader if we have NO data to show)
    if (isLoading && !directoryData) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading Directory...</p>
                </div>
            </div>
        );
    }

    // Guard 3: Data Missing (Safeguard against Blank Page crash)
    // This happens if loading finished but we still have no data (e.g., API error or deleted account)
    if (!directoryData && !isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No directory information found.</p>
                    <button 
                        onClick={() => dispatch(fetchDirectory(authPracticeId))}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        Retry Fetch
                    </button>
                </div>
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="flex flex-col w-full max-w-full overflow-x-hidden animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-screen">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 bg-white sticky top-0 z-30 shadow-sm gap-4 border-b border-gray-100">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {isEditing ? "Update Directory" : "My Directory"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {isEditing
                            ? `Editing profile for: ${directoryData.practice_name || 'My Practice'}`
                            : "This is how your clinic appears to patients on the website."}
                    </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    {isEditing ? (
                        <button 
                            onClick={() => toggleEditMode(false)} 
                            className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-gray-200 transition transform active:scale-95"
                        >
                            <CheckCircle className="w-4 h-4" /> Done Editing
                        </button>
                    ) : (
                        <button 
                            onClick={() => canEditDirectory && toggleEditMode(true)} 
                            disabled={!canEditDirectory}
                            className={`w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 transition transform active:scale-95 ${
                                canEditDirectory
                                    ? 'bg-orange-600 hover:bg-orange-700'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <Edit3 className="w-4 h-4" /> Update Directory
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="w-full max-w-full relative">
                {isEditing ? (
                    <PracticeEditor clinicData={directoryData as DirectoryProfile} />
                ) : (
                    <PracticeProfilePreview clinicData={directoryData as DirectoryProfile} />
                )}
            </div>
        </div>
    );
}
