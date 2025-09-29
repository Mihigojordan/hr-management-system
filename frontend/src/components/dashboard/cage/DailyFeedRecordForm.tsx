/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Check, X, Wheat } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import feedService, { type FeedData, type Feed } from '../../../services/feedService';
import cageService, { type Cage } from '../../../services/cageService';
import Swal from 'sweetalert2';
import useAdminAuth from '../../../context/AdminAuthContext';
import useEmployeeAuth from '../../../context/EmployeeAuthContext';

// Define FeedType enum (assumed to be in feedService)
enum FeedType {
  PELLET = 'PELLET',
  SEED = 'SEED',
  FRUIT = 'FRUIT',
  VEGETABLE = 'VEGETABLE',
  INSECT = 'INSECT',
  OTHER = 'OTHER',
}

interface FeedFormData {
  name: string;
  type: FeedType | '';
  proteinContent: string;
  date: string; // YYYY-MM-DDTHH:mm
  quantityGiven: string;
  notes: string;
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

const FeedForm: React.FC<{ role: string }> = ({ role }) => {
  const { user: adminUser } = useAdminAuth();
  const { user: employeeUser } = useEmployeeAuth();
  const user = role === 'admin' ? adminUser : employeeUser;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [prefilledCageId, setPrefilledCageId] = useState<string>('');
  const [formData, setFormData] = useState<FeedFormData>({
    name: '',
    type: '',
    proteinContent: '',
    date: '2025-09-27T12:55', // Default to 12:55 PM CAT, September 27, 2025
    quantityGiven: '',
    notes: '',
  });
  const navigate = useNavigate();
  const { id: feedId } = useParams<{ id?: string }>();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch cages
        const cageData = await cageService.getAllCages();

        // Check for query parameters
        const queryParams = new URLSearchParams(location.search);
        const cageIdFromQuery = queryParams.get('cageId');

        if (feedId) {
          // Fetch existing feed for update mode
          const feed = await feedService.getFeedById(feedId);
          if (feed) {
            setFormData({
              name: feed.name,
              type: feed.type as FeedType,
              proteinContent: feed.proteinContent.toString(),
              date: formatISOToDateTimeLocal(feed.date || ''),
              quantityGiven: feed.quantityGiven.toString(),
              notes: feed.notes || '',
            });
            setPrefilledCageId(feed.cageId || '');
          } else {
            throw new Error('Feed not found');
          }
        } else if (cageIdFromQuery) {
          // Validate prefilled cageId
          const isValidCageId = cageData?.some((cage: Cage) => cage.id === cageIdFromQuery);
          if (isValidCageId) {
            setPrefilledCageId(cageIdFromQuery);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Invalid Cage ID',
              text: 'The provided cage ID is invalid',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
            });
            navigate(`/${role}/dashboard/cage-management`);
          }
        } else {
          // No cageId provided in create mode
          Swal.fire({
            icon: 'error',
            title: 'Missing Cage ID',
            text: 'A valid cage ID is required to create a feed record',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          });
          navigate(`/${role}/dashboard/cage-management`);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load feed data',
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
  }, [feedId, location.search, user, role, navigate]);

  const handleInputChange = (field: keyof FeedFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = (): boolean => {
    const data: FeedData = {
      name: formData.name,
      type: formData.type as FeedType,
      proteinContent: Number(formData.proteinContent),
      date: formatDateTimeLocalToISO(formData.date),
      quantityGiven: Number(formData.quantityGiven),
      notes: formData.notes || undefined,
      cageId: prefilledCageId,
      administeredByEmployee: role === 'employee' ? user?.id : undefined,
      administeredByAdmin: role === 'admin' ? user?.id : undefined,
    };

    const validation = feedService.validateFeedData(data);
    const newErrors: Errors = {};

    validation.errors.forEach((error) => {
      if (error.includes('name')) newErrors.name = error;
      if (error.includes('type')) newErrors.type = error;
      if (error.includes('protein')) newErrors.proteinContent = error;
      if (error.includes('date')) newErrors.date = error;
      if (error.includes('quantity given')) newErrors.quantityGiven = error;
      if (error.includes('cageId')) newErrors.cageId = error;
    });

    setErrors(newErrors);
    return validation.isValid;
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
      const feedData: FeedData = {
        name: formData.name,
        type: formData.type as FeedType,
        proteinContent: Number(formData.proteinContent),
        date: formatDateTimeLocalToISO(formData.date),
        quantityGiven: Number(formData.quantityGiven),
        notes: formData.notes || undefined,
        cageId: prefilledCageId,
        administeredByEmployee: role === 'employee' ? user.id : undefined,
        administeredByAdmin: role === 'admin' ? user.id : undefined,
      };

      let response: Feed;
      if (feedId) {
        response = await feedService.updateFeed(feedId, feedData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Feed updated successfully`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        response = await feedService.createFeed(feedData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Feed created successfully`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      }

      navigate(`/${role}/dashboard/cage-management/view/${prefilledCageId}?tab=feed`);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save feed',
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
    navigate(`/${role}/dashboard/cage-management/view/${prefilledCageId || ''}?tab=feed`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-xs">
            {feedId ? 'Loading feed...' : 'Preparing form...'}
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
              {feedId ? 'Update Feed' : 'Add New Feed'}
            </h1>
            <p className="text-primary-100 text-xs mt-1">
              Fill in the details to {feedId ? 'update' : 'create'} your feed
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Wheat className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Feed Information</h2>
            </div>
            <p className="text-xs text-gray-500">Enter the details for the feed</p>
          </div>

          <div className="p-4 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Feed Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter feed name"
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Feed Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="" disabled>Select feed type</option>
                  {Object.values(FeedType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.type}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Protein Content (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.proteinContent}
                  onChange={(e) => handleInputChange('proteinContent', e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter protein content (%)"
                  min="0"
                  step="0.1"
                />
                {errors.proteinContent && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.proteinContent}
                  </p>
                )}
              </div>
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
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <span>{feedId ? 'Update Feed' : 'Create Feed'}</span>
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

export default FeedForm;