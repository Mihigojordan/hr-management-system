
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
} from "lucide-react";
import departmentService from "../../services/departmentService";

// Define interfaces
interface Department {
  id: number | string;
  name: string;
  description?: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
}

interface DepartmentData {
  id?:string;
  name: string;
  description?: string;
}

interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DepartmentService {
  getAllDepartments: () => Promise<Department[]>;
  createDepartment: (data: DepartmentData) => Promise<Department>;
  updateDepartment: (id: number | string, data: Partial<DepartmentData>) => Promise<Department>;
  deleteDepartment: (id: number | string) => Promise<void>;
  validateDepartmentData: (data: Partial<DepartmentData>) => ValidationResult;
}

const DepartmentDashboard: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Department | "name">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [viewingDepartment, setViewingDepartment] = useState<Department | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Department | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [newDepartment, setNewDepartment] = useState<DepartmentData>({
    name: "",
    description: "",
  });

  // Load departments on component mount
  useEffect(() => {
    loadDepartments();
  }, []);

  // Handle search and sort
  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allDepartments]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAllDepartments();
      setAllDepartments(data || []);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type: OperationStatus["type"], message: string, duration: number = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allDepartments];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (dept) =>
          dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
  // eslint-disable-next-line prefer-const
  let aValue = a[sortBy] ?? "";
  // eslint-disable-next-line prefer-const
  let bValue = b[sortBy] ?? "";

  if (sortBy === "createdAt") {
    const dateA = new Date(aValue as string).getTime();
    const dateB = new Date(bValue as string).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  } else {
    const strA = aValue.toString().toLowerCase();
    const strB = bValue.toString().toLowerCase();
    return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
  }
});

    setDepartments(filtered);
    setCurrentPage(1);
  };

  const handleAddDepartment = async () => {
    try {
      setOperationLoading(true);
      const validation = departmentService.validateDepartmentData(newDepartment);
      if (!validation.isValid) {
        showOperationStatus("error", validation.errors.join(", "));
        return;
      }

      await departmentService.createDepartment(newDepartment);
      setNewDepartment({ name: "", description: "" });
      setShowAddModal(false);
      loadDepartments();
      showOperationStatus("success", "Department created successfully!");
    } catch (err: any) {
      showOperationStatus("error", err.message || "Failed to create department");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEditDepartment = async () => {
    if (!editingDepartment) return;
    try {
      setOperationLoading(true);
      const validation = departmentService.validateDepartmentData(editingDepartment);
      if (!validation.isValid) {
        showOperationStatus("error", validation.errors.join(", "));
        return;
      }

      await departmentService.updateDepartment(editingDepartment.id, editingDepartment);
      setEditingDepartment(null);
      loadDepartments();
      showOperationStatus("success", "Department updated successfully!");
    } catch (err: any) {
      showOperationStatus("error", err.message || "Failed to update department");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteDepartment = async (department: Department) => {
    try {
      setOperationLoading(true);
      setDeleteConfirm(null);
      await departmentService.deleteDepartment(department.id);
      loadDepartments();
      showOperationStatus("success", `${department.name} deleted successfully!`);
    } catch (err: any) {
      showOperationStatus("error", err.message || "Failed to delete department");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleSort = (field: keyof Department) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: keyof Department) => {
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
    if (!dateString) {
      return new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDepartments = departments.slice(startIndex, endIndex);

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
            Showing {startIndex + 1} to {Math.min(endIndex, departments.length)} of{" "}
            {departments.length} results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
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
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Department Management
              </h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={operationLoading}
              className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add new department"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search departments..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    aria-label="Search departments"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort By:</span>
                <div className="relative">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const [field, order] = e.target.value.split("-") as [
                        keyof Department,
                        "asc" | "desc"
                      ];
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Sort departments"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading departments...</span>
                </div>
              </div>
            ) : currentDepartments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? `No departments found for "${searchTerm}"` : "No departments found"}
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
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Department Name</span>
                          {getSortIcon("name")}
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden md:table-cell">
                        Description
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Created Date</span>
                          {getSortIcon("createdAt")}
                        </div>
                      </th>
                      <th className="text-right py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentDepartments.map((department, index) => (
                      <tr
                        key={department.id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              {department.name || "Unnamed Department"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 hidden md:table-cell">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-700 max-w-xs truncate">
                              {department.description || "No description provided"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden sm:table-cell">
                          {formatDate(department.createdAt)}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setViewingDepartment(department)}
                              className="text-gray-400 hover:text-primary-600 transition-colors"
                              title="View Details"
                              aria-label="View department details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingDepartment(department)}
                              disabled={operationLoading}
                              className="text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                              title="Edit"
                              aria-label="Edit department"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(department)}
                              disabled={operationLoading}
                              className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                              title="Delete"
                              aria-label="Delete department"
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
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Loading Overlay */}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Department</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{deleteConfirm.name}"</span>? This will
                permanently remove the department and all associated data.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Cancel delete"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDepartment(deleteConfirm)}
                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                aria-label="Confirm delete department"
              >
                Delete Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Department Modal */}
      {viewingDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Department Details</h3>
              <button
                onClick={() => setViewingDepartment(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close view modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {viewingDepartment.name || "Unnamed Department"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg min-h-[60px]">
                  {viewingDepartment.description || "No description provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created Date
                </label>
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {formatDate(viewingDepartment.createdAt)}
                </p>
              </div>
              {viewingDepartment.updatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                    {formatDate(viewingDepartment.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Department</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close add modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter department name"
                  aria-label="Department name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewDepartment({
                      ...newDepartment,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none"
                  placeholder="Enter department description (optional)"
                  aria-label="Department description"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Cancel add"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                disabled={operationLoading}
                className="w-full sm:w-auto px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                aria-label="Add department"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editingDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Department</h3>
              <button
                onClick={() => setEditingDepartment(null)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close edit modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={editingDepartment.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditingDepartment({
                      ...editingDepartment,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter department name"
                  aria-label="Department name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingDepartment.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditingDepartment({
                      ...editingDepartment,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 h-20 resize-none"
                  placeholder="Enter department description (optional)"
                  aria-label="Department description"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => setEditingDepartment(null)}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                aria-label="Cancel edit"
              >
                Cancel
              </button>
              <button
                onClick={handleEditDepartment}
                disabled={operationLoading}
                className="w-full sm:w-auto px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                aria-label="Update department"
              >
                Update Department
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;
