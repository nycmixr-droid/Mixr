"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateRequestStatus } from "@/app/events/[id]/manage-actions";
import Image from "next/image";
import { Check, X } from "lucide-react";

type Request = {
    id: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
        email: string;
    };
    createdAt: Date;
};

export function ManageRequests({
    initialRequests,
    eventId,
}: {
    initialRequests: Request[];
    eventId: string;
}) {
    const [requests, setRequests] = useState(initialRequests);
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleAction = async (rsvpId: string, status: "CONFIRMED" | "CANCELLED") => {
        setIsLoading(rsvpId);
        try {
            await updateRequestStatus(rsvpId, status);
            setRequests((prev) => prev.filter((r) => r.id !== rsvpId));
            // Optional: Add a success message or toast here if a library was available
        } catch (error) {
            console.error(error);
            alert("Failed to update status. Please try again.");
        } finally {
            setIsLoading(null);
        }
    };

    if (requests.length === 0) return null;

    return (
        <div className="bg-surface border border-white/10 rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-bold font-heading">Pending Requests ({requests.length})</h2>
            <div className="space-y-4">
                {requests.map((request) => (
                    <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                {request.user.image ? (
                                    <Image
                                        src={request.user.image}
                                        alt={request.user.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                                        {request.user.name?.[0] || "?"}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-white">{request.user.name || "Anonymous"}</p>
                                <p className="text-xs text-white/50">Requested {new Date(request.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                onClick={() => handleAction(request.id, "CANCELLED")}
                                disabled={isLoading === request.id}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400"
                                onClick={() => handleAction(request.id, "CONFIRMED")}
                                disabled={isLoading === request.id}
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
