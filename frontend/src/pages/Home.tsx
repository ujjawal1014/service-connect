import React from "react"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-32 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg tracking-tight">Find the Perfect Service Provider</h1>
          <p className="text-2xl mb-8 max-w-3xl mx-auto text-blue-100 font-light">
            Connect with skilled professionals for repairs, maintenance, and more. Get your work done quickly and efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-full font-bold text-xl transition transform hover:-translate-y-1 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/services"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 rounded-full font-bold text-xl transition transform hover:-translate-y-1 shadow-lg"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Featured Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {[
              { title: "Home Repairs", icon: "🔨", description: "Quick and reliable home repair services for all your needs." },
              { title: "Electrical Work", icon: "⚡", description: "Professional electrical services to keep your home safe and powered." },
              { title: "Plumbing", icon: "🚿", description: "Expert plumbing solutions for leaks, installations, and maintenance." },
              { title: "Cleaning", icon: "🧹", description: "Thorough cleaning services for homes and offices." },
              { title: "Gardening", icon: "🌱", description: "Beautiful gardening and landscaping by experts." },
              { title: "Moving", icon: "📦", description: "Safe and efficient moving and packing services." },
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-200 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 text-center text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 drop-shadow-lg">Why Choose ServiceConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "⚡", title: "Fast & Reliable", desc: "Instant notifications and quick service matching." },
              { icon: "🔒", title: "Secure Payments", desc: "All transactions are safe and encrypted." },
              { icon: "🤝", title: "Trusted Professionals", desc: "Verified workers with real reviews and ratings." },
              { icon: "📱", title: "Easy to Use", desc: "Modern, intuitive platform for everyone." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 flex flex-col items-center shadow-lg border border-blue-400 hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4 text-blue-600">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-center text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Request a Service", icon: "📝", description: "Describe what you need and set your budget." },
              { title: "Get Connected", icon: "🔔", description: "Available workers receive your request in real-time." },
              { title: "Job Done", icon: "✅", description: "Your selected worker completes the job to your satisfaction." },
            ].map((step, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-8 shadow-md border border-gray-200 transition-transform hover:scale-105 hover:shadow-lg">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                name: "John Doe",
                role: "Homeowner",
                quote: "Found an electrician within minutes. Great service and very professional work!",
              },
              {
                name: "Jane Smith",
                role: "Office Manager",
                quote: "We use ServiceConnect for all our office maintenance needs. Reliable and fast.",
              },
              {
                name: "Priya Patel",
                role: "Business Owner",
                quote: "The platform is so easy to use and the workers are top-notch!",
              },
              {
                name: "Carlos Mendez",
                role: "Landlord",
                quote: "I found a plumber for my rental property in minutes. Highly recommended!",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full mr-4 border-2 border-blue-300"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 drop-shadow-lg">Stay Updated!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Subscribe to our newsletter for the latest updates, offers, and service tips.
          </p>
          <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 rounded-md bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
            <button
              type="submit"
              className="bg-gray-800 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Join our community of users and workers today and experience the easiest way to get your tasks done.
          </p>
          <Link
            to="/register"
            className="bg-gray-800 text-white hover:bg-gray-700 px-10 py-4 rounded-md font-bold text-xl inline-block transition transform hover:-translate-y-1 shadow-xl"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
