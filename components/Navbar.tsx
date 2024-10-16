"use client";
import Link from "next/link";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  SignedOut,
  useAuth,
  SignedIn,
} from "@clerk/nextjs";
import { Menu, X, PenTool, Home, Sparkles, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { userId } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white-100 bg-opacity-70 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href={"/"} className="flex items-center space-x-2">
            <PenTool className="w-8 h-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              CaptionCraftsAI
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/" icon={<Home className="w-5 h-5" />}>
              Home
            </NavLink>
            <NavLink href="/features" icon={<Sparkles className="w-5 h-5" />}>
              Features
            </NavLink>
            <NavLink href="/pricing" icon={<DollarSign className="w-5 h-5" />}>
              Pricing
            </NavLink>
            {userId && (
              <NavLink href="/generate" icon={<PenTool className="w-5 h-5" />}>
                Generate
              </NavLink>
            )}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 bg-white bg-opacity-70 backdrop-blur-md p-4 rounded-lg">
            <NavLink href="/" icon={<Home className="w-5 h-5" />}>
              Home
            </NavLink>
            <NavLink href="/features" icon={<Sparkles className="w-5 h-5" />}>
              Features
            </NavLink>
            <NavLink href="/pricing" icon={<DollarSign className="w-5 h-5" />}>
              Pricing
            </NavLink>
            {userId && (
              <NavLink href="/generate" icon={<PenTool className="w-5 h-5" />}>
                Generate
              </NavLink>
            )}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="w-full justify-start bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
