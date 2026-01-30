import { useState, useEffect } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import type { Clinic } from '../../../types';

interface Service {
    id: string;
    name: string;
    showInAppointment: boolean;
    description: string;
}

// Added onNext to props
export default function PracticeServices({ clinicData, onNext }: { clinicData: Clinic, onNext: () => void }) {
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        if (clinicData?.services && Array.isArray(clinicData.services)) {
            const formattedServices = clinicData.services.map((serviceName, index) => ({
                id: (index + 1).toString(),
                name: serviceName,
                showInAppointment: true,
                description: ''
            }));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setServices(formattedServices);
        } else {
            setServices([
                { id: '1', name: 'Dental', showInAppointment: true, description: '' },
                { id: '2', name: 'Teeth Cleaning', showInAppointment: true, description: '' }
            ]);
        }
    }, [clinicData]);

    const [name, setName] = useState('');
    const [showInAppointment, setShowInAppointment] = useState(true);
    const [description, setDescription] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');

    const addService = () => {
        if (!name.trim()) return;

        const newService: Service = {
            id: Date.now().toString(),
            name,
            showInAppointment,
            description
        };

        setServices(prev => [...prev, newService]);

        setName('');
        setDescription('');
        setShowInAppointment(true);

        console.log('New service added:', newService);
    };

    const deleteService = (id: string) => {
        setServices(prev => prev.filter(service => service.id !== id));
        console.log('Service deleted:', id);
    };

    const startEdit = (service: Service) => {
        setEditingId(service.id);
        setEditedName(service.name);
    };

    const saveEdit = (id: string) => {
        setServices(prev =>
            prev.map(service =>
                service.id === id ? { ...service, name: editedName } : service
            )
        );
        setEditingId(null);
        setEditedName('');
    };

    const handleSaveAndNext = () => {
        // Here you would save the 'services' array to your API
        console.log('Saving all services:', services);

        // Navigate to next tab
        onNext();
    };

    return (
        <div className="w-full space-y-6">

            {/* ADD SERVICES FORM */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-orange-500">
                        Add Services
                    </h2>

                    <button
                        onClick={addService}
                        className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition shadow-sm"
                    >
                        Add Service
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Service Name
                        </label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addService()}
                            placeholder="Enter Name"
                            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Show In Appointments
                        </label>
                        <div className="flex gap-6 mt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    className="text-orange-500 focus:ring-orange-500"
                                    checked={showInAppointment}
                                    onChange={() => setShowInAppointment(true)}
                                />
                                <span className="text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    className="text-orange-500 focus:ring-orange-500"
                                    checked={!showInAppointment}
                                    onChange={() => setShowInAppointment(false)}
                                />
                                <span className="text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700">
                        Short Description
                    </label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Short Information"
                        rows={4}
                        className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none transition"
                    />
                </div>
            </div>

            {/* SERVICES LIST */}
            <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-gray-800 font-bold mb-4">
                    Active Services
                </h3>

                <div className="flex flex-wrap gap-4">
                    {services.length === 0 && (
                        <p className="text-gray-400 text-sm">No services added yet.</p>
                    )}

                    {services.map(service => (
                        <div
                            key={service.id}
                            className="bg-white border border-gray-200 rounded-full px-5 py-2 flex items-center gap-3 shadow-sm hover:border-orange-200 transition"
                        >
                            {/* NAME / EDIT INPUT */}
                            {editingId === service.id ? (
                                <input
                                    value={editedName}
                                    onChange={e => setEditedName(e.target.value)}
                                    className="border border-orange-300 rounded px-2 py-1 text-sm w-32 outline-none focus:ring-1 focus:ring-orange-500"
                                    autoFocus
                                />
                            ) : (
                                <span className="font-medium text-gray-700">{service.name}</span>
                            )}

                            {/* ACTIONS */}
                            <div className="flex items-center gap-1 border-l pl-2 ml-1 border-gray-200">
                                {editingId === service.id ? (
                                    <>
                                        <button
                                            onClick={() => saveEdit(service.id)}
                                            className="text-green-600 hover:bg-green-50 p-1.5 rounded-full transition"
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-full transition"
                                        >
                                            <X size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(service)}
                                            className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-full transition"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => deleteService(service.id)}
                                            className="text-orange-500 hover:bg-orange-50 p-1.5 rounded-full transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
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