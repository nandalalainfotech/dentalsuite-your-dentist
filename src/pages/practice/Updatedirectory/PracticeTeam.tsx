import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import { SectionHeader, InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    qualification?: string;
}

export default function PracticeTeam({ clinicData }: { clinicData: Clinic }) {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
        (clinicData.team || []).map((member, i) => ({
            id: i.toString(),
            name: member.name,
            role: member.role,
            qualification: member.qual || ''
        }))
    );
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [editingMember, setEditingMember] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        qualification: ''
    });

    const handleAddMember = () => {
        if (formData.name && formData.role) {
            const newMember: TeamMember = {
                id: Date.now().toString(),
                ...formData
            };
            setTeamMembers([...teamMembers, newMember]);
            setFormData({ name: '', role: '', qualification: '' });
            setIsAddingMember(false);
        }
    };

    const handleEditMember = (member: TeamMember) => {
        setEditingMember(member.id);
        setFormData({
            name: member.name,
            role: member.role,
            qualification: member.qualification || ''
        });
    };

    const handleUpdateMember = () => {
        if (formData.name && formData.role && editingMember) {
            setTeamMembers(teamMembers.map(member => 
                member.id === editingMember 
                    ? { ...member, ...formData }
                    : member
            ));
            setEditingMember(null);
            setFormData({ name: '', role: '', qualification: '' });
        }
    };

    const handleDeleteMember = (id: string) => {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <SectionHeader 
                title="Our Team" 
                desc="Doctors, nurses, and staff members." 
                actionLabel="Add Member"
                onActionClick={() => setIsAddingMember(true)}
            />

            {isAddingMember && (
                <div className="mb-6 p-5 rounded-xl border border-orange-200 bg-orange-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Team Member</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <InputGroup
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <InputGroup
                            label="Role"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        />
                        <InputGroup
                            label="Qualification (Optional)"
                            value={formData.qualification}
                            onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddMember}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                        >
                            Add Member
                        </button>
                        <button
                            onClick={() => setIsAddingMember(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                    <div key={member.id} className="relative flex flex-col items-center p-6 border border-gray-200 rounded-2xl bg-white text-center hover:border-orange-200 transition group">
                        {editingMember === member.id ? (
                            <div className="w-full space-y-3">
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Name"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-orange-500 outline-none"
                                />
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    placeholder="Role"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-orange-500 outline-none"
                                />
                                <input
                                    type="text"
                                    value={formData.qualification}
                                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                                    placeholder="Qualification"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-orange-500 outline-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpdateMember}
                                        className="flex-1 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium hover:bg-orange-600 transition"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setEditingMember(null)}
                                        className="flex-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                    <Users className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="font-bold text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.role}</p>
                                {member.qualification && (
                                    <p className="text-xs text-gray-400 mt-1">{member.qualification}</p>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                                    <button 
                                        onClick={() => handleEditMember(member)}
                                        className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-lg"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteMember(member.id)}
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