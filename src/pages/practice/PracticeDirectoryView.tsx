/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Edit3 } from 'lucide-react'; // Removed Save icon as it's not used in the "View" mode header usually
import { useAppSelector } from '../../store/hooks';

//  1. Import the PracticeInfo Interface
import type { PracticeInfo } from '../../types/clinic';

import { getDirectoryService } from '../../services/service';
import { clinics as demoClinics } from '../../data/clinics';
import PracticeProfilePreview from './Updatedirectory/PracticeProfilePreview';
import PracticeEditor from './Updatedirectory/PracticeEditor';


export default function DirectoryView() {
    const userState = useAppSelector((state) => state.user.auth.user);
    const { id } = (userState as any)?.user ?? userState ?? {};

    //  2. Use PracticeInfo for State
    const [directoryData, setDirectoryData] = useState<PracticeInfo | null>(null);
    const [loading, setLoading] = useState(true);

    // FIX 1: Initialize isEditing from Local Storage
    const [isEditing, setIsEditing] = useState(() => {
        return localStorage.getItem('is_directory_editing') === 'true';
    });

    // FIX 2: Save isEditing state to Local Storage whenever it changes
    useEffect(() => {
        localStorage.setItem('is_directory_editing', String(isEditing));
    }, [isEditing]);

    const [isSaving, setIsSaving] = useState(false);

    // --- Helper: Convert API "Directory Locations" Array to "PracticeInfo" Time Object ---
    const formatOpeningHours = (locations: any[]) => {
        const defaultTime = {
            monday: "Closed", tuesday: "Closed", wednesday: "Closed",
            thursday: "Closed", friday: "Closed", saturday: "Closed", sunday: "Closed"
        };

        if (!locations || !Array.isArray(locations)) return defaultTime;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const timeMap: any = { ...defaultTime };
        locations.forEach((loc) => {
            const day = loc.week_name.toLowerCase();
            if (timeMap[day] !== undefined) {
                timeMap[day] = loc.clinic_time || "Closed";
            }
        });
        return timeMap;
    };

    const dayOrder = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];

    useEffect(() => {
        const fetchDirectory = async () => {
             if (!id) {
                setLoading(false);
                return
             }

            try {
                setLoading(true);
                const apiData = await getDirectoryService(id);

                if (apiData) {
                    const formattedData: PracticeInfo = {
                        id: apiData.id,
                        company_name: apiData.company_name || "",
                        business_name: apiData.business_name || "",
                        abn_acn: apiData.abn_acn || "",
                        name: apiData.name || apiData.business_name || "My Practice",

                        address: apiData.dental_practice?.address || "No address provided",
                        zipcode: apiData.dental_practice?.zipcode || "",

                        profession_type: apiData.profession_type || "",
                        email: apiData.email,
                        phone: apiData.phone,

                        // Images
                        logo: apiData.logo,
                        banner: apiData.banner_image,

                        // Time
                        time: formatOpeningHours(apiData.directory_locations),

                        // Team
                        dentists: apiData.directory_team_members?.map((m: any) => ({
                            id: m.id,
                            name: m.name || "",
                            specialization: m.specialization || "",
                            image: m.image || "",
                        })) || [],

                        // Services
                        services: apiData.directory_services?.map((s: any) => ({
                            id: s.id,
                            name: s.name,
                            description: s.description || "",
                        })) || [],

                        // Gallery
                        gallery: apiData.directory_gallery_posts?.map(
                            (g: any) => g?.image || g?.url || ""
                        ) || [],

                        // Certifications
                        directory_certifications: apiData.directory_certifications?.map((c: any) => ({
                            id: c.id,
                            title: c.title,
                            attachments: {
                                url: c?.attachments?.url || "",
                                name: c?.attachments?.name || "",
                            },
                        })) || [],

                        // Achievements
                        directory_achievements: apiData.directory_achievements?.map((a: any) => ({
                            id: a.id,
                            title: a.title,
                            image: a?.attachments?.url || "",
                        })) || [],

                        // Opening Hours
                        openingHours: apiData.directory_locations?.map((loc: any) => ({
                            id: loc.id,
                            week_name: loc.week_name,
                            clinic_time: loc.clinic_time || "Closed",
                        }))
                            ?.sort((a: any, b: any) => dayOrder.indexOf(a.week_name) - dayOrder.indexOf(b.week_name)) || [],

                        // Required interface fields
                        appointmentTypes: [],
                        specialities: [],

                        description: apiData.description || "",
                        website: apiData.website || "",
                        rating: apiData.rating || 4.0,
                        facilities: ["Parking", "Wi-Fi"],
                        insurances: ["HBF", "Bupa"],
                        parking: true,
                        emergency: true,
                        reviews: "0 Reviews",
                        faqs: JSON.stringify(apiData.directory_faqs || []),
                        testimonials: JSON.stringify(apiData.directory_testimonials || []),
                        
                        // Set undefined for properties we've manually mapped above to avoid duplications in PracticeInfo if strict
                        banner_image: undefined,
                        practiceLogo: undefined,
                        directory_services: undefined,
                        directory_team_members: undefined,
                        directory_gallery_posts: undefined,
                        directory_testimonials: undefined,
                        directory_locations: undefined,
                        practicePhone: undefined
                    };

                    setDirectoryData(formattedData as unknown as PracticeInfo);

                } else {
                    console.warn("No directory found in DB, using demo data.");
                    setDirectoryData(demoClinics[0] as unknown as PracticeInfo);
                }

            } catch (err) {
                console.error("Failed to load directory:", err);
                setDirectoryData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDirectory();
    }, [id]);

    
    // Toggle Handler
    const toggleEditMode = (mode: boolean) => {
        setIsEditing(mode);
        // Note: The useEffect will handle saving to localStorage
        // If turning OFF edit mode, we might want to clear the active tab from the Editor component
        if (!mode) {
            localStorage.removeItem('clinic_editor_active_tab');
        }
    };

     const handleSave = async () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsEditing(false);
        }, 800);
    };


    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading Directory...</p>
                </div>
            </div>
        );
    }

    if (!directoryData) return null;

    return (
        <div className="flex flex-col w-full max-w-full overflow-x-hidden animate-in fade-in duration-500 font-sans text-gray-800 bg-white min-h-screen">

            {/* Header / Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 bg-white sticky top-0 z-30 shadow-sm gap-4 border-b border-gray-100">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        {isEditing ? "Update Directory" : "My Directory"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {isEditing
                            ? `Editing profile for: ${directoryData.company_name}`
                            : "This is how your clinic appears to patients on the website."}
                    </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    {isEditing ? (
                        <>
                            <button onClick={() => toggleEditMode(false)} disabled={isSaving} className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 transition">
                                <ArrowLeft className="w-4 h-4" /> Cancel
                            </button>
                            <button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 flex items-center gap-2 shadow-lg shadow-gray-200 transition transform active:scale-95 disabled:opacity-70">
                                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <> Save Changes</>}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => toggleEditMode(true)} className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 flex items-center gap-2 transition transform active:scale-95">
                            <Edit3 className="w-4 h-4" /> Update Directory
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full max-w-full relative">
                {isEditing ? (
                    <PracticeEditor clinicData={directoryData} />
                ) : (
                    <PracticeProfilePreview clinicData={directoryData} />
                )}
            </div>
        </div>
    );
}