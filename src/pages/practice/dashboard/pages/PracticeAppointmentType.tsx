import React, { useEffect, useState } from 'react';
import { Plus, ChevronLeft, HelpCircle, ChevronsUpDown } from 'lucide-react';

// Redux Imports
import { fetchAppointmentData, saveAppointmentData, deleteAppointmentType } from '../../../../features/appointment_types/appointment_types.slice';
import type { AppointmentType, TeamMemberApptContext, PractitionerSetting } from '../../../../features/appointment_types/appointment_types.types';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { usePracticePermissions } from '../../../../features/permissions/Permissions.hooks';

const timeOptions = [5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 90, 120];

interface AppointmentTypeEditorProps {
  initialData?: AppointmentType | null;
  teamMembers: TeamMemberApptContext[];
  onSave: (data: AppointmentType, settings: Record<string, PractitionerSetting>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const AppointmentTypeEditor: React.FC<AppointmentTypeEditorProps> = ({
  initialData, teamMembers, onSave, onCancel, isLoading
}) => {
  const [formData, setFormData] = useState<AppointmentType>(initialData || {
    id: `temp-${Date.now()}`,
    name: '', existingEnabled: false,
    existingDuration: 30,
    existingLink: '',
    existingFutureBookingLimit: 90,
    newEnabled: false, newDuration: 30,
    newLink: '', newFutureBookingLimit: 90,
    newTermsEnabled: false,
    onlineEnabled: true,
    askReason: false,
    addMessage: false,
    unavailableAction: 'call',
    cancellationEnabled: true
  });

  const [practitionerSettings, setPractitionerSettings] = useState<Record<string, PractitionerSetting>>({});

  useEffect(() => {
    const initialSettings: Record<string, PractitionerSetting> = {};
    teamMembers.forEach(member => {
      const exType = member.appointmentTypes?.find((t: any) => t.id === formData.id && t.patientType === 'Existing');
      const newType = member.appointmentTypes?.find((t: any) => t.id === formData.id && t.patientType === 'New');
      initialSettings[member.id] = {
        ex: exType ? exType.enabled : false,
        new: newType ? newType.enabled : false
      };
    });
    setPractitionerSettings(initialSettings);
  }, [teamMembers, formData.id]);

  const togglePractitioner = (pId: string, field: 'ex' | 'new') => {
    setPractitionerSettings(prev => ({
      ...prev, [pId]: { ...prev[pId], [field]: !prev[pId]?.[field] }
    }));
  };

  const handleSave = () => { onSave(formData, practitionerSettings); };

  return (
    <div className="min-h-screen pb-10">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium">
            <ChevronLeft size={20} /> Back</button>
          <span className="text-gray-500 font-base text-2xl">|</span>
          <h1 className="text-xl font-bold text-gray-800">{initialData && !initialData.id.startsWith('temp-') ? 'Edit Appointment Type' : 'New Appointment Type'}</h1>
        </div>
        <button className="text-gray-600 border border-gray-300 px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
          <HelpCircle size={16} /> Need Help?</button>
      </div>

      <div className="max-w-6xl mx-auto mt-6 space-y-6">
        {/* SECTION 1: How it Appears to Patients */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-700 text-sm">How it Appears to Patients</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Appointment Name</label>
                <input type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-400 rounded-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Checkup"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.onlineEnabled}
                    onChange={(e) => setFormData({ ...formData, onlineEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Enabled for online appointments</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.askReason}
                    onChange={(e) => setFormData({ ...formData, askReason: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Ask patients to enter the reason</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.addMessage}
                    onChange={(e) => setFormData({ ...formData, addMessage: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Add a message to appear</span>
                </label>
                <div className="mt-4 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-2 font-medium">When patients cannot book:</p>
                  <div className="space-y-2 ml-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="un_act" checked={formData.unavailableAction === 'call'}
                        onChange={() => setFormData({ ...formData, unavailableAction: 'call' })}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Invite them to call</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="un_act" checked={formData.unavailableAction === 'inform'}
                        onChange={() => setFormData({ ...formData, unavailableAction: 'inform' })}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Inform them they cannot make appt</span>
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
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Existing Patients</h3>
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" checked={formData.existingEnabled}
                  onChange={(e) => setFormData({ ...formData, existingEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Allow existing patients</span>
              </label>
              {formData.existingEnabled && (
                <div className="ml-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-800">Length:</label>
                    <select value={formData.existingDuration}
                      onChange={(e) => setFormData({ ...formData, existingDuration: parseInt(e.target.value) })}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white outline-none">{timeOptions.map(min => <option key={min} value={min}>{min} mins</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-800">Book no more than</p>
                    <input type="number" value={formData.existingFutureBookingLimit}
                      onChange={(e) => setFormData({ ...formData, existingFutureBookingLimit: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-center outline-none"
                    />
                    <span className="text-sm">days future</span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">New Patients</h3>
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" checked={formData.newEnabled}
                  onChange={(e) => setFormData({ ...formData, newEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Allow new patients</span>
              </label>
              {formData.newEnabled && (
                <div className="ml-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-800">Length:</label>
                    <select value={formData.newDuration}
                      onChange={(e) => setFormData({ ...formData, newDuration: parseInt(e.target.value) })}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white outline-none">{timeOptions.map(min => <option key={min} value={min}>{min} mins</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-800">Book no more than</p>
                    <input type="number" value={formData.newFutureBookingLimit}
                      onChange={(e) => setFormData({ ...formData, newFutureBookingLimit: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded text-sm text-center outline-none"
                    />
                    <span className="text-sm">days future</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
                  disabled
                  value={formData.existingLink || ""}
                  onChange={(e) => setFormData({ ...formData, existingLink: e.target.value })}
                >
                  <option value="">Select PMS appointment type</option>
                  <option value="consult_std">Standard Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Link for New Patients</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm bg-gray-100 cursor-not-allowed"
                  disabled
                  value={formData.newLink || ""}
                  onChange={(e) => setFormData({ ...formData, newLink: e.target.value })}
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
                  name="cancellation_group"
                  checked={formData.cancellationEnabled === true}
                  onChange={() => setFormData({ ...formData, cancellationEnabled: true })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cancellation_group"
                  checked={formData.cancellationEnabled === false}
                  onChange={() => setFormData({ ...formData, cancellationEnabled: false })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 4: Practitioner Checkboxes */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700 text-sm">Appointment available online for your Active Practitioners</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th className="py-3 px-6 text-xs font-bold text-gray-600 uppercase w-48">Active Practitioner</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-600 uppercase w-48">Enable for Existing</th>
                  <th className="py-3 px-6 text-xs font-bold text-gray-600 uppercase w-48">Enable for New</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-3 px-6 text-sm text-emerald-600 font-medium">{member.first_name || member.last_name
                      ? `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim()
                      : ''}</td>
                    <td className="py-3 px-6">
                      <input type="checkbox" checked={!!practitionerSettings[member.id]?.ex} onChange={() => togglePractitioner(member.id, 'ex')}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input type="checkbox" checked={!!practitionerSettings[member.id]?.new} onChange={() => togglePractitioner(member.id, 'new')}
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
          <button onClick={onCancel} disabled={isLoading}
            className="px-6 py-2 border text-gray-700 bg-white rounded-sm font-medium">Cancel
          </button>
          <button onClick={handleSave} disabled={isLoading}
            className={`px-6 py-2 bg-orange-500 text-white rounded-sm font-medium 
          ${isLoading ? 'opacity-50' : 'hover:bg-orange-600'}`}>
            {isLoading ? 'Saving...' : 'Save Appointment Type'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function PracticeAppointmentType() {
  const dispatch = useAppDispatch();
  const { data: appointmentTypes, teamMembers, loading, saveLoading } = useAppSelector((state) => state.appointmentTypes);
  const { user: authPractice, isAuthenticated } = useAppSelector((state: any) => state.auth);
  const currentPracticeId = authPractice?.practiceId || authPractice?.id;
  const { canCreate, canEdit, canDelete } = usePracticePermissions(currentPracticeId);
  const canCreateAppointmentType = canCreate('appointment_type');
  const canEditAppointmentType = canEdit('appointment_type');
  const canDeleteAppointmentType = canDelete('appointment_type');

  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingData, setEditingData] = useState<AppointmentType | null>(null);

  // --- NEW STATE FOR CUSTOM DELETE MODAL ---
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && currentPracticeId) {
      dispatch(fetchAppointmentData(currentPracticeId));
    }
  }, [dispatch, isAuthenticated, currentPracticeId]);

  const handleSave = async (data: AppointmentType, settings: Record<string, PractitionerSetting>) => {
    const isExistingRecord = Boolean(data.id && !data.id.startsWith('temp-'));
    const canSave = isExistingRecord ? canEditAppointmentType : canCreateAppointmentType;

    if (!canSave) {
      alert(`You do not have permission to ${isExistingRecord ? 'edit' : 'create'} appointment types.`);
      return;
    }

    if (!currentPracticeId) {
      alert("Authentication error: Practice ID missing.");
      return;
    }

    try {
      await dispatch(saveAppointmentData({
        id: data.id,
        data,
        practiceId: currentPracticeId,
        settings,
        teamMembers
      })).unwrap();

      setView('list');

    } catch (error: any) {
      alert(`Failed to save appointment type:\n\n${error.message || error}`);
    }
  };

  // --- UPDATED DELETE HANDLERS ---
  const triggerDelete = (id: string) => {
    if (!canDeleteAppointmentType) {
      alert('You do not have permission to delete appointment types.');
      return;
    }
    setTypeToDelete(id);
  };

  const confirmDelete = () => {
    if (typeToDelete) {
      dispatch(deleteAppointmentType(typeToDelete));
      setTypeToDelete(null);
    }
  };

  const formatDuration = (enabled: boolean, mins: number) => !enabled ? '-' : `${mins} mins`;

  if (view === 'editor') {
    return <AppointmentTypeEditor initialData={editingData} teamMembers={teamMembers} onSave={handleSave} onCancel={() => setView('list')} isLoading={saveLoading} />;
  }

  return (
    <div className="p-6 bg-white min-h-screen relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Types</h1>
        <button onClick={() => {
          setEditingData(null);
          setView('editor');
        }}
          disabled={loading || !canCreateAppointmentType}
          className={`flex items-center gap-2 px-2 py-2 bg-blue-600 text-white rounded font-medium text-sm 
          ${(loading || !canCreateAppointmentType) ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Plus size={16}
          /> New Appointment Type
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-4 px-6 font-bold text-gray-700 text-base">
                <div className="flex items-center gap-2 cursor-pointer group">
                  Description
                  <ChevronsUpDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </th>
              <th className="py-4 px-6 font-bold text-gray-700 text-base">
                <div className="flex items-center gap-2 cursor-pointer group">
                  Existing Patient Duration
                  <ChevronsUpDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </th>
              <th className="py-4 px-6 font-bold text-gray-700 text-base">
                <div className="flex items-center gap-2 cursor-pointer group">
                  New Patient Duration
                  <ChevronsUpDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ?
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">Loading...</td>
              </tr> : appointmentTypes.length === 0 ? <tr><td colSpan={4}
                className="py-8 text-center text-gray-500">No types found.</td>
              </tr>
                : (
                  appointmentTypes.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-800 font-medium">{type.name}</td>
                      <td className="py-4 px-6 text-gray-600">{formatDuration(type.existingEnabled, type.existingDuration)}</td>
                      <td className="py-4 px-6 text-gray-600">{formatDuration(type.newEnabled, type.newDuration)}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingData(type); setView('editor'); }}
                            disabled={!canEditAppointmentType}
                            className={`px-2 py-1 text-sm font-bold border rounded ${
                              canEditAppointmentType
                                ? 'text-blue-600 border-blue-400 hover:bg-blue-600 hover:text-white'
                                : 'text-gray-400 border-gray-200 cursor-not-allowed'
                            }`}>
                            Edit
                          </button>
                          <button onClick={() => triggerDelete(type.id)}
                            disabled={!canDeleteAppointmentType}
                            className={`px-2 py-1 text-sm font-bold border rounded ${
                              canDeleteAppointmentType
                                ? 'text-red-600 border-red-400 hover:bg-red-600 hover:text-white'
                                : 'text-gray-400 border-gray-200 cursor-not-allowed'
                            }`}>
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

      {/* --- CUSTOM DELETE CONFIRMATION MODAL --- */}
      {typeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Delete Appointment Type</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to delete this appointment type? This action will remove it from all practitioners and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTypeToDelete(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
