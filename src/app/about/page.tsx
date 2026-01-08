// src/app/about/page.tsx

import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, DiscordIcon } from "@/components/icons";
import Footer from "@/components/footer";
import Header from "@/components/header";

const LINKS = {
  instagram: "https://www.instagram.com/fortworthfilmmakers",
  discord: "https://discord.gg/aJrsuTHg5Z",
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
      {children}
    </span>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {note ? <div className="mt-1 text-xs text-white/55">{note}</div> : null}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-xl font-semibold">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-white/65">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="film-grain relative min-h-screen overflow-hidden bg-[#05060a] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-52 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>

      {/* Top nav */}
      <Header activeHref="/about" />

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-6 sm:pt-10">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:h-72 sm:w-72 lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30" />
                <Image
                  src="/brand/logo.png"
                  alt="Fort Worth Filmmakers logo"
                  fill
                  className="relative object-contain p-7"
                  priority
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-2">
                <Pill>Fort Worth</Pill>
                <Pill>Indie-first</Pill>
                <Pill>Talent spotlight</Pill>
                <Pill>Meet. Crew. Shoot.</Pill>
              </div>

              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Fort Worth is entering a real production era.
              </h1>

              <p className="mt-5 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
                DFW has decades of film history, but the current moment is
                different: major studio infrastructure is landing here,
                incentives are stronger, and the limiting factor becomes people.
                Crew depth, trust, and discoverable talent are what turn stages
                into a real industry.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={LINKS.instagram}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90"
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

              <div className="mt-4 text-xs text-white/55">
                Meetups and updates live on Discord and Instagram; the site
                stays clean and fast.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left column */}
            <div className="lg:col-span-7">
              {/* The moment */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <SectionTitle
                  eyebrow="The moment"
                  title="Infrastructure is growing fast; the workforce must grow with it."
                  subtitle="New stages do not matter without trained crews, dependable department leads, and a visible roster productions can staff quickly."
                />

                <p className="mt-4 text-white/70">
                  North Texas is seeing unprecedented investment: large-scale
                  studio development, city-backed production zones, and
                  workforce initiatives designed to keep crews local instead of
                  importing entire departments from out of state.
                </p>

                <p className="mt-4 text-white/70">
                  Taylor Sheridan’s SGS Studios presence, and the broader
                  AllianceTexas build-out, signals something important: DFW is
                  not only a backdrop, it is becoming a base. On the south side,
                  Mansfield’s planned studio campus adds more long-term
                  capacity. When capacity increases, demand for local crew and
                  talent visibility increases immediately.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Stat
                    label="State incentive plan"
                    value="$1.5B"
                    note="Approved over 10 years; designed to attract and retain productions."
                  />
                  <Stat
                    label="Fort Worth Film Commission"
                    value="1,000+"
                    note="Projects supported since 2015."
                  />
                  <Stat
                    label="Local impact"
                    value="$700M+"
                    note="Economic impact and 30,000+ jobs supported in Fort Worth."
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs text-white/60">Why this matters</div>
                  <div className="mt-2 text-sm text-white/80">
                    If DFW wants sustainable production, it needs density: crew,
                    vendors, training, and community that keeps talent here long
                    enough to build real careers.
                  </div>
                </div>
              </div>

              {/* History and context */}
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                <SectionTitle
                  eyebrow="Context"
                  title="DFW has the legacy; now it is rebuilding scale."
                  subtitle="From classic features to iconic TV, the region has been on screen for generations."
                />

                <p className="mt-4 text-white/70">
                  The metroplex has served as a filming home for over a century.
                  Long-running television and recognizable locations shaped how
                  audiences see North Texas. Now, the industry is moving from
                  occasional projects to sustained production cycles, including
                  series work, commercials, digital content, and
                  post-production.
                </p>

                <p className="mt-4 text-white/70">
                  This matters for independents: when commercial and studio
                  production grows locally, it creates more day-rate work, more
                  mentorship, and more crew pathways. A stronger base means more
                  people can stay in DFW while building serious portfolios.
                </p>
              </div>

              {/* Ecosystem map */}
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                <SectionTitle
                  eyebrow="The ecosystem"
                  title="DFW already has major pieces"
                  subtitle="Commissions, unions, festivals, schools, and professional groups are active. FWF complements them by focusing on consistent collaboration and talent discovery in Fort Worth."
                />

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm font-semibold">
                      Film commissions
                    </div>
                    <p className="mt-2 text-sm text-white/75">
                      Dallas and Fort Worth support productions through official
                      film offices, permitting guidance, and location support.
                      Fort Worth has rapidly grown since establishing its film
                      commission in 2015.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm font-semibold">
                      Industry organizations
                    </div>
                    <p className="mt-2 text-sm text-white/75">
                      DFW has serious community infrastructure: Dallas Producers
                      Association, Texas Media Production Alliance, Women in
                      Film Dallas, Dallas Screenwriters Association, and
                      multiple filmmaker communities such as Dallas Filmmakers
                      Alliance. These groups support advocacy, education, and
                      networking across the metroplex.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm font-semibold">
                      Festivals and culture
                    </div>
                    <p className="mt-2 text-sm text-white/75">
                      Festivals are a big part of the talent pipeline: Dallas
                      International Film Festival, Lone Star Film Festival in
                      Fort Worth, plus strong specialty festivals and showcase
                      events across Dallas, Denton, Arlington, and beyond.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-sm font-semibold">
                      Education and workforce
                    </div>
                    <p className="mt-2 text-sm text-white/75">
                      DFW is rich with film programs and hands-on training:
                      university programs, community colleges, and specialized
                      schools. Workforce initiatives tied to new studio growth
                      are accelerating below-the-line training because that is
                      where the demand spikes first.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-5">
              {/* FWF story */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <SectionTitle
                  eyebrow="FWF"
                  title="We are building the Fort Worth layer."
                  subtitle="Not hype. Not gatekeeping. Consistent meetups, real crew matching, and a talent directory people can actually use."
                />

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/60">What we do</div>
                    <div className="mt-2 text-sm text-white/80">
                      We host meetups that make it easy to meet collaborators,
                      build trust, and turn conversations into shoots.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/60">Why we exist</div>
                    <div className="mt-2 text-sm text-white/80">
                      As DFW grows, producers need reliable local crews and a
                      visible roster. Independents need access to collaborators.
                      FWF sits in the middle: connecting the local indie scene
                      to a more professional production ecosystem.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/60">
                      Talent spotlight
                    </div>
                    <div className="mt-2 text-sm text-white/80">
                      Our Members page is built like a roster: photo, bio,
                      specialty, and links. It is designed to grow indefinitely
                      so local talent stays discoverable.
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
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

              {/* What success looks like */}
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                <SectionTitle
                  eyebrow="What success looks like"
                  title="More work stays local; more people build careers here."
                  subtitle="DFW wins when productions can staff confidently, and when independents can find collaborators without leaving Texas."
                />

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/60">Crew depth</div>
                    <div className="mt-2 text-sm text-white/80">
                      More trained grips, electrics, camera, art, sound, HMU,
                      and production staff available locally.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/60">
                      Talent retention
                    </div>
                    <div className="mt-2 text-sm text-white/80">
                      More filmmakers and crew can stay in DFW, build reels, and
                      stack credits without relocating to the coasts.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/60">Visibility</div>
                    <div className="mt-2 text-sm text-white/80">
                      Great local work gets screened, shared, staffed, and seen.
                      Not promised, but made more likely through consistency and
                      community.
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm font-semibold">If you are local</div>
                  <p className="mt-2 text-sm text-white/75">
                    Join the Discord, introduce yourself, and drop your role. If
                    you are a director, DP, editor, producer, actor, sound,
                    composer, HMU, grip, electric, art, or anything in between,
                    you belong here.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Footer instagramUrl={LINKS.instagram} discordUrl={LINKS.discord} />
        </div>
      </section>
    </main>
  );
}
