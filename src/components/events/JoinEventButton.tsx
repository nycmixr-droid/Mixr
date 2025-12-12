"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { joinExperience } from "@/app/events/[id]/actions";
import { Lock } from "lucide-react";

type JoinEventButtonProps = {
    eventId: string;
    visibility: "PUBLIC" | "PRIVATE";
    audience: "ALL" | "MEN_ONLY" | "WOMEN_ONLY";
    userGender?: string | null;
    className?: string;
};

export function JoinEventButton({
    eventId,
    visibility,
    audience,
    userGender,
    className,
}: JoinEventButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleJoin = async () => {
        setIsLoading(true);
        try {
            await joinExperience(eventId);
            // Revalidation happens on server, UI should update automatically if using router.refresh() or similar,
            // but server actions with revalidatePath usually handle it.
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to join experience");
        } finally {
            setIsLoading(false);
        }
    };

    const isPrivate = visibility === "PRIVATE";
    const buttonText = isLoading
        ? (isPrivate ? "Requesting..." : "Joining...")
        : (isPrivate ? "Request Access" : "Join Now");

    return (
        <Button
            size="lg"
            className={className}
            onClick={handleJoin}
            disabled={isLoading}
        >
            {isPrivate && <Lock className="w-4 h-4 mr-2" />}
            {buttonText}
        </Button>
    );
}
