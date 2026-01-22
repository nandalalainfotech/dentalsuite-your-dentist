import { useState } from 'react';
import { Trophy, Edit2, Trash2 } from 'lucide-react';
import { SectionHeader, InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

interface Achievement {
    id: string;
    title: string;
    organization?: string;
}

export default function PracticeAchievements({ clinicData }: { clinicData: Clinic }) {
    const [achievements, setAchievements] = useState<Achievement[]>(
        (clinicData.achievements || []).map((achievement, i) => ({
            id: i.toString(),
            title: achievement.title,
            organization: achievement.org || ''
        }))
    );
    const [isAddingAchievement, setIsAddingAchievement] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        organization: ''
    });

    const handleAddAchievement = () => {
        if (formData.title) {
            const newAchievement: Achievement = {
                id: Date.now().toString(),
                ...formData
            };
            setAchievements([...achievements, newAchievement]);
            setFormData({ title: '', organization: '' });
            setIsAddingAchievement(false);
        }
    };

    const handleEditAchievement = (achievement: Achievement) => {
        setEditingAchievement(achievement.id);
        setFormData({
            title: achievement.title,
            organization: achievement.organization || ''
        });
    };

    const handleUpdateAchievement = () => {
        if (formData.title && editingAchievement) {
            setAchievements(achievements.map(achievement => 
                achievement.id === editingAchievement 
                    ? { ...achievement, ...formData }
                    : achievement
            ));
            setEditingAchievement(null);
            setFormData({ title: '', organization: '' });
        }
    };

    const handleDeleteAchievement = (id: string) => {
        setAchievements(achievements.filter(achievement => achievement.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <SectionHeader 
                title="Achievements" 
                desc="Awards and certifications." 
                actionLabel="Add Achievement"
                onActionClick={() => setIsAddingAchievement(true)}
            />

            {isAddingAchievement && (
                <div className="mb-6 p-5 rounded-xl border border-orange-200 bg-orange-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Achievement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputGroup
                            label="Achievement Title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                        <InputGroup
                            label="Organization (Optional)"
                            value={formData.organization}
                            onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddAchievement}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                        >
                            Add Achievement
                        </button>
                        <button
                            onClick={() => setIsAddingAchievement(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white relative group">
                        {editingAchievement === achievement.id ? (
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputGroup
                                    label="Achievement Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                                <InputGroup
                                    label="Organization"
                                    value={formData.organization}
                                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                                />
                                <div className="flex gap-2 md:col-span-2">
                                    <button
                                        onClick={handleUpdateAchievement}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setEditingAchievement(null)}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                                    {achievement.organization && (
                                        <p className="text-sm text-gray-500">{achievement.organization}</p>
                                    )}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button 
                                        onClick={() => handleEditAchievement(achievement)}
                                        className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteAchievement(achievement.id)}
                                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}