import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Building2,
  CreditCard,
  Activity,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  FileText,
  Briefcase,
  Heart,
  Clock,
  X,
  File,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import employeeService from '../../../services/employeeService'; // Hypothetical service for employee data
import contractService from '../../../services/contractService'; // Hypothetical service for contract data
import { API_URL } from '../../../api/api'; // Adjust based on your API base URL

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null); // 'image' or 'pdf'
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage] = useState(2); // Number of contracts per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        // Fetch employee data
        const employeeData = await employeeService.getEmployeeById(id);
        // Parse experience if it's a string
        if (employeeData.experience && typeof employeeData.experience === 'string') {
          try {
            employeeData.experience = JSON.parse(employeeData.experience);
          } catch (parseError) {
            console.error('Error parsing experience:', parseError);
            employeeData.experience = [];
          }
        } else if (!Array.isArray(employeeData.experience)) {
          employeeData.experience = [];
        }
        setEmployee(employeeData);
      } catch (err) {
        console.error('Error fetching employee:', err);
        setError('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatDateTime = (dateString) => new Date(dateString).toLocaleString();

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'RWF',
    }).format(amount || 0);
  };

  const getUrlImage = (url) => {
    if (!url) return url;
    if (url.includes('http')) return url;
    return `${API_URL}${url}`;
  };

  const handlePreview = (url, type) => {
    const fullUrl = getUrlImage(url);
    setPreviewUrl(fullUrl);
    setPreviewType(type);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  // Pagination logic
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = employee?.contracts?.slice(indexOfFirstContract, indexOfLastContract) || [];
  const totalPages = Math.ceil((employee?.contracts?.length || 0) / contractsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading employee details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[90vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-[90vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Employee Not Found</h2>
          <p className="text-gray-600">The requested employee record could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[90vh] overflow-y-auto bg-gray-50 py-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          } animate-in slide-in-from-top-2 duration-300`}
        >
          {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {notification.message}
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[80vh] overflow-auto relative">
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            {previewType === 'image' ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            ) : (
              <iframe
                src={previewUrl}
                title="Document Preview"
                className="w-full h-[70vh]"
              />
            )}
          </div>
        </div>
      )}

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            onClick={() => navigate('/admin/dashboard/employee-management')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Employees
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-gray-600 mt-1">{employee.gender}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Hire Date</div>
              <div className="text-lg font-semibold">{formatDate(employee.date_hired)}</div>
            </div>
          </div>
        </div>

        <div className="grid  lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-900">{formatDate(employee.date_of_birth)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                  <div className="flex items-center mt-1">
                    <Heart className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.marital_status || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">National ID</label>
                  <div className="flex items-center mt-1">
                    <CreditCard className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.national_id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.email || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.phone || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Employment Information
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.position || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <div className="flex items-center mt-1">
                    <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.department?.name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.status || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{formatDate(employee.date_hired)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

         

          {/* Documents */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documents
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <div className="flex items-center mt-1">
                    {employee.profile_picture ? (
                      <button
                        onClick={() => handlePreview(employee.profile_picture, 'image')}
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <File className="w-4 h-4 mr-1" />
                        Preview Profile Picture
                      </button>
                    ) : (
                      <p className="text-sm text-gray-900">N/A</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CV</label>
                  <div className="flex items-center mt-1">
                    {employee.cv ? (
                      <button
                        onClick={() => handlePreview(employee.cv, 'pdf')}
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <File className="w-4 h-4 mr-1" />
                        Preview CV
                      </button>
                    ) : (
                      <p className="text-sm text-gray-900">N/A</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Application Letter</label>
                  <div className="flex items-center mt-1">
                    {employee.application_letter ? (
                      <button
                        onClick={() => handlePreview(employee.application_letter, 'pdf')}
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <File className="w-4 h-4 mr-1" />
                        Preview Application Letter
                      </button>
                    ) : (
                      <p className="text-sm text-gray-900">N/A</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" lg:col-span-2 flex flex-col gap-2">
          <div className=" grid xl:grid-cols-2 gap-4">
            {/* Contract Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Contract Information
                </h2>
              </div>
              <div className="p-6">
                {currentContracts.length > 0 ? (
                  <div className="space-y-6">
                    {currentContracts.map((contract) => (
                      <div key={contract.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Contract Type</label>
                            <p className="mt-1 text-sm text-gray-900">{contract.contractType || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <p className="mt-1 text-sm text-gray-900">{contract.status || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <div className="flex items-center mt-1">
                              <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-900">{formatDate(contract.startDate)}</p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <div className="flex items-center mt-1">
                              <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-900">
                                {contract.endDate ? formatDate(contract.endDate) : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Salary</label>
                            <div className="flex items-center mt-1">
                              <CreditCard className="w-4 h-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-900">
                                {formatCurrency(contract.salary, 'RWF')}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <div className="flex items-center mt-1">
                              <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-900">{contract.department?.name || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No contracts found for this employee.</p>
                )}
              </div>
            </div>

           {/* Work Experience */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Work Experience
              </h2>
            </div>
            <div className="p-6">
              {employee.experience.length > 0 ? (
                <div className="space-y-6">
                  {employee.experience.map((exp, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Name</label>
                          <p className="mt-1 text-sm text-gray-900">{exp.company_name || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <p className="mt-1 text-sm text-gray-900">{exp.description || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <div className="flex items-center mt-1">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-900">{formatDate(exp.start_date)}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <div className="flex items-center mt-1">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-900">
                              {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No work experience found for this employee.</p>
              )}
            </div>
          </div>
          </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  System Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-900">{formatDateTime(employee.createdAt)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-900">{formatDateTime(employee.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;