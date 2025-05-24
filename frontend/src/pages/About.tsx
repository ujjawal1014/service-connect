import React from "react"
import { Link } from "react-router-dom"

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg tracking-tight">About ServiceConnect</h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto text-blue-100 font-light opacity-90">
            Bridging the gap between people who need services and skilled professionals who can provide them.
          </p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div className="bg-gray-50 shadow-md rounded-lg p-8 border border-gray-200 flex flex-col items-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4 text-blue-600">🎯</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-gray-600 text-center text-sm">
              To make it easy, efficient, and reliable to find the right person for any job, while also providing opportunities for skilled workers to find consistent work.
            </p>
          </div>
          <div className="bg-gray-50 shadow-md rounded-lg p-8 border border-gray-200 flex flex-col items-center hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4 text-blue-600">📖</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Story</h2>
            <p className="text-gray-600 text-center mb-4 text-sm">
              Founded in 2023 after experiencing the frustration of finding reliable service providers, our founders created a solution to revolutionize how people connect with professionals.
            </p>
            <p className="text-gray-600 text-center text-sm">
              What started as a small local platform has now grown into a comprehensive service marketplace, connecting thousands of users with skilled workers across multiple service categories.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 drop-shadow-lg">Our Journey</h2>
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-8">
            {[
              { year: "2023", event: "Founded ServiceConnect" },
              { year: "2024", event: "Reached 10,000+ users" },
              { year: "2025", event: "Expanded to 3 new cities" },
              { year: "2026", event: "Launched mobile app" },
            ].map((milestone, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="bg-white text-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2 shadow-lg border border-blue-400">{milestone.year}</div>
                <div className="text-blue-100 text-center font-semibold opacity-90">{milestone.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ServiceConnect */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 drop-shadow-lg">Why ServiceConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "⚡", title: "Fast & Reliable", desc: "Instant notifications and quick service matching." },
              { icon: "🔒", title: "Secure Payments", desc: "All transactions are safe and encrypted." },
              { icon: "🤝", title: "Trusted Professionals", desc: "Verified workers with real reviews and ratings." },
              { icon: "📱", title: "Easy to Use", desc: "Modern, intuitive platform for everyone." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 flex flex-col items-center shadow-xl border border-gray-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-center text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 drop-shadow-lg">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Co-Founder",
                bio: "With over 15 years in tech and service industries, Alex leads our vision and strategy.",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Sarah Chen",
                role: "CTO",
                bio: "Sarah brings 10+ years of software development experience, leading our technical innovations.",
                img: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Operations",
                bio: "Michael ensures our platform runs smoothly and efficiently for all users.",
                img: "https://randomuser.me/api/portraits/men/65.jpg",
              },
            ].map((member, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-8 shadow-2xl border border-gray-200 flex flex-col items-center">
                <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-400 object-cover shadow-md" />
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-blue-600 mb-2 text-sm">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 drop-shadow-lg">Stay Updated!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100 opacity-90">
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
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-md font-semibold transition shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100 opacity-90">
            Whether you're looking for services or offering your skills, ServiceConnect is the platform for you.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 text-white hover:bg-blue-700 px-10 py-4 rounded-md font-bold text-xl inline-block transition transform hover:-translate-y-1 shadow-md"
          >
            Sign Up Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
