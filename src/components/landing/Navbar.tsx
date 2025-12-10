"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-24 h-8">
                        <Image
                            src="/logo.png"
                            alt="Mixr"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/feed"
                        className="text-sm font-medium text-white/70 hover:text-gold transition-colors"
                    >
                        Feed
                    </Link>
                    <SignedIn>
                        <Link
                            href="/profile"
                            className="text-sm font-medium text-white/70 hover:text-gold transition-colors"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/host/dashboard"
                            className="text-sm font-medium text-white/70 hover:text-gold transition-colors"
                        >
                            Dashboard
                        </Link>
                    </SignedIn>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/create">
                        <Button variant="outline" size="sm" className="hidden lg:flex">
                            Create Experience
                        </Button>
                    </Link>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm font-medium text-white hover:text-gold transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                        <Button size="sm">Get Started</Button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 border border-gold/50"
                                }
                            }}
                        />
                    </SignedIn>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-black border-b border-white/10"
                >
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            href="/feed"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Feed
                        </Link>
                        <SignedIn>
                            <Link
                                href="/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/host/dashboard"
                                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        </SignedIn>
                        <div className="flex flex-col gap-4 mt-4">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/5 w-full text-left">
                                        Sign In
                                    </button>
                                </SignInButton>
                                <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Button>
                            </SignedOut>
                            <SignedIn>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10 border border-gold/50"
                                        }
                                    }}
                                />
                            </SignedIn>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
