import { useEffect, useMemo, useRef, useState } from "react";
import { translations } from "./translations";
import formalPhoto from "./assets/mahdiyeh-formal.jpg";
import portraitPhoto from "./assets/mahdiyeh-portrait.jpg";

/* ---------------- helpers ---------------- */
const localize = (str, isRTL) => {
  if (!isRTL || typeof str !== 'string') return str;
  return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

/* ---------------- motion helpers ---------------- */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function CountUp({ value, decimals = 0, suffix = "", duration = 1400, isRTL = false }) {
  const ref = useRef(null); const [display, setDisplay] = useState("0");
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const finalVal = value.toFixed(decimals);
      if (reduce) return setDisplay(isRTL ? localize(finalVal, true) + suffix : finalVal + suffix);
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / duration); const eased = 1 - Math.pow(1 - p, 3);
        const currentVal = (value * eased).toFixed(decimals);
        setDisplay(isRTL ? localize(currentVal, true) + suffix : currentVal + suffix);
        if (p < 1) requestAnimationFrame(step);
        else setDisplay(isRTL ? localize(finalVal, true) + suffix : finalVal + suffix);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [value, decimals, duration, isRTL]);
  return <span ref={ref}>{display}</span>;
}

function useScramble(text) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glyphs = "01<>/*#+—▪";
    let frame = 0; let raf;
    const tick = () => {
      frame += 1; const settled = Math.max(0, Math.floor((frame - 12) / 2));
      setOut(text.split("").map((ch, i) => (ch === " " || ch === "×" || i < settled ? ch : glyphs[(Math.random() * glyphs.length) | 0])).join(""));
      if (settled < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return out;
}

/* ---------------- animated sensor signal ---------------- */
const P = 1200;
function trace(seed, amp, base) {
  const pts = [];
  for (let x = 0; x <= P; x += 6) {
    const t = (x / P) * Math.PI * 2;
    let y = base + Math.sin(t * 3 + seed) * amp * 0.55 + Math.sin(t * 9 + seed * 1.7) * amp * 0.3 + Math.sin(t * 21 + seed * 3.1) * amp * 0.18;
    const m = x % 300;
    if (m > 120 && m < 168) y += Math.sin((Math.PI * (m - 120)) / 48) * Math.sin((m - 120) * 0.9) * amp * 1.8;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}

function Signal({ isRTL }) {
  const traces = useMemo(() => [
    { d: trace(1.2, 16, 40), cls: "stroke-azure" },
    { d: trace(3.7, 20, 110), cls: "stroke-spark" },
    { d: trace(6.1, 12, 178), cls: "stroke-fog" },
  ], []);
  return (
    <div className="relative">
      <svg viewBox="0 0 1200 220" preserveAspectRatio="none" className={`h-36 w-full md:h-52 ${isRTL ? 'scale-x-[-1]' : ''}`} aria-hidden="true">
        <g className="signal-track">
          {traces.map((t, i) => (
            <g key={i}>
              <path d={t.d} fill="none" strokeWidth="1.6" className={t.cls} opacity=".85" />
              <path d={t.d} fill="none" strokeWidth="1.6" className={t.cls} opacity=".85" transform="translate(1200 0)" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---------------- small building blocks ---------------- */
function Chip({ children, dark = false }) {
  return <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${dark ? "border-paper/20 text-fog" : "border-mist bg-paper text-dusk"}`}>{children}</span>;
}

function SectionHead({ index, kicker, title, dark = false, isRTL = false }) {
  return (
    <Reveal>
      <div className={`flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] ${dark ? "text-spark" : "text-azure"}`}>
        <span>{localize(index, isRTL)}</span>
        <span className={`h-px w-12 ${dark ? "bg-spark/40" : "bg-azure/40"}`} />
        <span className={dark ? "text-fog" : "text-dusk"}>{kicker}</span>
      </div>
      <h2 className={`mask mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl ${dark ? "text-paper" : "text-ink"}`}>
        <span>{title}</span>
      </h2>
    </Reveal>
  );
}

function Fact({ k, v, isRTL }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-4">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-dusk">{k}</dt>
      <dd className={`break-all text-sm font-medium text-ink ${isRTL ? 'text-left' : 'text-right'}`}>{v}</dd>
    </div>
  );
}

/* ---------------- nav ---------------- */
function Nav({ t, isRTL, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScrolled(h.scrollTop > 30);
      setProgress(h.scrollTop / (h.scrollHeight - h.clientHeight));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = [...document.querySelectorAll("section[id]")];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? "border-b border-paper/10 bg-deep/85 backdrop-blur-md" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-azure font-display text-sm font-bold text-white shadow-sm">
            {isRTL ? "م.و" : "MV"}
          </span>
          <span className="hidden font-mono text-sm text-paper sm:block">
            {isRTL ? "مهدیه" : "mahdiyeh"}<span className="text-spark">.</span>{isRTL ? "ولیان" : "valian"}
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {Object.entries(t.nav).filter(([k]) => k !== "resume").map(([key, label]) => (
            <a key={key} href={`#${key}`} className={`nav-link font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${active === key ? "active text-spark" : "text-fog hover:text-paper"}`}>
              {label}
            </a>
          ))}
          <a
            href="/Mahdiyeh-Valian-CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-spark hover:text-white border border-spark/40 hover:border-spark bg-spark/10 px-3.5 py-1 rounded-full transition flex items-center gap-1.5 shadow-sm"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {t.nav.resume || "Resume"}
          </a>
          <button onClick={() => setLang(lang === "en" ? "fa" : "en")} className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog hover:text-spark border border-paper/20 px-3 py-1 rounded-full transition">
            {lang === "en" ? "FA" : "EN"}
          </button>
        </div>

        <button className="text-paper md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 px-6 pb-6 md:hidden">
          {Object.entries(t.nav).filter(([k]) => k !== "resume").map(([key, label]) => (
            <a key={key} href={`#${key}`} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-fog transition hover:bg-paper/5 hover:text-spark">
              {label}
            </a>
          ))}
          <a
            href="/Mahdiyeh-Valian-CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-spark transition hover:bg-paper/5 flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            {t.nav.resume || "Resume (PDF)"}
          </a>
          <button onClick={() => setLang(lang === "en" ? "fa" : "en")} className="rounded-md px-3 py-2.5 text-start font-mono text-xs uppercase tracking-[0.2em] text-fog transition hover:bg-paper/5 hover:text-spark">
            {lang === "en" ? "FA / فارسی" : "EN / English"}
          </button>
        </div>
      )}

      <div className="h-[2px]">
        <div className="h-full bg-spark" style={{ width: `${progress * 100}%` }} />
      </div>
    </nav>
  );
}

/* ---------------- sections ---------------- */
function Hero({ t, isRTL }) {
  const decoded = useScramble(t.hero.decoded);
  const heroStats = [
    { value: 3.19, decimals: 2, suffix: "", label: t.hero.stats[0].label },
    { value: 4.0, decimals: 1, suffix: "", label: t.hero.stats[1].label },
    { value: 7, decimals: 0, suffix: "+", label: t.hero.stats[2].label },
    { value: 7, decimals: 0, suffix: "", label: t.hero.stats[3].label },
  ];

  return (
    <header className="relative overflow-hidden bg-deep text-paper">
      <div className="grid-bg absolute inset-0" aria-hidden="true" />
      <div className="noise absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-azure/15 blur-[130px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-32 md:pt-40">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fog">
              <span className="blip text-spark">●</span>
              {t.site.availability}
              <span className="text-paper/30">/</span>
              {t.site.location}
            </p>

            <h1 className="mt-8 font-display font-bold leading-[0.95] tracking-tight">
              <span className="block text-6xl md:text-8xl">{t.site.name.split(" ")[0]}</span>
              <span className="text-outline block text-6xl md:text-8xl">{t.site.name.split(" ")[1] || ""}</span>
            </h1>

            <p className="mt-6 font-mono text-xs tracking-[0.35em] text-spark md:text-sm">&gt; {decoded}</p>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-fog md:text-lg">
              {t.site.summary} {t.site.summaryExtra}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#research" className="bg-azure px-7 py-3.5 font-mono text-sm text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-azure-deep">
                {t.hero.explore}
              </a>
              <a href={`mailto:${t.site.email}`} className="border border-paper/25 px-7 py-3.5 font-mono text-sm text-paper transition hover:-translate-y-0.5 hover:border-spark hover:text-spark">
                {t.hero.touch}
              </a>
              <a
                href="/Mahdiyeh-Valian-CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-spark/50 bg-spark/10 px-6 py-3.5 font-mono text-sm text-spark transition hover:-translate-y-0.5 hover:bg-spark hover:text-deep flex items-center gap-2 font-medium shadow-lift"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
                {t.hero.downloadCv}
              </a>
            </div>
          </div>

          {/* Hero Profile Photo Card */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <Reveal delay={150}>
              <div className="relative overflow-hidden rounded-2xl border border-paper/15 bg-paper/5 p-3 shadow-2xl backdrop-blur-md transition duration-500 hover:border-spark/40 hover:shadow-glow group">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-ink">
                  <img
                    src={formalPhoto}
                    alt={t.site.name}
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/20 to-transparent" />
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between font-mono text-[10px] text-spark">
                    <span className="rounded-full bg-deep/80 px-2.5 py-1 backdrop-blur-md border border-spark/30">
                      ● {isRTL ? "پژوهشگر هوش مصنوعی" : "AI Researcher"}
                    </span>
                    <span className="rounded-full bg-deep/80 px-2.5 py-1 text-fog border border-paper/20">
                      MSc · AI
                    </span>
                  </div>
                  <div className="absolute bottom-4 inset-x-4 flex items-end justify-between">
                    <div>
                      <div className="font-display text-xl font-bold text-white">{t.site.name}</div>
                      <div className="font-mono text-xs text-spark">{t.site.role}</div>
                    </div>
                    <a
                      href="/Mahdiyeh-Valian-CV.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-azure/90 px-3 py-1.5 font-mono text-xs text-white hover:bg-azure border border-white/20 shadow-md backdrop-blur-md transition hover:-translate-y-0.5"
                    >
                      <span>CV</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-paper/10 pt-8 md:grid-cols-4">
          {heroStats.map((s, i) => (
            <div key={i}>
              <div className="font-display text-3xl font-bold md:text-4xl">
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} isRTL={isRTL} />
              </div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className={`mb-2 flex gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-fog ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <span><i className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-azure align-middle" />{t.hero.signals[0]}</span>
          <span><i className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-spark align-middle" />{t.hero.signals[1]}</span>
          <span><i className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-fog align-middle" />{t.hero.signals[2]}</span>
        </div>
      </div>
      <Signal isRTL={isRTL} />
    </header>
  );
}

function About({ t, isRTL }) {
  const [photoView, setPhotoView] = useState("academic");
  const currentPhoto = photoView === "academic" ? portraitPhoto : formalPhoto;

  return (
    <section id="about" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead index="01" kicker={t.about.kicker} title={t.about.title} isRTL={isRTL} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6 self-start lg:sticky lg:top-28">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-paper shadow-lift border border-paper/10">
                <div className="grid-bg absolute inset-0 opacity-60" />
                <div className="relative">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-fog">
                    <span>{t.about.portrait}</span>
                    <div className="flex gap-1 bg-paper/10 p-0.5 rounded-lg border border-paper/10">
                      <button
                        onClick={() => setPhotoView("academic")}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition ${photoView === "academic" ? "bg-spark text-deep font-bold" : "text-fog hover:text-paper"}`}
                      >
                        {t.about.photoLabels.academic}
                      </button>
                      <button
                        onClick={() => setPhotoView("formal")}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition ${photoView === "formal" ? "bg-spark text-deep font-bold" : "text-fog hover:text-paper"}`}
                      >
                        {t.about.photoLabels.formal}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-paper/15 shadow-inner group">
                    <img
                      src={currentPhoto}
                      alt={t.site.name}
                      key={photoView}
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  </div>

                  <svg viewBox="0 0 300 36" className="mt-4 h-8 w-full" aria-hidden="true">
                    <path d="M0 18 L20 18 L28 6 L36 30 L44 18 L80 18 L90 8 L100 28 L110 18 L150 18 L160 2 L170 34 L180 18 L220 18 L230 10 L240 26 L250 18 L300 18" fill="none" strokeWidth="1.5" className="stroke-azure" />
                  </svg>

                  <div className="mt-4 border-t border-paper/10 pt-4 flex items-center justify-between font-mono text-[11px] text-fog">
                    <div>
                      <div className="font-display text-base font-bold text-white">{t.site.name}</div>
                      <div>{t.site.role} · {t.site.location}</div>
                    </div>
                    <a
                      href="/Mahdiyeh-Valian-CV.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-spark/40 bg-spark/10 px-3 py-1.5 font-mono text-xs text-spark hover:bg-spark hover:text-deep transition"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <dl className="divide-y divide-mist rounded-xl border border-mist bg-white px-6 shadow-sm">
                <Fact k={t.about.facts.location} v={t.site.location} isRTL={isRTL} />
                <Fact k={t.about.facts.email} v={t.site.email} isRTL={isRTL} />
                <Fact k={t.about.facts.languages} v={t.about.langs} isRTL={isRTL} />
                <Fact k={t.about.facts.lab} v={t.about.labName} isRTL={isRTL} />
              </dl>
            </Reveal>
          </div>

          <div>
            <Reveal><p className="text-lg leading-relaxed text-dusk md:text-xl">{t.about.paragraphs[0]}</p></Reveal>
            <Reveal delay={120}><p className="mt-6 text-lg leading-relaxed text-dusk">{t.about.paragraphs[1]}</p></Reveal>

            <Reveal delay={200}>
              <div className="mt-10">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-azure">{t.about.focus}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {t.focusAreas.map((f) => <Chip key={f}>{f}</Chip>)}
                </div>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <blockquote className={`mt-12 border-azure ${isRTL ? 'border-r-2 pr-6' : 'border-l-2 pl-6'}`}>
                <p className="font-display text-2xl font-medium leading-snug text-ink">{t.about.quote}</p>
                <cite className="mt-3 block font-mono text-[11px] uppercase tracking-[0.25em] text-dusk not-italic">{t.about.quoteCite}</cite>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResearchCard({ r, isRTL }) {
  const dark = r.id === "R.01";
  return (
    <div className={`relative overflow-hidden rounded-xl p-8 shadow-lift md:p-12 ${dark ? "bg-ink text-paper" : "border border-mist bg-paper text-ink"}`}>
      <span className={`pointer-events-none absolute -top-8 font-display text-[120px] font-bold ${dark ? "text-paper/5" : "text-ink/5"} ${isRTL ? 'left-0' : 'right-0'}`}>
        {localize(r.id, isRTL)}
      </span>
      <div className={`flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] ${dark ? "text-spark" : "text-azure"}`}>
        <span>{r.tag}</span>
        <span className={dark ? "text-fog" : "text-dusk"}>· {localize(r.period, isRTL)}</span>
      </div>
      <h3 className="mt-5 max-w-3xl font-display text-2xl font-bold leading-snug md:text-4xl">{r.title}</h3>
      <p className={`mt-3 font-mono text-xs ${dark ? "text-fog" : "text-dusk"}`}>
        {r.org} — {r.supervisor}
      </p>
      <p className={`mt-5 max-w-2xl leading-relaxed ${dark ? "text-fog" : "text-dusk"}`}>{r.desc}</p>
      <div className="mt-7 flex flex-wrap items-center gap-2">
        {r.chips.map((c) => <Chip key={c} dark={dark}>{c}</Chip>)}
        {r.grade && (
          <span className="rounded-full bg-azure px-4 py-1.5 font-mono text-[11px] text-white md:ml-auto">
            {localize(r.grade, isRTL)}
          </span>
        )}
      </div>
    </div>
  );
}

function Research({ t, isRTL }) {
  return (
    <section id="research" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead index="02" kicker={t.research.kicker} title={t.research.title} isRTL={isRTL} />
        <div className="mt-12 space-y-8">
          {t.research.items.map((r, i) => (
            <article key={r.id} className="sticky" style={{ top: `${96 + i * 22}px` }}>
              <ResearchCard r={r} isRTL={isRTL} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CourseProjects({ t, isRTL }) {
  return (
    <section id="projects" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead index="03" kicker={t.projects.kicker} title={t.projects.title} isRTL={isRTL} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {t.projects.items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 110} className="h-full">
              <article className="group h-full rounded-xl border border-mist bg-white p-8 transition duration-300 hover:-translate-y-1.5 hover:border-azure/50 hover:shadow-lift">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.22em]">
                  <span className="text-azure">{localize(p.id, isRTL)}</span>
                  <span className="text-dusk">{p.course}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-dusk">{p.blurb}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.chips.map((c) => <Chip key={c}>{c}</Chip>)}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({ t, isRTL }) {
  return (
    <section id="experience" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead index="04" kicker={t.experience.kicker} title={t.experience.title} isRTL={isRTL} />
        <ol className={`relative mt-14 space-y-14 border-mist ${isRTL ? 'mr-2 border-r pr-10' : 'ml-2 border-l pl-10'}`}>
          {t.experience.items.map((job, i) => (
            <li key={job.company} className="relative">
              <span className={`absolute top-2 h-3 w-3 rounded-full bg-azure ring-4 ring-white ${isRTL ? '-right-[45.5px]' : '-left-[45.5px]'}`} />
              <Reveal delay={i * 100}>
                <div className="font-mono text-xs tracking-[0.2em] text-azure">{localize(job.period, isRTL)}</div>
                <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">{job.role}</h3>
                <div className="mt-1 font-medium text-dusk">{job.company}</div>
                <ul className="mt-5 max-w-2xl space-y-2.5 text-dusk">
                  {job.points.map((pt) => (
                    <li key={pt} className="flex gap-3 leading-relaxed">
                      <span className="mt-[11px] h-px w-5 shrink-0 bg-azure" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.chips.map((c) => <Chip key={c}>{c}</Chip>)}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Education({ t, isRTL }) {
  return (
    <section id="education" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead index="05" kicker={t.education.kicker} title={t.education.title} isRTL={isRTL} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {t.education.items.map((ed, i) => (
            <Reveal key={ed.school} delay={i * 120} className="h-full">
              <article className="h-full rounded-xl border border-mist bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="font-mono text-xs tracking-[0.2em] text-azure">{localize(ed.period, isRTL)}</div>
                <h3 className="mt-4 font-display text-2xl font-bold leading-snug">{ed.degree}</h3>
                <div className="mt-2 text-dusk">{ed.school} · {ed.location}</div>

                <div className="mt-6">
                  <div className="font-mono text-[11px] text-dusk">{localize(ed.gpaLabel, isRTL)}</div>
                  <div className="gpa-bar mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
                    <span className="block h-full rounded-full bg-azure" style={{ width: `${(ed.gpa / 4) * 100}%` }} />
                  </div>
                </div>

                {ed.advisor && <div className="mt-5 font-mono text-xs text-dusk">{ed.advisor}</div>}
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-dusk">
                  {ed.notes.map((n) => (
                    <li key={n} className="flex gap-3"><span className="text-azure">–</span>{n}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills({ t, isRTL }) {
  return (
    <section id="skills" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead index="06" kicker={t.skills.kicker} title={t.skills.title} isRTL={isRTL} />
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {t.skills.groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 90}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-azure">{g.title}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span key={item} className="cursor-default rounded-full border border-mist bg-paper px-3.5 py-1.5 font-mono text-xs text-ink transition duration-200 hover:-translate-y-0.5 hover:border-azure hover:text-azure">
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function References({ t, isRTL }) {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHead index="07" kicker={t.references.kicker} title={t.references.title} isRTL={isRTL} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {t.references.items.map((ref, i) => (
            <Reveal key={ref.name} delay={i * 120} className="h-full">
              <article className="flex h-full items-start gap-5 rounded-xl border border-mist bg-white p-8">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink font-display text-lg font-bold text-spark">
                  {localize(ref.initials, isRTL)}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold">{ref.name}</h3>
                  <p className="mt-1 text-sm text-dusk">{ref.org}</p>
                  <div className="mt-4 flex gap-6">
                    {ref.links.map((l) => (
                      <a key={l.label} href={l.href} className="group font-mono text-xs text-azure transition hover:text-azure-deep">
                        {l.label}{" "}
                        <span className="inline-block transition-transform group-hover:-translate-y-0.5">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactRow({ label, value, href, isRTL }) {
  const inner = (
    <>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">{label}</span>
      <span className={`text-paper transition group-hover:text-spark ${isRTL ? 'text-left' : 'text-right'}`}>{value}</span>
    </>
  );
  return href ? (
    <a href={href} className="group flex items-center justify-between gap-6 py-5">{inner}</a>
  ) : (
    <div className="group flex items-center justify-between gap-6 py-5">{inner}</div>
  );
}

function Contact({ t, isRTL }) {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-deep text-paper">
      <div className="noise absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <div className="overflow-hidden border-b border-paper/10 py-4">
          <div className="marquee-track flex w-max">
            {[...t.marqueeItems, ...t.marqueeItems].map((m, i) => (
              <span key={i} className="mx-5 flex items-center gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.35em] text-fog">
                {m} <span className="text-spark">✦</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:py-32 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHead dark index="08" kicker={t.contact.kicker} title={t.contact.title} isRTL={isRTL} />
            <p className="mt-6 max-w-md leading-relaxed text-fog">{t.contact.desc}</p>
            <a href={`mailto:${t.site.email}`} className="group mt-10 inline-block break-all font-display text-2xl font-bold transition hover:text-spark md:text-4xl">
              {t.site.email}
              <span className="mt-2 block h-[2px] w-full origin-left scale-x-0 bg-spark transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          </div>

          <div className="self-center">
            <div className="divide-y divide-paper/10 border-y border-paper/10">
              <ContactRow label={t.contact.labels.email} value={t.site.email} href={`mailto:${t.site.email}`} isRTL={isRTL} />
              <ContactRow label={t.contact.labels.phone} value={t.site.phone} href={`tel:${t.site.phone.replace(/\s/g, "")}`} isRTL={isRTL} />
              <ContactRow label={t.contact.labels.location} value={t.site.location} isRTL={isRTL} />
              <ContactRow label={t.contact.labels.linkedin} value={t.contact.linkedinVal} href="#" isRTL={isRTL} />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/Mahdiyeh-Valian-CV.pdf"
                download="Mahdiyeh-Valian-CV.pdf"
                className="inline-flex items-center gap-3 bg-azure px-6 py-3.5 font-mono text-sm text-white transition hover:-translate-y-0.5 hover:bg-azure-deep shadow-lift"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {t.contact.download}
              </a>
              <a
                href="/Mahdiyeh-Valian-CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-paper/20 px-5 py-3.5 font-mono text-sm text-paper transition hover:-translate-y-0.5 hover:border-spark hover:text-spark"
              >
                {t.contact.view}
              </a>
            </div>
          </div>
        </div>

        <footer className="border-t border-paper/10 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 font-mono text-[11px] text-fog md:flex-row">
            <span>{t.contact.footer[0]}</span>
            <span>{t.contact.footer[1]}</span>
            <a href="#top" className="transition hover:text-spark">{t.contact.footer[2]}</a>
          </div>
        </footer>
      </div>
    </section>
  );
}

/* ---------------- app ---------------- */
export default function App() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const isRTL = t.dir === "rtl";

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
    if (isRTL) document.body.classList.add("rtl");
    else document.body.classList.remove("rtl");
  }, [lang, t.dir, isRTL]);

  return (
    <div id="top" className="bg-paper text-ink">
      <Nav t={t} isRTL={isRTL} lang={lang} setLang={setLang} />
      <Hero t={t} isRTL={isRTL} />
      <About t={t} isRTL={isRTL} />
      <Research t={t} isRTL={isRTL} />
      <CourseProjects t={t} isRTL={isRTL} />
      <Experience t={t} isRTL={isRTL} />
      <Education t={t} isRTL={isRTL} />
      <Skills t={t} isRTL={isRTL} />
      <References t={t} isRTL={isRTL} />
      <Contact t={t} isRTL={isRTL} />
    </div>
  );
}