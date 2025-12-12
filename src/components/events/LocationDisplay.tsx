"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

type LocationDisplayProps = {
    location: string;
    latitude: number | null;
    longitude: number | null;
    className?: string;
    showIcon?: boolean;
};

export function LocationDisplay({
    location,
    latitude,
    longitude,
    className = "",
    showIcon = false,
}: LocationDisplayProps) {
    const [displayLocation, setDisplayLocation] = useState(location);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Only reverse geocode if location is "TBD" or "Location TBD" and we have coordinates
        const isTBD = location === "TBD" || location === "Location TBD";

        if (isTBD && latitude && longitude) {
            setIsLoading(true);
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

            if (!token) {
                console.error("Mapbox token not found");
                setIsLoading(false);
                return;
            }

            fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&types=address,poi`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.features && data.features.length > 0) {
                        setDisplayLocation(data.features[0].place_name);
                    }
                })
                .catch((err) => console.error("Failed to reverse geocode:", err))
                .finally(() => setIsLoading(false));
        } else {
            setDisplayLocation(location);
        }
    }, [location, latitude, longitude]);

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {showIcon && <MapPin className="w-5 h-5 text-gold" />}
            <span className={isLoading ? "animate-pulse" : ""}>
                {displayLocation}
            </span>
        </div>
    );
}
