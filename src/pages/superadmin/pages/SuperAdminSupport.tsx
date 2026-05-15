/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    X, Loader2, MessageCircle, Paperclip, Send,
    Eye, Download, FileText, Inbox, ExternalLink, Search, Building2, User
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import supportService from '../../../features/support/support.service';
import { getUser } from '../../../features/auth/auth.utils';

type ViewType = 'PRACTICE_ADMIN' | 'PATIENT';
type StatusType = 'OPEN' | 'RESOLVED';

export default function SuperAdminSupport() {
    // --- STATES ---
    const [viewType, setViewType] = useState<ViewType>('PRACTICE_ADMIN');
    const [statusTab, setStatusTab] = useState<StatusType>('OPEN');
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    const [, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [chatAttachments, setChatAttachments] = useState<File[]>([]);
    const [showDetails, setShowDetails] = useState(false);

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewFileName, setPreviewFileName] = useState('');

    const chatFileInputRef = useRef<HTMLInputElement>(null);

    // --- DATE FORMATTER ---
    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    };

    // --- FETCHING ---
    const loadAllTickets = async () => {
        setIsLoading(true);
        try {
            const data = await supportService.getAllTickets();
            setTickets(data);
            if (data.length > 0) setSelectedTicket(data[0]);
        } catch (error) {
            console.error("Error loading tickets", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async (ticketId: string) => {
        try {
            const data = await supportService.getTicketMessages(ticketId);
            setMessages(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadAllTickets();
    }, []);

    useEffect(() => {
        if (selectedTicket?.id) {
            fetchMessages(selectedTicket.id);
        }
    }, [selectedTicket]);

    // --- HELPERS ---
    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    const openSafeView = (url: string) => {
        fetch(url).then(res => res.blob()).then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        });
    };

    const currentuser = getUser()

    // --- HANDLERS ---
    const handleSendMessage = async () => {
        if ((!chatMessage.trim() && chatAttachments.length === 0) || !selectedTicket || isSending) return;

        setIsSending(true);
        try {
            const attachmentMetadata = await Promise.all(
                chatAttachments.map(async (file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: await toBase64(file),
                }))
            );

            await supportService.sendMessage({
                ticket_id: selectedTicket.id,
                sender_id: currentuser.id,
                sender_type: currentuser.type,
                message: chatMessage.trim(),
                attachments: attachmentMetadata,
            });

            setChatMessage('');
            setChatAttachments([]);
            await fetchMessages(selectedTicket.id);
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setIsSending(false);
        }
    };

    const handleResolveTicket = async () => {
        if (!selectedTicket) return;
        setIsUpdating(selectedTicket.id);
        try {
            await supportService.updateTicketStatus(selectedTicket.id, 'RESOLVED');
            toast.success("Ticket marked as resolved");
            setTickets(prev => prev.map(t =>
                t.id === selectedTicket.id ? { ...t, status: 'RESOLVED' } : t
            ));
            setSelectedTicket({ ...selectedTicket, status: 'RESOLVED' });
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleChatAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setChatAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    };

    // --- FILTERING ---
    const statusFiltered = tickets.filter(t => t.type === viewType && t.status === statusTab);
    const displayedTickets = statusFiltered.filter((ticket) => {
        const search = searchTerm.toLowerCase();
        return ticket.request_number?.toString().includes(search) || ticket.subject?.toLowerCase().includes(search);
    });

    return (
        <div className="h-[calc(100vh-140px)] bg-white flex gap-6 p-2">

            {/* --- COLUMN 1: SIDEBAR --- */}
            <div className="w-[450px] bg-white rounded-[20px] border border-gray-200 flex flex-col shadow-sm shrink-0 overflow-hidden relative">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Support Admin</h1>
                        {/* Superadmin View Switcher */}
                        <div className="flex bg-gray-100 p-1 rounded-xl border">
                            <button onClick={() => setViewType('PRACTICE_ADMIN')}
                                className={`p-2 rounded-lg transition-all ${viewType === 'PRACTICE_ADMIN'
                                    ? 'bg-white shadow-sm text-orange-600'
                                    : 'text-gray-400'}`} title="Practices">
                                <Building2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewType('PATIENT')}
                                className={`p-2 rounded-lg transition-all ${viewType === 'PATIENT'
                                    ? 'bg-white shadow-sm text-orange-600'
                                    : 'text-gray-400'}`} title="Patients">
                                <User className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex bg-gray-200 rounded-2xl p-1 mb-4">
                        {['OPEN', 'RESOLVED'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setStatusTab(tab as StatusType)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${statusTab === tab
                                    ? 'bg-orange-500 shadow-md text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                {tab === 'OPEN' ? 'Open' : 'Resolved'}
                            </button>
                        ))}
                    </div>

                    <div className="relative mb-2">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/4 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Enter request number"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-4 pr-14 text-sm 
                            focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-10">
                    {displayedTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-10 text-center opacity-40 grayscale">
                            <Inbox className="w-12 h-12 mb-3" />
                            <p className="text-sm font-medium">No tickets found</p>
                        </div>
                    ) : (
                        displayedTickets.map((ticket) => (
                            <button
                                key={ticket.id}
                                onClick={() => { setSelectedTicket(ticket); setShowDetails(false); }}
                                className={`w-full text-left p-4 rounded-3xl border transition-all mb-4 relative ${selectedTicket?.id === ticket.id
                                    ? 'border-orange-500 bg-white shadow-lg ring-1 ring-orange-100'
                                    : 'border-gray-100 bg-gray-100 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-orange-200">
                                        {viewType === 'PRACTICE_ADMIN'
                                            ? <Building2 className="w-6 h-6 text-orange-500" />
                                            : <User className="w-6 h-6 text-orange-500" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-700 truncate">{ticket.practice_name || ticket.email.split('@')[0]}</h3>
                                            <span className="text-[10px] text-orange-500 font-semibold px-2 py-1 rounded-lg shrink-0">
                                                {new Date(ticket.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-bold">Req No : #{ticket.request_number || 'N/A'}</p>
                                        <div className="mt-1 pt-2 border-t border-gray-300">
                                            <p className="text-xs text-gray-500 font-bold">
                                                Subject : <span className="text-gray-600 font-semibold capitalize">{ticket.subject}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* --- COLUMN 2: CHAT VIEW --- */}
            <div className="flex-1 bg-white rounded-[20px] border border-gray-200 flex flex-col shadow-sm overflow-hidden relative">
                {selectedTicket ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-200 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedTicket.practice_name}</h2>
                                    <div className="flex items-center gap-2 mt-2.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedTicket.status === 'OPEN'
                                            ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600'
                                            : 'bg-gradient-to-br from-green-400 via-green-500 to-green-600'}`} />
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                                            {selectedTicket.status} • Req #{selectedTicket.request_number}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedTicket.status === 'OPEN' && (
                                    <button onClick={handleResolveTicket} disabled={!!isUpdating}
                                        className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-all shadow-md">
                                        Resolve
                                    </button>
                                )}
                                <button onClick={() => setShowDetails(!showDetails)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-white bg-blue-500 transition-all">
                                    {showDetails ? 'Hide Details' : 'View Details'}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden relative flex flex-col bg-white">
                            {/* Detailed Info Panel Overlay */}
                            {showDetails && (
                                <div className="absolute inset-0 z-20 bg-gray-50 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="p-6 space-y-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-4 border-b border-gray-200">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</p>
                                                <p className="text-sm font-bold text-gray-800">{selectedTicket.email}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requested On</p>
                                                <p className="text-sm font-bold text-gray-800">{new Date(selectedTicket.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-4 border-b border-gray-200 items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category</p>
                                                <p className="text-medium font-bold text-gray-800">{selectedTicket.relates_to?.replace(/-/g, ' ')}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Paperclip className="w-3 h-3" /> Attached Evidence ({selectedTicket.attachments?.length || 0})</p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                    {selectedTicket.attachments?.map((file: any, idx: number) => (
                                                        <div key={idx}
                                                            onClick={() => { setPreviewImage(file.url); setPreviewFileName(file.name); }}
                                                            className="group relative aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:border-orange-300 hover:shadow-md transition-all">
                                                            {file.type?.startsWith('image/') ? <img src={file.url}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                                <FileText className="w-6 h-6 text-gray-300" />
                                                                <span className="text-[8px] font-bold text-gray-400 px-2 text-center truncate w-full">
                                                                    {file.name}
                                                                </span>
                                                            </div>
                                                            }
                                                            <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                <div className="bg-white p-1 rounded-full shadow-lg">
                                                                    <Eye className="w-4 h-4 text-orange-600" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enquiry Details</p>
                                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-inner">
                                                <p className="text-[15px] text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                                                    {selectedTicket.enquiry_details}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Chat Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                                <div className="flex justify-center my-2">
                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-200">
                                        {formatDateLabel(selectedTicket.created_at)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-4">
                                    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-sm max-w-[70%] border border-gray-200">
                                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                            {selectedTicket.enquiry_details}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-600 px-1">
                                        {new Date(selectedTicket.created_at).toLocaleTimeString([],
                                            { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {messages.map((msg, index) => {
                                    const isAdminMessage = msg.sender_type === 'SUPER_ADMIN';
                                    const currentDateLabel = formatDateLabel(msg.created_at);
                                    const prevDateLabel = index === 0 ? formatDateLabel(selectedTicket.created_at) : formatDateLabel(messages[index - 1].created_at);
                                    const showDateSeparator = currentDateLabel !== prevDateLabel;

                                    return (
                                        <div key={index} className="space-y-2">
                                            {showDateSeparator && <div className="flex justify-center my-4">
                                                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-200">
                                                    {currentDateLabel}
                                                </span>
                                            </div>
                                            }
                                            <div className={`flex flex-col ${isAdminMessage ? 'items-end' : 'items-start'} gap-1`}>
                                                <div
                                                    className={`inline-block max-w-[70%] rounded-2xl overflow-hidden shadow-sm ${isAdminMessage
                                                        ? 'bg-orange-500 text-white rounded-br-sm'
                                                        : 'bg-gray-200 text-gray-800 rounded-tl-sm'
                                                        }`}
                                                >
                                                    {msg.attachments?.length > 0 && (
                                                        <div
                                                            className={`grid gap-2 p-2 ${msg.attachments.length === 1
                                                                    ? 'grid-cols-1'
                                                                    : 'grid-cols-2'
                                                                }`}
                                                        >
                                                            {msg.attachments.map((file: any, idx: number) => (
                                                                <div key={idx} onClick={() => { setPreviewImage(file.url); setPreviewFileName(file.name); }}
                                                                    className="relative group overflow-hidden rounded-xl cursor-pointer shadow-sm">
                                                                    {file.type?.startsWith('image/') ? <img src={file.url} alt={file.name}
                                                                        className="max-w-[180px] object-cover" /> : <div className={`w-52 h-20 flex items-center gap-3 px-4 rounded-xl 
                                                                        ${isAdminMessage ? 'bg-orange-400' : 'bg-white border'}
                                                                        `}>
                                                                        <FileText className="w-6 h-6 text-orange-500 shrink-0" />
                                                                        <p className="text-[10px] font-bold break-all line-clamp-2 text-gray-600">
                                                                            {file.name}
                                                                        </p>
                                                                    </div>
                                                                    }
                                                                    <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                        <div className="bg-white p-2 rounded-full shadow-lg">
                                                                            <Eye className="w-4 h-4 text-orange-600" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {msg.message && <div className="px-4 py-2">
                                                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                                                    </div>
                                                    }
                                                </div>
                                                <span className="text-[10px] font-semibold text-gray-600 px-1">
                                                    {new Date(msg.created_at).toLocaleTimeString([],
                                                        { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-gray-200 border-t border-gray-200">
                            {chatAttachments.length > 0 && (
                                <div className="flex gap-3 mb-2 overflow-x-auto pb-1">
                                    {chatAttachments.map((file, i) => (
                                        <div key={i} className="relative w-16 h-16 rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white shrink-0">
                                            {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)}
                                                className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-gray-400" />
                                            </div>
                                            }
                                            <button onClick={() => setChatAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-[20px] p-2 pl-6 shadow-sm 
                            focus-within:ring-2 focus-within:ring-orange-400 transition-all">
                                <textarea rows={1}
                                    placeholder="Type a reply..."
                                    className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-gray-700 resize-none font-medium placeholder:text-gray-400"
                                    value={chatMessage} onChange={(e) => setChatMessage(e.target.value)}
                                />
                                <div className="flex items-center gap-2 pr-2">
                                    <button
                                        className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={() => chatFileInputRef.current?.click()}>
                                        <input ref={chatFileInputRef} type="file" multiple className="hidden" onChange={handleChatAttachmentChange} />
                                        <Paperclip className="w-6 h-6" />
                                    </button>
                                    <button onClick={handleSendMessage} disabled={isSending}
                                        className="bg-orange-500 text-white p-2 rounded-xl shadow-lg hover:bg-orange-600 
                                        active:scale-95 transition-all disabled:opacity-30 min-w-[48px] flex justify-center">
                                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                        <MessageCircle className="w-20 h-20 mb-4 text-gray-300" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">
                            Select a request
                        </h2>
                    </div>
                )}
            </div>

            {/* --- PREVIEW MODAL --- */}
            {previewImage && (
                <div className="fixed inset-0 z-[9999] bg-gray-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-10">
                    <button onClick={() => setPreviewImage(null)}
                        className="absolute top-8 right-8 bg-black/60 hover:bg-black/80 p-3 rounded-full text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                    <img src={previewImage}
                        className="max-h-[75vh] w-auto rounded-2xl shadow-2xl border border-white/10"
                        alt="" />
                    <div className="mt-8 flex items-center gap-4">
                        <p className="text-white font-bold text-lg">{previewFileName}</p>
                        <div className="h-4 w-[1px] bg-white/20" />
                        <div className="flex gap-2">
                            <button onClick={() => openSafeView(previewImage)}
                                className="bg-black/50 hover:bg-black/70 p-3 rounded-xl text-white flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                                <ExternalLink className="w-4 h-4" /> View Full</button>
                            <a href={previewImage} download={previewFileName}
                                className="bg-orange-500 hover:bg-orange-600 p-3 rounded-xl text-white flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                                <Download className="w-4 h-4" /> Download</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}