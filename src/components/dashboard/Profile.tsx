import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import type { PatientProfile } from '../../features/patient/dashboard/dashboard.types';
import { uploadFile } from '../../features/common/upload.service';


interface ProfileProps {
  user: PatientProfile;
  // onUpdateUser: (updatedUser: PatientProfile) => Promise<void>;
  onUpdateUser: (data: FormData) => Promise<void>;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  type ProfileImage = string;
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    gender: string;
    mobile_number: string;
    profile_image: ProfileImage;
  }>({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    date_of_birth: user.date_of_birth,
    gender: user.gender,
    mobile_number: user.mobile_number,
    profile_image: user.profile_image ?? "",
  });



  useEffect(() => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      mobile_number: user.mobile_number,
      profile_image: user.profile_image ?? "",
    });
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    if (!formData.mobile_number?.trim()) {
      newErrors.mobile_number = 'Mobile number is required';
    } else if (!/^\+?[\d\s()-]+$/.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Invalid mobile number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   const updatedUser: PatientProfile = {
  //     ...user,
  //     first_name: formData.first_name,
  //     last_name: formData.last_name,
  //     email: formData.email,
  //     mobile_number: formData.mobile_number,
  //     date_of_birth: formData.date_of_birth,
  //     gender: formData.gender,
  //     profile_image: formData.profile_image,
  //   };

  //   try {
  //     await onUpdateUser(updatedUser);
  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   setIsEditing(false);
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = new FormData();

    payload.append("first_name", formData.first_name);
    payload.append("last_name", formData.last_name);
    payload.append("email", formData.email);
    payload.append("mobile_number", formData.mobile_number);
    payload.append("date_of_birth", formData.date_of_birth);
    payload.append("gender", formData.gender);
    payload.append("profile_image", formData.profile_image);

    try {
      await onUpdateUser(payload);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };


  const handleCancel = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      mobile_number: user.mobile_number,
      profile_image: user.profile_image ?? "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to render required symbol
  const RequiredSymbol = () => (
    <span className="text-red-500 ml-1">*</span>
  );

  // Determine if field is required (all fields except gender)
  const isRequired = (fieldName: string) => {
    return fieldName !== 'gender';
  };

  // // Image handling functions
  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFormData(prev => ({ ...prev, profile_image: reader.result as string }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const previewUrl = URL.createObjectURL(file);

  //   setFormData((prev) => ({
  //     ...prev,
  //     profile_image: file,
  //   }));

  //   setPreview(previewUrl);
  // };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gray-900 rounded-xl text-white">
            <Icons.User />
          </div>
          Profile Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Icons.Edit />
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Required fields note */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Fields marked with <span className="text-red-500">*</span>are required
            </p>
          </div>

          {/* Profile Image Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.profile_image ? (
                  <img
                    src={
                      preview ||
                      (typeof formData.profile_image === "string"
                        ? formData.profile_image
                        : "")
                    }
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  />
                ) : null}
                <div className={`w-24 h-24 bg-gradient-to-br from-gray-100 via-orange-600 to-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-2xl ${formData.profile_image ? 'hidden' : ''}`}>
                  <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Click the edit button to change your profile picture</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Upload Photo
                  </button>

                  {formData.profile_image && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          profile_image: "",
                        }))
                      }
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const uploadedFile = await uploadFile(file);

                    setFormData(prev => ({
                      ...prev,
                      profile_image: uploadedFile.url,
                    }));

                    setPreview(uploadedFile.url);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                First Name
                {isRequired('first_name') && <RequiredSymbol />}
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg  ${errors.first_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  {errors.first_name}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Last Name
                {isRequired('last_name') && <RequiredSymbol />}
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${errors.last_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  {errors.last_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Email Address
                {isRequired('email') && <RequiredSymbol />}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Mobile Number
                {isRequired('mobile_number') && <RequiredSymbol />}
              </label>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${errors.mobile_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
              />
              {errors.mobile_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mobile_number}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Date of Birth
                {isRequired(' date_of_birth') && <RequiredSymbol />}
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                  }`}
                required
              />
              {errors.date_of_birth && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  {errors.date_of_birth}
                </p>
              )}
            </div>

            {/* Gender - Not Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                Gender
                <span className="text-gray-400 text-xs ml-2">(Optional)</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 ">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <p className="text-gray-900 font-medium">{`${user.first_name} ${user.last_name}`}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                <p className="text-gray-900 font-medium">{formatDate(user.date_of_birth)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                <p className="text-gray-900 font-medium">{user.mobile_number}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                <p className="text-gray-900 font-medium capitalize">{user.gender}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};