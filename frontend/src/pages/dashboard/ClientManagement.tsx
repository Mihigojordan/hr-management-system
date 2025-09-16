
import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Download,
    Grid,
    List,
    Users,
    UserCheck,
    UserX,
    UserPlus,
    MoreHorizontal,
    MessageSquare,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    X
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import clientService, { type CreateClientInput, type UpdateClientInput } from '../../services/clientService';
import AddClientModal from '../../components/dashboard/client/AddClientModal';
import EditClientModal from '../../components/dashboard/client/EditClientModal';
import DeleteClientModal from '../../components/dashboard/client/DeleteClientModal';
import { API_URL } from '../../api/api';
import { useSocketEvent } from '../../context/SocketContext';

interface Client {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    profileImage?: string | null;
    createdAt: string;
    updatedAt: string;
}

interface OperationStatus {
    type: 'success' | 'error' | 'info';
    message: string;
}

const ClientManagement = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('Last 7 Days');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [operationStatus, setOperationStatus] = useState<OperationStatus | null>(null);
    const [operationLoading, setOperationLoading] = useState<boolean>(false);

    // Ref for hidden PDF content
    const pdfContentRef = useRef<HTMLDivElement>(null);

    // Fetch initial clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                const data = await clientService.getAllClients();
                setClients(data || []);
                setError(null);
            } catch (err: any) {
                const errorMessage = err.message || 'Failed to load clients';
                console.error('Error fetching clients:', err);
                setError(errorMessage);
                showOperationStatus('error', errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    // WebSocket event handlers
    useSocketEvent('clientCreated', (clientData: Client) => {
        console.log('Client created via WebSocket:', clientData);
        setClients((prevClients) => [...prevClients, clientData]);
        showOperationStatus('success', `Client ${clientData.firstname} ${clientData.lastname} created`);
    });

    useSocketEvent('clientUpdated', (clientData: Client) => {
        console.log('Client updated via WebSocket:', clientData);
        setClients((prevClients) =>
            prevClients.map((c) => (c.id === clientData.id ? clientData : c))
        );
        showOperationStatus('success', `Client ${clientData.firstname} ${clientData.lastname} updated`);
    });

    useSocketEvent('clientDeleted', ({ id }: { id: string }) => {
        console.log('Client deleted via WebSocket:', id);
        setClients((prevClients) => prevClients.filter((c) => c.id !== id));
        showOperationStatus('success', 'Client deleted');
    });

    // Generate avatar colors based on name
    const getAvatarColor = (name: string) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
            'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getInitials = (firstname: string, lastname: string) => {
        return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
    };

    const showOperationStatus = (type: OperationStatus['type'], message: string, duration: number = 3000) => {
        console.log('Operation status:', { type, message });
        setOperationStatus({ type, message });
        setTimeout(() => setOperationStatus(null), duration);
    };

    const handleExportPDF = async () => {
    try {
        setOperationLoading(true);

        const date = new Date().toLocaleDateString('en-CA').replace(/\//g, '');
        const filename = `clients_export_${date}.pdf`;

        // Generate table rows including profile images
        const tableRows = filteredClients.map((client, index) => {
            const profileImgUrl = client.profileImage
                ? `${API_URL}${client.profileImage}`
                : ''; // Optionally, a placeholder

            return `
                <tr>
                    <td style="font-size:10px;">${index + 1}</td>
                    <td style="font-size:10px;">
                        ${profileImgUrl ? `<img src="${profileImgUrl}" style="width:25px;height:25px;border-radius:50%;vertical-align:middle;margin-right:5px;" />` : ''}
                        ${client.firstname} ${client.lastname}
                    </td>
                    <td style="font-size:10px;">${client.email}</td>
                    <td style="font-size:10px;">${client.phone || 'N/A'}</td>
                    <td style="font-size:10px;">${client.address || 'N/A'}</td>
                    <td style="font-size:10px; color: ${client.status === 'ACTIVE' ? 'green' : 'red'};">
                        ${client.status}
                    </td>
                </tr>
            `;
        }).join('');

        const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; font-size: 10px; }
                    h1 { font-size: 14px; margin-bottom: 5px; }
                    p { font-size: 9px; margin-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; font-size: 10px; }
                    th, td { border: 1px solid #ddd; padding: 4px; text-align: left; vertical-align: middle; }
                    th { background-color: #ff6200; color: white; font-weight: bold; font-size: 10px; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    img { display: inline-block; }
                </style>
            </head>
            <body>
                <h1>Client List</h1>
                <p>Exported on: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' })}</p>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Client Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const opt = {
            margin: 0.5,
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        await html2pdf().from(htmlContent).set(opt).save();
        showOperationStatus('success', 'PDF exported successfully');
    } catch (err: any) {
        console.error('Error generating PDF:', err);
        showOperationStatus('error', 'Failed to export PDF');
    } finally {
        setOperationLoading(false);
    }
};


    const handleAddClient = () => {
        setSelectedClient(null);
        setIsAddModalOpen(true);
    };

    const handleEditClient = async (id: string) => {
        try {
            setOperationLoading(true);
            const client = await clientService.getClientById(id);
            if (client) {
                setSelectedClient(client);
                setIsEditModalOpen(true);
            } else {
                showOperationStatus('error', 'Client not found');
            }
        } catch (err: any) {
            console.error('Error fetching client for edit:', err);
            showOperationStatus('error', err.message || 'Failed to fetch client');
        } finally {
            setOperationLoading(false);
        }
    };

    const handleDeleteClient = (client: Client) => {
        setSelectedClient(client);
        setIsDeleteModalOpen(true);
    };

    const handleSaveClient = async (data: CreateClientInput | UpdateClientInput) => {
        try {
            setOperationLoading(true);
            console.log('Saving client with data:', data);
            if (isAddModalOpen) { // Add mode
                console.log('Calling clientService.createClient with:', data);
                const newClient = await clientService.createClient(data as CreateClientInput);
                console.log('createClient response:', newClient);
                if (!newClient) {
                    throw new Error('No client data returned from createClient');
                }
                // Note: No need to update state here, as WebSocket will handle it
                showOperationStatus('success', 'Client created successfully');
                setIsAddModalOpen(false);
            } else { // Edit mode
                console.log('Calling clientService.updateClient with:', data);
                if (!selectedClient) {
                    throw new Error('No client selected for update');
                }
                const updatedClient = await clientService.updateClient(selectedClient.id, data as UpdateClientInput);
                console.log('updateClient response:', updatedClient);
                // Note: No need to update state here, as WebSocket will handle it
                showOperationStatus('success', 'Client updated successfully');
                setIsEditModalOpen(false);
            }
        } catch (err: any) {
            console.error('Error in handleSaveClient:', err);
            showOperationStatus('error', err.message || 'Failed to save client');
        } finally {
            setOperationLoading(false);
        }
    };

    const handleDelete = async (client: Client) => {
        try {
            setOperationLoading(true);
            console.log('Deleting client with ID:', client.id);
            await clientService.deleteClient(client.id);
            // Note: No need to update state here, as WebSocket will handle it
            showOperationStatus('success', `Client "${client.firstname} ${client.lastname}" deleted successfully`);
        } catch (err: any) {
            console.error('Error deleting client:', err);
            showOperationStatus('error', err.message || 'Failed to delete client');
        } finally {
            setOperationLoading(false);
            setIsDeleteModalOpen(false);
            setSelectedClient(null);
        }
    };


    const filteredClients = clients
        .filter((client) =>
            `${client.firstname} ${client.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((client) => statusFilter === 'all' || client.status === statusFilter.toUpperCase())
        .sort((a, b) => {
            if (sortBy === 'Last 7 Days') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sortBy === 'Last 30 Days') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

    const totalPages = Math.ceil(filteredClients.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentClients = filteredClients.slice(startIndex, endIndex);

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
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredClients.length)} of {filteredClients.length} results
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
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
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                    currentPage === page
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
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

    const ClientCard = ({ client }: { client: Client }) => {
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [imageError, setImageError] = useState(false);
        const dropdownRef = useRef<HTMLDivElement>(null);

        // Toggle dropdown visibility
        const toggleDropdown = () => {
            setIsDropdownOpen(!isDropdownOpen);
        };

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    setIsDropdownOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md border py-1 z-10">
                                <button
                                    onClick={() => {
                                        handleEditClient(client.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex items-center px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                >
                                    <Edit className="w-3 h-3 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        handleDeleteClient(client);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex items-center px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                >
                                    <Trash2 className="w-3 h-3 mr-2" />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden">
                        {client.profileImage && !imageError ? (
                            <img
                                src={`${API_URL}${client.profileImage}`}
                                alt={`${client.firstname} ${client.lastname}`}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className={`w-full h-full ${getAvatarColor(client.firstname)} flex items-center justify-center text-white text-lg font-medium`}>
                                {getInitials(client.firstname, client.lastname)}
                            </div>
                        )}
                        {client.status === 'ACTIVE' && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{client.firstname} {client.lastname}</h3>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Email:</span> {client.email}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Phone:</span> {client.phone || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Address:</span> {client.address || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Created:</span> {client.createdAt}
                    </p>
                </div>

                <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                                <MessageSquare className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Phone className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            
            <AddClientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveClient}
            />
            <EditClientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                client={selectedClient}
                onSave={handleSaveClient}
            />
            <DeleteClientModal
                isOpen={isDeleteModalOpen}
                client={selectedClient}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={handleDelete}
            />
            {operationStatus && (
                <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
                    <div
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${
                            operationStatus.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : operationStatus.type === 'error'
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-orange-50 border-orange-200 text-orange-800'
                        }`}
                    >
                        {operationStatus.type === 'success' && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {operationStatus.type === 'error' && (
                            <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        {operationStatus.type === 'info' && (
                            <AlertCircle className="w-5 h-5 text-orange-600" />
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
                            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-700 font-medium">Processing...</span>
                        </div>
                    </div>
                </div>
            )}
            {/* Hidden PDF Content */}
           
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Clients</h1>
                            <nav className="flex items-center space-x-1 text-sm text-gray-500">
                                <span>🏠</span>
                                <span>/</span>
                                <span>Employee</span>
                                <span>/</span>
                                <span className="text-gray-900">Client {viewMode === 'grid' ? 'Grid' : 'List'}</span>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center space-x-1 px-3 py-2 text-sm border rounded-lg ${viewMode === 'grid' 
                                    ? 'bg-orange-500 text-white border-orange-500' 
                                    : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`flex items-center space-x-1 px-3 py-2 text-sm border rounded-lg ${viewMode === 'list' 
                                    ? 'bg-orange-500 text-white border-orange-500' 
                                    : 'border-gray-300 hover:bg-gray-50'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleExportPDF}
                                disabled={operationLoading || filteredClients.length === 0}
                                className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                            </button>
                            <button 
                                onClick={handleAddClient}
                                disabled={operationLoading}
                                className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Client</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{clients.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-pink-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {clients.filter((c) => c.status === 'ACTIVE').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Inactive Clients</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {clients.filter((c) => c.status === 'INACTIVE').length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <UserX className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">New Clients</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {clients.filter((c) => {
                                        const createdAt = new Date(c.createdAt);
                                        const now = new Date();
                                        now.setHours(now.getHours() + 2); // Adjust for CAT (UTC+2)
                                        return createdAt.getTime() > now.getTime() - 30 * 24 * 60 * 60 * 1000;
                                    }).length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-4 sm:p-6 border-b">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="relative flex-1 sm:flex-none">
                                    <input
                                        type="text"
                                        placeholder="Search clients..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                                <div className="flex space-x-2">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Sort By:</span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                        <option>Last 3 Months</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <div className="inline-flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading clients...</span>
                            </div>
                        </div>
                    ) : currentClients.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm || statusFilter !== 'all'
                                ? 'No clients found matching your filters'
                                : 'No clients found'}
                        </div>
                    ) : (
                        <>
                            {viewMode === 'grid' && (
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {currentClients.map((client) => (
                                            <ClientCard key={client.id} client={client} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {viewMode === 'list' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                                                    #
                                                </th>
                                                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                                                    Client Name
                                                </th>
                                                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                                                    Email
                                                </th>
                                                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                                                    Phone
                                                </th>
                                                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                                                    Address
                                                </th>
                                                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                                                    Status
                                                </th>
                                                <th className="text-right py-3 px-4 sm:px-6 text-sm font-medium text-gray-500">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {currentClients.map((client, index) => (
                                                <tr key={client.id} className="hover:bg-gray-50">
                                                    <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                                                        {startIndex + index + 1}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center relative overflow-hidden">
                                                                {client.profileImage ? (
                                                                    <img
                                                                        src={`${API_URL}${client.profileImage}`}
                                                                        alt={`${client.firstname} ${client.lastname}`}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                                            (e.target as HTMLImageElement).parentElement?.querySelector('.initials')?.classList.remove('hidden');
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <div className={`w-full h-full ${getAvatarColor(client.firstname)} flex items-center justify-center text-white text-sm font-medium ${client.profileImage ? 'hidden initials' : ''}`}>
                                                                    {getInitials(client.firstname, client.lastname)}
                                                                </div>
                                                                {client.status === 'ACTIVE' && (
                                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {client.firstname} {client.lastname}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                                                        {client.email}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                                                        {client.phone || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-gray-700 text-sm">
                                                        {client.address || 'N/A'}
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            client.status === 'ACTIVE'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            • {client.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button 
                                                                onClick={() => handleEditClient(client.id)}
                                                                disabled={operationLoading}
                                                                className="text-gray-400 hover:text-orange-600 transition-colors disabled:opacity-50"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteClient(client)}
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
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientManagement;