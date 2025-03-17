import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Getmovie",
  description: "Learn More About Getmovie.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">About Getmovie</h1>
            <p className="text-lg sm:text-xl mb-8 text-blue-100">
              Learn more about our mission to bring the best movie experience to you.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-base sm:text-lg">
              Those are dami text. Founded in 2023, Getmovie began with a simple mission: to create a platform where movie enthusiasts could discover and enjoy the best films from around the world. What started as a small project has grown into a comprehensive movie discovery platform loved by millions.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-base sm:text-lg">
              Our team of passionate movie lovers works tirelessly to curate the best selection of films across all genres, ensuring that there's something for everyone on our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-base sm:text-lg">
              At Getmovie, we believe that great stories have the power to inspire, educate, and transform lives. Our mission is to connect people with the films they'll love and to make quality cinema accessible to everyone.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-base sm:text-lg">
              We're committed to supporting filmmakers and the art of storytelling by promoting diverse voices and perspectives in cinema.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">The Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white text-center">Jane Doe</h3>
                <p className="text-blue-600 dark:text-blue-400 text-center mb-3">Founder & CEO</p>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base">
                  Film enthusiast with over 15 years of experience in the entertainment industry.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white text-center">John Smith</h3>
                <p className="text-blue-600 dark:text-blue-400 text-center mb-3">Chief Content Officer</p>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base">
                  Former film critic with a passion for discovering hidden cinematic gems.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white text-center">Sarah Johnson</h3>
                <p className="text-blue-600 dark:text-blue-400 text-center mb-3">Head of Technology</p>
                <p className="text-gray-600 dark:text-gray-400 text-center text-sm sm:text-base">
                  Tech innovator focused on creating seamless movie streaming experiences.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-base sm:text-lg">
              Have questions or feedback? We'd love to hear from you! Reach out to our team at <a href="mailto:info@getmovie.com" className="text-blue-600 dark:text-blue-400 hover:underline">info@getmovie.com</a> or use the form below.
            </p>
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea 
                  rows={4} 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors">
                Send Message
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 