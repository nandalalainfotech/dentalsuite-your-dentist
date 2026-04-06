import { Search, Monitor, ClipboardCheck, BookOpen, HelpCircle, PiggyBank, Stethoscope, List, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Article {
    id: string;
    title: string;
}

const topArticles: Article[] = [
    { id: '1', title: 'How to add, edit or setup a Practitioner' },
    { id: '2', title: 'How to manage different fees for weekday and weekend appointments' },
    { id: '3', title: 'How do I action my Recalls/Clinical Reminders? (Action checklist)' },
    { id: '4', title: 'How to Process Appointments in the Sidebar' },
    { id: '5', title: 'How to customise your practitioner\'s online availability' },
    { id: '6', title: 'How do I set up YourDentist payments for my appointments?' },
    { id: '7', title: 'How do I reset my Dashboard or Sidebar Password?' },
    { id: '8', title: 'How to create and manage Telehealth appointments' },
    { id: '9', title: 'How to block a practitioner\'s availability using \'Hide Sessions\'' },
    { id: '10', title: 'How do I search for an appointment reminder using the patient\'s name?' },
    { id: '11', title: 'Why does the Sidebar say \'No PMS\'?' },
    { id: '12', title: 'MyMedicare FAQs' },
];

const supportCategories = [
    {
        title: 'Installation Setup',
        description: 'Guides to help you install YourDentist at a practice',
        icon: <Monitor className="w-10 h-10 text-orange-600" />
    },
    {
        title: 'Getting Started',
        description: 'Setting up a new feature? Access the guides here',
        icon: <ClipboardCheck className="w-10 h-10 text-orange-600" />
    },
    {
        title: 'Browse By Feature',
        description: 'View all how-to and troubleshooting articles for every YourDentist feature',
        icon: <BookOpen className="w-10 h-10 text-orange-600" />
    },
    {
        title: 'FAQs',
        description: 'Got a question? Check our frequently asked questions here',
        icon: <HelpCircle className="w-10 h-10 text-orange-600" />
    },
    {
        title: 'Admin and Billing',
        description: 'User management and understanding your YourDentist invoice',
        icon: <PiggyBank className="w-10 h-10 text-orange-600" />
    },
    {
        title: 'General Practitioners',
        description: 'Guides specifically made for practitioners using YourDentist',
        icon: <Stethoscope className="w-10 h-10 text-orange-600" />
    }
];

interface SupportCentreProps {
    onBack: () => void;
}

export default function SupportCentre({ onBack }: SupportCentreProps) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="bg-white font-sans text-gray-700 min-h-screen">
            {/* Back Button */}
            <div className="px-4 sm:px-6 py-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>
            </div>

            {/* Header */}
            <header className="text-center py-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <h1 className="text-4xl font-bold text-gray-800">
                        YOUR DENTIST Practice Support
                    </h1>
                </div>
                {/* <p className="text-gray-600">
                    Not a practice? Head to our <a href="#" className="text-blue-600 hover:underline">patient help centre!</a>
                </p> */}
                <p className="text-gray-600 mt-4 text-lg">
                    Hello! What can we help you with?
                </p>
            </header>

            {/* Search Bar */}
            <div className="flex justify-center items-center gap-2 mb-12 max-w-3xl mx-auto">
                <div className="relative flex-grow">
                    {/* <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-10 h-8" /> */}
                    <Search className="absolute left-[15px] top-[8px] text-gray-400 w-5 h-8" />
                    <input
                        type="text"
                        placeholder='Search (e.g. "How do I action my Recalls?")'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <button className="bg-orange-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-orange-700 transition">
                    Search
                </button>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {supportCategories.map((category, index) => (
                    <button key={index} className="border border-gray-200 rounded-lg p-6 text-center flex flex-col items-center hover:shadow-lg transition-shadow duration-300 h-full">
                        <div className="bg-gray-100 rounded-full p-4 mb-4">
                            {category.icon}
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{category.title}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                    </button>
                ))}
            </div>

            {/* Top Articles Section */}
            <div className="bg-orange-600 text-white rounded-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <List className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Top Articles</h2>
                </div>
                <ul className="list-disc list-inside columns-1 sm:columns-2 lg:columns-3 gap-x-8 space-y-2">
                    {topArticles.map((article) => (
                        <li key={article.id}>
                            <a href="#" className="hover:underline">{article.title}</a>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}