import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, DiscordIcon } from "@/components/icons";
import { getUpcomingMeetups, formatMeetupDateTime } from "@/lib/meetupSchedule";
import Footer from "@/components/footer";
import Header from "@/components/header";

const LINKS = {
  instagram: "https://www.instagram.com/fortworthfilmmakers",
  discord: "https://discord.gg/aJrsuTHg5Z",
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="
        inline-flex items-center
        text-xs font-medium
        text-white/60
        sm:rounded-full sm:border sm:border-white/10 sm:bg-white/5 sm:px-3 sm:py-1 sm:text-white/75
      "
    >
      {children}
    </span>
  );
}

export default function HomePage() {
  const { next, alsoComingUp } = getUpcomingMeetups();

  return (
    <div className="film-grain relative flex flex-1 flex-col overflow-hidden bg-[#05060a] text-white">
      {/* Background: gradients + vignette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-52 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>

      {/* Top nav */}
      <Header activeHref="/" />

      {/* Main content grows to fill space */}
      <main className="relative z-10 flex-1 overflow-x-hidden">
        <section>
          <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-14 sm:px-6 sm:pt-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              {/* MOBILE: metadata line (no leading separator on wrapped lines) */}
              <div className="mb-5 sm:hidden flex flex-wrap items-center text-[11px] leading-snug text-white/55">
                {[
                  "Fort Worth",
                  "Indie-first",
                  "Talent spotlight",
                  "Meet. Crew. Shoot.",
                ].map((t) => (
                  <span
                    key={t}
                    className="after:mx-2 after:text-white/25 after:content-['•'] last:after:content-['']"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* DESKTOP+: pills */}
              <div className="mb-5 hidden sm:flex flex-wrap gap-x-3 gap-y-2">
                <Pill>Fort Worth</Pill>
                <Pill>Indie-first</Pill>
                <Pill>Talent spotlight</Pill>
                <Pill>Meet. Crew. Shoot.</Pill>
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                A stronger Texas indie scene: funded projects, paid work, and
                packed theaters.
              </h1>

              <p className="mt-5 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
                Fort Worth Filmmakers (FWF) is a grassroots hub for people who
                want to make movies in Texas. We welcome first-timers, working
                crew, and seasoned filmmakers. Our mission is simple: grow the
                community, raise the quality, and help the best work reach real
                audiences.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={LINKS.instagram}
                  target="_blank"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Follow on Instagram
                </Link>

                <Link
                  href={LINKS.discord}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  <DiscordIcon className="h-4 w-4" />
                  Join the Discord
                </Link>
              </div>
            </div>

            {/* Right “poster card” */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.65)]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30" />

                <div className="relative">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm font-semibold">
                      Upcoming meetups
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                        Central Time
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
                        Local first
                      </div>
                    </div>
                  </div>

                  {/* Meetups: side-by-side on sm, stacked on lg (because the right column becomes narrow) */}
                  <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="h-full rounded-2xl border border-white/10 bg-black/35 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">Next</div>
                      </div>

                      <div className="mt-2 text-sm text-white/90">
                        {next.title}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        TBA
                        {/* {formatMeetupDateTime(next.when)} */}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        Fort Worth
                        {/* {next.locationName}; {next.locationCity} */}
                      </div>
                    </div>

                    {/*  
                    <div className="h-full rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="text-sm font-semibold text-white/80">
                        Also coming up
                      </div>
                      <div className="mt-2 text-sm text-white/85">
                        {alsoComingUp.title}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        {formatMeetupDateTime(alsoComingUp.when)}
                        TBA
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {alsoComingUp.locationName}; {alsoComingUp.locationCity} 
                        Arlington
                      </div>
                    </div>*/}
                  </div>

                  <div className="mt-3 text-xs text-white/55">
                    Any changes or special events are posted on Instagram and
                    Discord.
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="text-xs text-white/60">What happens</div>
                      <div className="mt-1 text-sm">
                        Introductions, crew matchmaking, project pitches,
                        feedback, and collabs.
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="text-xs text-white/60">
                        Talent directory
                      </div>
                      <div className="mt-1 text-sm text-white/80">
                        A growing list of DPs, editors, sound, composers,
                        actors, producers, and more.
                      </div>
                      <Link
                        href="/members"
                        className="mt-3 inline-flex text-sm font-semibold text-white underline underline-offset-4 hover:opacity-90"
                      >
                        Explore members
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={LINKS.instagram}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-center text-sm font-semibold hover:bg-white/10"
                    >
                      <InstagramIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Instagram</span>
                    </Link>

                    <Link
                      href={LINKS.discord}
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-center text-sm font-semibold hover:bg-white/10"
                    >
                      <DiscordIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Discord</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-white/45">
                “Don’t pay attention to the industry. Do your own thing. Make
                your own industry. Break open the form!” - Martin Scorsese
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer instagramUrl={LINKS.instagram} discordUrl={LINKS.discord} />
    </div>
  );
}
