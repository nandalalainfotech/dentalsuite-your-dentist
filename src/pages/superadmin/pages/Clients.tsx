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
    Search
} from "lucide-react";
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, Select, TextField, Typography } from '@mui/material';
import { Menu, MenuItem, IconButton } from "@mui/material";
import {
    DELETE_CLIENT,
    GET_CLIENTS,
    UPDATE_PRACTICE_STATUS
} from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";
import AddPracticeForm from '../components/AddPracticeForm';
import PracticeDetailsDialog from '../components/PracticeDetailsDialog';
import { API_ENDPOINTS } from '../../../config/api';

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

export default function Clients() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, setIsProcessing] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [PracticeDetailsClient, setPracticeDetailsClient] = useState<Client | null>(null);

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

            const response = await fetch(API_ENDPOINTS.IMPERSONATE_AUTH, {
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
                    handleViewDetails={(client: Client) => setPracticeDetailsClient(client)}
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
                                onClick={() => { handleViewDetails(row); handleClose(); }}
                                sx={{ gap: 1.5 }}
                            >
                                <ArrowRight size={16} className="text-blue-500" />
                                <span className="font-medium text-gray-700">Practice Details</span>
                            </MenuItem>
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
                                <span className="font-medium text-gray-700">Practice Details</span>
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
                                <span className="font-medium text-gray-700">Practice Details</span>
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
            <div className="flex flex-col md:flex-row gap-4 mb-6">

                {/* SEARCH */}
                <TextField
                    placeholder="Search by Practice Name, Email, Location..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{
                        maxWidth: 420,

                        '& .MuiOutlinedInput-root': {
                            borderRadius: '999px',
                            backgroundColor: '#f9fafb',

                            '& fieldset': {
                                borderColor: '#e5e7eb',
                            },

                            '&:hover fieldset': {
                                borderColor: '#f47521',
                            },

                            '&.Mui-focused fieldset': {
                                borderColor: '#f47521',
                            },
                        },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search
                                        size={18}
                                        className="text-gray-400"
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* STATUS FILTER */}
                <FormControl
                    size="small"
                    sx={{
                        minWidth: 220,

                        '& .MuiOutlinedInput-root': {
                            borderRadius: '999px',
                            backgroundColor: '#f9fafb',

                            '& fieldset': {
                                borderColor: '#e5e7eb',
                            },

                            '&:hover fieldset': {
                                borderColor: '#f47521',
                            },

                            '&.Mui-focused fieldset': {
                                borderColor: '#f47521',
                            },
                        },
                    }}
                >
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        displayEmpty

                        startAdornment={
                            <InputAdornment position="start">
                                <Filter
                                    size={16}
                                    className="text-gray-400"
                                />
                            </InputAdornment>
                        }

                        IconComponent={(props) => (
                            <ChevronDown
                                {...props}
                                size={18}
                                className="text-gray-400 mr-2"
                            />
                        )}
                    >
                        <MenuItem value="ALL">All Status</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="VERIFIED">Verified</MenuItem>
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                        <MenuItem value="DECLINED">Declined</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* DataGrid */}
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } }
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
            <PracticeDetailsDialog
                onClose={() => setPracticeDetailsClient(null)}
                client={PracticeDetailsClient}
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