import React from "react";
import aboutUsImg from "../assets/aboutus1.png";
import Footer from "../components/layout/Footer";

const STATS = [
    { number: "8M+", label: "Patients connected" },
    { number: "9,000+", label: "Healthcare providers" },
    { number: "50M+", label: "Bookings made" },
    { number: "24/7", label: "Access to care" },
];

const VALUES = [
    {
        title: "Patients First",
        desc: "We believe the healthcare experience should be centred around the patient. Every decision we make starts with 'does this help the patient?'",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        ),
    },
    {
        title: "Trusted Partners",
        desc: "We build deep, lasting relationships with clinics and practitioners, providing technology that empowers them to do their best work.",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        ),
    },
    {
        title: "Innovation for Good",
        desc: "We use technology to solve real human problems, reducing anxiety and making healthcare more accessible for everyone.",
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ),
    },
];

const LEADERSHIP = [
    { name: "Dr. Sarah Smith", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop" },
    { name: "James Wilson", role: "Chief Technology Officer", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop" },
    { name: "Anita Ray", role: "Head of Product", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop" },
    { name: "David Chen", role: "Medical Director", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop" },
];

const AboutUs: React.FC = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-600">

            {/* --- HERO SECTION --- */}
            <section className="relative overflow-hidden pt-16 lg:pt-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

                        {/* Hero Text */}
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-600 sm:text-5xl md:text-6xl">
                                Making healthcare <br className="hidden lg:block" />
                                <span className="text-orange-600">accessible & simple</span> for everyone.
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                We believe that finding the right care shouldn't be complicated.
                                Healthengine connects millions of patients with thousands of practitioners
                                to create a healthier Australia.
                            </p>
                        </div>

                        {/* Hero Image / Collage */}
                        <div className="relative lg:mt-0">
                            <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
                                <img
                                    src={aboutUsImg}
                                    alt="Medical team collaboration"
                                    className="h-full w-full object-cover"
                                />
                                {/* Floating badge for decoration */}
                                <div className="absolute bottom-6 left-6 rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                                    <p className="text-sm font-semibold text-gray-600">Trusted by Australians</p>
                                    <div className="mt-1 flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200" />
                                        ))}
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-xs font-bold text-orange-800">+2k</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS BAR (HotDoc Style) --- */}
            <section className="mt-16 bg-orange-600 py-12 sm:mt-24 sm:py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                        {STATS.map((stat, i) => (
                            <div key={i} className="flex flex-col gap-y-2">
                                <dt className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                    {stat.number}
                                </dt>
                                <dd className="text-base font-medium leading-7 text-orange-200">
                                    {stat.label}
                                </dd>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- OUR STORY (Narrative) --- */}
            <section className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
                        {/* Left: Content */}
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-600 sm:text-4xl">
                                We started with a simple idea.
                            </h2>
                            <div className="mt-6 space-y-6 text-lg text-gray-600">
                                <p>
                                    Healthcare systems were fragmented, bookings were manual, and patients struggled to find availability. We saw an opportunity to bridge the gap between patients and providers using technology.
                                </p>
                                <p>
                                    Today, Healthengine is more than just a booking platform. We are a comprehensive healthcare ecosystem that helps practices grow and patients manage their health journey from end-to-end.
                                </p>
                            </div>

                            <div className="mt-10 border-l-4 border-orange-600 pl-6">
                                <p className="text-xl font-medium italic text-gray-800">
                                    "Our goal is to improve the healthcare experience for every single Australian, ensuring that care is just a tap away."
                                </p>
                                <p className="mt-4 text-sm font-semibold text-gray-500">— Dr. Sarah Smith, Founder</p>
                            </div>
                        </div>

                        {/* Right: Clean Image */}
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop"
                                alt="Doctor using tablet"
                                className="aspect-[4/3] w-full rounded-2xl bg-gray-600 object-cover shadow-xl ring-1 ring-gray-400/10"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- OUR VALUES --- */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-600 sm:text-4xl">Our Core Values</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            The principles that guide us as we build the future of healthcare.
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {VALUES.map((value, i) => (
                            <div key={i} className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-lg">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold leading-8 text-gray-600">{value.title}</h3>
                                <p className="mt-4 flex-auto text-base leading-7 text-gray-600">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- LEADERSHIP TEAM --- */}
            <section className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-600 sm:text-4xl">Meet the leadership</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            A team of medical and technology experts passionate about making a difference.
                        </p>
                    </div>

                    <ul role="list" className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                        {LEADERSHIP.map((person) => (
                            <li key={person.name} className="group">
                                <div className="relative aspect-[3/3] w-full overflow-hidden rounded-2xl bg-gray-200">
                                    <img
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        src={person.img}
                                        alt={person.name}
                                    />
                                </div>
                                <h3 className="mt-6 text-lg font-bold leading-8 text-gray-600">{person.name}</h3>
                                <p className="text-base leading-7 text-orange-600">{person.role}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* --- CTA / FOOTER BANNER --- */}
            <section className="relative isolate overflow-hidden bg-orange-600 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to improve your practice?
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg text-orange-100">
                        Join thousands of Australian healthcare providers who trust Healthengine to manage their bookings and patient experience.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a href="#" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-orange-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                            Partner with us
                        </a>
                        <a href="#" className="text-sm font-semibold leading-6 text-white hover:text-orange-200">
                            Join our team <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default AboutUs;