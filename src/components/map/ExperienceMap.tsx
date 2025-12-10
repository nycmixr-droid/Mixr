"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type Experience = {
    id: string;
    title: string;
    latitude: number | null;
    longitude: number | null;
    location: string;
    locationTBD: boolean;
};

interface ExperienceMapProps {
    experiences: Experience[];
    onMarkerClick?: (experienceId: string) => void;
}

export function ExperienceMap({ experiences, onMarkerClick }: ExperienceMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        // Initialize map
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/dark-v11",
            center: [-98.5795, 39.8283], // Center of US
            zoom: 3,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Filter experiences with valid coordinates
        const validExperiences = experiences.filter(
            (exp) => exp.latitude && exp.longitude && !exp.locationTBD
        );

        if (validExperiences.length === 0) return;

        // Add markers for each experience
        validExperiences.forEach((exp) => {
            if (!exp.latitude || !exp.longitude || !map.current) return;

            // Create custom marker element
            const el = document.createElement("div");
            el.className = "experience-marker";
            el.style.width = "32px";
            el.style.height = "32px";
            el.style.borderRadius = "50%";
            el.style.backgroundColor = "#D4AF37";
            el.style.border = "3px solid #000";
            el.style.cursor = "pointer";
            el.style.boxShadow = "0 2px 8px rgba(212, 175, 55, 0.5)";

            // Add marker to map
            const marker = new mapboxgl.Marker(el)
                .setLngLat([exp.longitude, exp.latitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<div style="color: #000; padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${exp.title}</h3>
              <p style="font-size: 12px; color: #666;">${exp.location}</p>
            </div>`
                    )
                )
                .addTo(map.current);

            // Handle marker click
            el.addEventListener("click", () => {
                if (onMarkerClick) {
                    onMarkerClick(exp.id);
                }
            });
        });

        // Fit map to show all markers
        if (validExperiences.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            validExperiences.forEach((exp) => {
                if (exp.latitude && exp.longitude) {
                    bounds.extend([exp.longitude, exp.latitude]);
                }
            });
            map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
        }

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, [experiences, onMarkerClick]);

    return (
        <div
            ref={mapContainer}
            className="w-full h-[600px] rounded-2xl overflow-hidden border border-white/10"
        />
    );
}
