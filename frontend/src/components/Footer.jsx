// src/components/layout/Footer.jsx

import { Globe, ChevronDown } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const footerNavigation = [
  {
    title: "Quick Links",
    links: [
      { name: "Bookings", isLink: false },
      { name: "Admin Login", isLink: true, href: "/admin-login" },
      { name: "Create Account", isLink: false },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", isLink: false },
      { name: "Careers", isLink: false },
      { name: "Partnership", isLink: false },
      { name: "Contact Team", isLink: false },
    ],
  },
  {
    title: "Legal & Governance",
    links: [
      { name: "Terms of Service", isLink: false },
      { name: "Privacy Policy", isLink: false },
      { name: "Compliance", isLink: false },
    ],
  },
];

const socials = [
  { name: "LinkedIn", icon: FaLinkedinIn, href: "https://linkedin.com" },
  { name: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
  { name: "Facebook", icon: FaFacebookF, href: "https://facebook.com" },
];

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-white pt-20 pb-0 overflow-hidden relative border-t border-zinc-900 select-none">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-600/10 blur-[130px] rounded-full" />
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* TOP SECTION: TAGLINE + SOCIALS + MULTI-COLUMN NAVIGATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
          
          {/* LEFT COLUMN: TAGLINE, LANGUAGE SELECTOR & SOCIALS */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug max-w-xs">
              Home away from home, book your comfort
            </h2>

            {/* Language Selector Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:border-zinc-700 transition-colors cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-1" />
            </div>

            {/* Minimalist Social Icons Row */}
            <div className="flex items-center gap-4 pt-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors p-1"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMNS: NAVIGATION LINKS (4 COLUMNS) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-left">
            {footerNavigation.map((col) => (
              <div key={col.title} className="space-y-4">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {col.title}
                </h3>
                <ul className="space-y-2.5 text-xs">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      {link.isLink ? (
                        <Link
                          to={link.href}
                          className="text-amber-400 hover:text-amber-300 transition-colors duration-200 block font-semibold leading-relaxed"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <span className="text-zinc-400 block font-normal leading-relaxed cursor-default">
                          {link.name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

      </div>

      <div className="w-full overflow-hidden leading-none pt-4 pointer-events-none">
        <h1 className="text-[16vw] font-black tracking-tighter text-white text-center uppercase leading-[0.8] tracking-[0.02em] whitespace-nowrap opacity-95">
          EDEN HOTEL 
        </h1>
      </div>
          
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* COPYRIGHT / LEGAL SUB-BAR */}
        <div className="py-6 border-t-2 border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4 text-left">
          <p>© {new Date().getFullYear()} Eden Hotel Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-default">Privacy Policy</span>
            <span className="cursor-default">Terms of Service</span>
            <span className="cursor-default">Security</span>
          </div>
        </div>
      </div>

    </footer>
  );
}