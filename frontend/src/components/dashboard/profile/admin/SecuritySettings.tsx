import React, { useState } from 'react';
import { Shield, CheckCircle, Settings, Trash2, Power } from 'lucide-react';
import useAdminAuth from '../../../../context/AdminAuthContext';
import Swal from 'sweetalert2';

interface AdminUser {
  id: string;
  adminName?: string;
  adminEmail?: string;
  isLocked?: boolean;
  createdAt?: string;
  profileImage?: string;
  phone?: string;
  is2FA?: boolean;
}

const SecuritySettings: React.FC = () => {
  const { user, updateAdmin } = useAdminAuth() as { user: AdminUser | null; updateAdmin: (updateData: Partial<AdminUser>) => Promise<AdminUser> };
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.is2FA || false);
  const [googleConnected, setGoogleConnected] = useState(true);
  const [phoneVerified] = useState(true);
  const [emailVerified] = useState(true);

  const handleChangePassword = () => {
    Swal.fire({
      title: 'Change Password',
      text: 'A modal to change your password would open here.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316', // orange-500
    });
  };

  const handleEnableTwoFactor = async () => {
    try {
      const action = twoFactorEnabled ? 'disable' : 'enable';
      const result = await Swal.fire({
        title: `Are you sure you want to ${action} Two Factor Authentication?`,
        text: twoFactorEnabled
          ? 'You will no longer receive OTP codes for login.'
          : 'You will receive OTP codes via SMS or email for login.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Yes, ${action} 2FA`,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#f97316', // orange-500
        cancelButtonColor: '#6b7280', // gray-500
      });

      if (result.isConfirmed) {
        if (!user?.id) {
          throw new Error('No logged-in admin to update');
        }
        await updateAdmin({ id: user.id, is2FA: !twoFactorEnabled });
        setTwoFactorEnabled(!twoFactorEnabled);
        Swal.fire({
          title: `2FA ${action}d`,
          text: `Two Factor Authentication has been ${action}d successfully.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f97316',
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || `Failed to ${twoFactorEnabled ? 'disable' : 'enable'} 2FA. Please try again.`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316',
      });
    }
  };

  const handleGoogleToggle = async () => {
    const action = googleConnected ? 'disconnect' : 'connect';
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} Google Authentication?`,
      text: googleConnected
        ? 'This will disconnect your Google account.'
        : 'This will connect your Google account.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      setGoogleConnected(!googleConnected);
      Swal.fire({
        title: `Google ${action}ed`,
        text: `Google Authentication has been ${action}ed successfully.`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316',
      });
    }
  };

  const handleRemovePhone = async () => {
    const result = await Swal.fire({
      title: 'Remove Phone Number',
      text: 'Are you sure you want to remove your phone number?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Phone Number Removed',
        text: 'Your phone number has been removed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316',
      });
    }
  };

  const handleChangePhone = () => {
    Swal.fire({
      title: 'Change Phone Number',
      text: 'A modal to change your phone number would open here.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316',
    });
  };

  const handleRemoveEmail = async () => {
    const result = await Swal.fire({
      title: 'Remove Email',
      text: 'Are you sure you want to remove your email?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Email Removed',
        text: 'Your email has been removed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316',
      });
    }
  };

  const handleChangeEmail = () => {
    Swal.fire({
      title: 'Change Email',
      text: 'A modal to change your email would open here.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316',
    });
  };

  const handleManageDevices = () => {
    Swal.fire({
      title: 'Manage Devices',
      text: 'A modal to manage your devices would open here.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316',
    });
  };

  const handleViewActivity = () => {
    Swal.fire({
      title: 'View Account Activity',
      text: 'A modal to view your account activity would open here.',
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f97316',
    });
  };

  const handleDeactivateAccount = async () => {
    const result = await Swal.fire({
      title: 'Deactivate Account',
      text: 'Are you sure you want to deactivate your account? This will shutdown your account and it will be reactivated when you sign in again.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, deactivate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Account Deactivated',
        text: 'Your account has been deactivated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316',
      });
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Delete Account',
      text: 'Are you sure you want to delete your account? Your account will be permanently deleted and cannot be recovered.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Account Deletion Initiated',
        text: 'Your account deletion has been initiated.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f97316',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Password Section */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-1">Password</h3>
          <p className="text-sm text-gray-500 mb-1">Set a unique password to protect the account</p>
          <p className="text-xs text-gray-400">Last Changed 03 Jan 2024, 09:00 AM</p>
        </div>
        <button
          onClick={handleChangePassword}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Change Password
        </button>
      </div>

      {/* Two Factor Authentication */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-1">Two Factor Authentication</h3>
          <p className="text-sm text-gray-500">Receive codes via SMS or email every time you login</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEnableTwoFactor}
            className={`px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 ${
              twoFactorEnabled
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500'
            }`}
          >
            {twoFactorEnabled ? 'Disable' : 'Enable'}
          </button>
          <button className="p-2 text-orange-500 hover:bg-orange-50 rounded">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Google Authentication */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-base font-medium text-gray-900">Google Authentication</h3>
            {googleConnected && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                ✓ Connected
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">Connect to Google</p>
        </div>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={googleConnected}
              onChange={handleGoogleToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>

      {/* Phone Number Verification */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-base font-medium text-gray-900">Phone Number Verification</h3>
            {phoneVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          <p className="text-sm text-gray-500 mb-1">The phone number associated with the account</p>
          <p className="text-xs text-gray-600">Verified Mobile Number: {user?.phone || '+99264710583'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRemovePhone}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 focus:outline-none"
          >
            Remove
          </button>
          <button
            onClick={handleChangePhone}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Change
          </button>
        </div>
      </div>

      {/* Email Verification */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-base font-medium text-gray-900">Email Verification</h3>
            {emailVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          <p className="text-sm text-gray-500 mb-1">The email address associated with the account</p>
          <p className="text-xs text-gray-600">Verified Email: {user?.adminEmail || 'info@example.com'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRemoveEmail}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 focus:outline-none"
          >
            Remove
          </button>
          <button
            onClick={handleChangeEmail}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Change
          </button>
        </div>
      </div>

      {/* Device Management */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-1">Device Management</h3>
          <p className="text-sm text-gray-500">The devices associated with the account</p>
        </div>
        <button
          onClick={handleManageDevices}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Manage
        </button>
      </div>

      {/* Account Activity */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-1">Account Activity</h3>
          <p className="text-sm text-gray-500">The activities of the account</p>
        </div>
        <button
          onClick={handleViewActivity}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          View
        </button>
      </div>

      {/* Deactivate Account */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900 mb-1">Deactivate Account</h3>
          <p className="text-sm text-gray-500">This will shutdown your account. Your account will be reactivated when you sign in again</p>
        </div>
        <button
          onClick={handleDeactivateAccount}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Deactivate
        </button>
      </div>

      {/* Delete Account */}
      <div className="flex items-center justify-between py-4">
        <div className="flex-1">
          <h3 className="text-base font-medium text-red-600 mb-1">Delete Account</h3>
          <p className="text-sm text-gray-500">Your account will be permanently deleted</p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;