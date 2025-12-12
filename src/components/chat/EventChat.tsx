"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";
import Image from "next/image";
import { sendMessage } from "@/app/events/[id]/chat-actions";

type Message = {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
};

export function EventChat({ eventId, initialMessages }: { eventId: string, initialMessages: Message[] }) {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !user) return;

        const tempId = Math.random().toString();
        const optimisticMessage: Message = {
            id: tempId,
            content: newMessage,
            createdAt: new Date(),
            user: {
                id: "temp-me", // Placeholder, won't match DB ID but we can use image to identify "me"
                name: user.fullName,
                image: user.imageUrl,
            },
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage("");
        setIsSending(true);

        try {
            await sendMessage(eventId, optimisticMessage.content);
        } catch (error) {
            console.error("Failed to send message", error);
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="font-bold text-white">Event Chat</h3>
                <p className="text-xs text-white/50">Chat with other attendees</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30 text-center">
                        <p>No messages yet.</p>
                        <p className="text-xs">Be the first to say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.user.image === user?.imageUrl;
                        return (
                            <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                                    <Image
                                        src={msg.user.image || "/placeholder-avatar.jpg"}
                                        alt={msg.user.name || "User"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMe
                                        ? "bg-gold text-black rounded-tr-none"
                                        : "bg-white/10 text-white rounded-tl-none"
                                    }`}>
                                    <p className="font-medium text-xs opacity-50 mb-1">{msg.user.name}</p>
                                    <p>{msg.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-gold/50"
                />
                <Button size="sm" onClick={handleSend} disabled={isSending || !newMessage.trim()}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
