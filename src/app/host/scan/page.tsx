"use client";

import { Button } from "@/components/ui/Button";
import { useState, useRef, useEffect } from "react";
import { checkInTicket } from "./actions";
import { QrCode, CheckCircle, XCircle, Camera } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function ScanPage() {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        attendee?: { name: string; email: string };
    } | null>(null);
    const [manualCode, setManualCode] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (codeReaderRef.current) {
                codeReaderRef.current.reset();
            }
        };
    }, []);

    const startScanning = async () => {
        setScanning(true);
        setResult(null);

        try {
            const codeReader = new BrowserMultiFormatReader();
            codeReaderRef.current = codeReader;

            const videoInputDevices = await codeReader.listVideoInputDevices();
            const selectedDeviceId = videoInputDevices[0]?.deviceId;

            if (!selectedDeviceId) {
                throw new Error("No camera found");
            }

            codeReader.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current!,
                async (result, error) => {
                    if (result) {
                        const qrCode = result.getText();
                        await handleCheckIn(qrCode);
                        codeReader.reset();
                        setScanning(false);
                    }
                }
            );
        } catch (error) {
            console.error("Error starting scanner:", error);
            alert("Failed to start camera. Please check permissions.");
            setScanning(false);
        }
    };

    const stopScanning = () => {
        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
        }
        setScanning(false);
    };

    const handleCheckIn = async (qrCode: string) => {
        try {
            const response = await checkInTicket(qrCode);
            setResult(response);
        } catch (error) {
            setResult({
                success: false,
                message: "Error checking in ticket",
            });
        }
    };

    const handleManualCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCode.trim()) return;
        await handleCheckIn(manualCode);
        setManualCode("");
    };

    return (
        <div className="min-h-screen pt-24 pb-12 container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <QrCode className="w-16 h-16 text-gold mx-auto mb-4" />
                    <h1 className="text-4xl font-bold font-heading mb-2">Scan Tickets</h1>
                    <p className="text-white/70">Check in attendees to your event</p>
                </div>

                {/* Scanner */}
                <div className="bg-surface border border-white/10 rounded-3xl p-8 mb-6">
                    {!scanning ? (
                        <div className="text-center">
                            <Button onClick={startScanning} size="lg" className="gap-2">
                                <Camera className="w-5 h-5" />
                                Start Camera Scanner
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <video
                                ref={videoRef}
                                className="w-full rounded-xl bg-black"
                                style={{ maxHeight: "400px" }}
                            />
                            <Button onClick={stopScanning} variant="outline" className="w-full">
                                Stop Scanning
                            </Button>
                        </div>
                    )}
                </div>

                {/* Manual Entry */}
                <div className="bg-surface border border-white/10 rounded-3xl p-8 mb-6">
                    <h2 className="text-xl font-bold mb-4">Manual Entry</h2>
                    <form onSubmit={handleManualCheckIn} className="flex gap-4">
                        <input
                            type="text"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            placeholder="Enter ticket code"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                        />
                        <Button type="submit">Check In</Button>
                    </form>
                </div>

                {/* Result */}
                {result && (
                    <div
                        className={`bg-surface border rounded-3xl p-8 ${result.success ? "border-green-500/50" : "border-red-500/50"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {result.success ? (
                                <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <h3
                                    className={`text-xl font-bold mb-2 ${result.success ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {result.success ? "Success!" : "Error"}
                                </h3>
                                <p className="text-white/90 mb-2">{result.message}</p>
                                {result.attendee && (
                                    <div className="text-sm text-white/70">
                                        <p>
                                            <strong>Name:</strong> {result.attendee.name}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {result.attendee.email}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
