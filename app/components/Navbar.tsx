'use client';
import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/constants";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`relative w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm py-3" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="relative z-10">
          <h1 className="text-3xl md:text-5xl text-emerald-500 font-bold"> codeadpool </h1>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <Link 
                href={link.href}
                className="text-[#e8e8e8] font-medium relative group"
              >
                {link.label}
                {/* <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-black to-white transition-all duration-300 group-hover:w-full"></span> */}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu} 
          className="lg:hidden flex items-center"
          aria-label="Toggle menu"
        >
          <div className="relative w-8 h-6 flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-[#e8e8e8] rounded-lg transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`w-full h-0.5 bg-[#e8e8e8] rounded-lg transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-full h-0.5 bg-[#e8e8e8] rounded-lg transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <div className="px-4 py-5 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.key} 
              href={link.href}
              className="block py-2 px-4 hover:bg-[#e8e8e8] hover:text-blue-600 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
