import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, DiscordIcon } from "@/components/icons";
import Footer from "@/components/footer";
import Header from "@/components/header";

const LINKS = {
  instagram: "https://www.instagram.com/fortworthfilmmakers",
  discord: "https://discord.gg/aJrsuTHg5Z",
  roster: "https://fwfilmmakers.org/roster",
  directory: "https://fwfilmmakers.org/directory",
  tools: "https://fwfilmmakers.org/tools",
  nonUnionCalc: "https://fwfilmmakers.org/tools/nonunioncalc",
};

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full",
        "bg-white/0 px-2.5 py-1 text-[11px] leading-none text-white/60",
        "ring-1 ring-white/10",
        className,
      ].join(" ")}
    >
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

function Card({
  title,
  eyebrow,
  children,
}: {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {eyebrow || title ? (
        <div className="mb-4">
          {eyebrow ? (
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              {eyebrow}
            </div>
          ) : null}
          {title ? (
            <h3 className="mt-2 text-lg font-semibold">{title}</h3>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function Bullet({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/75">{body}</div>
    </div>
  );
}

function Divider() {
  return <div className="my-10 h-px w-full bg-white/10" />;
}

function LinkCard({
  href,
  label,
  caption,
}: {
  href: string;
  label: string;
  caption: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start justify-between gap-3 rounded-2xl border border-white/12 bg-black/30 px-4 py-3 hover:bg-white/5"
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="mt-1 text-xs text-white/60">{caption}</div>
      </div>
      <div className="mt-0.5 shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 group-hover:bg-white/10">
        Open
      </div>
    </Link>
  );
}

export default function AboutPage() {
  return (
    <div className="film-grain relative flex min-h-screen flex-col overflow-hidden bg-[#05060a] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-52 right-[-120px] h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(0,0,0,0.85)]" />
      </div>

      {/* Top nav */}
      <Header activeHref="/about" />

      <main className="relative z-10 flex-1 overflow-x-hidden">
        {/* Hero */}
        <section>
          <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-6 sm:pt-10">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="relative mx-auto h-52 w-52 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:h-64 sm:w-64 lg:mx-0">
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

              <div className="lg:col-span-8 min-w-0">
                {/* MOBILE: simple metadata line (no pills, no nav confusion) */}
                <div className="sm:hidden flex flex-wrap items-center text-[11px] leading-snug text-white/55">
                  {[
                    "Fort Worth",
                    "Indie-first",
                    "Meetups",
                    "Open roster",
                    "Directory",
                    "Tools",
                    "Learn. Collaborate. Scale.",
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
                <div className="hidden sm:flex sm:flex-wrap sm:gap-2">
                  <Pill>Fort Worth</Pill>
                  <Pill>Indie-first</Pill>
                  <Pill>Meetups</Pill>
                  <Pill>Open roster</Pill>
                  <Pill>Directory</Pill>
                  <Pill>Tools</Pill>
                  <Pill>Learn. Collaborate. Scale.</Pill>
                </div>

                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                  A growing industry needs a stronger local pipeline.
                </h1>

                <p className="mt-5 max-w-2xl text-pretty text-base text-white/70 sm:text-lg">
                  As production expands in North Texas, the next challenge is
                  depth: trained crews, discoverable talent, and independent
                  projects that can grow into financeable, distributable films.
                  FWF focuses on building that pipeline through community,
                  collaboration, and consistency.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={LINKS.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    Follow on Instagram
                  </Link>

                  <Link
                    href={LINKS.discord}
                    target="_blank"
                    rel="noreferrer"
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

        {/* Story flow */}
        <section>
          <div className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-6">
            {/* Chapter 1 */}
            <Card
              eyebrow="Chapter 1: The moment"
              title="Fort Worth and North Texas are entering a real production era."
            >
              <p className="text-sm text-white/70">
                The region is seeing new infrastructure, more projects, and more
                attention. That momentum is a good thing. When major players
                build here, it brings work, training opportunities, and proof
                that Texas can support scale.
              </p>

              <p className="mt-4 text-sm text-white/70">
                The next step is making sure the growth is durable: deep local
                crews, discoverable talent, and an indie pipeline that can
                develop new filmmakers into professionals who can deliver on
                larger projects.
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
                <div className="text-xs text-white/60">The opportunity</div>
                <div className="mt-2 text-sm text-white/80">
                  This is a rare window: more productions are looking at Texas,
                  and more Texans are considering film as a real path. A strong
                  community turns that moment into careers.
                </div>
              </div>
            </Card>

            <Divider />

            {/* Chapter 2 */}
            <Card
              eyebrow="Chapter 2: The gap"
              title="Growth alone does not guarantee local opportunity."
            >
              <p className="text-sm text-white/70">
                Even in a boom, it is common for specialized roles and entire
                departments to be staffed from out of state. It is also common
                for funding to cluster around the most visible, proven entities.
                That is not villainy. It is how risk works in film.
              </p>

              <p className="mt-4 text-sm text-white/70">
                Our goal is to widen the funnel in a constructive way: make
                Texas talent easier to find, easier to trust, and easier to
                hire; help new filmmakers get their footing; and help the
                strongest indie projects become financeable and distributable.
              </p>

              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                <Bullet
                  title="Local crews need visibility"
                  body={
                    <>
                      Great crew work exists here, but it can be fragmented and
                      hard to discover. We help make local talent legible: who
                      does what, where to see their work, and how to contact
                      them.
                    </>
                  }
                />
                <Bullet
                  title="Indie projects need a pathway"
                  body={
                    <>
                      It is not enough to make something, you also need a plan:
                      packaging, budgets, pitch clarity, and the right
                      relationships. We help people learn the steps and meet the
                      right collaborators.
                    </>
                  }
                />
              </div>
            </Card>

            <Divider />

            {/* Chapter 3 */}
            <Card
              eyebrow="Chapter 3: Who we are"
              title="FWF is a connector: not a production company, not a closed club."
            >
              <p className="text-sm text-white/70">
                Fort Worth Filmmakers exists to connect people and compound
                momentum. We do not produce projects as an organization. We
                support creators at every level, then help the most promising
                work rise through consistency, community, and craft.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs text-white/60">What we believe</div>
                <div className="mt-2 text-sm text-white/80">
                  Low and no budget filmmaking matters because it creates
                  filmmakers. Meetups matter because trust staffs sets.
                  Screenings matter because audiences prove demand. Funding
                  matters because paid work keeps talent here.
                </div>
              </div>
            </Card>

            <Divider />

            {/* Chapter 4 */}
            <Card
              eyebrow="Chapter 4: What we do"
              title="A simple system that compounds every month."
            >
              <div className="grid gap-3">
                <Bullet
                  title="Meetups that turn into crews"
                  body={
                    <>
                      We host meetups designed to convert conversation into
                      collaboration. You meet people by role, find your next
                      crew, and build relationships that make set life smoother.
                    </>
                  }
                />

                <Bullet
                  title="A roster producers can actually use"
                  body={
                    <>
                      Our roster is built like a directory: photo, role,
                      specialty, and links. It is free to get listed on. The
                      goal is discoverable talent that is easy to contact, easy
                      to vet, and easy to staff.
                    </>
                  }
                />

                <Bullet
                  title="A directory built for collaboration"
                  body={
                    <>
                      We maintain a directory of organizations, contests,
                      programs, and communities across the region, with clear
                      ways to contact them. Our goal is to collaborate with the
                      ecosystem, not fragment it.
                    </>
                  }
                />

                <Bullet
                  title="Tools that remove friction"
                  body={
                    <>
                      We build practical tools for filmmakers and producers. The
                      first is a non-union rate calculator, and we are happy to
                      create new tools as the community suggests them.
                    </>
                  }
                />

                <Bullet
                  title="Support for the indie pipeline"
                  body={
                    <>
                      We encourage beginners and weekend filmmakers to make
                      films with their friends and screen them. That layer is
                      essential. It grows taste, skills, and discipline, and it
                      helps serious talent rise naturally.
                    </>
                  }
                />

                <Bullet
                  title="Education toward funding and distribution"
                  body={
                    <>
                      When a project is ready to scale, we help creators
                      understand what “financeable” looks like: packaging,
                      budgets, pitch materials, and the relationships that move
                      a project toward theatrical and streaming opportunities.
                    </>
                  }
                />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <LinkCard
                  href={LINKS.roster}
                  label="Roster"
                  caption="Free listing: crew, talent, and creatives"
                />
                <LinkCard
                  href={LINKS.directory}
                  label="Directory"
                  caption="Organizations, contests, programs, plus contact info"
                />
                <LinkCard
                  href={LINKS.tools}
                  label="Tools"
                  caption="Resources built with the community"
                />
                <LinkCard
                  href={LINKS.nonUnionCalc}
                  label="Non-Union Rate Calculator"
                  caption="Our first tool, with more to come"
                />
              </div>
            </Card>

            <Divider />

            {/* Chapter 5 */}
            <Card
              eyebrow="Chapter 5: Who this is for"
              title="If you want to work in film in Texas, you belong here."
            >
              <div className="mt-2 grid gap-3 lg:grid-cols-2">
                <Bullet
                  title="New to film"
                  body={
                    <>
                      Come learn the landscape: departments, set etiquette,
                      where opportunities live, and how to start helping on real
                      projects. The fastest way in is proximity to working
                      people.
                    </>
                  }
                />
                <Bullet
                  title="Indie filmmakers"
                  body={
                    <>
                      Find collaborators, build repeat teams, improve your work
                      through feedback and screenings, and learn how to package
                      projects that can grow beyond “no budget.”
                    </>
                  }
                />
                <Bullet
                  title="Crew and working pros"
                  body={
                    <>
                      Get discoverable, meet producers and department leads, and
                      help strengthen local hiring by showing what Texas crews
                      can do.
                    </>
                  }
                />
                <Bullet
                  title="Audience and supporters"
                  body={
                    <>
                      Show up to screenings and bring friends. If we want
                      powerful indie films on big screens, we need rooms that
                      feel alive.
                    </>
                  }
                />
              </div>
            </Card>

            <Divider />

            {/* Chapter 6 */}
            <Card
              eyebrow="Chapter 6: What success looks like"
              title="More paid work here; more great films from here."
            >
              <div className="grid gap-3 lg:grid-cols-3">
                <Bullet
                  title="More local hiring"
                  body={
                    <>
                      More productions staff Texas crew because the talent is
                      visible, proven, and connected.
                    </>
                  }
                />
                <Bullet
                  title="Better projects"
                  body={
                    <>
                      The indie layer stays active, and the best work
                      consistently rises to larger budgets and larger audiences.
                    </>
                  }
                />
                <Bullet
                  title="Packed screenings"
                  body={
                    <>
                      Local audiences show up for independent films, which
                      creates momentum for broader distribution.
                    </>
                  }
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-semibold">
                  If you take one step
                </div>
                <p className="mt-2 text-sm text-white/75">
                  Join the Discord, introduce yourself, post your role, then
                  come to a meetup. This is a storytelling profession; community
                  is how the story gets made.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={LINKS.discord}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90"
                >
                  <DiscordIcon className="h-4 w-4" />
                  Join the Discord
                </Link>
                <Link
                  href={LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Follow on Instagram
                </Link>
              </div>
            </Card>

            <div className="h-10" />
          </div>
        </section>
      </main>

      <Footer instagramUrl={LINKS.instagram} discordUrl={LINKS.discord} />
    </div>
  );
}
