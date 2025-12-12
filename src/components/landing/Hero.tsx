"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">

                {/* Base depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-[#0b0b0b]" />

                {/* White marble "clouding" */}
                <div className="absolute inset-0 opacity-70 mix-blend-screen">
                    <div className="absolute -top-40 -left-40 w-[900px] h-[700px] rounded-full bg-white/10 blur-[120px]" />
                    <div className="absolute top-10 right-[-200px] w-[900px] h-[700px] rounded-full bg-white/8 blur-[140px]" />
                    <div className="absolute bottom-[-250px] left-1/3 w-[1000px] h-[800px] rounded-full bg-white/7 blur-[160px]" />
                </div>

                {/* Veins (WHITE) — higher contrast */}
                <div
                    className="absolute inset-0 opacity-[0.55] mix-blend-screen"
                    style={{
                        backgroundImage: `
        linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.32) 14%, rgba(255,255,255,0) 28%),
        linear-gradient(25deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 12%, rgba(255,255,255,0) 26%),
        linear-gradient(160deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 10%, rgba(255,255,255,0) 22%)
      `
                    }}
                />

                {/* Kintsugi (GOLD) streak glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] bg-[#d4af37]/20 blur-[130px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-120px] right-[-120px] w-[900px] h-[650px] bg-[#d4af37]/12 blur-[160px] rounded-full mix-blend-screen" />

                {/* Gold "veins" overlay (thin + visible) */}
                <div
                    className="absolute inset-0 opacity-[0.45] mix-blend-screen"
                    style={{
                        backgroundImage: `
        linear-gradient(120deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.35) 12%, rgba(212,175,55,0) 24%),
        linear-gradient(35deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.22) 10%, rgba(212,175,55,0) 20%)
      `
                    }}
                />

                {/* Optional: subtle grain to sell the “stone” (turn up/down opacity) */}
                <div
                    className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
                    style={{
                        backgroundImage: `
        repeating-linear-gradient(
          0deg,
          rgba(255,255,255,0.06) 0px,
          rgba(255,255,255,0.06) 1px,
          rgba(0,0,0,0) 2px,
          rgba(0,0,0,0) 4px
        )
      `
                    }}
                />
            </div>


            <div className="container relative z-10 px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight leading-[1.1]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <span className="block text-white">Join Me Outside</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Jump into real-time plans before they slip away.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <Link href="/feed">
                            <Button size="lg" className="group min-w-[200px]">
                                Join Plans
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/create">
                            <Button variant="outline" size="lg" className="min-w-[200px]">
                                Host Plans
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </motion.div>
        </section>
    );
}
