const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuABZ7oeZ14bDMbCeURBpP5BPnrL780ngnZbn6a4aTwx7DkWJg1h_RkVttw0UvnUZ6Oin9Ern_C96cuXc8GqvL1fvIOIQiixwsANIQlusk53at3iyzB36ovwI6X5h4YHXeyS699SXomv9z_BkYtAEXvWOaZjossMUJTsqfqEvX4JgZZbEggm7a3KlebRhZMxO7-HHjacsvDLY1Q3_-fYw8iJ5NkfBpZq8uEk4PVbO_T5sGzcWARvUM6Ls6G6L9nRJUpJ7ZQJBN2-HJwM";

const PREVIEW_IMAGES = [
  {
    title: "The Join Screen",
    tag: "Entry Point",
    accent: "text-violet-300",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeJ3TqXr1MM4QtoiDxBxUhi9YdGNWR6iUjn66eKKk2njeD8OporxSKXHIok1Xl-IpdrIizIgLO0IwNeXtGia1SO8VJ9fi-UOel6tCK0nij5o1W4r2wwEwEP_-czx1ow43fxy6bnwD1yj_MjuDtT-Q_Xg5UYr8oEfIJzfSRAbKAv03Yq621VmTyq9yVLzxUUFcjm0UV-4IdO9vaTnxoHT---woveYMIIKqdEoP4TMcnrP2UhLbbmJYKeX5RsXLJVaWevl0ehMZLdXFc",
  },
  {
    title: "Active Collaboration",
    tag: "Workspace",
    accent: "text-cyan-300",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5S318niuEvriALRhHyLdkB6_Jcz4VtQBk2aWZ28Nis9_WCaRq8JRHiazhFPlVSTmI-Rl5APSWWqs1gHZwZrAnUU0rlMmeR-MDnBW0yc8UtqxSwiutCJxjr0Cp_oRCJQbjZgQAWULQGt8dRMRnhVKR8hSUJnkQWFj217CDT5Mral5w9EwO309h1DzXmVtosmOK8OXTeQALOd9_q5evvGIucsYlampxmH-ZcgR7ADlWhHzQdfcEt9T5wvFcsjY9yf-XC1gHeyiTCy6A",
  },
  {
    title: "Universal Languages",
    tag: "Settings",
    accent: "text-emerald-300",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq3P4WuiVb-gEWy-nUwtzgoU9LKJCf-G1RWCX74FEdQwoZDBpTRA-_d9-fTuz5adestB-EIBfPryk1PtjN2LwCwY9OworJxIM6uy0nVqEBHptAXTwmqcsaUowzQpJMo-p_HhsBt9L7EpzYvgoA3wm0DuDXQzHwnvhqWsgjqDjUaVZhagH_MbaGrDnAj5yZ7-8v4QvN_ggDSBEX-vE49YKHL1jzM5qOTfiLQKtPx8UYZmI37m2zgzg_rmF6_jpJvQ6jAECM-CJwiSQa",
  },
  {
    title: "Export and Deploy",
    tag: "Finish",
    accent: "text-slate-300",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIj1I2jjspi10L2-6XegmJLjcuGqB1EFX9SvTBiZpQi4q-UbIdhL8BOYDLxf8q1uyJQzayTobrOHU1m7XaUBiBU3MkVWsWf5f4LpkjsMlAX9koOvGq_Do45p_weB7UVgqskkJ4D5Y9ZFR3CZk4ITy06hYbNxhiJ7hyyFFIBp7JFHGn3arEAJkgZRTfU9npkGEEGjZR7u63VD7mUAxjEq15AEE_PjRsZlE_iukq5dWcdMFf4qK2V7tImsTuI6HDx5x6O6jVa3vB_n7X",
  },
];

const FEATURE_CARDS = [
  {
    title: "Real-time Sync",
    body: "Code appears for everyone as you type, powered by conflict-free data syncing.",
  },
  {
    title: "User Presence",
    body: "Live participant list with identity colors so teammates are easy to track.",
  },
  {
    title: "Built-in Chat",
    body: "Discuss logic and decisions without leaving the coding room.",
  },
  {
    title: "Language Switcher",
    body: "Switch language for the shared editor and keep everyone on the same mode.",
  },
  {
    title: "Instant Link Share",
    body: "Copy room invite link in one click and bring collaborators in quickly.",
  },
  {
    title: "Smart Export",
    body: "Export current code instantly with language-based file extensions.",
  },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    t: "Pick a name",
    b: "Set your username and room. No account required.",
  },
  {
    n: "02",
    t: "Code Together",
    b: "Share room link and start writing with your team.",
  },
  {
    n: "03",
    t: "Share and Export",
    b: "Keep collaborating in-room, then export instantly.",
  },
];

const PRESENCE_MOCK = [
  { n: "Alex", s: "Editing workspace", c: "border-violet-400" },
  { n: "Sadia", s: "Viewing", c: "border-cyan-400" },
  { n: "John", s: "Typing in chat", c: "border-emerald-400" },
];

const USE_CASE_TAGS = [
  "Pair Programming",
  "Interview Prep",
  "Quick Debugging",
  "Education",
  "Code Reviews",
];

function LandingPage({ onScrollToSection, onStartRoom, onOpenJoinModal, year }) {
  return (
    <div className="min-h-screen bg-[#0d0d14] text-[#e4e1ec]">
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0d0d14]/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => onScrollToSection("hero")}
            className="flex items-center gap-2 text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-black text-white">
              Q
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              QuickPair
            </span>
          </button>

          <div className="hidden items-center gap-8 text-sm font-medium text-[#ccc3d8] md:flex">
            <button
              type="button"
              onClick={() => onScrollToSection("features")}
              className="hover:text-white"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection("how")}
              className="hover:text-white"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection("use-cases")}
              className="hover:text-white"
            >
              Use Cases
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection("docs")}
              className="hover:text-white"
            >
              Docs
            </button>
          </div>
        </div>
      </nav>

      <section id="hero" className="relative overflow-hidden px-6 pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle,rgba(124,58,237,0.28)_1px,transparent_1px)] bg-size-[28px_28px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-125 w-full -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-2">
          <div className="space-y-8 text-center lg:text-left">
            <div className="lp-reveal lp-delay-1 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-[#1b1b22] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.9)]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#ccc3d8]">
                Live - Real-time collaborative coding
              </span>
            </div>

            <h1 className="lp-reveal lp-delay-2 text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              One room.
              <br />
              Every mind.
              <br />
              <span className="text-violet-400">Code live.</span>
            </h1>

            <p className="lp-reveal lp-delay-3 mx-auto max-w-xl text-lg leading-relaxed text-[#ccc3d8] lg:mx-0">
              The fastest way to share your editor. Zero installation, zero
              friction. Just a URL and your collective intelligence.
            </p>

            <div className="lp-reveal lp-delay-4 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={onStartRoom}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_0_rgba(124,58,237,0.0)] transition hover:shadow-[0_0_24px_rgba(124,58,237,0.5)]"
              >
                Start a Room
                <span>-&gt;</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenJoinModal("")}
                className="rounded-full border border-cyan-300/30 bg-[#2a2931] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#34343c]"
              >
                Join a Room
              </button>
            </div>
          </div>

          <div className="relative w-full">
            <div className="absolute inset-0 -z-10 bg-cyan-500/10 blur-[80px]" />
            <div className="lp-reveal lp-delay-2 overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f26]/60 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between bg-[#2a2931] px-4 py-3">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="rounded-md border border-white/10 bg-[#0e0e15] px-3 py-1 text-[10px] text-[#ccc3d8]">
                  quickpair.dev/room/frontend-sprint
                </span>
                <span className="w-8" />
              </div>

              <div className="relative aspect-video p-8">
                <img
                  alt="Editor backdrop"
                  src={HERO_BG}
                  className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm"
                />
                <div className="lp-hero-float relative mx-auto w-full max-w-sm space-y-5 rounded-xl border border-violet-400/30 bg-[#34343c]/85 p-6 text-center backdrop-blur-xl">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 text-xl font-semibold text-violet-300">
                    -&gt;
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Join Room</h3>
                    <p className="text-xs text-[#ccc3d8]">
                      frontend-sprint by @alex_dev
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenJoinModal("frontend-sprint")}
                    className="w-full rounded-full bg-violet-600 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
                  >
                    Join Collaboration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-reveal lp-delay-1 border-y border-white/10 bg-[#1b1b22]/55 py-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          <div className="text-center">
            <div className="font-mono text-2xl font-black text-cyan-300">340+</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[#ccc3d8]">
              Rooms Active
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-black text-violet-300">5s</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[#ccc3d8]">
              Avg Join Time
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-black text-emerald-300">60+</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[#ccc3d8]">
              Countries
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-black text-white">Zero</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-[#ccc3d8]">
              Friction Policy
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="bg-[#0d0d14] px-6 py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="lp-reveal mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold text-white">How it works</h2>
            <p className="mx-auto max-w-xl text-[#ccc3d8]">
              Collaboration should be as simple as sending a link. Three steps
              to synchronization.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, index) => (
              <div
                key={item.n}
                className="lp-reveal relative rounded-xl bg-[#1c1c2e] p-8"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <div className="absolute left-3 top-1 text-5xl font-black text-violet-500/20">
                  {item.n}
                </div>
                <div className="mt-8 space-y-3">
                  <h3 className="text-xl font-bold text-white">{item.t}</h3>
                  <p className="text-sm text-[#ccc3d8]">{item.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#13131a] px-6 py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURE_CARDS.map((card, index) => (
            <article
              key={card.title}
              className="lp-reveal rounded-xl bg-[#1b1b22] p-7 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#2a2931]"
              style={{ animationDelay: `${140 + index * 70}ms` }}
            >
              <h4 className="mb-2 text-lg font-bold text-white">{card.title}</h4>
              <p className="text-sm text-[#ccc3d8]">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="use-cases" className="bg-[#0d0d14] px-6 py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="lp-reveal space-y-6">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Your session. Your identity.
              <span className="block text-violet-400">Always safe.</span>
            </h2>
            <p className="text-[#ccc3d8]">
              Username uniqueness is enforced per room, and refresh-safe
              reconnect keeps you in flow. Build together without identity
              collisions.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Realtime presence active
            </div>
          </div>

          <div
            className="lp-reveal rounded-2xl bg-[#1f1f26] p-6"
            style={{ animationDelay: "180ms" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Presence List</h3>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase text-emerald-300">
                Connected
              </span>
            </div>
            <div className="space-y-3">
              {PRESENCE_MOCK.map((person) => (
                <div
                  key={person.n}
                  className={`flex items-center justify-between rounded-xl bg-[#2a2931] px-4 py-3 border-l-4 ${person.c}`}
                >
                  <span className="text-sm font-medium text-white">{person.n}</span>
                  <span className="text-xs text-[#ccc3d8]">{person.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#13131a] px-6 py-24">
        <div className="lp-reveal mx-auto w-full max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white">Beyond the Editor</h2>
          <p className="mx-auto mt-4 max-w-3xl text-[#ccc3d8]">
            QuickPair removes setup friction so you can focus on logic, not
            logistics. Pair programming, interview prep, debugging, and code
            reviews happen in one shared room.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {USE_CASE_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-[#2a2931] px-4 py-2 text-xs text-[#e4e1ec]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d0d14] px-6 py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2">
          {PREVIEW_IMAGES.map((item, index) => (
            <article
              key={item.title}
              className="lp-reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1f1f26]"
              style={{ animationDelay: `${140 + index * 90}ms` }}
            >
              <img
                src={item.src}
                alt={item.title}
                className="aspect-4/3 w-full object-cover opacity-55 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0d0d14] via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className={`text-[10px] uppercase tracking-[0.25em] ${item.accent}`}>
                  {item.tag}
                </p>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="docs"
        className="relative overflow-hidden bg-linear-to-r from-[#1a1140] to-[#2d186b] px-6 py-28 text-center"
      >
        <div className="lp-reveal mx-auto w-full max-w-4xl">
          <h2 className="text-5xl font-black leading-tight text-white">
            Start a room. Invite someone.
            <span className="block text-violet-300">Ship faster.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[#ddd2f1]">
            No credit card. No sign-up required for room entry. Just create and
            collaborate.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onStartRoom}
              className="rounded-full bg-violet-500 px-8 py-3 font-bold text-white transition hover:bg-violet-400"
            >
              Create a Room
            </button>
            <button
              type="button"
              onClick={() => onOpenJoinModal("")}
              className="rounded-full border border-white/35 bg-white/10 px-8 py-3 font-bold text-white transition hover:bg-white/20"
            >
              Join Existing Room
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#090b12] px-6 py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-black text-white">QuickPair</h3>
            <p className="mt-3 text-sm text-[#ccc3d8]">
              Collaborative coding platform for modern development teams.
            </p>
          </div>
          <div className="space-y-2 text-sm text-[#ccc3d8]">
            <button
              type="button"
              className="block hover:text-white"
              onClick={() => onScrollToSection("features")}
            >
              Features
            </button>
            <button
              type="button"
              className="block hover:text-white"
              onClick={() => onScrollToSection("how")}
            >
              How It Works
            </button>
            <button
              type="button"
              className="block hover:text-white"
              onClick={() => onScrollToSection("use-cases")}
            >
              Use Cases
            </button>
          </div>
          <div className="space-y-2 text-sm text-[#ccc3d8]">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="block hover:text-white"
            >
              GitHub
            </a>
            <button
              type="button"
              className="block hover:text-white"
              onClick={() => onScrollToSection("docs")}
            >
              Documentation
            </button>
            <button
              type="button"
              className="block hover:text-white"
              onClick={() => onOpenJoinModal("")}
            >
              Launch App
            </button>
          </div>
        </div>
        <div className="mx-auto mt-8 w-full max-w-7xl text-xs text-[#8f8aa0]">
          (c) {year} QuickPair
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
