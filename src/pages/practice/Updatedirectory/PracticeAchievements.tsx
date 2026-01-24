// import { useState } from 'react';
// import { Trophy, Edit2, Trash2 } from 'lucide-react';
// import { SectionHeader, InputGroup } from './SharedEditorComponents';
// import type { Clinic } from '../../../types/clinic';

// interface Achievement {
//     id: string;
//     title: string;
//     organization?: string;
// }

// export default function PracticeAchievements({ clinicData }: { clinicData: Clinic }) {
//     const [achievements, setAchievements] = useState<Achievement[]>(
//         (clinicData.achievements || []).map((achievement, i) => ({
//             id: i.toString(),
//             title: achievement.title,
//             organization: achievement.org || ''
//         }))
//     );
//     const [isAddingAchievement, setIsAddingAchievement] = useState(false);
//     const [editingAchievement, setEditingAchievement] = useState<string | null>(null);
//     const [formData, setFormData] = useState({
//         title: '',
//         organization: ''
//     });

//     const handleAddAchievement = () => {
//         if (formData.title) {
//             const newAchievement: Achievement = {
//                 id: Date.now().toString(),
//                 ...formData
//             };
//             setAchievements([...achievements, newAchievement]);
//             setFormData({ title: '', organization: '' });
//             setIsAddingAchievement(false);
//         }
//     };

//     const handleEditAchievement = (achievement: Achievement) => {
//         setEditingAchievement(achievement.id);
//         setFormData({
//             title: achievement.title,
//             organization: achievement.organization || ''
//         });
//     };

//     const handleUpdateAchievement = () => {
//         if (formData.title && editingAchievement) {
//             setAchievements(achievements.map(achievement => 
//                 achievement.id === editingAchievement 
//                     ? { ...achievement, ...formData }
//                     : achievement
//             ));
//             setEditingAchievement(null);
//             setFormData({ title: '', organization: '' });
//         }
//     };

//     const handleDeleteAchievement = (id: string) => {
//         setAchievements(achievements.filter(achievement => achievement.id !== id));
//     };

//     return (
//         <div className="max-w-4xl mx-auto">
//             <SectionHeader 
//                 title="Achievements" 
//                 desc="Awards and certifications." 
//                 actionLabel="Add Achievement"
//                 onActionClick={() => setIsAddingAchievement(true)}
//             />

//             {isAddingAchievement && (
//                 <div className="mb-6 p-5 rounded-xl border border-orange-200 bg-orange-50">
//                     <h3 className="font-semibold text-gray-900 mb-4">Add New Achievement</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                         <InputGroup
//                             label="Achievement Title"
//                             value={formData.title}
//                             onChange={(e) => setFormData({...formData, title: e.target.value})}
//                         />
//                         <InputGroup
//                             label="Organization (Optional)"
//                             value={formData.organization}
//                             onChange={(e) => setFormData({...formData, organization: e.target.value})}
//                         />
//                     </div>
//                     <div className="flex gap-2">
//                         <button
//                             onClick={handleAddAchievement}
//                             className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
//                         >
//                             Add Achievement
//                         </button>
//                         <button
//                             onClick={() => setIsAddingAchievement(false)}
//                             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <div className="space-y-3">
//                 {achievements.map((achievement) => (
//                     <div key={achievement.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white relative group">
//                         {editingAchievement === achievement.id ? (
//                             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <InputGroup
//                                     label="Achievement Title"
//                                     value={formData.title}
//                                     onChange={(e) => setFormData({...formData, title: e.target.value})}
//                                 />
//                                 <InputGroup
//                                     label="Organization"
//                                     value={formData.organization}
//                                     onChange={(e) => setFormData({...formData, organization: e.target.value})}
//                                 />
//                                 <div className="flex gap-2 md:col-span-2">
//                                     <button
//                                         onClick={handleUpdateAchievement}
//                                         className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
//                                     >
//                                         Update
//                                     </button>
//                                     <button
//                                         onClick={() => setEditingAchievement(null)}
//                                         className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
//                                     <Trophy className="w-5 h-5" />
//                                 </div>
//                                 <div className="flex-1">
//                                     <h4 className="font-bold text-gray-900">{achievement.title}</h4>
//                                     {achievement.organization && (
//                                         <p className="text-sm text-gray-500">{achievement.organization}</p>
//                                     )}
//                                 </div>
//                                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
//                                     <button 
//                                         onClick={() => handleEditAchievement(achievement)}
//                                         className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg"
//                                     >
//                                         <Edit2 className="w-4 h-4" />
//                                     </button>
//                                     <button 
//                                         onClick={() => handleDeleteAchievement(achievement.id)}
//                                         className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg"
//                                     >
//                                         <Trash2 className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import { useState } from 'react';
import { Trophy, Edit2, Trash2, Upload, X } from 'lucide-react';
import type { Clinic } from '../../../types/clinic';

interface Achievement {
    id: string;
    title: string;
    organization?: string;
    image?: string;
}

export default function PracticeAchievements({ clinicData }: { clinicData: Clinic }) {
    const [achievements, setAchievements] = useState<Achievement[]>(
        (clinicData.achievements || []).map((a, i) => ({
            id: i.toString(),
            title: a.title,
            organization: a.org || ''
        }))
    );

    const [title, setTitle] = useState('');
    const [organization, setOrganization] = useState('');
    const [, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    /* ---------- FILE HANDLER ---------- */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!['image/jpeg', 'image/png'].includes(selected.type)) {
            alert('Only JPG and PNG allowed');
            return;
        }

        if (selected.size > 5 * 1024 * 1024) {
            alert('Max file size is 5MB');
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    /* ---------- ADD ACHIEVEMENT ---------- */
    const handleAddAchievement = () => {
        if (!title) return;

        setAchievements(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                title,
                organization,
                image: preview || undefined
            }
        ]);

        setTitle('');
        setOrganization('');
        setFile(null);
        setPreview(null);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Achievements</h2>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium">
                    Save
                </button>
            </div>

            {/* ADD ACHIEVEMENT */}
            <div className="bg-white rounded-2xl border p-6 space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* TITLE */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Achievement Name
                        </label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter Achievement Name"
                            className="mt-1 w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                    </div>

                    {/* UPLOAD */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Attachment
                        </label>

                        <input
                            type="file"
                            id="achievement-upload"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <label
                            htmlFor="achievement-upload"
                            className="mt-1 border-2 border-dashed rounded-xl p-6 text-center
                         text-gray-500 hover:border-orange-400 transition cursor-pointer
                         flex flex-col items-center justify-center relative"
                        >
                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-32 object-contain mb-2"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPreview(null);
                                            setFile(null);
                                        }}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Upload className="mb-2 text-orange-400" />
                                    <p className="font-medium">
                                        Choose an image or drag & drop it here.
                                    </p>
                                    <p className="text-xs">JPG, PNG (Max 5MB)</p>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleAddAchievement}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-medium"
                    >
                        Add Achievement
                    </button>
                </div>
            </div>

            {/* ACHIEVEMENTS LIST */}
            <div className="bg-gray-50 rounded-2xl p-6 min-h-[220px]">

                {achievements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>No achievements available.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {achievements.map(a => (
                            <div
                                key={a.id}
                                className="flex items-center gap-4 bg-white p-4 rounded-xl border group"
                            >
                                {a.image ? (
                                    <img
                                        src={a.image}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{a.title}</p>
                                    {a.organization && (
                                        <p className="text-sm text-gray-500">{a.organization}</p>
                                    )}
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-500">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setAchievements(prev => prev.filter(x => x.id !== a.id))
                                        }
                                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
