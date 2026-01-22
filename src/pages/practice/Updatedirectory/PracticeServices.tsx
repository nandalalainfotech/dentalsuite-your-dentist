import { useState } from 'react';
import { Briefcase, Edit2, Trash2 } from 'lucide-react';
import { SectionHeader, InputGroup } from './SharedEditorComponents';
import type { Clinic } from '../../../types/clinic';

interface Service {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
}

export default function PracticeServices({ clinicData }: { clinicData: Clinic }) {
    const [services, setServices] = useState<Service[]>(
        (clinicData.services || []).map((service, i) => ({
            id: i.toString(),
            name: service,
            description: '',
            status: 'active' as 'active' | 'inactive'
        }))
    );
    const [isAddingService, setIsAddingService] = useState(false);
    const [editingService, setEditingService] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        status: 'active' | 'inactive';
    }>({
        name: '',
        description: '',
        status: 'active'
    });

    const handleAddService = () => {
        if (formData.name) {
            const newService: Service = {
                id: Date.now().toString(),
                ...formData
            };
            setServices([...services, newService]);
            setFormData({ name: '', description: '', status: 'active' });
            setIsAddingService(false);
        }
    };

    const handleEditService = (service: Service) => {
        setEditingService(service.id);
        setFormData({
            name: service.name,
            description: service.description || '',
            status: service.status
        });
    };

    const handleUpdateService = () => {
        if (formData.name && editingService) {
            setServices(services.map(service =>
                service.id === editingService
                    ? { ...service, ...formData }
                    : service
            ));
            setEditingService(null);
            setFormData({ name: '', description: '', status: 'active' });
        }
    };

    const handleDeleteService = (id: string) => {
        setServices(services.filter(service => service.id !== id));
    };

    const toggleServiceStatus = (id: string) => {
        setServices(services.map(service =>
            service.id === id
                ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
                : service
        ));
    };

    return (
        <div className="max-w-5xl mx-auto">
            <SectionHeader
                title="Medical Services"
                desc="List the treatments and procedures provided."
                actionLabel="Add Service"
                onActionClick={() => setIsAddingService(true)}
            />

            {isAddingService && (
                <div className="mb-6 p-5 rounded-xl border border-orange-200 bg-orange-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputGroup
                            label="Service Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Description (Optional)</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none transition"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddService}
                            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
                        >
                            Add Service
                        </button>
                        <button
                            onClick={() => setIsAddingService(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <div key={service.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center hover:bg-white hover:shadow-sm transition relative group">
                        {editingService === service.id ? (
                            <div className="w-full space-y-4">
                                <InputGroup
                                    label="Service Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none transition"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Description (Optional)"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpdateService}
                                        className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setEditingService(null)}
                                        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${service.status === 'active'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                                        {service.description && (
                                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                        )}
                                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                            <button
                                                onClick={() => toggleServiceStatus(service.id)}
                                                className={`font-medium ${service.status === 'active' ? 'text-green-600' : 'text-gray-500'
                                                    }`}
                                            >
                                                {service.status === 'active' ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditService(service)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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