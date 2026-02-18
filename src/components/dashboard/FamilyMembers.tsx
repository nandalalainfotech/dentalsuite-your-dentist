/* eslint-disable react-hooks/static-components */
import React, { useState } from 'react';
import type { FamilyMember } from '../../types/dashboard';

interface NewMemberFormData {
  name: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other' | '';
  dob?: string;
  relationship: FamilyMember['relationship'] | '';
}

interface EditMemberFormData extends NewMemberFormData {
  id: string;
}

interface FamilyMembersProps {
  members: FamilyMember[];
  onAddMember: (newMember: Omit<FamilyMember, 'id' | 'isActive'>) => void;
  onSwitchActive: (memberId: string) => void;
  onEditMember: (memberId: string, updatedData: Partial<FamilyMember>) => void;
  onDeleteMember: (memberId: string) => void;
}


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
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
};

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: NewMemberFormData | EditMemberFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  mode: 'add' | 'edit';
  title: string;
}

const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  mode = 'add',
  title
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-auto max-h-[85vh] overflow-hidden flex flex-col mt-10">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icons.Close />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 flex-1 overflow-y-auto">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-3 sm:space-y-4">

            {/* Name Field */}
            <div>
              <label htmlFor={`${mode}MemberName`} className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id={`${mode}MemberName`}
                name="name"
                value={formData.name}
                onChange={onChange}
                className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Enter full name"
                required
                autoFocus={mode === 'add'}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor={`${mode}MemberEmail`} className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id={`${mode}MemberEmail`}
                name="email"
                value={formData.email || ''}
                onChange={onChange}
                className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="example@email.com"
              />
            </div>

            {/* Grid for Phone and Gender - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Phone Field */}
              <div>
                <label htmlFor={`${mode}MemberPhone`} className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id={`${mode}MemberPhone`}
                  name="phone"
                  value={formData.phone || ''}
                  onChange={onChange}
                  className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Gender Field */}
              <div>
                <label htmlFor={`${mode}MemberGender`} className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gender
                </label>
                <div className="relative">
                  <select
                    id={`${mode}MemberGender`}
                    name="gender"
                    value={formData.gender || ''}
                    onChange={onChange}
                    className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none pr-10 bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Icons.ChevronDown />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid for DOB and Relationship - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Date of Birth Field */}
              <div>
                <label htmlFor={`${mode}MemberDob`} className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={`${mode}MemberDob`}
                    name="dob"
                    value={formData.dob || ''}
                    onChange={onChange}
                    className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none pr-10"
                    placeholder="dd-mm-yyyy"
                  />
                </div>
              </div>

              {/* Relationship Field */}
              <div>
                <label htmlFor={`${mode}MemberRelationship`} className="block text-sm font-medium text-gray-700 mb-1.5">
                  Relationship <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    id={`${mode}MemberRelationship`}
                    name="relationship"
                    value={formData.relationship}
                    onChange={onChange}
                    className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none pr-10 bg-white"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="self">Self</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Icons.ChevronDown />
                  </div>
                </div>
              </div>
            </div>

            {/* Required fields note */}
            <div className="pt-1">
              <p className="text-xs text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.name.trim() || !formData.relationship}
                  className={`flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${(!formData.name.trim() || !formData.relationship)
                    ? 'bg-orange-500 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                >
                  {mode === 'add' ? 'Add Family Member' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export const FamilyMembers: React.FC<FamilyMembersProps> = ({
  members,
  onAddMember,
  onSwitchActive,
  onEditMember,
  onDeleteMember
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);

  const [newMemberForm, setNewMemberForm] = useState<NewMemberFormData>({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    relationship: '',
  });

  const [editMemberForm, setEditMemberForm] = useState<EditMemberFormData>({
    id: '',
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

  const resetEditMemberForm = () => {
    setEditMemberForm({
      id: '',
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

  const handleOpenEditMemberModal = (member: FamilyMember) => {
    setEditMemberForm({
      id: member.id,
      name: member.name,
      email: member.email || '',
      phone: member.phone || '',
      gender: member.gender || '',
      dob: member.dateOfBirth || '',
      relationship: member.relationship,
    });
    setShowEditMemberModal(true);
  };

  const handleCloseEditMemberModal = () => {
    setShowEditMemberModal(false);
    resetEditMemberForm();
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    formType: 'add' | 'edit'
  ) => {
    const { name, value } = e.target;
    if (formType === 'add') {
      setNewMemberForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setEditMemberForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddMemberSubmit = () => {
    if (!newMemberForm.name.trim() || !newMemberForm.relationship || !newMemberForm.relationship) {
      alert('Name and Relationship are required!');
      return;
    }

    onAddMember({
      name: newMemberForm.name.trim(),
      email: newMemberForm.email?.trim() || undefined,
      phone: newMemberForm.phone?.trim() || undefined,
      gender: newMemberForm.gender as 'male' | 'female' | 'other' | undefined,
      dateOfBirth: newMemberForm.dob || undefined,
      relationship: newMemberForm.relationship as FamilyMember['relationship'],
    });

    handleCloseAddMemberModal();
  };

  const handleEditMemberSubmit = () => {
    if (!editMemberForm.name.trim() || !editMemberForm.relationship) {
      alert('Name and Relationship are required!');
      return;
    }

    onEditMember(editMemberForm.id, {
      name: editMemberForm.name.trim(),
      email: editMemberForm.email?.trim() || undefined,
      phone: editMemberForm.phone?.trim() || undefined,
      gender: editMemberForm.gender as 'male' | 'female' | 'other' | undefined,
      dateOfBirth: editMemberForm.dob || undefined,
      relationship: editMemberForm.relationship as FamilyMember['relationship'],
    });

    handleCloseEditMemberModal();
  };

  const handleDeleteMember = (memberId: string) => {
    onDeleteMember(memberId);
    setShowDeleteConfirm(null);
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-xl text-white">
            <Icons.Family />
          </div>
          Family Members
        </h2>
        <button
          onClick={handleOpenAddMemberModal}
          className="px-4 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 self-start sm:self-auto shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Family Member</span>
        </button>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${member.isActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
              }`}
            onClick={() => !member.isActive && onSwitchActive(member.id)}
          >
            {/* Use items-start to keep icon at top if list grows */}
            <div className="flex items-start justify-between">

              <div className="flex items-start space-x-4">
                {/* Icon Box */}
                <div className={`p-3 rounded-lg flex-shrink-0 ${member.isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {getRelationshipIcon(member.relationship)}
                </div>

                {/* Data Column - Vertical Stack */}
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 text-base">{member.name}</h3>
                    {member.isActive && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Relationship */}
                  <p className="text-sm font-medium text-gray-500">
                    {getRelationshipLabel(member.relationship)}
                  </p>

                  {/* Additional Information Stack */}
                  {member.email && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {member.email}
                    </p>
                  )}

                  {member.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {member.phone}
                    </p>
                  )}

                  {member.dateOfBirth && (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {new Date(member.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {member.relationship !== 'self' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditMemberModal(member);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit member"
                    >
                      {/* Edit Icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(showDeleteConfirm === member.id ? null : member.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete member"
                    >
                      {/* Delete Icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Delete Confirmation Box */}
            {showDeleteConfirm === member.id && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-sm text-red-700 font-medium">
                    Are you sure you want to remove {member.name}?
                  </p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(null);
                      }}
                      className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMember(member.id);
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals remain the same... */}
      <MemberModal
        isOpen={showAddMemberModal}
        onClose={handleCloseAddMemberModal}
        onSubmit={handleAddMemberSubmit}
        formData={newMemberForm}
        onChange={(e) => handleFormChange(e, 'add')}
        mode="add"
        title="Add Family Member"
      />

      <MemberModal
        isOpen={showEditMemberModal}
        onClose={handleCloseEditMemberModal}
        onSubmit={handleEditMemberSubmit}
        formData={editMemberForm}
        onChange={(e) => handleFormChange(e, 'edit')}
        mode="edit"
        title="Edit Family Member"
      />
    </div>
  );
};