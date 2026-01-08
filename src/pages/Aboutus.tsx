import React from "react";

const PATIENT_BENEFITS = [
    "The healthcare app that’s there for you whenever you need it",
    "Enjoy access to 1000s of primary care providers across Australia",
    "Keep, manage and amend all of your bookings in one place",
];

const PROVIDER_BENEFITS = [
    "Put your practice in front of millions of patients looking to book every month",
    "Leverage technology designed to improve the patient and practice experience",
    "Engage your patients pre and post appointments with ease",
];

const HELP_CARDS = [
    {
        title: "Are you a patient?",
        desc: "Find, book and manage your appointments easily.",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
        cta: "Find care",
    },
    {
        title: "Are you a provider?",
        desc: "Drive growth and efficiency with Yourdentist.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
        cta: "Partner with us",
    },
];

const LEADERSHIP_TEAM = [
    { name: "Dr. Sarah Smith", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" },
    { name: "James Wilson", role: "Chief Technology Officer", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
    { name: "Anita Ray", role: "Head of Product", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop" },
    { name: "David Chen", role: "Medical Director", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop" },
];

const AboutUs: React.FC = () => {
    return (
        <div className="w-full bg-slate-50">
            <main className="space-y-24 pb-24">

                {/* --- HERO / ABOUT SECTION --- */}
                <section className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                        {/* Text Content */}
                        <div className="flex flex-col justify-center rounded-3xl bg-orange-50 p-10 shadow-sm">
                            <h2 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-gray-900">
                                About us
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-200 text-xs font-bold text-orange-900 shadow-sm">
                                    i
                                </span>
                            </h2>

                            <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
                                <p>
                                    Yourdentist was built to enable patients to find the right care
                                    whenever they need it.
                                </p>
                                <p>
                                    Through our connected network of incredible primary healthcare
                                    providers, you can find, book, and manage a range of
                                    services in one easy-to-use app.
                                </p>
                            </div>
                        </div>

                        {/* Image Collage - Medical Team Meetings */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Tall Image Left */}
                            <div className="relative h-full overflow-hidden rounded-2xl shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=800&auto=format&fit=crop"
                                    alt="Doctors discussion walking"
                                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>

                            {/* Stacked Images Right */}
                            <div className="space-y-4">
                                <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1551892531-1e7af2641774?q=80&w=800&auto=format&fit=crop"
                                        alt="Medical team meeting around table"
                                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                                <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=800&auto=format&fit=crop"
                                        alt="Doctor digital consultation meeting"
                                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- WHY Yourdentist? --- */}
                <section className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="overflow-hidden rounded-[2.5rem] bg-orange-600 px-6 py-16 text-white shadow-xl md:px-12">
                        <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
                            Why Yourdentist?
                        </h2>

                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                            {/* For Patients */}
                            <div>
                                <div className="mb-8 flex items-center justify-center lg:justify-start">
                                    <span className="rounded-full bg-white px-6 py-2 text-sm font-semibold uppercase tracking-wider text-orange-800 shadow-inner">
                                        For our patients
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {PATIENT_BENEFITS.map((text, i) => (
                                        <div
                                            key={i}
                                            className="group flex items-start gap-4 rounded-xl bg-orange-700/50 p-5 transition-all hover:bg-orange-700"
                                        >
                                            <div className="mt-1 shrink-0 rounded-full bg-orange-400 p-1">
                                                <svg className="h-3 w-3 text-orange-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <p className="font-medium text-orange-50">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* For Providers */}
                            <div>
                                <div className="mb-8 flex items-center justify-center lg:justify-start">
                                    <span className="rounded-full bg-white px-6 py-2 text-sm font-semibold uppercase tracking-wider text-orange-800 shadow-inner">
                                        For our providers
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {PROVIDER_BENEFITS.map((text, i) => (
                                        <div
                                            key={i}
                                            className="group flex items-start gap-4 rounded-xl bg-orange-700/50 p-5 transition-all hover:bg-orange-700"
                                        >
                                            <div className="mt-1 shrink-0 rounded-full bg-orange-400 p-1">
                                                <svg className="h-3 w-3 text-orange-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <p className="font-medium text-orange-50">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- HOW CAN WE HELP --- */}
                <section className="mx-auto max-w-6xl px-6">
                    <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl">
                        How can we help?
                    </h2>

                    <div className="grid gap-8 md:grid-cols-2">
                        {HELP_CARDS.map((card, i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-3xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="h-64 overflow-hidden">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900">{card.title}</h3>
                                    <p className="mt-3 text-lg text-gray-600">{card.desc}</p>
                                    <button className="mt-8 inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200">
                                        {card.cta}
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- LEADERSHIP --- */}
                <section className="mx-auto max-w-6xl px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Our Leadership Team
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                        Together, we bring over 100 years of experience in healthcare and technology to improve the patient experience.
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                        {LEADERSHIP_TEAM.map((person, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-40 md:w-40">
                                    <img src={person.img} alt={person.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                                <p className="text-sm font-medium text-orange-600">{person.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default AboutUs;