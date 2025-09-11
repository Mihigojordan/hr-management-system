
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
  DollarSign,
  UserPlus,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import employeeService from '../../../services/employeeService';

import { API_URL } from '../../../api/api';

// Define types and interfaces
const MARITAL_STATUS = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'] as const;
const EMPLOYEE_STATUS = ['ACTIVE', 'TERMINATED', 'RESIGNED', 'PROBATION'] as const;
const GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const;

type MaritalStatus = typeof MARITAL_STATUS[number];
type EmployeeStatus = typeof EMPLOYEE_STATUS[number];
type Gender = typeof GENDERS[number];

interface Department {
  id: string;
  name: string;
}

interface Experience {
  company_name: string;
  description: string;
  start_date: string;
  end_date?: string;
}

interface Contract {
  id: string;
  contractType: string;
  status: string;
  startDate: string;
  endDate?: string;
  salary: number;
  department?: Department;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  date_of_birth: string;
  phone: string;
  email: string;
  address: string;
  national_id: string;
  position: string;
  departmentId: string;
  department?: Department;
  marital_status: MaritalStatus;
  date_hired: string;
  status: EmployeeStatus;
  bank_account_number: string;
  bank_name: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  experience: Experience[];
  profile_picture?: string;
  application_letter?: string;
  cv?: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
  contracts?: Contract[];
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const ViewEmployee: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [contractsPerPage] = useState<number>(2);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) {
        setError('No employee ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const employeeData = await employeeService.getEmployeeById(id);
        if (employeeData) {
          let parsedExperience: Experience[] = [];
          if (employeeData.experience && typeof employeeData.experience === 'string') {
            try {
              parsedExperience = JSON.parse(employeeData.experience);
            } catch (parseError) {
              console.error('Error parsing experience:', parseError);
              parsedExperience = [];
            }
          } else if (!Array.isArray(employeeData.experience)) {
            parsedExperience = [];
          } else {
            parsedExperience = employeeData.experience;
          }
          setEmployee({ ...employeeData, experience: parsedExperience });
        } else {
          setError('Employee not found');
        }
      } catch (err) {
        console.error('Error fetching employee:', err);
        setError('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number | undefined, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'RWF',
    }).format(amount || 0);
  };

  const getUrlImage = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.includes('http')) return url;
    return `${API_URL}${url}`;
  };

  const handlePreview = (url: string | undefined, type: 'image' | 'pdf') => {
    const fullUrl = getUrlImage(url);
    if (fullUrl) {
      setPreviewUrl(fullUrl);
      setPreviewType(type);
    }
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewType(null);
  };

  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = employee?.contracts?.slice(indexOfFirstContract, indexOfLastContract) || [];
  const totalPages = Math.ceil((employee?.contracts?.length || 0) / contractsPerPage);

  const paginate = (pageNumber: number) => {
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

        <div className="grid lg:grid-cols-2 gap-8">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                  <div className="flex items-center mt-1">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.bank_account_number || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <div className="flex items-center mt-1">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.bank_name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                  <div className="flex items-center mt-1">
                    <UserPlus className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.emergency_contact_name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{employee.emergency_contact_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          <div className="lg:col-span-2 flex flex-col gap-2">
            <div className="grid xl:grid-cols-2 gap-4">
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
