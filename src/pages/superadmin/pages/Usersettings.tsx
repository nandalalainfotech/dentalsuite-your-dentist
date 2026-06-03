import { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client/react";
import {
    Loader2,
    ArrowLeft,
    Search,
    Filter,
    ArrowRight
} from "lucide-react";
import { GET_CLIENTS } from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";
import PermissionManager from '../components/PermissionManager';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl
} from "@mui/material";

// Interfaces
interface Client {
    id: string;
    email: string;
    status: string;
    created_at: string;
    practice_name?: string;
    address?: string;
    city?: string;
    state?: string;
    postcode?: string;
}

interface ClientsResponse {
    accounts: Client[];
}

const columns: GridColDef[] = [
    {
        field: 'practice_name',
        headerName: 'Practice Details',
        flex: 2.5,
        sortable: false,

        renderCell: (params) => (
            <div className="flex flex-col justify-center h-full py-3 leading-relaxed overflow-hidden">

                <span className="font-bold text-[16px] text-[#1a2b3c] truncate">
                    {params.row.practice_name || "Untitled Practice"}
                </span>

                <span className="text-sm text-gray-400 truncate mt-1">
                    {params.row.email}
                </span>

            </div>
        )
    },

    {
        field: 'location',
        headerName: 'Location',
        flex: 2.2,
        sortable: false,

        renderCell: (params) => (
            <div className="flex flex-col justify-center h-full py-3 leading-relaxed overflow-hidden">

                <span className="font-semibold text-[15px] text-[#1a2b3c] truncate">
                    {params.row.city
                        ? `${params.row.city}, ${params.row.state}`
                        : 'No Location'}
                </span>

                <span className="text-sm text-gray-400 truncate mt-1">
                    {params.row.address || 'No address'}
                </span>

            </div>
        )
    },

    {
        field: 'action',
        headerName: 'Permissions',
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,

        renderCell: () => (
            <div className="flex items-center justify-center w-full h-full">

                <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center transition-all hover:bg-[#f47521] group">

                    <ArrowRight
                        size={18}
                        className="text-[#f47521] group-hover:text-white"
                    />

                </div>

            </div>
        )
    }
];

export default function UserSettings() {
    const [selectedClinic, setSelectedClinic] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState<'practice_name' | 'email' | 'city'>('practice_name');

    // --- PAGINATION STATE ---
    const [, setCurrentPage] = useState(1);
    const [] = useState(5);

    const { data, loading, error } = useQuery<ClientsResponse>(GET_CLIENTS, { client: localClient });

    // Reset to page 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, searchCategory]);

    const approvedClients = data?.accounts?.filter(c => c.status === 'ACTIVE') ?? [];

    // --- SEARCH LOGIC ---
    const filteredClinics = approvedClients.filter((client) => {
        const value = client[searchCategory]?.toLowerCase() || "";
        return value.includes(searchTerm.toLowerCase());
    });

    // --- PAGINATION CALCULATION ---

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Loading Clinics</p>
        </div>
    );

    if (error) return <div className="p-10 text-red-500 text-center">Connection Error</div>;

    // DETAIL VIEW
    if (selectedClinic) {
        return (
            <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
                <button
                    onClick={() => setSelectedClinic(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#f47521] mb-6 font-bold text-sm transition-all"
                >
                    <ArrowLeft size={18} /> Back to Overview
                </button>

                <div className="mb-5 pb-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">{selectedClinic.practice_name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">ID: {selectedClinic.id.slice(0, 8)}</span>
                            <span className="text-gray-400 text-sm font-medium">{selectedClinic.email}</span>
                        </div>
                    </div>
                </div>
                <PermissionManager practiceId={selectedClinic.id} />
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="w-full max-w-7xl mx-auto">

            {/* TOP HEADER SECTION */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">

                {/* LEFT */}
                <div>

                    <h1 className="text-3xl font-extrabold text-[#1a2b3c] tracking-tight">
                        User Settings
                    </h1>

                    <p className="text-gray-500 mt-2 font-medium">
                        Manage module access levels for approved practice
                    </p>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                    {/* CATEGORY SELECT */}
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 190,

                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: '#fff',

                                '& fieldset': {
                                    borderColor: '#e5e7eb'
                                },

                                '&:hover fieldset': {
                                    borderColor: '#f47521'
                                },

                                '&.Mui-focused fieldset': {
                                    borderColor: '#f47521'
                                }
                            }
                        }}
                    >

                        <Select
                            value={searchCategory}
                            onChange={(e) =>
                                setSearchCategory(
                                    e.target.value as any
                                )
                            }

                            startAdornment={

                                <InputAdornment position="start">

                                    <Filter
                                        size={16}
                                        className="text-gray-400"
                                    />

                                </InputAdornment>

                            }
                        >

                            <MenuItem value="practice_name">
                                Practice Name
                            </MenuItem>

                            <MenuItem value="email">
                                Email
                            </MenuItem>

                            <MenuItem value="city">
                                City
                            </MenuItem>

                        </Select>

                    </FormControl>

                    {/* SEARCH */}
                    <TextField
                        size="small"
                        placeholder="Search practice..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }

                        sx={{
                            width: {
                                xs: '100%',
                                sm: 320
                            },

                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: '#fff',

                                '& fieldset': {
                                    borderColor: '#e5e7eb'
                                },

                                '&:hover fieldset': {
                                    borderColor: '#f47521'
                                },

                                '&.Mui-focused fieldset': {
                                    borderColor: '#f47521'
                                }
                            }
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
                                )
                            }
                        }}
                    />

                </div>

            </div>

            {/* DATAGRID CARD */}
            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">

                <DataGrid
                    rows={filteredClinics}
                    columns={columns}
                    getRowId={(row) => row.id}

                    pageSizeOptions={[5, 10, 20]}

                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5
                            }
                        }
                    }}

                    disableRowSelectionOnClick

                    onRowClick={(params) => {
                        setSelectedClinic(params.row);
                    }}

                    autoHeight
                    rowHeight={92}

                    sx={{
                        border: 0,

                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f9fafb',
                            fontWeight: 700,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#6b7280',
                            borderBottom: '1px solid #f1f5f9'
                        },

                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 700
                        },

                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            outline: 'none !important',
                            paddingLeft: '20px',
                            paddingRight: '20px'
                        },

                        '& .MuiDataGrid-row': {
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        },

                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#fff7ed'
                        },

                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid #f3f4f6',
                            minHeight: '64px'
                        }
                    }}
                />

            </div>

        </div>
    );
}