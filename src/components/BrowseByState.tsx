import { useEffect, useState } from "react";
import { ClinicService } from "../services/ClinicService";
import { ArrowRight } from "lucide-react";
interface StateGroup {
    code: string;
    name: string;
    clinics: number;
    image?: string;
}
const stateNames: Record<string, string> = {
    NSW: "New South Wales",
    QLD: "Queensland",
    VIC: "Victoria",
    ACT: "Australian Capital Territory",
    SA: "South Australia",
    WA: "Western Australia",
    TAS: "Tasmania",
    NT: "Northern Territory",
};
const BrowseByState = () => {
    const [states, setStates] = useState<StateGroup[]>([]);
    useEffect(() => {
        const loadData = async () => {
            try {
                const clinics = await ClinicService.getAllClinics();
                const map: Record<string, StateGroup> = {};
                clinics.forEach((clinic) => {
                    const address = clinic.address;
                    if (!address) return;
                    const parts = address.split(" ");
                    if (parts.length < 2) return;
                    const code = parts[parts.length - 2];
                    if (!map[code]) {
                        map[code] = {
                            code,
                            name: stateNames[code] ?? code,
                            clinics: 0,
                            image: `/states/${code.toLowerCase()}.png`,
                        };
                    }
                    map[code].clinics += 1;
                });
                // Sort by number of clinics (optional, but looks better)
                const sortedStates = Object.values(map).sort((a, b) => b.clinics - a.clinics);
                setStates(sortedStates);
            } catch (error) {
                console.error("Error loading clinics:", error);
            }
        };
        loadData();
    }, []);
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                        Browse Dental Practices by State
                    </h2>
                    <p className="text-gray-600 mt-2 text-lg">
                        Discover trusted dental practices across Australia and find experienced dentists near you
                    </p>
                </div>
                {/* Responsive Grid System 
                    Mobile: 1 column
                    Small Tablet: 2 columns
                    Laptop: 3 columns
                    Desktop: 4 columns
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
                    {states.map((item) => (
                        <div
                            key={item.code}
                            className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            {/* Decorative Watermark (Background Text) */}
                            <span className="absolute -bottom-5 -right-4 text-8xl font-black text-orange-100 select-none transition-transform duration-500 group-hover:scale-110 group-hover:text-orange-200">
                                {item.code}
                            </span>
                            {/* Optional: Map Image Overlay (if exists) */}
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt=""
                                    className="absolute bottom-4 right-4 w-16 h-25 object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-125 transition-all duration-300 mb-20"
                                />
                            )}
                            {/* Card Content */}
                            <div className="relative z-10 h-full flex flex-col justify-between min-h-[140px]">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400">
                                        {item.clinics} Practice{item.clinics !== 1 && 's'} Available
                                    </p>
                                </div>
                                {/* Call to Action Button */}
                                <div className="mt-6 flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                    Browse Clinics
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default BrowseByState;