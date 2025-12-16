import { MessageSquare } from "lucide-react"; // You can use any icon library

const ReviewCard = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 pt-8 sm:pt-12">
      {/* Heading */}
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Share Your Experience
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          We’d love to hear your thoughts on our dental practice directory. 
          Your feedback helps improve dental care accessibility across Australia.
        </p>
      </div>

      {/* Card */}
      <div className="mt-10">
        <div className="border-2 border-dashed border-orange-600 bg-white rounded-2xl p-6 md:p-10 max-w-xl">
          <div className="flex flex-col gap-4">
            
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-600">
              <MessageSquare size={24} />
            </div>

            {/* Text */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                We Value Your Opinion
              </h3>
              <p className="text-gray-600 mt-1 leading-relaxed">
                Share your feedback to help us improve our platform.
              </p>
            </div>

            {/* Button */}
            <button className="w-max px-6 py-2 rounded-full border border-orange-600 bg-orange-600 text-white hover:bg-orange-600 hover:text-black transition">
              Review
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewCard;
