"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LogOut } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Why Us", href: "/why-us/" },
  { label: "Book a Call", href: "/book-call/" },
  { label: "Get Started", href: "/get-started/" },
];

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleLangChange = (targetLang: "en" | "ja") => {
    if (lang === targetLang) return;

    if (targetLang === "en") {
      router.push(`/en${pathname}`);
    } else {
      const newPath = pathname.replace(/^\/en/, "") || "/";
      router.push(newPath);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");

    if (path.includes("job-seekers")) {
      router.push(lang === "ja" ? "/job-seekers-auth" : "/en/job-seekers-auth");
    } else if (path.includes("staff")) {
      router.push(lang === "ja" ? "/staff-login" : "/en/staff-login");
    } else {
      router.push(lang === "ja" ? "/auth" : "/en/auth");
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 w-full z-50 border-b border-gray-200  ${scrolled ? " bg-white/50 backdrop-blur-2xl text-slate-600" : "bg-transparent text-black"} transition-all duration-500`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-15">
            {/* Logo Section */}
            <Link
              href="/"
              className="flex items-center gap-2 tracking-wider uppercase font-bold"
            >
              {/* <div className="w-16 h-12 relative">
                <img
                  src="/logo.png"
                  alt="Hi Mac USA Logo"
                  className="object-contain"
                />
              </div> */}
              Vacancify
            </Link>

            {/* Desktop Navigation Links */}
            {/* <div className="hidden xl:flex items-center space-x-8 text-sm font-medium ">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`hover:text-primary transition-colors ${
                    path === link.href ? "text-primary font-bold" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div> */}

            <div className={`flex items-center`}>
              <button
                onClick={() => handleLangChange(lang === "ja" ? "en" : "ja")}
                className={`relative flex h-8 w-22.5 items-center rounded-full cursor-pointer backdrop-blur-3xl  p-1 transition-colors duration-300 hover:bg-gray-200 ${scrolled ? "bg-gray-300" : "bg-gray-100"}`}
              >
                <div
                  className={`absolute top-1 left-1 h-6 w-10.5 rounded-full bg-white/50 shadow-sm ${lang === "ja" ? "" : "translate-x-10"}`}
                />

                <div className="relative z-10 flex w-full justify-between px-2 text-[10px] font-semibold">
                  <span
                    className={`transition-colors ${
                      lang === "ja" ? "text-neutral-900" : "text-neutral-500"
                    }`}
                  >
                    JA 🇯🇵
                  </span>
                  <span
                    className={`transition-colors ${
                      lang === "en" ? "text-neutral-900" : "text-neutral-500"
                    }`}
                  >
                    EN 🇺🇸
                  </span>
                </div>
              </button>
            </div>

            <button onClick={handleLogout}>
              <LogOut className="cursor-pointer w-5 h-5 hover:text-blue-600" />
            </button>

            {/* Texas Time Display */}
            {/* <div className="hidden xl:block text-xs text-neutral-600 font-mono whitespace-pre-line text-center">
              {currentTime}
            </div> */}

            {/* Mobile Menu Button */}
            {/* <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`xl:hidden p-2 rounded-xl  text-white hover:text-slate-600 cursor-pointer hover:bg-primary/90 transition-colors ${scrolled ? "bg-primary" : ""}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button> */}
          </div>
        </div>
      </nav>
      {/* --- MOBILE MENU SYSTEM --- */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 xl:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 h-full w-70 bg-white z-70 xl:hidden transform transition-transform duration-300 ease-out shadow-2xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="p-6 flex justify-between items-center border-b border-slate-50">
            <span className="font-bold text-slate-900">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-lg font-medium p-3 rounded-xl transition-all ${
                    path === link.href
                      ? "bg-blue-50 text-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Texas Time Display in Mobile */}
          {/* <div className="text-xs text-neutral-600 font-mono whitespace-pre-line text-center pb-4">
            {currentTime}
          </div> */}

          {/* Mobile Footer CTA */}
          <div className="p-6 border-t border-slate-50">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/book-call");
              }}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/40 active:scale-[0.98] transition-transform"
            >
              Book a free call
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
