import React from "react"
import { Link } from "react-router-dom"

const socialLinks = [
  { href: "https://facebook.com", icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
  ) },
  { href: "https://twitter.com", icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.936 0 .386.045.762.127 1.124C7.728 8.816 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89-.386.104-.793.16-1.213.16-.297 0-.583-.028-.862-.08.584 1.822 2.28 3.148 4.29 3.184A9.868 9.868 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
  ) },
  { href: "https://instagram.com", icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37c-.967.967-1.24 2.14-1.298 3.417C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.058 1.277.331 2.45 1.298 3.417.967.967 2.14 1.24 3.417 1.298C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.277-.058 2.45-.331 3.417-1.298.967-.967 1.24-2.14 1.298-3.417.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.277-.331-2.45-1.298-3.417-.967-.967-2.14-1.24-3.417-1.298C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
  ) },
]

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-extrabold mb-4 tracking-wide text-blue-400">ServiceConnect</h3>
            <p className="text-gray-300 mb-4">Connecting users with skilled workers for all your service needs.</p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact Us</h3>
            <p className="text-gray-300 mb-2">Email: <a href="mailto:info@serviceconnect.com" className="hover:text-blue-400 transition">info@serviceconnect.com</a></p>
            <p className="text-gray-300 mb-2">Phone: <a href="tel:+15551234567" className="hover:text-blue-400 transition">+1 (555) 123-4567</a></p>
            <p className="text-gray-300">Address: 123 Service St, City, Country</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Newsletter</h3>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-2 rounded font-semibold hover:from-blue-800 hover:to-blue-950 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} <span className="text-blue-400 font-bold">ServiceConnect</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
