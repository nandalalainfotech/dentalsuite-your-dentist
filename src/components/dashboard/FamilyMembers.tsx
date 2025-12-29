import React, { useState } from 'react';
import type { FamilyMember } from '../../types/dashboard';

interface FamilyMembersProps {
  members: FamilyMember[];
  onAddMember: () => void;
  onSwitchActive: (memberId: string) => void;
  onEditMember: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
}

export const FamilyMembers: React.FC<FamilyMembersProps> = ({
  members,
  onAddMember,
  onSwitchActive,
  onEditMember,
  onDeleteMember
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'child':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };

  const getRelationshipLabel = (relationship: FamilyMember['relationship']) => {
    return relationship.charAt(0).toUpperCase() + relationship.slice(1);
  };

  const handleDeleteMember = (memberId: string) => {
    onDeleteMember(memberId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Family Members</h2>
        <button
          onClick={onAddMember}
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
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
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
                    onEditMember(member.id);
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
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Click on a family member to switch the active patient context.</p>
      </div>
    </div>
  );
};