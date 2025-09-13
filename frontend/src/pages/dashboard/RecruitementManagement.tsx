import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Copy,
  MoreHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  MapPin,
  Calendar,
  Users,
  Briefcase,
} from "lucide-react";
import jobService from "../../services/jobService";
import { useNavigate } from "react-router-dom";
import { useSocketEvent,useSocket } from "../../context/SocketContext"; // Import useSocketEvent
import type { Job } from "../../types/model";

interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

const JobDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Job>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  const [deleteConfirm, setDeleteConfirm] = useState<Job | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const {socket} =useSocket()

  const navigate = useNavigate();

  // Load initial job data
  useEffect(() => {
    loadData();
  }, []);

  // Handle WebSocket events for job updates
  useSocketEvent("jobCreated", (job: Job) => {
    if(job){

      setAllJobs((prev) => [...prev, job]);
      showOperationStatus("success", `New job "${job.title}" created!`);
    }
  }, [setAllJobs]);

  useSocketEvent("jobUpdated", (updatedJob: Job) => {
    if(updatedJob){

      setAllJobs((prev) =>
        prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    showOperationStatus("success", `Job "${updatedJob.title}" updated!`);
  }
  }, [setAllJobs]);

  useSocketEvent("jobDeleted", ({ id }: { id: string }) => {
    if(id){

      setAllJobs((prev) => prev.filter((job:Job) => job.id !== id));
      showOperationStatus("success", `Job deleted successfully!`);
    }
  }, [setAllJobs]);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, statusFilter, employmentTypeFilter, allJobs]);

  const loadData = async () => {
    try {
      setLoading(true);
      const jobData = await jobService.getAllJobs();
      setAllJobs(jobData || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type: OperationStatus["type"], message: string, duration: number = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allJobs];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Apply employment type filter
    if (employmentTypeFilter !== "all") {
      filtered = filtered.filter((job) => job.employment_type === employmentTypeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle dates
      if (
        sortBy === "posted_at" ||
        sortBy === "expiry_date" ||
        sortBy === "created_at" ||
        sortBy === "updated_at"
      ) {
        const aDate =
          typeof aValue === "string" || aValue instanceof Date ? new Date(aValue) : new Date(0);
        const bDate =
          typeof bValue === "string" || bValue instanceof Date ? new Date(bValue) : new Date(0);

        if (sortOrder === "asc") return aDate.getTime() - bDate.getTime();
        else return bDate.getTime() - aDate.getTime();
      }

      // Handle strings / numbers
      const aStr = aValue ? aValue.toString().toLowerCase() : "";
      const bStr = bValue ? bValue.toString().toLowerCase() : "";

      if (sortOrder === "asc") return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
      else return aStr < bStr ? 1 : aStr > bStr ? -1 : 0;
    });

    setJobs(filtered);
    setCurrentPage(1);
  };

  const handleAddJob = () => {
    navigate("/admin/dashboard/recruiting-management/create");
  };

  const handleEditJob = (job: Job) => {
    if (!job?.id) return;
    navigate(`/admin/dashboard/recruiting-management/update/${job.id}`);
  };

  const handleViewJob = (job: Job) => {
    if (!job?.id) return;
    navigate(`/admin/dashboard/recruiting-management/${job.id}`);
  };

  const handleDeleteJob = async (job: Job) => {
    try {
      setOperationLoading(true);
      setDeleteConfirm(null);
      await jobService.deleteJob(job.id);
      // Note: No need to call loadData() since jobDeleted event will update allJobs
      showOperationStatus("success", `"${job.title}" deleted successfully!`);
    } catch (err: any) {
      showOperationStatus("error", err.message || "Failed to delete job");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleSort = (field: keyof Job) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: keyof Job) => {
    if (sortBy !== field) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    }
    return (
      <ChevronDown
        className={`w-4 h-4 text-primary-600 transition-transform ${
          sortOrder === "desc" ? "rotate-180" : ""
        }`}
      />
    );
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${
          statusStyles[status as keyof typeof statusStyles] || statusStyles.DRAFT
        }`}
      >
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
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          typeStyles[type as keyof typeof typeStyles] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type.replace("_", " ")}
      </span>
    );
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

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
            Showing {startIndex + 1} to {Math.min(endIndex, jobs.length)} of {jobs.length} results
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Job Management
              </h1>
            </div>
            <button
              onClick={handleAddJob}
              disabled={operationLoading}
              className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>

                <div className="flex space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                    <option value="PAUSED">Paused</option>
                    <option value="DRAFT">Draft</option>
                  </select>

                  <select
                    value={employmentTypeFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEmploymentTypeFilter(e.target.value)}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort By:</span>
                <div className="relative">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const [field, order] = e.target.value.split("-") as [keyof Job, "asc" | "desc"];
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="location-asc">Location (A-Z)</option>
                    <option value="location-desc">Location (Z-A)</option>
                    <option value="posted_at-desc">Newest Posted</option>
                    <option value="posted_at-asc">Oldest Posted</option>
                    <option value="expiry_date-asc">Expiring Soon</option>
                    <option value="expiry_date-desc">Expiring Later</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading jobs...</span>
                </div>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm || statusFilter !== "all" || employmentTypeFilter !== "all"
                  ? "No jobs found matching your filters"
                  : "No jobs found"}
              </div>
            ) : (
              <>
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        #
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Job Title</span>
                          {getSortIcon("title")}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                        onClick={() => handleSort("location")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Location</span>
                          {getSortIcon("location")}
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden lg:table-cell">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden lg:table-cell">
                        Status
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                        onClick={() => handleSort("posted_at")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Posted</span>
                          {getSortIcon("posted_at")}
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden xl:table-cell">
                        Expires
                      </th>
                      <th className="text-right py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentJobs.map((job, index) => (
                      <tr key={job.id || index} className="hover:bg-gray-50">
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              {job.title}
                            </span>
                            {job.industry && (
                              <span className="text-xs text-gray-500 mt-1">{job.industry}</span>
                            )}
                            <div className="md:hidden mt-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden md:table-cell">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                            {job.location}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 hidden lg:table-cell">
                          <div className="flex flex-col space-y-1">
                            {getEmploymentTypeBadge(job.employment_type)}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 hidden lg:table-cell">
                          <div className="flex flex-col space-y-1">
                            {getStatusBadge(job.status!)}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden sm:table-cell">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            {formatDate(job.posted_at)}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden xl:table-cell">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            {formatDate(job.expiry_date)}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewJob(job)}
                              className="text-gray-400 hover:text-primary-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditJob(job)}
                              disabled={operationLoading}
                              className="text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(job)}
                              disabled={operationLoading}
                              className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>

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
            <button onClick={() => setOperationStatus(null)} className="ml-2 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete the job{" "}
                <span className="font-semibold">"{deleteConfirm.title}"</span>? This will permanently
                remove the job posting and all associated data.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deleteConfirm)}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDashboard;