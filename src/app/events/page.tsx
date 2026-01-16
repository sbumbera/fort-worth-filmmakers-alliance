// src/app/events/page.tsx

import Header from "@/components/header";
import Footer from "@/components/footer";
import EventsHero from "@/components/events/EventsHero";
import EventsCalendar from "@/components/events/EventsCalendar";

const LINKS = {
  instagram: "https://www.instagram.com/fortworthfilmmakers",
  discord: "https://discord.gg/aJrsuTHg5Z",
};

export default function EventsPage() {
  return (
    <div className="film-grain relative flex flex-1 flex-col overflow-hidden bg-[#05060a] text-white">
      {/* Background: gradients + vignette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-52 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>

      <Header activeHref="/events" />

      <main className="relative z-10 flex-1 overflow-x-hidden">
        <section>
          <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-14 pt-12 sm:px-6 sm:pt-14">
            <EventsHero />
            <EventsCalendar />
          </div>
        </section>
      </main>

      <Footer instagramUrl={LINKS.instagram} discordUrl={LINKS.discord} />
    </div>
  );
}
