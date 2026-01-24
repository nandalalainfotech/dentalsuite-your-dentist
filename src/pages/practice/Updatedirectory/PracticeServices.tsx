import { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    showInAppointment: boolean;
    description: string;
}

export default function PracticeServices() {
    const [services, setServices] = useState<Service[]>([
        { id: '1', name: 'Dental', showInAppointment: true, description: '' },
        { id: '2', name: 'Teeth Cleaning', showInAppointment: true, description: '' }
    ]);

    const [name, setName] = useState('');
    const [showInAppointment, setShowInAppointment] = useState(true);
    const [description, setDescription] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');

    const addService = () => {
        if (!name.trim()) return;

        setServices(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                name,
                showInAppointment,
                description
            }
        ]);

        setName('');
        setDescription('');
        setShowInAppointment(true);
    };

    const deleteService = (id: string) => {
        setServices(prev => prev.filter(service => service.id !== id));
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

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* ADD SERVICES */}
            <div className="bg-white rounded-2xl p-6 border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-orange-500">
                        Add Services
                    </h2>

                    <button
                        onClick={addService}
                        className="px-6 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                    >
                        Save
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
                            placeholder="Enter Name"
                            className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Service Show In Appointments
                        </label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={showInAppointment}
                                    onChange={() => setShowInAppointment(true)}
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={!showInAppointment}
                                    onChange={() => setShowInAppointment(false)}
                                />
                                No
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
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-400 outline-none resize-none"
                    />
                </div>
            </div>

            {/* SERVICES LIST */}
            <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-orange-500 font-semibold mb-4">
                    Services
                </h3>

                <div className="flex flex-wrap gap-4">
                    {services.map(service => (
                        <div
                            key={service.id}
                            className="bg-white border rounded-full px-5 py-2 flex items-center gap-3"
                        >
                            {/* NAME / EDIT INPUT */}
                            {editingId === service.id ? (
                                <input
                                    value={editedName}
                                    onChange={e => setEditedName(e.target.value)}
                                    className="border rounded px-2 py-1 text-sm w-40"
                                />
                            ) : (
                                <span className="font-medium">{service.name}</span>
                            )}

                            {/* ACTIONS */}
                            <div className="flex items-center gap-2">
                                {editingId === service.id ? (
                                    <>
                                        <button
                                            onClick={() => saveEdit(service.id)}
                                            className="text-green-600 hover:bg-green-50 p-1 rounded"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(service)}
                                            className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteService(service.id)}
                                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
