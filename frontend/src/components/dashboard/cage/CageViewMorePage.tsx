/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Fish, Calendar, Droplets, Activity, Settings, AlertCircle, CheckCircle, Clock, Wrench, Eye, ArrowLeft, Package, Syringe, Bath, Cookie, Plus, Wheat } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import cageService, { type Cage } from '../../../services/cageService';
import medicationService, { type Medication } from '../../../services/medicationService';
import feedService, { type Feed, type DailyFeedRecord } from '../../../services/feedService';
import FeedingSection from './FeedingSection';

const CageViewPage: React.FC<{ role: string }> = ({ role }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [cage, setCage] = useState<Cage | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [dailyFeedRecords, setDailyFeedRecords] = useState<DailyFeedRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id: cageId } = useParams<{ id: string }>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['details', 'medications', 'feed'].includes(tab)) {
      setActiveTab(tab);
    }

    const fetchData = async () => {
      if (!cageId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Cage ID is missing',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
        navigate(`/${role}/dashboard/cage-management`);
        return;
      }

      setIsLoading(true);
      try {
        const cageData = await cageService.getCageById(cageId);
        if (!cageData) {
          throw new Error('Cage not found');
        }
        setCage(cageData);

        const medicationData = await medicationService.getMedicationsByCageId(cageId);
        setMedications(medicationData);

        const feedData = await feedService.getAllFeeds();
        setFeeds(feedData || []);

        const feedRecordData = await feedService.getAllDailyFeedRecords();
        setDailyFeedRecords(feedRecordData.filter(record => record.cageId === cageId) || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load cage, medication, or feed data',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
        navigate(`/${role}/dashboard/cage-management`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cageId, role, navigate]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Africa/Harare', // CAT (UTC+2)
    });
  };

  const formatDateTime = (dateString: string | undefined): string => {
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

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'INACTIVE':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'UNDER_MAINTENANCE':
        return <Wrench className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'UNDER_MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNetTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'FINGERLING':
        return 'bg-blue-100 text-blue-800';
      case 'JUVENILE':
        return 'bg-purple-100 text-purple-800';
      case 'ADULT':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string | undefined) => {
    switch (method) {
      case 'FEED':
        return <Cookie className="w-4 h-4" />;
      case 'BATH':
        return <Bath className="w-4 h-4" />;
      case 'WATER':
        return <Droplets className="w-4 h-4" />;
      case 'INJECTION':
        return <Syringe className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getMedicationStatus = (startDate: string | undefined, endDate: string | null | undefined) => {
    const now = new Date('2025-09-27T01:04:00+02:00'); // 1:04 AM CAT, September 27, 2025
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (!start) {
      return { status: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
    if (now < start) {
      return { status: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
    } else if (!end || now <= end) {
      return { status: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const activeMedications = medications.filter(med => {
    const now = new Date('2025-09-27T01:04:00+02:00'); // 1:04 AM CAT, September 27, 2025
    const start = med.startDate ? new Date(med.startDate) : null;
    const end = med.endDate ? new Date(med.endDate) : null;
    return start && now >= start && (!end || now <= end);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-xs">Loading cage data...</p>
        </div>
      </div>
    );
  }

  if (!cage) {
    return null; // Handled by useEffect redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/${role}/dashboard/cage-management`)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <Fish className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{cage.cageName}</h1>
                  <p className="text-sm text-gray-500">Code: {cage.cageCode}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(cage.cageStatus)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cage.cageStatus)}`}>
                {cage.cageStatus.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Cage Details</span>
              </div>
            </button>
            <button
              onClick={() => handleTabChange('medications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'medications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Medications</span>
                {activeMedications.length > 0 && (
                  <span className="ml-1 bg-red-100 text-red-600 text-xs rounded-full px-2 py-1">
                    {activeMedications.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => handleTabChange('feed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Wheat className="w-4 h-4" />
                <span>Feed</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Capacity</p>
                    <p className="text-2xl font-bold text-gray-900">{cage.cageCapacity.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">fish</p>
                  </div>
                  <Fish className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Depth</p>
                    <p className="text-2xl font-bold text-gray-900">{cage.cageDepth}m</p>
                    <p className="text-xs text-gray-500">meters</p>
                  </div>
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Volume</p>
                    <p className="text-2xl font-bold text-gray-900">{cage.cageVolume}m³</p>
                    <p className="text-xs text-gray-500">cubic meters</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Medications</p>
                    <p className="text-2xl font-bold text-gray-900">{activeMedications.length}</p>
                    <p className="text-xs text-gray-500">treatments</p>
                  </div>
                  <Package className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cage Specifications */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Cage Specifications
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Cage Code</span>
                    <span className="text-sm text-gray-900 font-mono">{cage.cageCode}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Net Type</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNetTypeColor(cage.cageNetType)}`}>
                      {cage.cageNetType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Cage Type</span>
                    <span className="text-sm text-gray-900 capitalize">{cage.cageType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(cage.cageStatus)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cage.cageStatus)}`}>
                        {cage.cageStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">{formatDate(cage.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Stocking Date</span>
                    <span className="text-sm text-gray-900">{formatDateTime(cage.stockingDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Days Since Stocking</span>
                    <span className="text-sm text-gray-900">
                      {cage.stockingDate
                        ? Math.floor((new Date('2025-09-27T01:04:00+02:00') - new Date(cage.stockingDate)) / (1000 * 60 * 60 * 24))
                        : 'N/A'} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Medications Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Recent Medications
                </h3>
                <button
                  onClick={() => handleTabChange('medications')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              {medications.slice(0, 3).map((medication) => {
                const medStatus = getMedicationStatus(medication.startDate, medication.endDate);
                return (
                  <div key={medication.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      {getMethodIcon(medication.method)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                        <p className="text-xs text-gray-500">{medication.reason || 'No reason provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${medStatus.color}`}>
                        {medStatus.status}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(medication.startDate)}</span>
                    </div>
                  </div>
                );
              })}
              {medications.length === 0 && (
                <p className="text-sm text-gray-500">No medications recorded for this cage.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Medication Management</h2>
                <p className="text-sm text-gray-600">Manage medications for {cage.cageName}</p>
              </div>
              <button
                onClick={() => navigate(`/${role}/dashboard/cage-management/m/create/${cageId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medication</span>
              </button>
            </div>

            {/* Active Medications Alert */}
            {activeMedications.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">
                    {activeMedications.length} active medication{activeMedications.length > 1 ? 's' : ''} in progress
                  </span>
                </div>
              </div>
            )}

            {/* Medications List */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administered By</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medications.map((medication) => {
                      const medStatus = getMedicationStatus(medication.startDate, medication.endDate);
                      return (
                        <tr key={medication.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                              <div className="text-sm text-gray-500">{medication.dosage}</div>
                              {medication.reason && (
                                <div className="text-xs text-gray-400 mt-1">{medication.reason}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {getMethodIcon(medication.method)}
                              <span className="text-sm text-gray-900">{medication.method}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div>
                              <div>Start: {formatDate(medication.startDate)}</div>
                              <div>End: {medication.endDate ? formatDate(medication.endDate) : 'Ongoing'}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${medStatus.color}`}>
                              {medStatus.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{medication.employee?.name || 'Unknown'}</td>
                        </tr>
                      );
                    })}
                    {medications.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No medications recorded for this cage.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feed' && (
          <FeedingSection
            cageId={cageId!}
            feeds={feeds}
            dailyFeedRecords={dailyFeedRecords}
            role={role}
          />
        )}
      </div>
    </div>
  );
};

export default CageViewPage;