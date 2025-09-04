import React, { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

const AddContractModal = ({ isOpen, onClose, onSubmit, employees, departments, loading }) => {
  const [newContract, setNewContract] = useState({
    employeeId: "",
    departmentId: "",
    contractType: "",
    startDate: "",
    endDate: "",
    salary: "",
    currency: "RWF",
    status: "ACTIVE",
  });

    const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const handleSubmit = () => {
    // Check for existing active contract
    const selectedEmployee = employees.find((emp) => emp.id === newContract.employeeId);
    const activeContract = selectedEmployee?.contracts?.find(
      (contract) => contract.status === "ACTIVE"
    );

    if (activeContract && newContract.status === "ACTIVE") {
      Swal.fire({
        title: "Warning: Active Contract Exists",
        html: `The employee <strong>${selectedEmployee.first_name} ${selectedEmployee.last_name}</strong> already has an active contract (${activeContract.contractType}). <br> <br> Started at <strong>${formatDate(activeContract.startDate)}</strong> and Ending at <strong>${formatDate(activeContract.endDate)}</strong> .<br/><br/>Creating a new active contract will terminate the existing one. Do you want to proceed?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Create New Contract",
        cancelButtonText: "No, Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          // Pass the active contract ID to terminate along with the new contract data
          onSubmit({ ...newContract,});
          onClose()
        }
      });
    } else {
      onSubmit(newContract);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add New Contract</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <select
              value={newContract.employeeId}
              onChange={(e) =>
                setNewContract({ ...newContract, employeeId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={newContract.departmentId}
              onChange={(e) =>
                setNewContract({ ...newContract, departmentId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contract Type
            </label>
            <select
              value={newContract.contractType}
              onChange={(e) =>
                setNewContract({ ...newContract, contractType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Contract Type</option>
              <option value="PROBATION">Probation</option>
              <option value="PERMANENT">Permanent</option>
              <option value="TEMPORARY">Temporary</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={newContract.startDate}
              onChange={(e) =>
                setNewContract({ ...newContract, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={newContract.endDate}
              onChange={(e) =>
                setNewContract({ ...newContract, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary
            </label>
            <input
              type="number"
              value={newContract.salary}
              onChange={(e) =>
                setNewContract({ ...newContract, salary: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter salary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <input
              type="text"
              value={newContract.currency}
              onChange={(e) =>
                setNewContract({ ...newContract, currency: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter currency (e.g., RWF)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={newContract.status}
              onChange={(e) =>
                setNewContract({ ...newContract, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="TERMINATED">Terminated</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
          >
            Add Contract
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddContractModal;