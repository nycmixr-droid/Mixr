import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { getFeaturedEvent, getUpcomingEvents } from "./actions";
import { ExperienceCard } from "@/components/landing/ExperienceCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";

export default async function Home() {
  const featuredEvent = await getFeaturedEvent();
  const upcomingEvents = await getUpcomingEvents();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
      <Navbar />
      <Hero />

      {/* Featured Launch Event */}
      {featuredEvent && (
        <section className="py-20 container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium uppercase tracking-wider mb-4 border border-gold/20">
              <Ticket className="w-3 h-3" />
              Launch Event
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              Join Us for the Official Launch
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Be part of history as we launch 3rdSpace with an unforgettable celebration
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-surface border border-gold/30 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {featuredEvent.image && (
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold font-heading mb-4">
                  {featuredEvent.title}
                </h3>
                <p className="text-white/80 mb-6">{featuredEvent.description}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-white/70">
                    <Calendar className="w-5 h-5 text-gold" />
                    <span>{new Date(featuredEvent.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <MapPin className="w-5 h-5 text-gold" />
                    <span>{featuredEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <Users className="w-5 h-5 text-gold" />
                    <span>{featuredEvent._count.participants} joined</span>
                  </div>
                </div>

                <Link href={`/experiences/${featuredEvent.id}/join`}>
                  <Button size="lg" className="w-full">
                    Join Experience
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-2">
                  Upcoming Plans
                </h2>
                <p className="text-white/70">Discover what's happening next</p>
              </div>
              <Link href="/feed">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <ExperienceCard
                  key={event.id}
                  experience={{
                    id: event.id,
                    title: event.title,
                    category: event.category || "Event",
                    date: new Date(event.date).toLocaleDateString(),
                    location: event.location,
                    price: event.price === 0 ? "Free" : `$${event.price}`,
                    // price: event.price === 0 ? "Free" : `$${event.price}`,
                    image: event.image || "/placeholder.jpg",
                    attendees: event._count.participants,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-surface">
        <div className="container mx-auto px-4 text-center text-white/40 text-sm">
          <p>© 2024 3rdSpace. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
