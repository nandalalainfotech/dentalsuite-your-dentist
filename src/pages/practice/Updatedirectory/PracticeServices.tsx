import { useState, useEffect } from 'react';
import { 
    Stethoscope, Plus, Trash2, Edit2, Check, X, 
    CheckCircle2, AlertCircle, 
    Briefcase
} from 'lucide-react';
import type { Clinic } from '../../../types';

interface Service {
    id: string;
    name: string;
    showInAppointment: boolean;
    description: string;
}

const POPULAR_SERVICES = [
    "General Checkup", "Teeth Cleaning", "Vaccination", 
    "Physiotherapy", "Blood Test", "Consultation", 
    "X-Ray", "Pediatrics", "Dermatology"
];

export default function PracticeServices({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    // --- State ---
    const [services, setServices] = useState<Service[]>([]);
    
    // Form State
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newShow, setNewShow] = useState(true);

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Service>>({});

    // --- Effects ---
    useEffect(() => {
        if (clinicData?.services && Array.isArray(clinicData.services)) {
            const formattedServices = clinicData.services.map((serviceName, index) => ({
                id: (index + 1).toString(),
                name: serviceName,
                showInAppointment: true,
                description: 'Standard consultation service.'
            }));
            setServices(formattedServices);
        } else {
            // Default mock data if empty
            setServices([
                { id: '1', name: 'General Consultation', showInAppointment: true, description: 'Standard 15 minute appointment.' },
            ]);
        }
    }, [clinicData]);

    // --- Handlers ---

    const handleAdd = () => {
        if (!newName.trim()) return;

        const newService: Service = {
            id: Date.now().toString(),
            name: newName,
            description: newDesc,
            showInAppointment: newShow
        };

        setServices(prev => [newService, ...prev]); // Add to top
        
        // Reset
        setNewName('');
        setNewDesc('');
        setNewShow(true);
    };

    const handleQuickAdd = (name: string) => {
        // Prevent duplicates
        if (services.some(s => s.name === name)) return;

        const newService: Service = {
            id: Date.now().toString(),
            name: name,
            description: 'Standard service',
            showInAppointment: true
        };
        setServices(prev => [newService, ...prev]);
    };

    const handleDelete = (id: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
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
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSaveAndNext = () => {
        console.log('Saving Services:', services);
        onNext();
    };

    // --- Styles ---
    const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-100 focus:border-orange-500 outline-none transition text-sm";

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Services</h2>
                    <p className="text-sm text-gray-500">Add the medical services available at your practice.</p>
                </div>
            </div>

            {/* ADD SERVICE SECTION */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Add New Service</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Name Input */}
                    <div className="md:col-span-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Service Name (e.g. Dental Exam)"
                            className={inputClasses}
                        />
                    </div>

                    {/* Description Input */}
                    <div className="md:col-span-5">
                        <input
                            type="text"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            placeholder="Short description..."
                            className={inputClasses}
                        />
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-3 flex items-center gap-3 h-[42px]">
                        <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:border-orange-300 transition select-none h-full">
                            <input
                                type="checkbox"
                                checked={newShow}
                                onChange={(e) => setNewShow(e.target.checked)}
                                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                            />
                            <span className="text-gray-600">Active</span>
                        </label>
                        <button
                            onClick={handleAdd}
                            disabled={!newName.trim()}
                            className="flex-1 h-full bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>
            </div>

            {/* QUICK ADD / POPULAR */}
            {/* <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Services</h3>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_SERVICES.map((name) => {
                        const isAdded = services.some(s => s.name === name);
                        return (
                            <button
                                key={name}
                                onClick={() => handleQuickAdd(name)}
                                disabled={isAdded}
                                className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                                    ${isAdded 
                                        ? 'bg-orange-50 border-orange-200 text-orange-400 cursor-default' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600'
                                    }
                                `}
                            >
                                {isAdded && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {name}
                                {!isAdded && <Plus className="w-3.5 h-3.5 opacity-50" />}
                            </button>
                        );
                    })}
                </div>
            </div> */}

            {/* SERVICES LIST GRID */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <h3 className="text-sm font-bold text-gray-700">
                        Service List ({services.length})
                    </h3>
                </div>

                {services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                        <AlertCircle className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-gray-400 text-sm">No services added yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <div 
                                key={service.id} 
                                className={`
                                    relative p-4 rounded-xl border transition group bg-white
                                    ${editingId === service.id ? 'border-orange-400 ring-4 ring-orange-50 shadow-md z-10' : 'border-gray-200 hover:border-orange-200 hover:shadow-sm'}
                                `}
                            >
                                {editingId === service.id ? (
                                    // EDIT MODE
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-orange-500 uppercase">Editing Service</span>
                                        </div>
                                        <input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))}
                                            className={inputClasses}
                                            placeholder="Service Name"
                                            autoFocus
                                        />
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))}
                                            className={`${inputClasses} resize-none`}
                                            placeholder="Description"
                                            rows={2}
                                        />
                                        <div className="flex items-center justify-between pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editForm.showInAppointment}
                                                    onChange={(e) => setEditForm(prev => ({...prev, showInAppointment: e.target.checked}))}
                                                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                                />
                                                <span className="text-sm text-gray-700">Active</span>
                                            </label>
                                            <div className="flex gap-2">
                                                <button onClick={cancelEdit} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition"><X className="w-4 h-4" /></button>
                                                <button onClick={saveEdit} className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // VIEW MODE
                                    <>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-800">{service.name}</h4>
                                                {service.showInAppointment ? (
                                                    <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span>
                                                ) : (
                                                    <span className="w-2 h-2 rounded-full bg-gray-300" title="Inactive"></span>
                                                )}
                                            </div>
                                            
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                                                <button 
                                                    onClick={() => startEdit(service)} 
                                                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(service.id)} 
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                            {service.description || "No description provided."}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER ACTIONS */}
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
                    className="px-8 py-3 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition"
                >
                    Save & Next
                </button>
            </div>
        </div>
    );
}