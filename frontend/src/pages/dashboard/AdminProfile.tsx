import React from "react";
import { User, Mail, Calendar, Shield, Lock } from "lucide-react";
import useAdminAuth from "../../context/AdminAuthContext";

// --- Type Definitions ---
interface AdminUser {
  adminName?: string;
  adminEmail?: string;
  isLocked?: boolean;
  createdAt?: string;
  profileImg?: string;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status?: "red" | "green";
}

// --- InfoCard Component ---
const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value, status }) => (
  <div className="bg-white shadow-md rounded-xl p-5 flex gap-4 items-start">
    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-primary-600">{label}</p>
      <div className="flex items-center gap-2">
        {status && (
          <span
            className={`w-3 h-3 rounded-full ${
              status === "red" ? "bg-red-500" : "bg-green-500"
            }`}
          />
        )}
        <p className="text-lg font-semibold text-primary-900">{value}</p>
      </div>
    </div>
  </div>
);

// --- Main Component ---
const AdminProfile: React.FC = () => {
  const { user } = useAdminAuth() as { user: AdminUser | null };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto p-6 md:p-10">
      <div className="mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Avatar + Basic Info */}
          <div className="relative px-6 pb-8 -mt-16 flex flex-col items-center">
            <div className="w-28 h-28 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-14 h-14 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-primary-900">
              {user?.adminName || "Admin User"}
            </h2>
            <p className="text-primary-600">{user?.adminEmail}</p>

            {/* Status */}
            <div className="mt-4">
              {user?.isLocked ? (
                <span className="flex items-center gap-2 bg-red-500/20 px-4 py-1.5 rounded-full text-sm font-medium text-red-700">
                  <Lock className="w-4 h-4" />
                  Account Locked
                </span>
              ) : (
                <span className="flex items-center gap-2 bg-green-500/20 px-4 py-1.5 rounded-full text-sm font-medium text-green-700">
                  <Shield className="w-4 h-4" />
                  Account Active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <InfoCard
            icon={<User className="w-5 h-5 text-white" />}
            label="Full Name"
            value={user?.adminName || "Not provided"}
          />
          <InfoCard
            icon={<Mail className="w-5 h-5 text-white" />}
            label="Email Address"
            value={user?.adminEmail || "Not provided"}
          />
          <InfoCard
            icon={<Shield className="w-5 h-5 text-white" />}
            label="Account Status"
            value={user?.isLocked ? "Locked" : "Active"}
            status={user?.isLocked ? "red" : "green"}
          />
          <InfoCard
            icon={<Calendar className="w-5 h-5 text-white" />}
            label="Account Created"
            value={formatDate(user?.createdAt)}
          />
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 text-center">
          <div className="flex justify-center items-center text-primary-600">
            <Shield className="w-5 h-5 mr-2" />
            <p className="text-sm">
              This is a read-only view of your administrative account. Contact
              the system administrator for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
