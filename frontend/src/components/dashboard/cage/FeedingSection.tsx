/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Package,
  Wheat,
  TrendingUp,
  BarChart3,
  Target,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import feedService, { type Feed, type DailyFeedRecord } from '../../../services/feedService';

interface FeedingSectionProps {
  cageId: string;
  feeds: Feed[];
  dailyFeedRecords: DailyFeedRecord[];
  role: string;
}

const DeleteFeedRecordModal: React.FC<{
  isOpen: boolean;
  record: DailyFeedRecord | null;
  onClose: () => void;
  onDelete: (record: DailyFeedRecord) => Promise<void>;
}> = ({ isOpen, record, onClose, onDelete }) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Delete Feed Record</h3>
            <p className="text-xs text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-xs text-gray-700">
            Are you sure you want to delete the feed record for{' '}
            <span className="font-semibold">{record.feed?.name}</span> on{' '}
            <span className="font-semibold">{formatDate(record.date)}</span>?
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(record)}
            className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedingSection: React.FC<FeedingSectionProps> = ({ cageId, feeds, dailyFeedRecords, role }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DailyFeedRecord | null>(null);
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Africa/Harare', // CAT (UTC+2)
    });
  };

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Harare', // CAT (UTC+2)
    });
  };

  // Calculate feeding statistics
  const todayFeedRecords = dailyFeedRecords.filter(record => {
    const recordDate = new Date(record.date).toDateString();
    const today = new Date('2025-09-27T00:36:00+02:00'); // 12:36 AM CAT, September 27, 2025
    return recordDate === today.toDateString();
  });

  const weekFeedRecords = dailyFeedRecords.filter(record => {
    const recordDate = new Date(record.date);
    const weekAgo = new Date('2025-09-27T00:36:00+02:00');
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  });

  const totalFeedToday = todayFeedRecords.reduce((sum, record) => sum + record.quantityGiven, 0);
  const avgDailyFeed = weekFeedRecords.length > 0
    ? weekFeedRecords.reduce((sum, record) => sum + record.quantityGiven, 0) / 7
    : 0;

  const handleCreateFeedRecord = () => {
    navigate(`/${role}/dashboard/cage-management/f/create?cageId=${cageId}`);
  };

  const handleUseFeed = (feed: Feed) => {
    navigate(`/${role}/dashboard/cage-management/f/create?cageId=${cageId}&feedId=${feed.id}`);
  };

  const handleEditFeed = (feed: Feed) => {
    // Navigate to a FeedForm (not implemented here, but could be added)
    Swal.fire({
      icon: 'info',
      title: 'Not Implemented',
      text: 'Feed editing is not implemented in this version.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const handleEditRecord = (record: DailyFeedRecord) => {
    navigate(`/${role}/dashboard/cage-management/f/update/${record.id}`);
  };

  const handleDeleteRecord = async (record: DailyFeedRecord) => {
    try {
      await feedService.deleteDailyFeedRecord(record.id);
      setDailyFeedRecords(dailyFeedRecords.filter(r => r.id !== record.id));
      setIsDeleteModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Feed record for ${record.feed?.name} deleted successfully`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error: any) {
      console.error('Error deleting feed record:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete feed record',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feeding Management</h2>
          <p className="text-sm text-gray-600">Track and manage feeding for this cage</p>
        </div>
        <button
          onClick={handleCreateFeedRecord}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Feeding</span>
        </button>
      </div>

      {/* Feeding Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Feed</p>
              <p className="text-2xl font-bold text-gray-900">{totalFeedToday.toFixed(1)} kg</p>
              <p className="text-xs text-gray-500">{todayFeedRecords.length} feeding{todayFeedRecords.length !== 1 ? 's' : ''}</p>
            </div>
            <Wheat className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">7-Day Average</p>
              <p className="text-2xl font-bold text-gray-900">{avgDailyFeed.toFixed(1)} kg</p>
              <p className="text-xs text-gray-500">per day</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Feeds</p>
              <p className="text-2xl font-bold text-gray-900">{feeds.length}</p>
              <p className="text-xs text-gray-500">feed types</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{dailyFeedRecords.length}</p>
              <p className="text-xs text-gray-500">all time</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Available Feeds */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Available Feed Types
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protein Content</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feeding Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feeds.map((feed) => (
                <tr key={feed.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{feed.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {feed.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1 text-green-600" />
                      {feed.proteinContent}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`font-medium ${
                      feed.quantityAvailable < 100 ? 'text-red-600' :
                      feed.quantityAvailable < 200 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {feed.quantityAvailable} kg
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{feed.feedingRate}%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUseFeed(feed)}
                        className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                        title="Use this feed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditFeed(feed)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                        title="Edit feed"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Feeding Records */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Feeding Records
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Given</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administered By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailyFeedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{formatDate(record.date)}</div>
                      <div className="text-gray-500 text-xs">{formatDateTime(record.date).split(', ')[1]}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.feed?.name || 'Unknown'}</div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {record.feed?.type || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="font-semibold text-green-600">{record.quantityGiven} kg</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.employee?.name || record.admin?.name || record.administeredByEmployee || record.administeredByAdmin || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {record.notes || 'No notes'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditRecord(record)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                        title="Edit record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteFeedRecordModal
        isOpen={isDeleteModalOpen}
        record={selectedRecord}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
};

export default FeedingSection;