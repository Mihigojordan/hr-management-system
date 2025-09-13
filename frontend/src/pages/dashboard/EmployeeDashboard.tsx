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
  FileText,
} from "lucide-react";
import employeeService from "../../services/employeeService";
import departmentService from "../../services/departmentService";
import contractService from "../../services/contractService";
import { useNavigate } from "react-router-dom";
import type { Employee, Department, ContractData, Contract } from "../../types/model";
import { useSocket, useSocketEvent } from "../../context/SocketContext";
import AddContractModal from "../../components/dashboard/contract/AddContractModal";

const CONTRACT_STATUSES = ['ACTIVE', 'EXPIRED', 'TERMINATED', 'PENDING'] as const;
type ContractStatus = typeof CONTRACT_STATUSES[number];

interface OperationStatus {
  type: "success" | "error" | "info";
  message: string;
}

const EmployeeDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Employee>("first_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [deleteConfirm, setDeleteConfirm] = useState<Employee | null>(null);
  const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeContractStatus, setEmployeeContractStatus] = useState<{ [key: string]: boolean }>({});

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    handleFilterAndSort();
  }, [searchTerm, sortBy, sortOrder, allEmployees]);

  // Real-time socket listeners
  useSocketEvent('contractCreated', (contract: Contract) => {
    showOperationStatus('info', `New contract created${contract.employeeId ? ` for employee ${contract.employeeId}` : ''}!`);
    if (contract.employeeId) {
      setEmployeeContractStatus((prev) => ({
        ...prev,
        [contract.employeeId]: true,
      }));
    }
  });

  useSocketEvent('contractUpdated', (contract: Contract) => {
    showOperationStatus('info', `Contract ${contract.id} updated!`);
  });

  useSocketEvent('contractDeleted', ({ id }: { id: string }) => {
    showOperationStatus('info', `Contract ${id} deleted!`);
    // Optionally reload contract status for affected employee
    loadData(); // Reload to ensure contract status is updated
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeeData, departmentData] = await Promise.all([
        employeeService.getAllEmployees(),
        departmentService.getAllDepartments(),
      ]);
      setAllEmployees(employeeData || []);
      setDepartments(departmentData || []);
      setError(null);

      // Fetch contract status for all employees
      const contractStatus: { [key: string]: boolean } = {};
      for (const employee of employeeData || []) {
        if (employee.id) {
          const contracts = await contractService.getContractsByEmployeeId(employee.id);
          contractStatus[employee.id] = contracts.length > 0;
        }
      }
      setEmployeeContractStatus(contractStatus);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showOperationStatus = (type: OperationStatus["type"], message: string, duration: number = 3000) => {
    setOperationStatus({ type, message });
    setTimeout(() => setOperationStatus(null), duration);
  };

  const handleFilterAndSort = () => {
    let filtered = [...allEmployees];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (emp) =>
          emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle dates
      if (sortBy === "date_hired" || sortBy === "date_of_birth") {
        const aDate = typeof aValue === "string" || aValue instanceof Date
          ? new Date(aValue)
          : new Date(0);
        const bDate = typeof bValue === "string" || bValue instanceof Date
          ? new Date(bValue)
          : new Date(0);

        if (sortOrder === "asc") return aDate.getTime() - bDate.getTime();
        else return bDate.getTime() - aDate.getTime();
      }

      // Handle strings / numbers
      const aStr = aValue ? aValue.toString().toLowerCase() : "";
      const bStr = bValue ? bValue.toString().toLowerCase() : "";

      if (sortOrder === "asc") return aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
      else return aStr < bStr ? 1 : aStr > bStr ? -1 : 0;
    });

    setEmployees(filtered);
    setCurrentPage(1);
  };

  const handleAddEmployee = () => {
    navigate('/admin/dashboard/employee-management/create');
  };

  const handleEditEmployee = (employee: Employee) => {
    if (!employee?.id) return;
    navigate(`/admin/dashboard/employee-management/update/${employee.id}`);
  };

  const handleViewEmployee = (employee: Employee) => {
    if (!employee?.id) return;
    navigate(`/admin/dashboard/employee-management/${employee.id}`);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      setOperationLoading(true);
      setDeleteConfirm(null);
      await employeeService.deleteEmployee(employee.id);
      loadData();
      showOperationStatus("success", `${employee.first_name} ${employee.last_name} deleted successfully!`);
    } catch (err: any) {
      showOperationStatus("error", err.message || "Failed to delete employee");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCreateContract = async (employee: Employee) => {
    try {
      setOperationLoading(true);
      // Fetch employee's contracts to check if any exist
      const contracts = await contractService.getContractsByEmployeeId(employee.id);
      if (contracts.length > 0) {
        showOperationStatus('error', 'This employee already has a contract.');
        return;
      }

      setSelectedEmployee(employee);
      setIsContractModalOpen(true);
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Failed to check existing contracts');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleContractSubmit = async (data: ContractData) => {
    try {
      setOperationLoading(true);
      const validation = contractService.validateContractData(data);
      if (!validation.isValid) {
        showOperationStatus('error', validation.errors.join(', '));
        return;
      }

      const contract = await contractService.createContract(data);
      if (selectedEmployee) {
        await contractService.assignEmployeeToContract(contract.id, selectedEmployee.id);
        setEmployeeContractStatus((prev) => ({
          ...prev,
          [selectedEmployee.id]: true,
        }));
      }

      showOperationStatus('success', 'Contract created and assigned successfully!');
    } catch (err: any) {
      showOperationStatus('error', err.message || 'Failed to create contract');
    } finally {
      setOperationLoading(false);
      setIsContractModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleSort = (field: keyof Employee) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: keyof Employee) => {
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
    if (!dateString) return new Date().toLocaleDateString("en-GB");
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDepartmentName = (departmentId?: string): string => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : "Unknown";
  };

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

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
            Showing {startIndex + 1} to {Math.min(endIndex, employees.length)} of{" "}
            {employees.length} results
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
                Employee Management
              </h1>
            </div>
            <button
              onClick={handleAddEmployee}
              disabled={operationLoading}
              className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
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
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const [field, order] = e.target.value.split("-") as [keyof Employee, "asc" | "desc"];
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="first_name-asc">First Name (A-Z)</option>
                    <option value="first_name-desc">First Name (Z-A)</option>
                    <option value="position-asc">Position (A-Z)</option>
                    <option value="position-desc">Position (Z-A)</option>
                    <option value="date_hired-desc">Newest Hired</option>
                    <option value="date_hired-asc">Oldest Hired</option>
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
                  <span>Loading employees...</span>
                </div>
              </div>
            ) : currentEmployees.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? `No employees found for "${searchTerm}"` : "No employees found"}
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
                        onClick={() => handleSort("first_name")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          {getSortIcon("first_name")}
                        </div>
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden md:table-cell"
                        onClick={() => handleSort("position")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Position</span>
                          {getSortIcon("position")}
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 hidden lg:table-cell">
                        Department
                      </th>
                      <th
                        className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                        onClick={() => handleSort("date_hired")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Hire Date</span>
                          {getSortIcon("date_hired")}
                        </div>
                      </th>
                      <th className="text-right py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentEmployees.map((employee, index) => (
                      <tr key={employee.id || index} className="hover:bg-gray-50">
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                          {startIndex + index + 1}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900 text-sm sm:text-base">
                              {employee.first_name} {employee.last_name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden md:table-cell">
                          {employee.position || "No position"}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden lg:table-cell">
                          {getDepartmentName(employee.departmentId)}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm hidden sm:table-cell">
                          {formatDate(employee.date_hired)}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewEmployee(employee)}
                              className="text-gray-400 hover:text-primary-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditEmployee(employee)}
                              disabled={operationLoading}
                              className="text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCreateContract(employee)}
                              disabled={!!operationLoading || !!(employee.id && employeeContractStatus[employee.id])}
                              className="text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={employee.id && employeeContractStatus[employee.id] ? "Employee already has a contract" : "Create Contract"}
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(employee)}
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

      <AddContractModal
        isOpen={isContractModalOpen}
        onClose={() => {
          setIsContractModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleContractSubmit}
        departments={departments}
        loading={operationLoading}
        employee={selectedEmployee}
      />

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

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Employee</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {deleteConfirm.first_name} {deleteConfirm.last_name}
                </span>
                ? This will permanently remove the employee and all associated data.
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
                onClick={() => handleDeleteEmployee(deleteConfirm)}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;