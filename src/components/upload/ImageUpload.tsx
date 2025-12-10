"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    return (
        <div className="space-y-4">
            {value ? (
                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/10">
                    <Image src={value} alt="Upload" fill className="object-cover" />
                    <button
                        onClick={() => onChange("")}
                        className="absolute top-2 right-2 p-2 bg-black/80 hover:bg-black rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-gold/50 transition-colors">
                    <Upload className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <UploadButton<OurFileRouter, "imageUploader">
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                            if (res?.[0]?.url) {
                                onChange(res[0].url);
                                setUploading(false);
                            }
                        }}
                        onUploadError={(error: Error) => {
                            alert(`Upload failed: ${error.message}`);
                            setUploading(false);
                        }}
                        onUploadBegin={() => setUploading(true)}
                        appearance={{
                            button:
                                "bg-gold text-black hover:bg-gold/90 transition-colors px-6 py-3 rounded-full font-medium",
                            allowedContent: "text-white/50 text-sm mt-2",
                        }}
                    />
                    {uploading && (
                        <p className="text-sm text-gold mt-4">Uploading...</p>
                    )}
                </div>
            )}
        </div>
    );
}
