"use client";

import { Button } from "@/components/ui/Button";
import { createCheckoutSession } from "../actions";
import { useState } from "react";
import { Ticket, DollarSign, Calendar, MapPin } from "lucide-react";
import Image from "next/image";

type Event = {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    price: number;
    image: string | null;
};

export default function BookEventClient({ event }: { event: Event }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const { url } = await createCheckoutSession(event.id);
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error(error);
            alert("Failed to start checkout. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Event Details */}
                    <div>
                        {event.image && (
                            <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <h1 className="text-4xl font-bold font-heading mb-4">{event.title}</h1>
                        <p className="text-white/70 mb-6">{event.description}</p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-white/80">
                                <Calendar className="w-5 h-5 text-gold" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <MapPin className="w-5 h-5 text-gold" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <DollarSign className="w-5 h-5 text-gold" />
                                <span className="text-2xl font-bold text-gold">
                                    {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Card */}
                    <div className="bg-surface border border-white/10 rounded-3xl p-8 h-fit sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <Ticket className="w-8 h-8 text-gold" />
                            <h2 className="text-2xl font-bold font-heading">Get Your Ticket</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-lg">
                                <span className="text-white/70">Ticket Price</span>
                                <span className="font-bold">
                                    {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between text-xl">
                                <span className="font-bold">Total</span>
                                <span className="font-bold text-gold">
                                    {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                                </span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            size="lg"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Processing..."
                                : event.price === 0
                                    ? "Get Free Ticket"
                                    : "Proceed to Checkout"}
                        </Button>

                        <p className="text-xs text-white/50 text-center mt-4">
                            Secure payment powered by Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
