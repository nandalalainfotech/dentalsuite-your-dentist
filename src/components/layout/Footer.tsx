import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                <span className="text-orange-600">Y</span>our
                <span className="text-orange-600">D</span>entist
              </h2>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm">
              Connecting patients with trusted dental professionals for better
              oral health.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {["Home", "Find Dentists", "Services", "About Us", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-orange-400 text-xs sm:text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Contact Info
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                <p className="text-gray-300 text-xs sm:text-sm">
                  123 Dental Street, City, State 12345
                </p>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <p className="text-gray-300 text-xs sm:text-sm">
                  (123) 456-7890
                </p>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-orange-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-300 text-xs sm:text-sm">
                  info@yourdentist.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-6 mb-6 sm:mb-8">
          <a
            href="#"
            className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
          >
            <i className="bi bi-twitter text-xl sm:text-2xl"></i>
          </a>

          <a
            href="#"
            className="text-gray-400 hover:text-red-400 transition-colors duration-200"
          >
            <i className="bi bi-instagram text-xl sm:text-2xl"></i>
          </a>

          <a
            href="#"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
          >
            <i className="bi bi-facebook text-xl sm:text-2xl"></i>
          </a>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © {currentYear} Your Dentist. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            <a
              href="#"
              className="hover:text-orange-400 transition-colors duration-200 mr-4"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-orange-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
