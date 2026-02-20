import React from 'react';
import { Download, FileText } from 'lucide-react';

const ClientBill: React.FC = () => {
  return (
    <div className="animate-fade-in text-center py-20">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
        <FileText size={40} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Billing & Invoices</h2>
      <p className="text-gray-500 mt-2 max-w-md mx-auto">
        View and manage client bills here. This section allows you to track outstanding payments and generate invoice reports.
      </p>
      
      <div className="mt-8 flex justify-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
             <Download size={18} />
             Download Report
          </button>
      </div>
    </div>
  );
};

export default ClientBill;