/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import {
    Loader2,
    Plus,
    ArrowRight,
    Ban,
    RotateCcw,
    Trash2,
    UserCheck,
    MoreVertical,
    Filter,
    ChevronDown,
    Search,
    X
} from "lucide-react";
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider } from '@mui/material';
import { Menu, MenuItem, IconButton } from "@mui/material";
import { DELETE_CLIENT, GET_CLIENTS, UPDATE_PRACTICE_STATUS } from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";
import AddPracticeForm from '../components/AddPracticeForm';

interface Client {
    id: string;
    email: string;
    status: string;
    created_at: string;
    practice_name?: string;
    address?: string;
    practice_phone?: string;
    abn_number?: string;
    practice_type?: string;
    city?: string;
    state?: string;
    postcode?: string;
    first_name?: string;
    last_name?: string;
    mobile?: string;
    type?: string;
}

interface ClientsResponse {
    accounts: Client[];
}

// View Details Dialog Component

function ViewDetailsDialog({ open, onClose, client }: { open: boolean; onClose: () => void; client: Client | null }) {
    if (!client) return null;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-AU', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                {/* Sticky Header */}
                <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-[24px] z-10">
                    <h2 className="text-2xl font-black text-[#1a2b3c] pr-8">Practice Details</h2>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-all"
                        aria-label="Close"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Practice Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Practice Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Name</p>
                                <p className="text-[#1a2b3c] font-bold">{client.practice_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email</p>
                                <p className="text-[#1a2b3c] font-medium">{client.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">ABN Number</p>
                                <p className="text-[#1a2b3c] font-medium">{client.abn_number || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Type</p>
                                <p className="text-[#1a2b3c] font-medium">{client.practice_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Practice Phone</p>
                                <p className="text-[#1a2b3c] font-medium">{client.practice_phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Address Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Address</p>
                                <p className="text-[#1a2b3c] font-medium">{client.address || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">City</p>
                                <p className="text-[#1a2b3c] font-medium">{client.city || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">State</p>
                                <p className="text-[#1a2b3c] font-medium">{client.state || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Postcode</p>
                                <p className="text-[#1a2b3c] font-medium">{client.postcode || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Primary Contact Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Primary Contact
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">First Name</p>
                                <p className="text-[#1a2b3c] font-bold">{client.first_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Last Name</p>
                                <p className="text-[#1a2b3c] font-bold">{client.last_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Mobile</p>
                                <p className="text-[#1a2b3c] font-medium">{client.mobile || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2b3c] mb-4 flex items-center gap-2">
                            Account Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Status</p>
                                <div className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider 
                                    ${client.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' :
                                        client.status === 'VERIFIED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            client.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                'bg-red-50 text-red-600 border-red-100'}`}>
                                    {client.status}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Created At</p>
                                <p className="text-[#1a2b3c] font-medium">{formatDate(client.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Account Type</p>
                                <p className="text-[#1a2b3c] font-medium">{client.type || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer with Buttons */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-4 sticky bottom-0 bg-white rounded-b-[24px]">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-full font-bold text-white hover:bg-orange-700 transition-all bg-orange-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function Clients() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setIsProcessing] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [viewDetailsClient, setViewDetailsClient] = useState<Client | null>(null);

    const { data, loading, error, refetch } = useQuery<ClientsResponse>(GET_CLIENTS, {
        client: localClient
    });

    const [updateStatus] = useMutation(UPDATE_PRACTICE_STATUS, {
        client: localClient
    });

    const [deleteClient] = useMutation(DELETE_CLIENT, {
        client: localClient
    });

    // ---------------- ACTIONS ----------------

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setIsProcessing(id);
        try {
            await updateStatus({ variables: { id, status: newStatus } });
            await refetch();
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(null);
        }
    };

    const handleAdminView = async (practiceId: string) => {
        try {
            const user = JSON.parse(sessionStorage.getItem("user") || "{}");

            const response = await fetch("http://localhost:3000/auth/impersonate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    practiceId,
                    superAdminId: user.id
                }),
            });

            const result = await response.json();

            sessionStorage.setItem("impersonation_token", result.accessToken);
            sessionStorage.setItem("impersonation_user", JSON.stringify(result.user));
            sessionStorage.setItem("isImpersonating", "true");

            window.open("/practice/dashboard/view-profile", "_blank");

        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await deleteClient({ variables: { id: deleteId } });
            await refetch();
            setDeleteId(null);
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    // ---------------- COLUMNS ----------------

    const columns: GridColDef<Client>[] = [
        {
            field: 'practice_name',
            headerName: 'Practice Name',
            flex: 1,
            renderCell: (params) => (
                <span className="font-bold text-[#1a2b3c]">
                    {params.value || "Untitled Practice"}
                </span>
            )
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'practice_phone',
            headerName: 'Phone Number',
            flex: 1,
            renderCell: (params) => (
                <span className="font-medium text-gray-700">
                    {params.value || "Not Provided"}
                </span>
            )
        },
        {
            field: 'address',
            headerName: 'Location',
            flex: 1,
            renderCell: (params) => (
                <span>{params.row.address || "Address missing"}</span>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold 
                ${params.value === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                        params.value === 'VERIFIED' ? 'bg-blue-100 text-blue-600' :
                            params.value === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                'bg-red-100 text-red-600'}`}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <ActionsCell
                    row={params.row}
                    handleStatusUpdate={handleStatusUpdate}
                    handleAdminView={handleAdminView}
                    handleDelete={handleDelete}
                    handleViewDetails={(client: Client) => setViewDetailsClient(client)}
                />
            )
        }
    ];

    // ---------------- ACTIONS BUTTONS ----------------

    function ActionsCell({ row, handleStatusUpdate, handleAdminView, handleDelete, handleViewDetails }: any) {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);

        const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const status = row.status;

        return (
            <>
                <IconButton onClick={handleOpen}>
                    <MoreVertical size={18} />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    slotProps={{
                        paper: {
                            sx: {
                                borderRadius: 2,
                                minWidth: 200,
                                padding: "2px"
                            }
                        }
                    }}
                >
                    {/* ACTIVE */}
                    {status === "ACTIVE" && (
                        <>
                            <MenuItem
                                onClick={() => { handleAdminView(row.id); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <ArrowRight size={16} className="text-blue-500" />
                                <span className="font-medium text-gray-700">View Details</span>
                            </MenuItem>

                            <MenuItem
                                onClick={() => { handleStatusUpdate(row.id, 'INACTIVE'); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <Ban size={16} className="text-orange-500" />
                                <span className="font-medium text-orange-600">Mark Inactive</span>
                            </MenuItem>
                        </>
                    )}

                    {/* VERIFIED */}
                    {status === "VERIFIED" && (
                        <>
                            {/* View Details for VERIFIED - opens popup */}
                            <MenuItem
                                onClick={() => { handleViewDetails(row); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <ArrowRight size={16} className="text-blue-500" />
                                <span className="font-medium text-gray-700">View Details</span>
                            </MenuItem>

                            <MenuItem
                                onClick={() => { handleStatusUpdate(row.id, 'ACTIVE'); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <UserCheck size={16} className="text-green-600" />
                                <span className="font-medium text-green-600">Approve</span>
                            </MenuItem>

                            <MenuItem
                                onClick={() => { handleStatusUpdate(row.id, 'DECLINED'); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <Ban size={16} className="text-red-500" />
                                <span className="font-medium text-red-600">Decline</span>
                            </MenuItem>
                        </>
                    )}

                    {/* PENDING */}
                    {status === "PENDING" && (
                        <>
                            {/* View Details for PENDING - opens popup */}
                            <MenuItem
                                onClick={() => { handleViewDetails(row); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <ArrowRight size={16} className="text-blue-500" />
                                <span className="font-medium text-gray-700">View Details</span>
                            </MenuItem>

                            <MenuItem
                                onClick={() => { handleStatusUpdate(row.id, 'DECLINED'); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <Ban size={16} className="text-red-500" />
                                <span className="font-medium text-red-600">Decline</span>
                            </MenuItem>

                            <MenuItem
                                sx={{ gap: 1.5 }}
                            >
                                <RotateCcw size={16} className="text-blue-500" />
                                <span className="font-medium text-blue-600">Resend Verification</span>
                            </MenuItem>
                        </>
                    )}

                    {/* INACTIVE */}
                    {status === "INACTIVE" && (
                        <>
                            <MenuItem
                                onClick={() => { handleStatusUpdate(row.id, 'ACTIVE'); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <UserCheck size={16} className="text-green-600" />
                                <span className="font-medium text-green-600">Activate</span>
                            </MenuItem>
                        </>
                    )}

                    {/* COMMON DELETE */}
                    <MenuItem
                        onClick={() => {
                            handleDelete(row.id);
                            handleClose();
                        }}
                        sx={{
                            gap: 1.5,
                            borderTop: '1px solid #f1f1f1',
                            '&:hover': {
                                backgroundColor: '#fef2f2'
                            }
                        }}
                    >
                        <Trash2 size={16} className="text-red-500" />
                        <span className="font-medium text-red-600">Delete Account</span>
                    </MenuItem>
                </Menu>
            </>
        );
    };

    // ---------------- LOADING ----------------

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
            <p className="text-gray-400">Loading clients...</p>
        </div>
    );

    if (error) return <div className="p-10 text-red-500">Error loading data</div>;

    // ---------------- ROWS ----------------

    const filteredRows = (data?.accounts ?? []).filter((client) => {
        const search = searchText.toLowerCase();

        const matchesSearch =
            client.practice_name?.toLowerCase().includes(search) ||
            client.email?.toLowerCase().includes(search) ||
            client.practice_phone?.toLowerCase().includes(search) ||
            client.address?.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === 'ALL' || client.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // ---------------- UI ----------------

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black">Account Management</h1>
                    <p className="text-gray-500">Manage practice registrations</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                    <Plus size={18} />
                    Add Practice
                </button>
            </div>

            {/* Add Practice Modal */}
            {isModalOpen && (
                <AddPracticeForm
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        refetch();
                    }}
                />
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-8 mb-6">
                {/* Search */}
                <div className="flex items-center w-full md:w-[400px] bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-orange-500 transition">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Practice Name, Email, Location.."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="bg-transparent outline-none w-full text-medium px-2"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative w-[220px]">
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2.5 hover:border-gray-300 focus-within:ring-2 focus-within:ring-orange-500 transition">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-transparent outline-none w-full text-sm font-semibold text-gray-700 cursor-pointer"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="DECLINED">Declined</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* DataGrid */}
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } }
                    }}
                    disableRowSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #f0f0f0',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#fafafa',
                            fontWeight: 'bold',
                        }
                    }}
                />
            </Box>

            {/* View Details Dialog */}
            <ViewDetailsDialog
                open={Boolean(viewDetailsClient)}
                onClose={() => setViewDetailsClient(null)}
                client={viewDetailsClient}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle className="font-bold text-gray-800">
                    Delete Account
                </DialogTitle>

                <DialogContent>
                    <Typography className="text-gray-600 text-sm">
                        Are you sure you want to delete this account? This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions className="px-6 pb-4">
                    <Button
                        onClick={() => setDeleteId(null)}
                        variant="outlined"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        color="error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}