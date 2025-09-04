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

import contractService from "../../services/contractService";
import employeeService from "../../services/employeeService";
import departmentService from "../../services/departmentService";
import AddContractModal from "./../../components/dashboard/contract/AddContractModal";
import EditContractModal from "./../../components/dashboard/contract/EditContractModal";
import ViewContractModal from "./../../components/dashboard/contract/ViewContractModal";
import DeleteConfirmModal from "./../../components/dashboard/contract/DeleteConfirmModal";

const ContractDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [allContracts, setAllContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [viewingContract, setViewingContract] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allContracts]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contractData, employeeData, departmentData] = await Promise.all([
        contractService.getAllContracts(),
        employeeService.getAllEmployees(),
        departmentService.getAllDepartments(),
      ]);
      setAllContracts(contractData || []);
      setEmployees(employeeData || []);
      setDepartments(departmentData || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type, message, duration = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allContracts];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (contract) =>
          contract.contractType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getEmployeeName(contract.employeeId)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getDepartmentName(contract.departmentId)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy] || "";
      let bValue = b[sortBy] || "";

      if (sortBy === "startDate" || sortBy === "endDate" || sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === "employee") {
        aValue = getEmployeeName(a.employeeId).toLowerCase();
        bValue = getEmployeeName(b.employeeId).toLowerCase();
      } else if (sortBy === "department") {
        aValue = getDepartmentName(a.departmentId).toLowerCase();
        bValue = getDepartmentName(b.departmentId).toLowerCase();
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setContracts(filtered);
    setCurrentPage(1);
  };

  const handleAddContract = async (contractData) => {
    try {
      setOperationLoading(true);
      const validation = contractService.validateContractData(contractData);
      if (!validation.isValid) {
        showOperationStatus("error", validation.errors.join(", "));
        return;
      }

      await contractService.createContract(contractData);
      setShowAddModal(false);
      loadData();
      showOperationStatus("success", "Contract created successfully!");
    } catch (err) {
      showOperationStatus("error", err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEditContract = async (contractData) => {
    try {
      setOperationLoading(true);
      const validation = contractService.validateContractData(contractData);
      if (!validation.isValid) {
        showOperationStatus("error", validation.errors.join(", "));
        return;
      }

      await contractService.updateContract(contractData.id, contractData);
      setEditingContract(null);
      loadData();
      showOperationStatus("success", "Contract updated successfully!");
    } catch (err) {
      showOperationStatus("error", err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteContract = async (contract) => {
    try {
      setOperationLoading(true);
      setDeleteConfirm(null);
      await contractService.deleteContract(contract.id);
      loadData();
      showOperationStatus("success", `Contract for ${getEmployeeName(contract.employeeId)} deleted successfully!`);
    } catch (err) {
      showOperationStatus("error", err.message);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : "Unknown";
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : "Unknown";
  };

  const totalPages = Math.ceil(contracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentContracts = contracts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
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
            Showing {startIndex + 1} to {Math.min(endIndex, contracts.length)} of{" "}
            {contracts.length} results
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
                Contract Management
              </h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={operationLoading}
              className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contract</span>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search contracts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort By:</span>
                <div className="relative">
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split("-");
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="startDate-desc">Newest Start Date</option>
                    <option value="startDate-asc">Oldest Start Date</option>
                    <option value="contractType-asc">Contract Type (A-Z)</option>
                    <option value="contractType-desc">Contract Type (Z-A)</option>
                    <option value="employee-asc">Employee Name (A-Z)</option>
                    <option value="employee-desc">Employee Name (Z-A)</option>
                    <option value="department-asc">Department (A-Z)</option>
                    <option value="department-desc">Department (Z-A)</option>
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
                  <span>Loading contracts...</span>
                </div>
              </div>
            ) : currentContracts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? `No contracts found for "${searchTerm}"` : "No contracts found"}
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
                        onClick={() => handleSort("employee")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Employee</span>
                          {getSortIcon("employee")}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                        onClick={() => handleSort("contractType")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Contract Type</span>
                          {getSortIcon("contractType")}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                        onClick={() => handleSort("contractType")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          {getSortIcon("status")}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                        onClick={() => handleSort("department")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Department</span>
                          {getSortIcon("department")}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                        onClick={() => handleSort("startDate")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Start Date</span>
                          {getSortIcon("startDate")}
                        </div>
                      </th>
                      <th className="text-right py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentContracts.map((contract, index) => (
                      <tr key={contract.id || index} className="hover:bg-gray-50">
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              {getEmployeeName(contract.employeeId)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden md:table-cell">
                          {contract.contractType || "N/A"}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden md:table-cell">
                          {contract.status || "N/A"}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden lg:table-cell">
                          {getDepartmentName(contract.departmentId)}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden sm:table-cell">
                          {formatDate(contract.startDate)}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setViewingContract(contract)}
                              className="text-gray-400 hover:text-primary-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingContract(contract)}
                              disabled={operationLoading}
                              className="text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(contract)}
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
            <button
              onClick={() => setOperationStatus(null)}
              className="ml-2 hover:opacity-70"
            >
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

      <AddContractModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddContract}
        employees={employees}
        departments={departments}
        loading={operationLoading}
      />

      {editingContract && (
        <EditContractModal
          isOpen={!!editingContract}
          onClose={() => setEditingContract(null)}
          onSubmit={handleEditContract}
          contract={editingContract}
          employees={employees}
          departments={departments}
          loading={operationLoading}
        />
      )}

      {viewingContract && (
        <ViewContractModal
          isOpen={!!viewingContract}
          onClose={() => setViewingContract(null)}
          contract={viewingContract}
          getEmployeeName={getEmployeeName}
          getDepartmentName={getDepartmentName}
          formatDate={formatDate}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDeleteContract(deleteConfirm)}
          contract={deleteConfirm}
          getEmployeeName={getEmployeeName}
        />
      )}
    </div>
  );
};

export default ContractDashboard;