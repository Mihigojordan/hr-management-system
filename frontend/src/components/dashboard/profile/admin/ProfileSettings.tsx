import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import Swal from 'sweetalert2';
import useAdminAuth from '../../../../context/AdminAuthContext';
import { API_URL } from '../../../../api/api';

interface AdminUser {
  id?: string;
  adminName?: string;
  adminEmail?: string;
  isLocked?: boolean;
  createdAt?: string;
  profileImage?: string;
  phone?: string;
}

interface FormData {
  adminName: string;
  adminEmail: string;
  phone: string;
  createdAt: string;
  profileImage: string;
}

const ProfileSettings: React.FC = () => {
  const { user, updateAdmin } = useAdminAuth() as {
    user: AdminUser | null;
    updateAdmin: (data: Partial<AdminUser>) => Promise<AdminUser>;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    adminName: user?.adminName || '',
    adminEmail: user?.adminEmail || '',
    phone: user?.phone || '',
    createdAt: user?.createdAt || '',
    profileImage: `${API_URL}${user?.profileImage}` || '',
  });


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    setFormData({     
         adminName: user?.adminName || '',
      adminEmail: user?.adminEmail || '',
      phone: user?.phone || '',
        createdAt: user?.createdAt || '',
        profileImage: `${API_URL}${user?.profileImage}` || '',
    })

  },[user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatePayload: Partial<AdminUser> = {
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        phone: formData.phone,
      };

      if (selectedFile) {
        const fd = new FormData();
        fd.append('profileImg', selectedFile);
        fd.append('adminName', formData.adminName);
        fd.append('adminEmail', formData.adminEmail);
        fd.append('phone', formData.phone);

        await updateAdmin(fd as unknown as Partial<AdminUser>);
      } else {
        await updateAdmin(updatePayload);
      }

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        confirmButtonColor: '#f97316', // orange
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while updating your profile.',
        confirmButtonColor: '#ef4444', // red
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      adminName: user?.adminName || '',
      adminEmail: user?.adminEmail || '',
      phone: user?.phone || '',
      createdAt: user?.createdAt || '',
      profileImage: user?.profileImage || '',
    });
    setIsEditing(false);
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  return (
    <>
      {/* Profile Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Basic Information
        </h2>

        {/* Profile Photo */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex space-x-3">
              <label
                className={`px-4 py-2 rounded-md transition-colors ${
                  isEditing
                    ? 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={!isEditing}
                  className="hidden"
                />
              </label>
              <button
                onClick={() =>
                  setFormData((prev) => ({ ...prev, profileImage: '' }))
                }
                disabled={!isEditing}
                className={`px-4 py-2 border border-gray-300 rounded-md transition-colors ${
                  isEditing
                    ? 'text-gray-700 hover:bg-gray-50'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                Remove
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Recommended image size is 400px x 400px
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="adminName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Admin Name
            </label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              value={formData.adminName}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                isEditing
                  ? 'focus:ring-orange-500 focus:border-orange-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="Enter admin name"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                isEditing
                  ? 'focus:ring-orange-500 focus:border-orange-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label
              htmlFor="adminEmail"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleInputChange}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                isEditing
                  ? 'focus:ring-orange-500 focus:border-orange-500'
                  : 'bg-gray-100 text-gray-600 cursor-not-allowed'
              }`}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label
              htmlFor="createdAt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Account Created
            </label>
            <input
              type="datetime-local"
              id="createdAt"
              name="createdAt"
              value={formatDate(formData.createdAt)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Update
          </button>
        </div>
      )}

      {isEditing && (
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </>
  );
};

export default ProfileSettings;
