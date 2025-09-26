/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Check, X, Wheat } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import feedService, { type DailyFeedRecordData, type DailyFeedRecord, type Feed } from '../../../services/feedService';
import cageService, { type Cage } from '../../../services/cageService';
import Swal from 'sweetalert2';
import  useAdminAuth from '../../../context/AdminAuthContext';
import useEmployeeAuth from '../../../context/EmployeeAuthContext';

interface DailyFeedRecordFormData {
  date: string; // YYYY-MM-DDTHH:mm
  quantityGiven: string;
  notes: string;
  feedId: string;
  cageId: string;
  administeredBy: string;
}

interface Errors {
  [key: string]: string | null;
}

// Utility function to format ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
const formatISOToDateTimeLocal = (isoDate: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Utility function to convert datetime-local to ISO string
const formatDateTimeLocalToISO = (dateTime: string): string => {
  if (!dateTime) return '';
  return new Date(dateTime).toISOString();
};

const DailyFeedRecordForm: React.FC<{ role: string }> = ({ role }) => {
  const { user: adminUser } = useAdminAuth();
  const { user: employeeUser } = useEmployeeAuth();
  const user = role === 'admin' ? adminUser : employeeUser;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [cages, setCages] = useState<Cage[]>([]);
  const [formData, setFormData] = useState<DailyFeedRecordFormData>({
    date: '2025-09-27T00:42', // Default to 12:42 AM CAT, September 27, 2025
    quantityGiven: '',
    notes: '',
    feedId: '',
    cageId: '',
    administeredBy: user?.id || '',
  });
  const navigate = useNavigate();
  const { id: recordId } = useParams<{ id?: string }>();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch feeds and cages for dropdowns
        const feedData = await feedService.getAllFeeds();
        setFeeds(feedData || []);
        const cageData = await cageService.getAllCages();
        setCages(cageData || []);

        // Check for query parameters
        const queryParams = new URLSearchParams(location.search);
        const prefilledCageId = queryParams.get('cageId');
        const prefilledFeedId = queryParams.get('feedId');

        if (recordId) {
          // Fetch existing record for update mode
          const record = await feedService.getDailyFeedRecordById(recordId);
          if (record) {
            setFormData({
              date: formatISOToDateTimeLocal(record.date || ''),
              quantityGiven: record.quantityGiven.toString(),
              notes: record.notes || '',
              feedId: record.feedId || '',
              cageId: record.cageId || '',
              administeredBy: record.administeredByEmployee || record.administeredByAdmin || '',
            });
          } else {
            throw new Error('Feed record not found');
          }
        } else {
          // Pre-fill cageId, feedId, and administeredBy from query parameters and user
          setFormData((prev) => ({
            ...prev,
            cageId: prefilledCageId || prev.cageId,
            feedId: prefilledFeedId || prev.feedId,
            administeredBy: user?.id || '',
          }));
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load feed record data',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'User not authenticated',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      navigate(`/${role}/login`);
    }
  }, [recordId, location.search, user, role, navigate]);

  const handleInputChange = (field: keyof DailyFeedRecordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = (): boolean => {
    const data: DailyFeedRecordData = {
      date: formatDateTimeLocalToISO(formData.date),
      quantityGiven: Number(formData.quantityGiven),
      notes: formData.notes || undefined,
      feedId: formData.feedId,
      cageId: formData.cageId,
      administeredByEmployee: role === 'employee' ? formData.administeredBy : undefined,
      administeredByAdmin: role === 'admin' ? formData.administeredBy : undefined,
    };

    const validation = feedService.validateDailyFeedRecordData(data);
    const newErrors: Errors = {};

    validation.errors.forEach((error) => {
      if (error.includes('date')) newErrors.date = error;
      if (error.includes('quantity')) newErrors.quantityGiven = error;
      if (error.includes('feedId')) newErrors.feedId = error;
      if (error.includes('cageId')) newErrors.cageId = error;
    });

    if (!formData.administeredBy) {
      newErrors.administeredBy = 'Administered by is required';
    }

    setErrors(newErrors);
    return validation.isValid && !newErrors.administeredBy;
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'User not authenticated',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      navigate(`/${role}/login`);
      return;
    }

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the errors in the form',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const feedRecordData: DailyFeedRecordData = {
        date: formatDateTimeLocalToISO(formData.date),
        quantityGiven: Number(formData.quantityGiven),
        notes: formData.notes || undefined,
        feedId: formData.feedId,
        cageId: formData.cageId,
        administeredByEmployee: role === 'employee' ? user.id : undefined,
        administeredByAdmin: role === 'admin' ? user.id : undefined,
      };

      let response: DailyFeedRecord;
      if (recordId) {
        response = await feedService.updateDailyFeedRecord(recordId, feedRecordData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Feed record updated successfully`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        response = await feedService.createDailyFeedRecord(feedRecordData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Feed record created successfully`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      }

      navigate(`/${role}/dashboard/cage-management/view/${formData.cageId}?tab=feed`);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save feed record',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/${role}/dashboard/cage-management/view/${formData.cageId}?tab=feed`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-xs">
            {recordId ? 'Loading feed record...' : 'Preparing form...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-600 px-6 py-4">
            <h1 className="text-lg font-semibold text-white">
              {recordId ? 'Update Feed Record' : 'Add New Feed Record'}
            </h1>
            <p className="text-primary-100 text-xs mt-1">
              Fill in the details to {recordId ? 'update' : 'create'} your feed record
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Wheat className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Feed Record Information</h2>
            </div>
            <p className="text-xs text-gray-500">Enter the details for the feed record</p>
          </div>

          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Date and Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Select date and time"
                />
                {errors.date && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Quantity Given (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantityGiven}
                  onChange={(e) => handleInputChange('quantityGiven', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter quantity given (kg)"
                  min="0"
                  step="0.1"
                />
                {errors.quantityGiven && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.quantityGiven}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Feed <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.feedId}
                  onChange={(e) => handleInputChange('feedId', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select feed</option>
                  {feeds.map((feed) => (
                    <option key={feed.id} value={feed.id}>
                      {feed.name} ({feed.type})
                    </option>
                  ))}
                </select>
                {errors.feedId && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.feedId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Cage <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.cageId}
                  onChange={(e) => handleInputChange('cageId', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select cage</option>
                  {cages.map((cage) => (
                    <option key={cage.id} value={cage.id}>
                      {cage.cageName} ({cage.cageCode})
                    </option>
                  ))}
                </select>
                {errors.cageId && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.cageId}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Administered By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={user?.name || formData.administeredBy}
                disabled
                className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                placeholder="Authenticated user"
              />
              {errors.administeredBy && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <X className="h-3 w-3" />
                  {errors.administeredBy}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter notes (optional)"
                rows={4}
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                <Check className="h-4 w-4" />
                <span>{recordId ? 'Update Feed Record' : 'Create Feed Record'}</span>
              </button>
            </div>
          </div>

          {errors.general && (
            <div className="mx-6 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600 flex items-center gap-2">
                <X className="h-4 w-4" />
                {errors.general}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyFeedRecordForm;