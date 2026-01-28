import React, { useState } from 'react';
import { Plus, Trash2, ArrowUpDown, Clock, UserCheck, UserPlus } from 'lucide-react';

interface AppointmentType {
  id: string;
  name: string; // Maps to "Description" in your image
  existingPatientDuration: number; // in minutes
  newPatientDuration: number | null; // in minutes, null means "-"
}

const initialAppointmentTypes: AppointmentType[] = [
  {
    id: '1',
    name: 'Consultation',
    existingPatientDuration: 30,
    newPatientDuration: 30,
  },
  {
    id: '2',
    name: 'Check Up and Clean',
    existingPatientDuration: 30,
    newPatientDuration: 30,
  },
  {
    id: '3',
    name: 'Recall',
    existingPatientDuration: 30,
    newPatientDuration: null, // This renders as "-"
  },
  {
    id: '4',
    name: 'Emergency',
    existingPatientDuration: 30,
    newPatientDuration: 30,
  },
];

// --- MODAL COMPONENT ---
interface AppointmentTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentType: Omit<AppointmentType, 'id'> & { id?: string }) => void;
  appointmentType?: AppointmentType | null;
}

const AppointmentTypeModal: React.FC<AppointmentTypeModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  appointmentType 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    existingPatientDuration: 30,
    newPatientDuration: 30,
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: appointmentType?.name || '',
        existingPatientDuration: appointmentType?.existingPatientDuration || 30,
        newPatientDuration: appointmentType?.newPatientDuration || 30,
      });
    }
  }, [isOpen, appointmentType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      // If user enters 0, treat it as null/not applicable
      newPatientDuration: formData.newPatientDuration === 0 ? null : formData.newPatientDuration,
      id: appointmentType?.id,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">
            {appointmentType ? 'Edit Appointment Type' : 'Add New Appointment Type'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description / Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description / Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g., Consultation"
            />
          </div>

          {/* Existing Patient Duration */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <UserCheck size={16} /> Existing Patient Duration (mins)
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                step="5"
                value={formData.existingPatientDuration}
                onChange={(e) => setFormData({ ...formData, existingPatientDuration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* New Patient Duration */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <UserPlus size={16} /> New Patient Duration (mins)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="5"
                value={formData.newPatientDuration}
                onChange={(e) => setFormData({ ...formData, newPatientDuration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Set to 0 if not applicable (will show as "-")</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- DELETE MODAL ---
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  typeName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, typeName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm shadow-xl p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Item?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">"{typeName}"</span>?
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function PracticeAppointmentType() {
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(initialAppointmentTypes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<AppointmentType | null>(null);
  const [deleteType, setDeleteType] = useState<AppointmentType | null>(null);

  const handleSave = (data: Omit<AppointmentType, 'id'> & { id?: string }) => {
    if (data.id) {
      setAppointmentTypes(prev => prev.map(type => type.id === data.id ? { ...type, ...data } as AppointmentType : type));
    } else {
      const newType = { ...data, id: Date.now().toString() } as AppointmentType;
      setAppointmentTypes(prev => [...prev, newType]);
    }
    setEditingType(null);
  };

  const handleDelete = () => {
    if (deleteType) {
      setAppointmentTypes(prev => prev.filter(type => type.id !== deleteType.id));
      setDeleteType(null);
    }
  };

  const formatDuration = (mins: number | null) => {
    if (!mins || mins === 0) return '-';
    return `${mins} mins`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Types</h1>
        <button
          onClick={() => {
            setEditingType(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          Add Type
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 font-bold text-gray-700 text-sm">Description</th>
              <th className="py-4 px-6 font-bold text-gray-700 text-sm">Existing Patient Duration</th>
              <th className="py-4 px-6 font-bold text-gray-700 text-sm">New Patient Duration</th>
              <th className="py-3 px-4 text-right">
                <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-bold text-gray-600 hover:bg-gray-50">
                  <ArrowUpDown size={14} />
                  Sort Appt Types
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointmentTypes.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No appointment types found. Click "Add Type" to create one.
                </td>
              </tr>
            ) : (
              appointmentTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {type.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {formatDuration(type.existingPatientDuration)}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {formatDuration(type.newPatientDuration)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingType(type);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-1.5 text-sm font-semibold text-blue-600 border border-blue-400 rounded hover:bg-blue-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteType(type)}
                        className="px-4 py-1.5 text-sm font-semibold text-red-600 border border-red-400 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AppointmentTypeModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingType(null); }}
        onSave={handleSave}
        appointmentType={editingType}
      />

      <DeleteConfirmModal
        isOpen={!!deleteType}
        onClose={() => setDeleteType(null)}
        onConfirm={handleDelete}
        typeName={deleteType?.name || ''}
      />
    </div>
  );
}