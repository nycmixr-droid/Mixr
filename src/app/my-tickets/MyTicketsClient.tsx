"use client";

import { Ticket as TicketIcon, Calendar, MapPin, CheckCircle } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

type Ticket = {
    id: string;
    qrCode: string;
    status: string;
    checkedInAt: Date | null;
    event: {
        id: string;
        title: string;
        date: Date;
        location: string;
        image: string | null;
    };
};

export default function MyTicketsClient({ tickets }: { tickets: Ticket[] }) {
    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-heading mb-2">My Tickets</h1>
                <p className="text-white/70">View and manage your event tickets</p>
            </div>

            {tickets.length === 0 ? (
                <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center">
                    <TicketIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No tickets yet</h3>
                    <p className="text-white/70">
                        Browse events and get your first ticket!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-surface border border-white/10 rounded-3xl overflow-hidden hover:border-gold/30 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Event Info */}
                                <div className="flex-1 p-6">
                                    {ticket.event.image && (
                                        <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4">
                                            <Image
                                                src={ticket.event.image}
                                                alt={ticket.event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold font-heading mb-3">
                                        {ticket.event.title}
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-white/70">
                                            <Calendar className="w-4 h-4 text-gold" />
                                            <span>
                                                {new Date(ticket.event.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/70">
                                            <MapPin className="w-4 h-4 text-gold" />
                                            <span>{ticket.event.location}</span>
                                        </div>
                                        {ticket.status === "USED" && ticket.checkedInAt && (
                                            <div className="flex items-center gap-2 text-green-500">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>
                                                    Checked in on{" "}
                                                    {new Date(ticket.checkedInAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="bg-white p-6 flex items-center justify-center md:w-48">
                                    <div className="text-center">
                                        <QRCodeSVG value={ticket.qrCode} size={128} />
                                        <p className="text-xs text-black/50 mt-2">
                                            Scan at venue
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
