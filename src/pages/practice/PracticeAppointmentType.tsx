import React, { useEffect, useState } from 'react';
import { Plus, ArrowUpDown, Info, ChevronLeft, HelpCircle, GripVertical } from 'lucide-react';
import type { Clinic, AppointmentType as ClinicAppointmentType, Dentist } from '../../types/clinic';
import { clinics } from '../../data/clinics';
import { usePracticeAuth } from '../../hooks/usePracticeAuth';

// --- TYPES ---
interface AppointmentType {
  id: string;
  name: string;
  // Existing Patient Settings
  existingEnabled: boolean;
  existingDuration: number;
  existingLink: string;
  existingFutureBookingLimit: number;
  // New Patient Settings
  newEnabled: boolean;
  newDuration: number;
  newLink: string;
  newFutureBookingLimit: number;
  newTermsEnabled: boolean;
  // General Settings
  onlineEnabled: boolean;
  askReason: boolean;
  addMessage: boolean;
  unavailableAction: 'call' | 'inform';
  cancellationEnabled: boolean;
}

const timeOptions = [5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 90, 120];

const buildAppointmentTypes = (types?: ClinicAppointmentType[]): AppointmentType[] => {
  if (!types || types.length === 0) return [];

  return types.map((type) => {
    const isEmergency = type.name.toLowerCase().includes('emergency');

    return {
      id: type.id,
      name: type.name,
      existingEnabled: true,
      existingDuration: type.duration,
      existingLink: '',
      existingFutureBookingLimit: isEmergency ? 7 : 90,
      newEnabled: true,
      newDuration: type.duration,
      newLink: '',
      newFutureBookingLimit: isEmergency ? 7 : 90,
      newTermsEnabled: false,
      onlineEnabled: true,
      askReason: isEmergency,
      addMessage: isEmergency,
      unavailableAction: 'call',
      cancellationEnabled: !isEmergency
    };
  });
};

const buildDentists = (clinic?: Clinic): Dentist[] => clinic?.dentists ?? [];

// --- EDITOR COMPONENT ---
interface AppointmentTypeEditorProps {
  initialData?: AppointmentType | null;
  dentists: Dentist[];
  onSave: (data: AppointmentType) => void;
  onCancel: () => void;
}

const AppointmentTypeEditor: React.FC<AppointmentTypeEditorProps> = ({
  initialData,
  dentists,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<AppointmentType>(initialData || {
    id: '',
    name: '',
    existingEnabled: false,
    existingDuration: 30,
    existingLink: '',
    existingFutureBookingLimit: 90,
    newEnabled: false,
    newDuration: 30,
    newLink: '',
    newFutureBookingLimit: 90,
    newTermsEnabled: false,
    onlineEnabled: true,
    askReason: false,
    addMessage: false,
    unavailableAction: 'call',
    cancellationEnabled: true
  });

  const [practitionerSettings, setPractitionerSettings] = useState<Record<string, { ex: boolean, new: boolean }>>({});

  const togglePractitioner = (pId: string, field: 'ex' | 'new') => {
    setPractitionerSettings(prev => ({
      ...prev,
      [pId]: { ...prev[pId], [field]: !prev[pId]?.[field] }
    }));
  };

  const handleSave = () => {
    onSave({ ...formData, id: formData.id || Date.now().toString() });
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={20} /> Back
          </button>
          <span className="text-gray-500 font-base text-2xl">|
          </span>
          <h1 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Appointment Type' : 'New Appointment Type'}
          </h1>
        </div>
        <button className="text-gray-600 border border-gray-300 px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
          <HelpCircle size={16} /> Need Help?
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-6 space-y-6 ">

        {/* SECTION 1: How it Appears to Patients */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-700 text-sm">How it Appears to Patients</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Appointment Name</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-blue-400 rounded-sm focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="e.g. Checkup"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.onlineEnabled}
                    onChange={(e) => setFormData({ ...formData, onlineEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enabled for online appointments</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.askReason}
                    onChange={(e) => setFormData({ ...formData, askReason: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Ask patients to enter the reason for their appointment</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.addMessage}
                    onChange={(e) => setFormData({ ...formData, addMessage: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Add a message to appear as soon as this appointment type is selected</span>
                </label>

                {/* RADIO GROUP 1: Unavailable Action */}
                <div className="mt-4 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-2 font-medium">When patients cannot book this appointment type with a practitioner:</p>
                  <div className="space-y-2 ml-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="unavailable_action_group" // UNIQUE NAME
                        checked={formData.unavailableAction === 'call'}
                        onChange={() => setFormData({ ...formData, unavailableAction: 'call' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Invite them to call the clinic</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="unavailable_action_group" // UNIQUE NAME
                        checked={formData.unavailableAction === 'inform'}
                        onChange={() => setFormData({ ...formData, unavailableAction: 'inform' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Inform them they cannot make an appointment</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Templates for Practitioners */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-700 text-sm">Templates for Practitioners</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6 max-w-3xl">
              Templates allow you to quickly set up new practitioners.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Existing Patients Column */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Existing Patients</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.existingEnabled}
                      onChange={(e) => setFormData({ ...formData, existingEnabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow existing patients to book this appointment type</span>
                  </label>

                  {formData.existingEnabled && (
                    <div className="ml-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-800">Default appointment length:</label>
                        <select
                          value={formData.existingDuration}
                          onChange={(e) => setFormData({ ...formData, existingDuration: parseInt(e.target.value) })}
                          className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:border-blue-500 outline-none"
                        >
                          {timeOptions.map(min => (
                            <option key={min} value={min}>{min} mins</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 mb-2">
                          Existing patients can book an appointment online no more than
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={formData.existingFutureBookingLimit}
                            onChange={(e) => setFormData({ ...formData, existingFutureBookingLimit: parseInt(e.target.value) || 0 })}
                            className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-center focus:border-blue-500 outline-none"
                          />
                          <span className="text-sm text-gray-800">days in the future</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* New Patients Column */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">New Patients</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.newEnabled}
                      onChange={(e) => setFormData({ ...formData, newEnabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow new patients to book this appointment type</span>
                  </label>

                  {formData.newEnabled && (
                    <div className="ml-6 space-y-4">
                      <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                        <label className="text-sm text-gray-800">Default appointment length:</label>
                        <select
                          value={formData.newDuration}
                          onChange={(e) => setFormData({ ...formData, newDuration: parseInt(e.target.value) })}
                          className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white min-w-[100px] text-gray-700 focus:border-blue-500 outline-none"
                        >
                          {timeOptions.map(min => (
                            <option key={min} value={min}>{min} mins</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <p className="text-sm text-gray-800 mb-2">
                          New patients can book an appointment online no more than
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={formData.newFutureBookingLimit}
                            onChange={(e) => setFormData({ ...formData, newFutureBookingLimit: parseInt(e.target.value) || 0 })}
                            className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-center focus:border-blue-500 outline-none"
                          />
                          <span className="text-sm text-gray-800">days in the future</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Link to Core Practice */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-700 text-sm">Link to Core Practice Appointment Type</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Link for Existing Patients
                </label>

                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-gray-100 cursor-not-allowed"
                  value=""
                  disabled
                // value={formData.existingLink}
                // onChange={(e) => setFormData({ ...formData, existingLink: e.target.value })}
                >
                  <option value="">Select PMS appointment type</option>
                  <option value="consult_std">Standard Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Link for New Patients</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-gray-100 cursor-not-allowed"
                  value=""
                  disabled
                // value={formData.newLink}
                // onChange={(e) => setFormData({ ...formData, newLink: e.target.value })}
                >
                  <option value="">Select PMS appointment type</option>
                  <option value="consult_new">New Patient Consultation</option>
                </select>
              </div>
            </div>

            {/* RADIO GROUP 2: Cancellations */}
            <div className="flex py-4 text-sm text-gray-700">
              <p>Accept Cancellations Online</p>
            </div>
            <div className="flex items-center justify-left gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cancellation_group" // UNIQUE NAME
                  checked={formData.cancellationEnabled === true}
                  onChange={() => setFormData({ ...formData, cancellationEnabled: true })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cancellation_group" // UNIQUE NAME
                  checked={formData.cancellationEnabled === false}
                  onChange={() => setFormData({ ...formData, cancellationEnabled: false })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 4: Practitioner Table */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700 text-sm">Appointment available online for your Active Practitioners</h2>
            <a className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <Info size={12} /> Additional customisations are available in your Practitioner Setup.
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="py-3 px-6 text-xs font-bold text-gray-600 uppercase w-48">Active Practitioner</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-600 uppercase w-48">Enable for Existing Patients</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-600 uppercase w-48">Enable for New Patients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dentists.map((dentist) => (
                  <tr key={dentist.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 text-sm">
                      <a href="/PracticeTeam" className="text-emerald-600 underline hover:text-emerald-700">{dentist.name}</a>
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="checkbox"
                        checked={!!practitionerSettings[dentist.id]?.ex}
                        onChange={() => togglePractitioner(dentist.id, 'ex')}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="checkbox"
                        checked={!!practitionerSettings[dentist.id]?.new}
                        onChange={() => togglePractitioner(dentist.id, 'new')}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-end gap-3 pt-4 pb-12">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-sm hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors font-medium shadow-sm"
          >
            Save Appointment Type
          </button>
        </div>

      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function PracticeAppointmentType() {
  const { practice: authPractice, isAuthenticated } = usePracticeAuth();
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingData, setEditingData] = useState<AppointmentType | null>(null);
  const [isSorting, setIsSorting] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    let activeClinic: Clinic | undefined = clinics[0];

    if (isAuthenticated && authPractice) {
      activeClinic = clinics.find(c =>
        c.email === authPractice.email ||
        c.id === authPractice.id
      ) ?? clinics[0];
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAppointmentTypes(buildAppointmentTypes(activeClinic?.appointmentTypes));
    setDentists(buildDentists(activeClinic));
  }, [isAuthenticated, authPractice]);

  const handleCreateNew = () => {
    setEditingData(null);
    setView('editor');
  };

  const handleEdit = (type: AppointmentType) => {
    setEditingData(type);
    setView('editor');
  };

  const handleSave = (data: AppointmentType) => {
    if (editingData) {
      setAppointmentTypes(prev => prev.map(t => t.id === data.id ? data : t));
    } else {
      setAppointmentTypes(prev => [...prev, data]);
    }
    setView('list');
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      setAppointmentTypes(prev => prev.filter(t => t.id !== id));
    }
  };

  const formatDuration = (enabled: boolean, mins: number) => {
    if (!enabled) return '-';
    return `${mins} mins`;
  };

  // --- Sorting Logic ---
  const onDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newItems = [...appointmentTypes];
    const draggedItem = newItems[draggedItemIndex];
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedItemIndex(index);
    setAppointmentTypes(newItems);
  };

  const onDrop = () => {
    setDraggedItemIndex(null);
  };

  if (view === 'editor') {
    return (
      <AppointmentTypeEditor
        initialData={editingData}
        dentists={dentists}
        onSave={handleSave}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Types</h1>
        <button
          onClick={handleCreateNew}
          disabled={isSorting}
          className={`flex items-center gap-2 px-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm ${isSorting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Plus size={16} />
          New Appointment Type
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {isSorting && <th className="py-4 px-2 w-10"></th>}
              <th className="py-4 px-6 font-bold text-gray-700 text-base">Description</th>
              <th className="py-4 px-6 font-bold text-gray-700 text-base">Existing Patient Duration</th>
              <th className="py-4 px-6 font-bold text-gray-700 text-base">New Patient Duration</th>
              <th className="py-3 px-4 text-right">
                <button
                  onClick={() => setIsSorting(!isSorting)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-bold transition-all ${isSorting
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <ArrowUpDown size={14} />
                  {isSorting ? 'Done Sorting' : 'Sort Appt Types'}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointmentTypes.length === 0 ? (
              <tr>
                <td colSpan={isSorting ? 5 : 4} className="py-8 text-center text-gray-500">
                  No appointment types found. Click "Add Type" to create one.
                </td>
              </tr>
            ) : (
              appointmentTypes.map((type, index) => (
                <tr
                  key={type.id}
                  draggable={isSorting}
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={onDrop}
                  className={`transition-colors ${isSorting
                    ? 'cursor-move hover:bg-blue-50'
                    : 'hover:bg-gray-50'
                    } ${draggedItemIndex === index ? 'bg-blue-100 opacity-50' : ''}`}
                >
                  {isSorting && (
                    <td className="pl-4">
                      <GripVertical size={20} className="text-gray-400" />
                    </td>
                  )}
                  <td className="py-4 px-6 text-gray-800 font-medium">{type.name}</td>
                  <td className="py-4 px-6 text-gray-600">{formatDuration(type.existingEnabled, type.existingDuration)}</td>
                  <td className="py-4 px-6 text-gray-600">{formatDuration(type.newEnabled, type.newDuration)}</td>
                  <td className="py-4 px-4 text-right">
                    {!isSorting && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(type)} className="px-2 py-1 text-sm font-bold text-blue-600 border border-blue-400 rounded hover:bg-blue-600 hover:text-white">Edit</button>
                        <button onClick={() => handleDelete(type.id)} className="px-2 py-1 text-sm font-bold text-red-600 border border-red-400 rounded hover:bg-red-600 hover:text-white">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
