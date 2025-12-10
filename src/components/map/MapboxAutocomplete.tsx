"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface AddressResult {
    place_name: string;
    center: [number, number]; // [longitude, latitude]
}

interface MapboxAutocompleteProps {
    value: string;
    onChange: (location: string, latitude?: number, longitude?: number) => void;
    placeholder?: string;
}

export function MapboxAutocomplete({
    value,
    onChange,
    placeholder = "Venue Name or Address",
}: MapboxAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchAddress = async (query: string) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    query
                )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=address,poi&limit=5`
            );
            const data = await response.json();
            setSuggestions(data.features || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        searchAddress(newValue);
    };

    const handleSelectSuggestion = (suggestion: AddressResult) => {
        onChange(suggestion.place_name, suggestion.center[1], suggestion.center[0]);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gold/50 z-10" />
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                        >
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gold/70 mt-1 flex-shrink-0" />
                                <span className="text-sm text-white/90">{suggestion.place_name}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {isLoading && (
                <div className="absolute right-4 top-3.5">
                    <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
