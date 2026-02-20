import React, { useState } from 'react';
import { List, CreditCard } from 'lucide-react';
import ClientList from './client/ClientList';
import ClientBill from './client/ClientBill';

const Clients: React.FC = () => {
    // State to toggle between views
    const [activeSubTab, setActiveSubTab] = useState<'list' | 'bill'>('list');

    return (
        <div className="w-full">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
                
                {/* Sub-Tabs Navigation */}
                <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1">
                    <button 
                        onClick={() => setActiveSubTab('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            activeSubTab === 'list' 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <List size={16} />
                        List
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('bill')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            activeSubTab === 'bill' 
                            ? 'bg-white text-gray-900 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <CreditCard size={16} />
                        Billing
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="mt-6">
                {activeSubTab === 'list' ? <ClientList /> : <ClientBill />}
            </div>
        </div>
    );
};

export default Clients;