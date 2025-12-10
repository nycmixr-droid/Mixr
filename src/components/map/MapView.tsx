"use client";

import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useState } from "react";
import { MapPin } from "lucide-react";

interface Location {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
}

interface MapViewProps {
    locations: Location[];
    center?: { lat: number; lng: number };
    zoom?: number;
}

export function MapView({ locations, center = { lat: 40.7128, lng: -74.0060 }, zoom = 12 }: MapViewProps) {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-white/10">
            <Map
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                initialViewState={{
                    longitude: center.lng,
                    latitude: center.lat,
                    zoom: zoom,
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
            >
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        longitude={loc.longitude}
                        latitude={loc.latitude}
                        anchor="bottom"
                        onClick={(e: any) => {
                            e.originalEvent.stopPropagation();
                            setSelectedLocation(loc);
                        }}
                    >
                        <div className="cursor-pointer group">
                            <MapPin className="w-8 h-8 text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-transform group-hover:scale-110" />
                        </div>
                    </Marker>
                ))}

                {selectedLocation && (
                    <Popup
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
                        anchor="top"
                        onClose={() => setSelectedLocation(null)}
                        closeButton={false}
                        className="text-black"
                    >
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-lg">{selectedLocation.title}</h3>
                            {selectedLocation.description && (
                                <p className="text-sm text-gray-600">{selectedLocation.description}</p>
                            )}
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}
