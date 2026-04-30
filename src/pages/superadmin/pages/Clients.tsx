import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import {
    ChevronDown,
    MoreVertical,
    Loader2,
    Search,
    Filter,
    Ban,
    RotateCcw,
    Trash2,
    UserCheck,
    ArrowRight,
    Plus,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { GET_CLIENTS, UPDATE_PRACTICE_STATUS } from "../graphql/clients.query";
import { localClient } from "../../../api/apollo/localClient";
import AddPracticeForm from '../components/AddPracticeForm';

interface Client {
    id: string;
    email: string;
    status: string;
    created_at: string;
    practice_name?: string;
    abn_number?: string;
    practice_type?: string;
    practice_phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postcode?: string;
    first_name?: string;
    last_name?: string;
    mobile?: string;
}

interface ClientsResponse {
    accounts: Client[];
}

export default function Clients() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showActionsId, setShowActionsId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState<'practice_name' | 'email' | 'address' | 'status'>('practice_name');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, loading, error, refetch } = useQuery<ClientsResponse>(GET_CLIENTS, { client: localClient });

    const [updateStatus] = useMutation(UPDATE_PRACTICE_STATUS, { client: localClient });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowActionsId(null);
            }
        };
        if (showActionsId) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showActionsId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, searchCategory]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setIsProcessing(id);
        try {
            await updateStatus({ variables: { id, status: newStatus } });
            setShowActionsId(null);
            await refetch();
        } catch (err) {
            console.error(`Error updating status to ${newStatus}:`, err);
        } finally {
            setIsProcessing(null);
        }
    };

    const handleAdminView = async (practiceId: string) => {
        try {

            const user = JSON.parse(sessionStorage.getItem("user") || "{}");
            const superAdminId = user.id;

            const response = await fetch("http://localhost:3000/auth/impersonate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    practiceId,
                    superAdminId
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to impersonate");
            }

            sessionStorage.setItem("impersonation_token", result.accessToken);
            sessionStorage.setItem("impersonation_user", JSON.stringify(result.user));
            sessionStorage.setItem("isImpersonating", "true");

            window.open("/practice/dashboard/view-profile", "_blank");

        } catch (error) {
            console.error("Admin view error:", error);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-50 text-green-600 border-green-100';
            case 'VERIFIED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'DECLINED':
            case 'INACTIVE': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-[#f47521] mb-4" size={32} />
            <p className="text-gray-400 font-medium tracking-wide">Syncing data...</p>
        </div>
    );

    if (error) return <div className="p-10 text-red-500 text-center">Unable to load accounts.</div>;

    const filteredClients = (data?.accounts ?? []).filter((client) => {
        const valueToSearch = client[searchCategory]?.toLowerCase() || "";
        return valueToSearch.includes(searchTerm.toLowerCase());
    });

    const totalItems = filteredClients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <div className="w-full max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#1a2b3c] ">Account Management</h1>
                    <p className="text-gray-500 mt-2 font-medium text-lg">Manage and verify practice registrations</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 bg-orange-500 hover:bg-[#d9651d] text-white px-6 py-3 rounded-full font-black transition-all"
                >
                    <Plus size={22} strokeWidth={3} />
                    Add New Practice
                </button>
            </div>

            {/* SEARCH SECTION: Full Width Row */}
            <div className="w-full mb-10">
                <div className="flex items-center w-full bg-[#d1d5db] p-2 rounded-[24px] border border-gray-200">

                    {/* Filter */}
                    <div className="relative flex items-center min-w-[200px]">
                        <Filter size={18} className="absolute left-4 text-gray-500" />
                        <select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value as any)}
                            className="w-full pl-12 pr-10 py-3.5 bg-white border-none rounded-2xl text-sm font-bold text-[#1a2b3c] appearance-none focus:ring-2 focus:ring-[#f47521]/70 cursor-pointer outline-none shadow-sm"
                        >
                            <option value="practice_name">Practice Name</option>
                            <option value="email">Email Address</option>
                            <option value="address">Location</option>
                            <option value="status">Status</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Separator */}
                    <div className="h-10 w-[2px] bg-gray-400/30 mx-4"></div>

                    {/* Search Input (Grows to fill width) */}
                    <div className="relative flex-1 flex items-center group">
                        <Search size={20} className="absolute left-5 text-gray-400 group-focus-within:text-[#f47521] transition-colors" />
                        <input
                            type="text"
                            placeholder={`Search by ${searchCategory.replace('_', ' ')}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-3.5 bg-white border-none rounded-2xl text-[15px] font-medium text-[#1a2b3c] placeholder:text-gray-400 focus:ring-2 focus:ring-[#f47521]/70 outline-none shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Modal Logic */}
            {isModalOpen && (
                <AddPracticeForm
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        refetch();

                    }}
                />
            )}

            <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[11px] font-bold text-gray-700 border bg-gray-100 rounded-t-xl uppercase tracking-wider">
                    <div className="col-span-3">Practice Name</div>
                    <div className="col-span-3">Contact Email</div>
                    <div className="col-span-3">Location</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Search Results Logic */}
                {filteredClients.length > 0 ? (
                    currentClients.map((client, index) => {
                        const isActionsOpen = showActionsId === client.id;
                        const status = client.status || 'PENDING';
                        const isProcessingThis = isProcessing === client.id;

                        // SMART POSITIONING LOGIC
                        const isNearBottom = index >= currentClients.length - 2 && currentClients.length > 2;

                        return (
                            <div key={client.id} className="group transition-all duration-300 bg-white border rounded-[18px] border-gray-100 hover:border-gray-200 shadow-sm">
                                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                    <div className="col-span-3 font-bold text-[#1a2b3c] text-[15px]">{client.practice_name || "Untitled Practice"}</div>
                                    <div className="col-span-3 text-gray-500 text-sm font-medium truncate pr-4">{client.email}</div>
                                    <div className="col-span-3 text-gray-400 text-sm truncate">{client.address || "Address missing"}</div>
                                    <div className="col-span-2">
                                        <div className={`inline-flex px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(status)}`}>
                                            {status}
                                        </div>
                                    </div>

                                    <div className="col-span-1 flex items-center justify-end gap-2">
                                        <div className="relative" ref={isActionsOpen ? dropdownRef : null}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowActionsId(isActionsOpen ? null : client.id);
                                                }}
                                                className={`p-2 rounded-xl transition-all ${isActionsOpen ? 'bg-[#f47521] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100 hover:text-[#f47521]'}`}
                                                disabled={isProcessingThis}
                                            >
                                                {isProcessingThis ? <Loader2 size={20} className="animate-spin" /> : <MoreVertical size={20} strokeWidth={2.5} />}
                                            </button>

                                            {isActionsOpen && (
                                                <div className={`absolute right-0 w-52 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 py-2 
                                        ${isNearBottom ? 'bottom-full mb-2' : 'top-full mt-2'}`}>

                                                    {/* Actions buttons (View Details, Approve, etc.) go here... */}
                                                    {(status === "ACTIVE") && (
                                                        <button onClick={(e) => { e.stopPropagation(); setShowActionsId(null); handleAdminView(client.id); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">
                                                            <ArrowRight size={16} /> View Details
                                                        </button>
                                                    )}

                                                    {status === 'PENDING' && (
                                                        <>
                                                            <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'DECLINED'); }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                                                                <Ban size={16} /> Decline
                                                            </button>

                                                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50">
                                                                <RotateCcw size={16} /> Resend Verification
                                                            </button>
                                                        </>
                                                    )}

                                                    {status === 'VERIFIED' && (
                                                        <>
                                                            <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'ACTIVE'); }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-green-600 hover:bg-green-50">
                                                                <UserCheck size={16} /> Approve
                                                            </button>

                                                            <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'DECLINED'); }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                                                                <Ban size={16} /> Decline
                                                            </button>
                                                        </>
                                                    )}

                                                    {status === 'ACTIVE' && (
                                                        <>
                                                            <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'INACTIVE'); }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-orange-600 hover:bg-orange-50">
                                                                <Ban size={16} /> Mark Inactive
                                                            </button>

                                                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                                                                <Trash2 size={16} /> Delete Account
                                                            </button>
                                                        </>
                                                    )}

                                                    {status === 'INACTIVE' && (
                                                        <>
                                                            <button onClick={(e) => { e.stopPropagation(); handleStatusUpdate(client.id, 'ACTIVE'); }}
                                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-green-600 hover:bg-green-50">
                                                                <UserCheck size={16} /> Mark Active
                                                            </button>

                                                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50">
                                                                <Trash2 size={16} /> Delete Account
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    /* EMPTY STATE UI */
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-[24px]">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <Search size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-[#1a2b3c] font-bold text-lg">No matching practices found</h3>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms or filters</p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 text-[#f47521] font-bold text-sm hover:underline"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* PAGINATION UI */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <span className="text-sm text-gray-500 font-medium">Rows per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-400">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-2 rounded-lg border border-gray-100 hover:bg-gray-50 disabled:opacity-30 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}