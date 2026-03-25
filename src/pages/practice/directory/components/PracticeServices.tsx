/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import {
    Briefcase, Plus, Trash2, Edit2, X, Check, Loader2
} from 'lucide-react';
import toast from "react-hot-toast";

// 1. Redux Imports
import { useAppDispatch } from '../../../../store/hooks';
import { updateDirectoryServices } from '../../../../features/directory/directory.slice';
// 2. We now use our raw DirectoryProfile type
import type { DirectoryProfile } from '../../../../features/directory/directory.types';

interface Service {
    id: string;
    name: string;
    showInAppointment: boolean;
    description: string;
}

export default function PracticeServices({ clinicData, onNext }: { clinicData: DirectoryProfile, onNext: () => void }) {
    const dispatch = useAppDispatch();

    const [services, setServices] = useState<Service[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Service>>({});

    const stripHtml = (html: string) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, '');
    };

    // Populate data directly from Hasura DB array
    useEffect(() => {
        if (clinicData?.practice_services) {
            const formattedServices = clinicData.practice_services.map((s: any) => ({
                id: s.id,
                name: s.name || "",
                description: stripHtml(s.description) || "",
                showInAppointment: s.show_in_appointment ?? true 
            }));
            setServices(formattedServices);
        }
    }, [clinicData]);

    // --- Handlers ---

    const handleAdd = () => {
        if (!newName.trim()) return;

        const newService: Service = {
            id: Date.now().toString(), // Temp ID for local state
            name: newName,
            description: newDesc,
            showInAppointment: true
        };

        setServices(prev => [newService, ...prev]);
        setNewName('');
        setNewDesc('');
        toast.success("Service added to list");
    };

    const handleDelete = (id: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
        toast.success("Service removed");
    };

    const startEdit = (service: Service) => {
        setEditingId(service.id);
        setEditForm({ ...service });
    };

    const saveEdit = () => {
        if (!editingId || !editForm.name) return;

        setServices(prev => prev.map(s =>
            s.id === editingId ? { ...s, ...editForm } as Service : s
        ));
        setEditingId(null);
        setEditForm({});
        toast.success("Service updated");
    };

    const handleSaveAndNext = async () => {
        setIsSaving(true);
        try {
            // Map local state to DB snake_case fields
            const dbServices = services.map(s => ({
                name: s.name,
                description: s.description,
                show_in_appointment: s.showInAppointment
            }));

            // Dispatch to Hasura
            await dispatch(updateDirectoryServices({
                practiceId: clinicData.id,
                services: dbServices
            })).unwrap();

            toast.success("Services saved successfully!");
            onNext();
        } catch (error: any) {
            console.error("Failed to save services:", error);
            toast.error(error.message || "Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">

            {/* Header Section */}
            <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-6">
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <Briefcase className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Services</h2>
                    <p className="text-gray-500 text-sm mt-1">List the treatments and procedures available at your practice.</p>
                </div>
            </div>

            {/* Input Section */}
            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 mb-8 focus-within:ring-1 focus-within:ring-orange-200 transition-all">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Name */}
                    <div className="md:col-span-4 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Service Name</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Dental Implant"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition shadow-sm"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-6 space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Short Description</label>
                        <input
                            type="text"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            placeholder="Brief details about the procedure..."
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition shadow-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                    </div>

                    {/* Add Button */}
                    <div className="md:col-span-2 pt-6">
                        <button
                            onClick={handleAdd}
                            disabled={!newName.trim()}
                            className="w-full h-[46px] bg-gray-900 text-white font-medium rounded-xl hover:bg-black hover:shadow-lg hover:shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                        Active Services <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">{services.length}</span>
                    </h3>
                </div>

                {services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                            <Briefcase className="w-6 h-6 text-gray-300" />
                        </div>
                        <h4 className="text-gray-900 font-medium">No services added yet</h4>
                        <p className="text-gray-400 text-sm mt-1 max-w-xs">Start by adding a service name above to populate your directory listing.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`
                                    relative p-5 rounded-xl border transition-all duration-200 group bg-white
                                    ${editingId === service.id
                                        ? 'border-orange-500 ring-4 ring-orange-50/50 shadow-lg z-10'
                                        : 'border-gray-100 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5'
                                    }
                                `}
                            >
                                {editingId === service.id ? (
                                    // EDIT MODE
                                    <div className="space-y-3 animate-in fade-in duration-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">Editing Service</span>
                                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                                        </div>
                                        <input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm font-medium"
                                            placeholder="Service Name"
                                            autoFocus
                                        />
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm resize-none"
                                            placeholder="Description"
                                            rows={2}
                                        />
                                        <div className="flex justify-end pt-2">
                                            <button
                                                onClick={saveEdit}
                                                className="px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition flex items-center gap-1.5"
                                            >
                                                <Check size={14} /> Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // VIEW MODE
                                    <>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-900 text-lg">{service.name}</h4>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => startEdit(service)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 min-h-[40px]">
                                            {service.description || "No description provided."}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <button
                    type="button"
                    onClick={onNext}
                    className="px-8 py-3 bg-orange-50 text-orange-400 font-medium rounded-full hover:bg-orange-100 transition"
                >
                    Skip
                </button>
                <button
                    onClick={handleSaveAndNext}
                    disabled={isSaving}
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        'Save & Next'
                    )}
                </button>
            </div>
        </div>
    );
}