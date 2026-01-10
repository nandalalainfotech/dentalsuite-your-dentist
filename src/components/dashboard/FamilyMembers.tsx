import React, { useState } from 'react';
import type { FamilyMember } from '../../types/dashboard';

interface NewMemberFormData {
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  dob: string;
  relationship: FamilyMember['relationship'] | '';
}



interface FamilyMembersProps {
  members: FamilyMember[];
  onAddMember: (newMember: Omit<FamilyMember, 'id' | 'isActive'>) => void;
  onSwitchActive: (memberId: string) => void;
  onEditMember: (memberId: string, updatedData: Partial<FamilyMember>) => void;
  onDeleteMember: (memberId: string) => void;
}

interface EditableMember {
  id: string;
  name: string;
  relationship: FamilyMember['relationship'];
}

export const FamilyMembers: React.FC<FamilyMembersProps> = ({
  members,
  onAddMember,
  onSwitchActive,
  onEditMember,
  onDeleteMember
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<EditableMember | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempRelationship, setTempRelationship] = useState<FamilyMember['relationship']>('self');

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState<NewMemberFormData>({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    relationship: '',
  });


  const resetNewMemberForm = () => {
    setNewMemberForm({
      name: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      relationship: '',
    });
  };

  const handleOpenAddMemberModal = () => {
    resetNewMemberForm();
    setShowAddMemberModal(true);
  };

  const handleCloseAddMemberModal = () => {
    setShowAddMemberModal(false);
    resetNewMemberForm();
  };

  const handleNewMemberFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMemberForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMemberSubmit = () => {
    if (!newMemberForm.name.trim() || !newMemberForm.relationship) {
      alert('Name and Relationship are required!');
      return;
    }

    onAddMember({
      name: newMemberForm.name.trim(),
      email: newMemberForm.email?.trim() || undefined,
      phone: newMemberForm.phone?.trim() || undefined,
      gender: newMemberForm.gender || undefined,
      dateOfBirth: newMemberForm.dob || undefined,
      relationship: newMemberForm.relationship as FamilyMember['relationship'],
    });


    handleCloseAddMemberModal();
  };


  const getRelationshipIcon = (relationship: FamilyMember['relationship']) => {
    switch (relationship) {
      case 'self':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'father':
      case 'mother':
      case 'spouse':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'child':
      case 'sibling':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126.1283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };

  const getRelationshipLabel = (relationship: FamilyMember['relationship'] | '') => {
    if (!relationship) return 'Not set';
    return relationship.charAt(0).toUpperCase() + relationship.slice(1);
  };

  const handleDeleteMember = (memberId: string) => {
    onDeleteMember(memberId);
    setShowDeleteConfirm(null);
  };

  const handleStartEdit = (member: FamilyMember) => {
    setEditingMember({
      id: member.id,
      name: member.name,
      relationship: member.relationship
    });
    setTempName(member.name);
    setTempRelationship(member.relationship);
  };

  const handleSaveEdit = () => {
    if (editingMember && tempName.trim()) {
      onEditMember(editingMember.id, { name: tempName.trim(), relationship: tempRelationship });
      setEditingMember(null);
      setTempName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setTempName('');
    setTempRelationship('self');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const Icons = {
    Family: () => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    Calendar: () => (
      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-xl text-white">
            <Icons.Family />
          </div>Family Members</h2>
        <button
          onClick={handleOpenAddMemberModal}
          className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-1 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Member</span>
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${member.isActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
              }`}
            onClick={() => !member.isActive && onSwitchActive(member.id)}
          >
            {editingMember?.id === member.id ? (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${member.isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {getRelationshipIcon(tempRelationship)}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter name"
                      autoFocus
                    />
                    <select
                      value={tempRelationship}
                      onChange={(e) => setTempRelationship(e.target.value as FamilyMember['relationship'])}
                      className="mt-2 w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l-.707.707L6%207.707%202.707%2011.293l-.707-.707L5.293%207.293z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
                    >
                      <option value="self">Self</option>
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="child">Child</option>
                      <option value="spouse">Spouse</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={!tempName.trim()}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${tempName.trim()
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 text-sm font-semibold bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${member.isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {getRelationshipIcon(member.relationship)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{member.name}</h3>
                        {member.isActive && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{getRelationshipLabel(member.relationship)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(member);
                      }}
                      className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {member.relationship !== 'self' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(showDeleteConfirm === member.id ? null : member.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {showDeleteConfirm === member.id && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 mb-2">
                      Are you sure you want to remove {member.name}?
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMember(member.id);
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(null);
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseAddMemberModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Family Member</h3> {/* Increased margin-bottom */}
            <form onSubmit={(e) => { e.preventDefault(); handleAddMemberSubmit(); }} className="space-y-4">
              <div>
                <label htmlFor="newMemberName" className="block text-sm font-medium text-gray-900 mb-1">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="newMemberName"
                  name="name"
                  value={newMemberForm.name}
                  onChange={handleNewMemberFormChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="newMemberEmail" className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                <input
                  type="email"
                  id="newMemberEmail"
                  name="email"
                  value={newMemberForm.email}
                  onChange={handleNewMemberFormChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="newMemberPhone" className="block text-sm font-medium text-gray-900 mb-1">Phone</label>
                <input
                  type="tel"
                  id="newMemberPhone"
                  name="phone"
                  value={newMemberForm.phone}
                  onChange={handleNewMemberFormChange}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="newMemberGender" className="block text-sm font-medium text-gray-900 mb-1">Gender</label>
                <select
                  id="newMemberGender"
                  name="gender"
                  value={newMemberForm.gender}
                  onChange={handleNewMemberFormChange}
                  className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l-.707.707L6%207.707%202.707%2011.293l-.707-.707L5.293%207.293z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="newMemberDob" className="block text-sm font-medium text-gray-900 mb-1">Date of Birth</label>
                <div className="relative">
                  <input
                    type="text" // Changed to text for placeholder accuracy
                    id="newMemberDob"
                    name="dob"
                    value={newMemberForm.dob}
                    onChange={handleNewMemberFormChange}
                    placeholder="mm/dd/yyyy" // Placeholder as per image
                    onFocus={(e) => (e.target.type = 'date')} // Change to date input on focus
                    onBlur={(e) => { // Change back to text if empty after blur
                      if (!e.target.value) {
                        e.target.type = 'text';
                      }
                    }}
                    className="block w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Icons.Calendar />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="newMemberRelationship" className="block text-sm font-medium text-gray-900 mb-1">Relationship <span className="text-red-500">*</span></label>
                <select
                  id="newMemberRelationship"
                  name="relationship"
                  value={newMemberForm.relationship}
                  onChange={handleNewMemberFormChange}
                  className="block w-full pl-3 pr-10 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l-.707.707L6%207.707%202.707%2011.293l-.707-.707L5.293%207.293z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3"
                  required
                >
                  <option value="">Other</option> {/* Default option as per image */}
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="child">Child</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-2 border-t border-gray-100"> {/* Added border-t for separator */}
                <button
                  type="button"
                  onClick={handleCloseAddMemberModal}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newMemberForm.name.trim() || !newMemberForm.relationship}
                  className={`px-4 py-2 text-sm font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${(!newMemberForm.name.trim() || !newMemberForm.relationship) ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};