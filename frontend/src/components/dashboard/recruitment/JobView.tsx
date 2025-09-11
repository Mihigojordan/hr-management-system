import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Clock,
  DollarSign,
  Eye,
  UserCheck,
  UserX,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Mail,
  Phone,
  Download,
  ExternalLink,
} from "lucide-react";
import jobService from "../../../services/jobService";
import applicantService from "../../../services/applicantService";
import type { Job,  Applicant } from "../../../types/model";

interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

const JobView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [applicantsLoading, setApplicantsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination for applicants
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  
  // Operation states
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [actionConfirm, setActionConfirm] = useState<{
    applicant: Applicant;
    action: 'hire' | 'reject';
  } | null>(null);

  useEffect(() => {
    if (id) {
      loadJobData();
      loadApplicants();
    }
  }, [id]);

  const loadJobData = async () => {
    try {
      setLoading(true);
      const jobData = await jobService.getJobById(id!);
      if (jobData) {
        setJob(jobData);
        setError(null);
      } else {
        setError("Job not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async () => {
    try {
      setApplicantsLoading(true);
      const applicantsData = await applicantService.getApplicantsByJobId(parseInt(id!));
      setApplicants(applicantsData || []);
    } catch (err: any) {
      console.error("Failed to load applicants:", err);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const showOperationStatus = (type: OperationStatus["type"], message: string, duration: number = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleEditJob = () => {
    navigate(`/admin/dashboard/recruiting-management/update/${id}`);
  };

  const handleDeleteJob = async () => {
    try {
      setOperationLoading(true);
      await jobService.deleteJob(id!);
      showOperationStatus("success", "Job deleted successfully!");
      setTimeout(() => {
        navigate('/admin/dashboard/recruiting-management');
      }, 1500);
    } catch (err: any) {
      showOperationStatus("error", err.message || "Failed to delete job");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleApplicantAction = async (applicant: Applicant, action: 'hire' | 'reject') => {
    try {
      setOperationLoading(true);
      setActionConfirm(null);
      
      const newStage = action === 'hire' ? 'HIRED' : 'REJECTED';
      await applicantService.updateApplicantStage(applicant.id, newStage);
      
      await loadApplicants();
      
      showOperationStatus(
        "success", 
        `${applicant.name} has been ${action === 'hire' ? 'hired' : 'rejected'} successfully!`
      );
    } catch (err: any) {
      showOperationStatus("error", err.message || `Failed to ${action} applicant`);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleViewApplicant = (applicant: Applicant) => {
    navigate(`/admin/dashboard/recruiting-management/applicants/${applicant.id}`);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      OPEN: "bg-green-100 text-green-800 border-green-200",
      CLOSED: "bg-red-100 text-red-800 border-red-200",
      PAUSED: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusStyles[status as keyof typeof statusStyles] || statusStyles.DRAFT}`}>
        {status}
      </span>
    );
  };

  const getEmploymentTypeBadge = (type: string) => {
    const typeStyles = {
      FULL_TIME: "bg-blue-100 text-blue-800",
      PART_TIME: "bg-purple-100 text-purple-800",
      CONTRACT: "bg-orange-100 text-orange-800",
      FREELANCE: "bg-pink-100 text-pink-800",
      INTERNSHIP: "bg-indigo-100 text-indigo-800",
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${typeStyles[type as keyof typeof typeStyles] || "bg-gray-100 text-gray-800"}`}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  const getExperienceBadge = (level: string) => {
    const levelStyles = {
      ENTRY: "bg-green-100 text-green-800",
      MID: "bg-blue-100 text-blue-800",
      SENIOR: "bg-purple-100 text-purple-800",
      EXECUTIVE: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${levelStyles[level as keyof typeof levelStyles] || "bg-gray-100 text-gray-800"}`}>
        {level}
      </span>
    );
  };

  const getStageBadge = (stage: string) => {
    const stageStyles = {
      APPLIED: "bg-blue-100 text-blue-800 border-blue-200",
      SHORTLISTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
      INTERVIEWED: "bg-purple-100 text-purple-800 border-purple-200",
      HIRED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${stageStyles[stage as keyof typeof stageStyles] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
        {stage}
      </span>
    );
  };

  const totalPages = Math.ceil(applicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = applicants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-4 py-3 border-t">
        <div className="flex items-center text-sm text-gray-700 mb-4 sm:mb-0">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, applicants.length)} of{" "}
            {applicants.length} applicants
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <div className="flex space-x-1">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? "bg-primary-500 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 font-medium">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Job</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/dashboard/recruiting-management')}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/dashboard/recruiting-management')}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <button
                onClick={() => navigate('/admin/dashboard/recruiting-management')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Jobs
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEditJob}
                disabled={operationLoading}
                className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Job</span>
              </button>
              <button
                onClick={handleDeleteJob}
                disabled={operationLoading}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                {job.industry && (
                  <p className="text-lg text-gray-600 mb-4">{job.industry}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                {getStatusBadge(job.status!)}
                {getEmploymentTypeBadge(job.employment_type)}
                {getExperienceBadge(job.experience_level)}
              </div>
            </div>

            {/* Job Meta Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                <span>Posted {formatDate(job.posted_at)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                <span>Expires {formatDate(job.expiry_date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-5 h-5 mr-2 text-gray-400" />
                <span>{applicants.length} Applicant{applicants.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Skills Required */}
            {job.skills_required && Array.isArray(job.skills_required) && job.skills_required.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(job.skills_required as string[]).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Applicants Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Applicants ({applicants.length})
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            {applicantsLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading applicants...</span>
                </div>
              </div>
            ) : currentApplicants.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>No applicants yet for this position</p>
              </div>
            ) : (
              <>
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        #
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        Applicant
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden md:table-cell">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden lg:table-cell">
                        Experience
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        Stage
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden sm:table-cell">
                        Applied
                      </th>
                      <th className="text-right py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentApplicants.map((applicant, index) => (
                      <tr key={applicant.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              {applicant.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {applicant.email}
                            </span>
                            <div className="md:hidden mt-1">
                              {applicant.phone && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {applicant.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden md:table-cell">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-xs">{applicant.email}</span>
                            </div>
                            {applicant.phone && (
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 text-gray-400 mr-1" />
                                <span className="text-xs">{applicant.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden lg:table-cell">
                          {applicant.experienceYears ? `${applicant.experienceYears} years` : 'Not specified'}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          {getStageBadge(applicant.stage)}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden sm:table-cell">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            {formatDate(applicant.created_at)}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewApplicant(applicant)}
                              className="text-gray-400 hover:text-primary-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {applicant.stage !== 'HIRED' && applicant.stage !== 'REJECTED' && (
                              <>
                                <button
                                  onClick={() => setActionConfirm({ applicant, action: 'hire' })}
                                  disabled={operationLoading}
                                  className="text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                                  title="Hire"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setActionConfirm({ applicant, action: 'reject' })}
                                  disabled={operationLoading}
                                  className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                  title="Reject"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPages > 1 && renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Operation Status Toast */}
      {operationStatus && (
        <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${
              operationStatus.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : operationStatus.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-primary-50 border-primary-200 text-primary-800"
            }`}
          >
            {operationStatus.type === "success" && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            {operationStatus.type === "error" && (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            {operationStatus.type === "info" && (
              <AlertCircle className="w-5 h-5 text-primary-600" />
            )}
            <span className="font-medium">{operationStatus.message}</span>
            <button
              onClick={() => setOperationStatus(null)}
              className="ml-2 hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Operation Loading Overlay */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                actionConfirm.action === 'hire' 
                  ? 'bg-green-100' 
                  : 'bg-red-100'
              }`}>
                {actionConfirm.action === 'hire' ? (
                  <UserCheck className="w-6 h-6 text-green-600" />
                ) : (
                  <UserX className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {actionConfirm.action === 'hire' ? 'Hire' : 'Reject'} Applicant
                </h3>
                <p className="text-sm text-gray-500">This action will update the applicant's status</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to {actionConfirm.action}{" "}
                <span className="font-semibold">
                  {actionConfirm.applicant.name}
                </span>
                ? This will change their application status to{" "}
                <span className="font-semibold">
                  {actionConfirm.action === 'hire' ? 'HIRED' : 'REJECTED'}
                </span>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setActionConfirm(null)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplicantAction(actionConfirm.applicant, actionConfirm.action)}
                disabled={operationLoading}
                className={`w-full sm:w-auto px-4 py-2 ${
                  actionConfirm.action === 'hire'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {actionConfirm.action === 'hire' ? 'Hire' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobView;