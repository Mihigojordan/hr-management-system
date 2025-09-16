import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Lock, Bell, Link } from 'lucide-react';
import ProfileSettings from '../../components/dashboard/profile/admin/ProfileSettings';
import SecuritySettings from '../../components/dashboard/profile/admin/SecuritySettings';
import NotificationsSettings from '../../components/dashboard/profile/admin/NotificationsSettings';
import ConnectedApps from '../../components/dashboard/profile/admin/ConnectedApps';

const AdminProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const validTabs = ['profile', 'security', 'notifications', 'connected-apps'] as const;
  const initialTab = validTabs.includes(searchParams.get('tab') as any)
    ? (searchParams.get('tab') as 'profile' | 'security' | 'notifications' | 'connected-apps')
    : 'profile';
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'notifications' | 'connected-apps'
  >(initialTab);

  // Sync activeTab with URL params
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-5 h-5 mr-3" />
                Security Settings
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('connected-apps')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'connected-apps'
                    ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Link className="w-5 h-5 mr-3" />
                Connected Apps
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className=" mx-auto">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-8 py-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'profile'
                    ? 'Profile Settings'
                    : activeTab === 'security'
                    ? 'Security Settings'
                    : activeTab === 'notifications'
                    ? 'Notifications'
                    : 'Connected Apps'}
                </h1>
              </div>
              <div className="p-8">
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'notifications' && <NotificationsSettings />}
                {activeTab === 'connected-apps' && <ConnectedApps />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;