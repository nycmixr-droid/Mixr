"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { X } from "lucide-react";
import { updateProfile } from "@/app/profile/[userId]/actions";

type User = {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    gender: string | null;
};

export function EditProfileModal({
    isOpen,
    onClose,
    user,
}: {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || "",
        bio: user.bio || "",
        gender: user.gender || "",
        image: user.image || "",
    });

    if (!isOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formDataObj = new FormData();
            formDataObj.append("name", formData.name);
            formDataObj.append("bio", formData.bio);
            formDataObj.append("gender", formData.gender);
            formDataObj.append("image", formData.image);

            await updateProfile(formDataObj);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold font-heading">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="edit-profile-form" onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                Profile Picture
                            </label>
                            <div className="flex justify-center">
                                <ImageUpload
                                    value={formData.image}
                                    onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                Name
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                            <p className="text-xs text-white/40">
                                Used for gender-specific events.
                            </p>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="edit-profile-form"
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
