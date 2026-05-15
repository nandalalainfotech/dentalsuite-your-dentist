import {
    Upload, X, Loader2, Plus, MessageCircle, Paperclip, Send,
    Eye, Download, FileText, Inbox, ExternalLink, Search, ChevronRight
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClinic } from '../../../../features/support/support.slice';
import supportService from '../../../../features/support/support.service';

const relatesToOptions = [
    { value: 'Practice-support', label: 'Support Enquiry' },
    { value: 'Practice-billing', label: 'Billing Enquiry' },
    { value: 'Practice-others', label: 'Others' },
];

type TabType = 'OPEN' | 'RESOLVED';

export default function PracticeSupportForm() {
    const currentClinic = useSelector(selectCurrentClinic);

    // --- STATES ---
    const [activeTab, setActiveTab] = useState<TabType>('OPEN');
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, setSubmitError] = useState<string | null>(null);

    // --- FORM STATES ---
    const [relatesTo, setRelatesTo] = useState('clinic-support');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [enquiryDetails, setEnquiryDetails] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [chatMessage, setChatMessage] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewFileName, setPreviewFileName] = useState('');
    const [chatAttachments, setChatAttachments] = useState<File[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const ticketFileInputRef = useRef<HTMLInputElement>(null);
    const chatFileInputRef = useRef<HTMLInputElement>(null);

    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString([], {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    };

    // --- FETCH ---
    const fetchTickets = async () => {
        if (!currentClinic?.id) return;
        try {
            const data = await supportService.getClinicTickets(currentClinic.id);
            setTickets(data);
            if (!selectedTicket && data.length > 0) setSelectedTicket(data[0]);
        } catch (error) {
            console.error(error);
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
        if (currentClinic?.email) setEmail(currentClinic.email);
        fetchTickets();
    }, [currentClinic]);

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
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank');
            });
    };

    // --- HANDLERS ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setSubmitError(null);
        setIsLoading(true);
        try {
            const fileMetadata = await Promise.all(
                attachments.map(async (file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: await toBase64(file),
                }))
            );

            const nextRequestNumber = await supportService.getNextRequestNumber();

            await supportService.createTicket({
                request_number: nextRequestNumber,
                email,
                subject,
                enquiry_details: enquiryDetails,
                relates_to: relatesTo,
                practice_id: currentClinic?.id,
                attachments: fileMetadata,
            });

            setIsCreateModalOpen(false);
            setSubject('');
            setEnquiryDetails('');
            setAttachments([]);
            await fetchTickets();
        } catch (err: any) {
            setSubmitError(err?.message || 'Failed to submit request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChatAttachmentChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files) return;

        setChatAttachments((prev) => [
            ...prev,
            ...Array.from(e.target.files!),
        ]);
    };

    const handleSendMessage = async () => {
        try {
            if (
                !chatMessage.trim() &&
                chatAttachments.length === 0
            ) {
                return;
            }


            const attachmentMetadata = await Promise.all(
                chatAttachments.map(async (file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: await toBase64(file),
                }))
            );

            const safeAttachments = JSON.parse(
                JSON.stringify(attachmentMetadata)
            );

            await supportService.sendMessage({
                ticket_id: selectedTicket.id,
                sender_id: currentClinic.id,
                sender_type: currentClinic.type,
                message: chatMessage,
                attachments: safeAttachments,
            });

            setChatMessage('');
            setChatAttachments([]);

            await fetchMessages(selectedTicket.id);
        } catch (error) {
            console.error(error);
        }
    };

    // 1. Filter by Status (Open vs Resolved)
    const statusFiltered = tickets.filter(t => t.status === activeTab);

    // 2. Filter by Search Term (matches request number or subject)
    const displayedTickets = statusFiltered.filter((ticket) => {
        const search = searchTerm.toLowerCase();

        // Check if request number contains the search string
        const matchesNumber = ticket.request_number?.toString().includes(search);

        // (Optional) Check if subject contains the search string for better UX
        const matchesSubject = ticket.subject?.toLowerCase().includes(search);

        return matchesNumber || matchesSubject;
    });

    return (
        <div className="h-[calc(100vh-140px)] bg-white flex gap-6 p-2">

            {/* --- COLUMN 1: SIDEBAR (Standalone Container) --- */}
            <div className="w-[450px] bg-white rounded-[20px] border border-gray-200 flex flex-col shadow-sm shrink-0 overflow-hidden relative">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Support Conversations</h1>
                    </div>

                    <div className="flex bg-gray-200 rounded-2xl p-1 mb-4">
                        {(['OPEN', 'RESOLVED'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab
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
                            value={searchTerm} // Add this
                            onChange={(e) => setSearchTerm(e.target.value)} // Add this
                            className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-4 pr-14 text-sm focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-20">
                    {displayedTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-10 text-center opacity-40 grayscale">
                            <Inbox className="w-12 h-12 mb-3" />
                            <p className="text-sm font-medium">No tickets here</p>
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
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-700 truncate">
                                                {ticket.subject}
                                            </h3>
                                            <span className="text-[10px] text-orange-500 font-semibold px-1 py-1 rounded-lg shrink-0">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-bold">
                                            Req No : #{ticket.request_number || 'N/A'}
                                        </p>
                                        <div className="mt-1 pt-2 border-t border-gray-300">
                                            <p className="text-xs text-gray-500 font-bold">
                                                Reason : <span className="text-gray-600 font-semibold capitalize">{ticket.relates_to?.replace(/-/g, ' ')}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Floating Action Button */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="absolute bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-all active:scale-95 z-10"
                >
                    <Plus className="w-7 h-7" />
                </button>
            </div>

            {/* --- COLUMN 2: CHAT VIEW (Standalone Container) --- */}
            <div className="flex-1 bg-white rounded-[20px] border border-gray-200 flex flex-col shadow-sm overflow-hidden relative">
                {selectedTicket ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-200 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedTicket.subject}</h2>
                                    <div className="flex items-center gap-2 mt-2.5">
                                        <div className={`w-2 h-2 rounded-full ${selectedTicket.status === 'OPEN'
                                            ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600'
                                            : 'bg-gradient-to-br from-green-400 via-green-500 to-green-600'}`} />
                                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                                            {selectedTicket.status} • Req #{selectedTicket.request_number}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-white bg-blue-500 transition-all"
                            >
                                {showDetails ? 'Hide Details' : 'View Details'}
                                <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
                            </button>
                        </div>

                        {/* Relative Wrapper for Chat/Details Overlay */}
                        <div className="flex-1 overflow-hidden relative flex flex-col bg-white">

                            {/* Detailed Info Panel (Hides Chat when open) */}
                            {showDetails && (
                                <div className="absolute inset-0 z-20 bg-gray-50 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="p-6 space-y-2">
                                        {/* ROW 1: Contact & Date */}
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

                                        {/* ROW 2: Category & Evidence */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-4 border-b border-gray-200 items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Category</p>
                                                <p className="text-medium font-bold text-gray-800">
                                                    {selectedTicket.relates_to?.replace(/-/g, ' ')}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Paperclip className="w-3 h-3" />
                                                    Attached Evidence ({selectedTicket.attachments?.length || 0})
                                                </p>

                                                {selectedTicket.attachments?.length > 0 ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {selectedTicket.attachments.map((file: any, idx: number) => {
                                                            const isImage = file.type?.startsWith('image/');
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    onClick={() => {
                                                                        setPreviewImage(file.url);
                                                                        setPreviewFileName(file.name);
                                                                    }}
                                                                    className="group relative aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:border-orange-300 hover:shadow-md transition-all"
                                                                >
                                                                    {isImage ? (
                                                                        <img
                                                                            src={file.url}
                                                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                                            alt={file.name}
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                                            <FileText className="w-6 h-6 text-gray-300" />
                                                                            <span className="text-[8px] font-bold text-gray-400 px-2 text-center truncate w-full">
                                                                                {file.name}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                        <div className="bg-white p-1 rounded-full shadow-lg">
                                                                            <Eye className="w-4 h-4 text-orange-600" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">No attachments provided</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* ROW 3: Enquiry Details */}
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
                            {/* <div
                                className="flex-1 overflow-y-auto p-4 space-y-2 relative scroll-smooth"
                                style={{
                                    backgroundColor: "#e4fbe6", 
                                    backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
                                    backgroundRepeat: "repeat",
                                    backgroundSize: "450px",
                                    backgroundBlendMode: "multiply", 
                                    opacity: 1
                                }}
                            > */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                                {/* Initial Date Tag for Enquiry */}
                                <div className="flex justify-center my-2">
                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-200">
                                        {formatDateLabel(selectedTicket.created_at)}
                                    </span>
                                </div>

                                {/* Initial Enquiry Message */}
                                <div className="flex flex-col items-end gap-2 mb-4">
                                    <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-[70%] shadow-sm">
                                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                            {selectedTicket.enquiry_details}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-600 px-1">
                                        {new Date(selectedTicket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* Chat Messages with Date Grouping */}
                                {messages.map((msg, index) => {
                                    const isOwnMessage = msg.sender_type === 'PRACTICE_ADMIN';

                                    // Date Logic: Compare current message date with previous message (or initial ticket)
                                    const currentDateLabel = formatDateLabel(msg.created_at);
                                    const prevDateLabel = index === 0
                                        ? formatDateLabel(selectedTicket.created_at)
                                        : formatDateLabel(messages[index - 1].created_at);

                                    const showDateSeparator = currentDateLabel !== prevDateLabel;

                                    return (
                                        <div key={index} className="space-y-2">
                                            {/* Show Date Separator if it's a new day */}
                                            {showDateSeparator && (
                                                <div className="flex justify-center my-4">
                                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-200">
                                                        {currentDateLabel}
                                                    </span>
                                                </div>
                                            )}

                                            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} gap-1`}>
                                                <div
                                                    className={`inline-block max-w-[70%] rounded-2xl overflow-hidden shadow-sm ${isOwnMessage
                                                        ? 'bg-orange-500 text-white rounded-br-sm'
                                                        : 'bg-gray-200 text-gray-800 rounded-tl-sm'
                                                        }`}
                                                >
                                                    {/* ATTACHMENTS */}
                                                    {msg.attachments?.length > 0 && (
                                                        <div
                                                            className={`grid gap-2 p-2 ${msg.attachments.length === 1
                                                                    ? 'grid-cols-1'
                                                                    : 'grid-cols-2'
                                                                }`}
                                                        >
                                                            {msg.attachments.map((file: any, idx: number) => {
                                                                const isImage = file.type?.startsWith('image/');
                                                                return (
                                                                    <div
                                                                        key={idx}
                                                                        onClick={() => {
                                                                            setPreviewImage(file.url);
                                                                            setPreviewFileName(file.name);
                                                                        }}
                                                                        className="relative group overflow-hidden rounded-xl cursor-pointer"
                                                                    >
                                                                        {isImage ? (
                                                                            <img src={file.url} alt={file.name} className="max-w-[180px] object-cover" />
                                                                        ) : (
                                                                            <div className={`w-52 h-20 flex items-center gap-3 px-4 rounded-xl ${isOwnMessage ? 'bg-orange-400' : 'bg-white border'}`}>
                                                                                <FileText className="w-6 h-6 text-orange-500 shrink-0" />
                                                                                <p className="text-[10px] font-bold break-all line-clamp-2 text-gray-600">{file.name}</p>
                                                                            </div>
                                                                        )}
                                                                        <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                            <div className="bg-white p-2 rounded-full shadow-lg">
                                                                                <Eye className="w-4 h-4 text-orange-600" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* MESSAGE TEXT */}
                                                    {msg.message && (
                                                        <div className="px-4 py-2">
                                                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                                                {msg.message}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* TIME */}
                                                <span className="text-[10px] font-semibold text-gray-600 px-1">
                                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
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
                                            {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-gray-400" />
                                            </div>
                                            }
                                            <button onClick={() => setChatAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-[20px] p-2 pl-6 shadow-sm focus-within:ring-2 focus-within:ring-orange-400 transition-all">
                                <textarea
                                    rows={1}
                                    placeholder="Enter message..."
                                    className="flex-1 bg-transparent border-none outline-none py-2 text-sm text-gray-700 resize-none font-medium placeholder:text-gray-400"
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                />
                                <div className="flex items-center gap-2 pr-2">
                                    <button className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors" onClick={() => chatFileInputRef.current?.click()}>
                                        <input ref={chatFileInputRef} type="file" multiple className="hidden" onChange={handleChatAttachmentChange} />
                                        <Paperclip className="w-5 h-5 " />
                                    </button>
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-orange-500 text-white p-2 rounded-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-30 min-w-[48px] flex justify-center"
                                    >

                                        <Send className="w-5 h-5 " />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                        <MessageCircle className="w-20 h-20 mb-4 text-gray-300" />
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400">Select a request</h2>
                    </div>
                )}
            </div>

            {/* --- PREVIEW MODAL --- */}
            {previewImage && (
                <div className="fixed inset-0 z-[9999] bg-gray-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-10">
                    <button onClick={() => setPreviewImage(null)} className="absolute top-8 right-8 bg-black/60 hover:bg-black/80 p-3 rounded-full text-white transition-all">
                        <X className="w-6 h-6" />
                    </button>
                    <img src={previewImage} className="max-h-[75vh] w-auto rounded-2xl shadow-2xl border border-white/10" alt="" />
                    <div className="mt-8 flex items-center gap-4">
                        <p className="text-white font-semibold text-lg">{previewFileName}</p>
                        <div className="h-4 w-[1px] bg-white/20" />
                        <div className="flex gap-2">
                            <button onClick={() => openSafeView(previewImage)} className="bg-black/50 hover:bg-black/70 p-3 rounded-xl text-white flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                                <ExternalLink className="w-4 h-4" /> View Full
                            </button>
                            <a href={previewImage} download={previewFileName} className="bg-orange-500 hover:bg-orange-600 p-3 rounded-xl text-white flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                                <Download className="w-4 h-4" /> Download
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CREATE MODAL --- */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                        {/* HEADER - Slimmer padding */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div>
                                <h2 className="text-xl text-gray-900 font-bold">New Support Ticket</h2>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Fill in the details below</p>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-full bg-gray-600 hover:bg-red-500 transition-colors">
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* BODY - Optimized spacing */}
                        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">

                            {/* 2-Column Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Relates to<span className="text-red-400">*</span></label>
                                    <select
                                        value={relatesTo}
                                        onChange={e => setRelatesTo(e.target.value)}
                                        className="w-full h-11 rounded-xl bg-gray-50 border border-gray-100 px-4 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all"
                                    >
                                        {relatesToOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Email<span className="text-red-400">*</span></label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full h-11 rounded-xl bg-gray-50 border border-gray-100 px-4 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject<span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Brief summary of the issue..."
                                    className="w-full h-11 rounded-xl bg-gray-50 border border-gray-100 px-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Enquiry Details<span className="text-red-400">*</span></label>
                                <textarea
                                    rows={4}
                                    value={enquiryDetails}
                                    onChange={e => setEnquiryDetails(e.target.value)}
                                    placeholder="How can we help you today?"
                                    className="w-full rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 resize-none transition-all"
                                />
                            </div>

                            {/* ATTACHMENTS - Compact integrated style */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Attachments</label>
                                    <span className="text-[10px] text-gray-400 font-bold">{attachments.length} files added</span>
                                </div>

                                <div className="flex gap-4 items-start">
                                    {/* Smaller Upload Trigger */}
                                    <div
                                        onClick={() => ticketFileInputRef.current?.click()}
                                        className="w-24 h-24 shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group"
                                    >
                                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-orange-500 mb-1" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Add</span>
                                        <input ref={ticketFileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
                                    </div>

                                    {/* Horizontal Scrollable Previews */}
                                    <div className="flex-1 flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                        {attachments.map((file, i) => (
                                            <div key={i} className="relative w-24 h-24 rounded-2xl border border-gray-100 overflow-hidden bg-white shrink-0 shadow-sm group">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gray-50">
                                                        <FileText className="w-6 h-6 text-gray-300" />
                                                        <p className="text-[8px] text-center mt-1 truncate w-full px-1">{file.name}</p>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => removeAttachment(i)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {attachments.length === 0 && (
                                            <div className="h-24 flex items-center text-gray-300 text-xs italic">
                                                No files attached yet...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER - Compact and clean */}
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-5 h-10 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isLoading || !subject || !enquiryDetails}
                                onClick={handleSubmit}
                                className="px-6 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-orange-200 disabled:opacity-30 flex items-center gap-2 transition-all active:scale-95"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Ticket'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}