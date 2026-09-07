import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  Download,
  Eye,
  EyeOff,
  Hand,
  Info,
  Lock,
  MessageSquare,
  Mic,
  LayoutDashboard,
  MicOff,
  MonitorUp,
  MoreVertical,
  PhoneOff,
  SendHorizonal,
  ShieldCheck,
  Smile,
  Sparkles,
  Sun,
  Moon,
  Users,
  Video,
  VideoOff,
  Shield,
} from "lucide-react";
import { buildContext, firewall, TOKENS, type Field } from "@/lib/privacy";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";
import veilLogo from "@/assets/veil-logo.jpg";
import avatar5 from "@/assets/avatar-5.jpg";
import avatar6 from "@/assets/avatar-6.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veil — Privacy Agent for Browsing and Meetings" },
      {
        name: "description",
        content:
          "Veil reads your page or meeting locally, redacts personal data before any network request, sends only sanitized context to the model, and executes the action back in your browser.",
      },
      { property: "og:title", content: "Veil — Privacy Agent for Browsing and Meetings" },
      {
        property: "og:description",
        content: "Local analysis, local redaction, privacy firewall, server reasoning, local action execution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const INITIAL: Field[] = [
  { ref: "fullname", label: "Full Name", value: "Jane Doe", inputType: "text", hintKey: "fullname" },
  { ref: "email", label: "Email", value: "jane.doe@example.com", inputType: "email", hintKey: "email" },
  { ref: "phone", label: "Phone", value: "+91 9876543210", inputType: "tel", hintKey: "phone" },
  { ref: "password", label: "Password", value: "Hunter2!secret", inputType: "password", hintKey: "password" },
  { ref: "address", label: "Address", value: "Ahmedabad, Gujarat", inputType: "text", hintKey: "address" },
  { ref: "card", label: "Card Number", value: "4111 1111 1111 1111", inputType: "text", hintKey: "cardnumber" },
];

const BUTTONS = ["Submit Application"];

const TESTIMONIALS = [
  {
    img: avatar1,
    name: "Priya Sharma",
    role: "Operations Lead, Kilnworks",
    quote: "We stopped copy-pasting customer data into chat tools the same week we tried it.",
  },
  {
    img: avatar2,
    name: "Martin Keller",
    role: "CISO, Northfield Bank",
    quote: "The firewall report is the first thing our auditors actually enjoyed reading.",
  },
  {
    img: avatar3,
    name: "Daniel Reyes",
    role: "Support Manager, Alder & Co.",
    quote: "Agents resolve tickets twice as fast and I no longer worry about what leaves the tab.",
  },
];

const PARTICIPANTS = [
  { img: avatar1, name: "Priya Sharma", email: "priya.sharma@kilnworks.io", you: false },
  { img: avatar4, name: "Aarav Mehta", email: "aarav.mehta@nimbuspay.com", you: true },
  { img: avatar2, name: "Martin Keller", email: "m.keller@northfield.bank", you: false },
  { img: avatar5, name: "Ingrid Lofgren", email: "ingrid@alderco.se", you: false },
  { img: avatar3, name: "Daniel Reyes", email: "daniel.reyes@alderco.com", you: false },
  { img: avatar6, name: "Kwame Boateng", email: "kwame.b@northfield.bank", you: false },
];

type Msg = {
  from: "user" | "agent";
  text: string;
  kind?: "step" | "ok" | "fail";
};

type Surface = "site" | "meeting";

const FEATURES = [
  ["Same-day payouts", "Funds land in your account the day the invoice clears.", "\u26A1"],
  ["Clean audit trail", "Every export and access is logged and reviewable.", "\uD83D\uDCCB"],
  ["No lock-in", "Your data exports in one click, whenever you want.", "\uD83D\uDD13"],
] as const;

// Simulated speaking pattern for realistic meeting feel
const SPEAKING_PATTERN = [0, 2, 0, 4, 2, 0, 3, 0, 5, 0, 1, 0];

function Page() {
  const [surface, setSurface] = useState<Surface>("site");
  const [fields, setFields] = useState<Field[]>(INITIAL);
  const [sanitizedView, setSanitizedView] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "agent",
      kind: "ok",
      text: "I\u2019m Veil. I read whatever tab you\u2019re on \u2014 a page or a live meeting \u2014 strip personal data on-device, and only then think out loud with a model. Try \u201CSubmit this form.\u201D or \u201CMute me.\u201D",
    },
  ]);
  const [task, setTask] = useState("Submit this form.");
  const [meetingSeconds, setMeetingSeconds] = useState(2340); // 39:00
  const [speakingIdx, setSpeakingIdx] = useState(-1);

  // Meeting timer
  useEffect(() => {
    if (surface !== "meeting") return;
    const t = setInterval(() => setMeetingSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [surface]);

  // Simulated speaking
  useEffect(() => {
    if (surface !== "meeting") return;
    let tick = 0;
    const t = setInterval(() => {
      setSpeakingIdx(SPEAKING_PATTERN[tick % SPEAKING_PATTERN.length]);
      tick++;
    }, 2500);
    return () => clearInterval(t);
  }, [surface]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const siteRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const { detections, sanitized } = useMemo(
    () => buildContext(fields, BUTTONS, { title: "Create Your Account \u2014 NimbusPay", url: "https://demo.local/signup" }),
    [fields],
  );

  const meetingFields = useMemo<Field[]>(
    () =>
      PARTICIPANTS.flatMap((p, i) => [
        { ref: `p${i}-name`, label: `Participant ${i + 1} Name`, value: p.name, inputType: "text", hintKey: "fullname" },
        { ref: `p${i}-email`, label: `Participant ${i + 1} Email`, value: p.email, inputType: "email", hintKey: "email" },
      ]),
    [],
  );

  const meeting = useMemo(
    () =>
      buildContext(meetingFields, ["Mute", "Present", "Camera off", "Leave"], {
        title: "Weekly Sync \u2014 6 participants",
        url: "https://meet.local/nimbus-weekly",
      }),
    [meetingFields],
  );

  const active = surface === "site" ? { detections, sanitized } : { detections: meeting.detections, sanitized: meeting.sanitized };

  const tokenFor = (ref: string) => {
    const d = detections.find((x) => x.ref === ref);
    return d ? TOKENS[d.type] : null;
  };

  const push = (m: Msg) => {
    setMessages((x) => [...x, m]);
    requestAnimationFrame(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  async function askAgent(text: string) {
    if (!text.trim() || busy) return;
    setBusy(true);
    push({ from: "user", text });
    await wait(400);

    const inMeeting = surface === "meeting";

    push({
      from: "agent",
      kind: "step",
      text: inMeeting
        ? `Captured the meeting locally \u2014 6 participant tiles and 4 controls on \u201CWeekly Sync\u201D.`
        : `Captured the page locally \u2014 ${fields.length} form fields and ${BUTTONS.length} action found on \u201CCreate Your Account\u201D.`,
    });
    await wait(500);

    const names = active.detections.map((d) => d.type);
    push({
      from: "agent",
      kind: "step",
      text: `Detected ${active.detections.length} sensitive values on-device: ${[...new Set(names)].join(", ")}. Confidence ${Math.round(
        Math.min(...active.detections.map((d) => d.confidence)) * 100,
      )}%+.`,
    });
    await wait(500);

    push({
      from: "agent",
      kind: "step",
      text: inMeeting
        ? "Redacted locally \u2014 participant faces blurred and names swapped for [NAME] before anything leaves the device."
        : "Redacted everything locally \u2014 values replaced with tokens like [NAME], [EMAIL], [CARD].",
    });
    await wait(400);

    const payload = { task: text, sanitized_context: active.sanitized };
    const rawValues = (inMeeting ? meetingFields : fields).map((f) => f.value).filter(Boolean);
    const verdict = firewall(payload, rawValues);
    if (!verdict.allowed) {
      push({
        from: "agent",
        kind: "fail",
        text: `Privacy firewall blocked the request: ${verdict.violations.map((v) => v.rule).join(", ")}. Nothing was sent.`,
      });
      setBusy(false);
      return;
    }
    push({ from: "agent", kind: "ok", text: "Firewall passed. Only the sanitized context below is leaving the device." });
    push({
      from: "agent",
      kind: "step",
      text: JSON.stringify(payload.sanitized_context.elements.map((e) => e["value"] ?? e["text"])),
    });
    await wait(400);

    if (inMeeting) {
      const t = text.toLowerCase();
      await wait(500);
      push({ from: "agent", kind: "step", text: "Model replied with a single local control action \u2014 no audio or video was uploaded." });
      await wait(350);
      if (t.includes("unmute")) {
        setMuted(false);
        push({ from: "agent", kind: "ok", text: "Unmuted your microphone." });
      } else if (t.includes("mute")) {
        setMuted(true);
        push({ from: "agent", kind: "ok", text: "Muted your microphone locally." });
      } else if (t.includes("present") || t.includes("share")) {
        setPresenting((p) => !p);
        push({ from: "agent", kind: "ok", text: "Toggled screen presenting." });
      } else if (t.includes("camera") || t.includes("video")) {
        setCamOff((c) => !c);
        push({ from: "agent", kind: "ok", text: "Toggled your camera." });
      } else {
        push({
          from: "agent",
          kind: "ok",
          text: "I can mute/unmute, toggle your camera, or start presenting in this meeting \u2014 everything else stays untouched.",
        });
      }
      setBusy(false);
      return;
    }

    setSubmitted(false);
    try {
      const res = await fetch("/api/public/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { action?: string; target?: string; reason?: string; error?: string };
      if (!res.ok || !data.action) throw new Error(data.error || "Backend error");
      push({ from: "agent", kind: "step", text: `Model replied: ${data.reason ?? ""}` });
      await wait(350);

      if (data.action === "click" && data.target) {
        siteRef.current?.scrollTo({ top: siteRef.current.scrollHeight, behavior: "smooth" });
        await wait(600);
        setSubmitted(true);
        push({ from: "agent", kind: "ok", text: `Done \u2014 clicked \u201C${data.target}\u201D in the page. Your raw details never left this device.` });
      } else {
        push({ from: "agent", kind: "ok", text: `Executed ${data.action} on the page.` });
      }
    } catch (e) {
      push({ from: "agent", kind: "fail", text: e instanceof Error ? e.message : "Request failed." });
    } finally {
      setBusy(false);
    }
  }

  function downloadExtension() {
    fetch("/privacy-browser-agent.zip")
      .then((r) => {
        if (!r.ok) throw new Error(`Download failed: ${r.status}`);
        return r.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "privacy-browser-agent.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((err) => alert(err.message));
  }

  return (
    <main className="flex h-screen flex-col bg-background text-foreground">
      {/* Frosted Glass Tab Bar */}
      <header className="frosted-header relative z-20 flex items-center justify-between gap-4 border-b border-border/60 px-4 pt-2">
        <div className="flex items-end gap-1">
          {(
            [
              ["site", "NimbusPay \u2014 Sign up"],
              ["meeting", "Weekly Sync \u00B7 Meet"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSurface(id)}
              className={`rounded-t-lg border border-b-0 px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                surface === id
                  ? "tab-active-indicator border-border/60 bg-card text-foreground shadow-sm"
                  : "border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={downloadExtension} className="btn-outline mb-2 inline-flex items-center gap-2 text-xs">
          <Download size={13} /> Chrome Extension
        </button>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* LEFT: the active tab */}
        {surface === "site" ? (
          <div ref={siteRef} className="relative min-h-0 overflow-y-auto bg-card">
            {sanitizedView && (
              <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-secondary px-5 py-2.5 text-xs font-medium text-secondary-foreground animate-fade-in">
                <EyeOff size={13} />
                Sanitized preview \u2014 this is exactly what the AI receives
              </div>
            )}

            {/* Nav */}
            <nav className="flex items-center justify-between px-8 py-5 animate-fade-in">
              <span className="font-display text-lg font-bold tracking-tight">NimbusPay</span>
              <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
                <span className="cursor-pointer transition-colors hover:text-foreground">Product</span>
                <span className="cursor-pointer transition-colors hover:text-foreground">Pricing</span>
                <span className="cursor-pointer transition-colors hover:text-foreground">Customers</span>
                <span className="cursor-pointer font-medium text-foreground">Sign up</span>
              </div>
            </nav>

            {/* Hero with floating shapes */}
            <section className="relative overflow-hidden px-8 pb-12 pt-6">
              {/* Decorative gradient blobs */}
              <div className="hero-shape animate-float" style={{ width: 280, height: 280, top: -60, right: -40, background: "oklch(0.6 0.1 45 / 0.2)" }} />
              <div className="hero-shape animate-float-reverse" style={{ width: 200, height: 200, bottom: -30, left: "20%", background: "oklch(0.6 0.08 180 / 0.15)" }} />
              <div className="hero-shape animate-float" style={{ width: 120, height: 120, top: "40%", right: "25%", background: "oklch(0.55 0.11 155 / 0.12)" }} />

              <div className="relative z-10">
                <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Payments for small teams
                </p>
                <h1 className="animate-fade-in-up delay-100 mt-3 max-w-xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                  <span className="text-gradient">Get paid</span> without the paperwork.
                </h1>
                <p className="animate-fade-in-up delay-200 mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                  NimbusPay handles invoicing, payouts and compliance in one place, so a two-person studio can bill like an
                  enterprise.
                </p>
                <div className="animate-fade-in-up delay-300 mt-7 flex gap-3">
                  <button
                    className="btn-primary"
                    onClick={() => siteRef.current?.scrollTo({ top: siteRef.current.scrollHeight, behavior: "smooth" })}
                  >
                    Create your account
                  </button>
                  <button className="btn-outline">See pricing</button>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="grid gap-px border-y border-border bg-border sm:grid-cols-3">
              {FEATURES.map(([t, d, emoji]) => (
                <div key={t} className="feature-card bg-card px-8 py-7">
                  <span className="mb-2 block text-xl">{emoji}</span>
                  <h3 className="text-sm font-semibold">{t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{d}</p>
                </div>
              ))}
            </section>

            {/* Testimonials */}
            <section className="px-8 py-10">
              <h2 className="font-display text-xl font-semibold tracking-tight">What customers say</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {TESTIMONIALS.map((t) => (
                  <figure key={t.name} className="hover-lift rounded-xl border border-border bg-card p-4">
                    <div className="relative h-36 w-full overflow-hidden rounded-lg bg-muted">
                      <img
                        src={t.img}
                        alt={`Portrait of ${t.name}`}
                        loading="lazy"
                        width={512}
                        height={512}
                        className={`h-full w-full object-cover transition-all duration-500 ${
                          sanitizedView ? "scale-105 blur-lg" : ""
                        }`}
                      />
                      {sanitizedView && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          Face hidden
                        </span>
                      )}
                      {!sanitizedView && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      )}
                    </div>
                    <blockquote className="mt-3 text-[13px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {sanitizedView ? (
                        <span className="rounded bg-muted px-1.5 font-mono text-[11px]">[NAME]</span>
                      ) : (
                        <>
                          <span className="font-medium text-foreground">{t.name}</span> &middot; {t.role}
                        </>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            {/* Form Section with Glassmorphism */}
            <section className="relative border-t border-border bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/30 px-8 py-12">
              {/* Background accent blobs */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-20 top-1/4 h-60 w-60 rounded-full bg-primary/5 blur-[80px]" />
                <div className="absolute -right-20 bottom-1/4 h-48 w-48 rounded-full bg-veil-accent/5 blur-[70px]" />
              </div>

              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="font-display text-2xl font-semibold tracking-tight">Create your account</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Two minutes, no credit card required &mdash; except the demo field below.
                </p>

                <div className="glass-card mt-6 grid gap-4 p-6 sm:grid-cols-2">
                  {fields.map((f, i) => {
                    const token = tokenFor(f.ref);
                    const shown = sanitizedView && token ? token : f.value;
                    return (
                      <label key={f.ref} className="block">
                        <span className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                          {f.label}
                          {sanitizedView && token && (
                            <span className="chip chip-safe normal-case tracking-normal">{token} sent to AI</span>
                          )}
                        </span>
                        <input
                          className={`field ${sanitizedView && token ? "font-mono text-primary" : ""}`}
                          type="text"
                          value={shown}
                          readOnly={sanitizedView && !!token}
                          onChange={(e) =>
                            setFields((fs) => fs.map((x, xi) => (xi === i ? { ...x, value: e.target.value } : x)))
                          }
                        />
                      </label>
                    );
                  })}
                  <div className="flex items-end gap-3 sm:col-span-2">
                    <button
                      className={`btn-primary transition-all ${submitted ? "ring-2 ring-success ring-offset-2 ring-offset-card" : ""}`}
                      onClick={() => setSubmitted(true)}
                    >
                      Submit Application
                    </button>
                    {submitted && (
                      <span className="animate-success-pop inline-flex items-center gap-1.5 text-sm font-medium text-success">
                        <ShieldCheck size={15} /> Submitted &mdash; clicked by the agent
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                  NimbusPay demo site &middot; fictional data only
                </p>
              </div>
            </section>
          </div>
        ) : (
          /* Meeting tab — White Google Meet style */
          <div className="meeting-grid-bg flex min-h-0 flex-col bg-[#f8fafc] text-gray-900">
            {/* Meeting top bar */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <div className="flex items-center gap-3">
                <p className="font-display text-sm font-semibold text-gray-900">Weekly Sync</p>
                <span className="hidden items-center gap-1 rounded bg-gray-200/50 px-2 py-0.5 text-[10px] text-gray-600 sm:inline-flex">
                  <Lock size={9} /> meet.local/nimbus-weekly
                </span>
              </div>
              <div className="flex items-center gap-3">
                {sanitizedView && (
                  <span className="animate-scale-in rounded-full bg-blue-100 px-3 py-1 text-[11px] font-medium text-blue-700">
                    Sanitized view
                  </span>
                )}
                <div className="meeting-timer flex items-center gap-1.5 text-[12px] text-gray-600 font-medium">
                  <span className="rec-dot inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                  {formatTime(meetingSeconds)}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Users size={12} />
                  <span>6</span>
                </div>
              </div>
            </div>

            {/* Participant grid - Featured speaker layout */}
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:flex-row">
              {(() => {
                const activeSpeakerIndex = speakingIdx >= 0 ? speakingIdx : 0;
                const mainP = PARTICIPANTS[activeSpeakerIndex];
                const others = PARTICIPANTS.filter((_, i) => i !== activeSpeakerIndex);
                
                const renderTile = (p: typeof PARTICIPANTS[0], isMain: boolean) => {
                  const actualIndex = PARTICIPANTS.indexOf(p);
                  const meOff = p.you && camOff;
                  const isSpeaking = speakingIdx === actualIndex && !sanitizedView;
                  return (
                    <div
                      key={p.name}
                      className={`participant-tile relative overflow-hidden rounded-2xl ${
                        isMain ? "min-h-[250px] w-full flex-1" : "aspect-video w-full shrink-0 sm:w-64"
                      } ${isSpeaking ? "is-speaking" : ""} ${p.you ? "ring-1 ring-gray-300" : ""}`}
                      style={{ background: "#e2e8f0" }}
                    >
                      {meOff ? (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                          <span className={`${isMain ? "h-24 w-24 text-4xl" : "h-12 w-12 text-xl"} flex items-center justify-center rounded-full bg-white text-gray-500 font-display shadow-sm`}>
                            {p.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={p.img}
                          alt={`Video tile of ${p.name}`}
                          loading="lazy"
                          className={`h-full w-full object-cover transition-all duration-500 ${
                            sanitizedView ? "scale-105 blur-lg" : ""
                          }`}
                        />
                      )}
                      {sanitizedView && !meOff && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white/40 text-[10px] font-semibold uppercase tracking-widest text-gray-700 backdrop-blur-sm">
                          Face hidden
                        </span>
                      )}
                      {/* Name + mic overlay */}
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent px-3 py-2 text-[11px] text-white">
                        <span className={`flex items-center gap-1.5 ${
                          sanitizedView ? "font-mono text-gray-200" : "font-medium"
                        }`}>
                          {sanitizedView ? "[NAME]" : p.name}
                          {p.you && !sanitizedView && (
                            <span className="rounded bg-white/20 px-1 py-px text-[9px] font-semibold">You</span>
                          )}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isSpeaking && (
                            <div className="audio-wave">
                              <span /><span /><span /><span />
                            </div>
                          )}
                          {p.you && muted ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/90">
                              <MicOff size={10} className="text-white" />
                            </span>
                          ) : !isSpeaking ? (
                            <Mic size={11} className="text-white/70" />
                          ) : null}
                        </div>
                      </div>
                      {actualIndex === 0 && presenting && (
                        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg">
                          <MonitorUp size={10} /> Presenting
                        </span>
                      )}
                    </div>
                  );
                };

                return (
                  <>
                    <div className="relative flex min-h-[300px] flex-1 flex-col">
                      {renderTile(mainP, true)}
                    </div>
                    <div className="flex w-full shrink-0 gap-3 overflow-x-auto sm:w-auto sm:flex-col sm:overflow-y-auto">
                      {others.map((p) => renderTile(p, false))}
                    </div>
                  </>
                );
              })()}
            </div>


            {/* Meeting controls — floating pill dock */}
            <div className="flex items-center justify-center px-4 py-4">
              <div className="meet-control-dock flex items-center gap-1">
                <MeetBtn active={muted} danger label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((m) => !m)}>
                  {muted ? <MicOff size={18} /> : <Mic size={18} />}
                </MeetBtn>
                <MeetBtn active={camOff} danger label={camOff ? "Start camera" : "Stop camera"} onClick={() => setCamOff((c) => !c)}>
                  {camOff ? <VideoOff size={18} /> : <Video size={18} />}
                </MeetBtn>
                <MeetBtn active={presenting} label={presenting ? "Stop presenting" : "Present"} onClick={() => setPresenting((p) => !p)}>
                  <MonitorUp size={18} />
                </MeetBtn>

                <span className="mx-1.5 h-6 w-px bg-gray-200" />

                <MeetBtn label="Reactions" onClick={() => {}}>
                  <Smile size={18} />
                </MeetBtn>
                <MeetBtn label="Raise hand" onClick={() => {}}>
                  <Hand size={18} />
                </MeetBtn>
                <MeetBtn label="Chat" onClick={() => {}}>
                  <MessageSquare size={18} />
                </MeetBtn>
                <MeetBtn label="Meeting info" onClick={() => {}}>
                  <Info size={18} />
                </MeetBtn>

                <span className="mx-1.5 h-6 w-px bg-gray-200" />

                <button className="inline-flex h-10 items-center gap-2 rounded-full bg-red-500 px-5 text-[13px] font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 hover:shadow-red-500/30">
                  <PhoneOff size={16} />
                  <span className="hidden sm:inline">Leave</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT: Veil Sidebar */}
        <aside className={`flex min-h-0 flex-col border-l shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between border-b px-4 py-3.5 transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
            <div className="relative z-10 flex items-center gap-2.5">
              <span className={`relative flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden border shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <img src={veilLogo} alt="Veil Logo" className="h-full w-full object-cover" />
                <span className="absolute inset-0 animate-pulse-glow rounded-lg pointer-events-none" />
              </span>
              <div>
                <p className={`font-display text-sm font-semibold leading-none transition-colors duration-300 ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>Veil</p>
                <p className={`mt-1 flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-300 ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${busy ? "animate-ping bg-amber-500" : "bg-emerald-500"}`} />
                  {busy ? "Processing\u2026" : surface === "site" ? "Watching this page" : "In this meeting"}
                </p>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                title="Toggle Theme"
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all shadow-sm ${isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {isDarkTheme ? <Sun size={13} /> : <Moon size={13} />}
              </button>
              <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 ${isDarkTheme ? 'border-teal-500/30 bg-teal-500/10 text-teal-400' : 'border-teal-200 bg-teal-50 text-teal-700'}`}>
                <Lock size={8} /> On-device
              </span>
              <Link
                to="/dashboard"
                title="Open Extension Dashboard"
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all shadow-sm ${isDarkTheme ? 'border-slate-700 bg-slate-800 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300' : 'bg-white border-slate-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700'}`}
              >
                <LayoutDashboard size={13} />
              </Link>
            </div>
          </div>

          {/* Sanitized toggle */}
          <button
            onClick={() => setSanitizedView((v) => !v)}
            className={`flex items-center justify-between border-b px-4 py-3 text-left transition-colors ${isDarkTheme ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <span className="flex items-center gap-2.5">
              {sanitizedView ? <EyeOff size={15} className={`transition-colors ${isDarkTheme ? 'text-teal-400' : 'text-teal-600'}`} /> : <Eye size={15} className={`transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-400'}`} />}
              <span>
                <span className={`block text-[13px] font-semibold transition-colors ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>Preview sanitized</span>
                <span className={`block text-[11px] transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
                  {sanitizedView ? "Faces blurred, PII tokenized" : "Showing your real view"}
                </span>
              </span>
            </span>
            <span
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${sanitizedView ? (isDarkTheme ? "bg-teal-500" : "bg-teal-500") : (isDarkTheme ? "bg-slate-700" : "bg-slate-200")}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${sanitizedView ? "left-[18px]" : "left-0.5"}`}
              />
            </span>
          </button>

          {/* Detection chips */}
          <div className={`flex flex-wrap gap-1.5 border-b px-4 py-3 transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50/50'}`}>
            {active.detections.slice(0, 12).map((d) => (
              <span
                key={d.ref}
                className={`detection-chip cursor-default rounded-full border px-2 py-0.5 font-mono text-[10px] shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`}
              >
                {d.type} &middot; {Math.round(d.confidence * 100)}%
              </span>
            ))}
            {active.detections.length === 0 && (
              <span className={`text-xs font-medium transition-colors ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>No sensitive data detected here.</span>
            )}
          </div>

          {/* Chat messages */}
          <div ref={chatRef} className={`veil-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 transition-colors duration-300 ${isDarkTheme ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble-enter flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm transition-colors duration-300 ${
                    m.from === "user"
                      ? (isDarkTheme ? "bg-teal-600 text-white font-medium shadow-teal-900/50" : "bg-teal-600 text-white font-medium shadow-teal-600/20")
                      : m.kind === "fail"
                        ? (isDarkTheme ? "border border-red-500/30 bg-red-900/20 text-red-300" : "border border-red-200 bg-red-50 text-red-800")
                        : m.kind === "ok"
                          ? (isDarkTheme ? "border border-slate-700 bg-slate-800 text-slate-200" : "border border-slate-200 bg-white text-slate-700")
                          : (isDarkTheme ? "border border-dashed border-slate-700 bg-transparent font-mono text-[11px] text-slate-500 shadow-none" : "border border-dashed border-slate-300 bg-transparent font-mono text-[11px] text-slate-500 shadow-none")
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className={`rounded-2xl border px-4 py-3 shadow-sm transition-colors duration-300 ${isDarkTheme ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                  <div className={isDarkTheme ? 'typing-dots' : 'typing-dots-light'}>
                    <span className={isDarkTheme ? 'bg-slate-500' : 'bg-slate-300'} />
                    <span className={isDarkTheme ? 'bg-slate-500' : 'bg-slate-300'} />
                    <span className={isDarkTheme ? 'bg-slate-500' : 'bg-slate-300'} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <form
            className={`flex items-center gap-2 border-t p-3 transition-colors duration-300 ${isDarkTheme ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
            onSubmit={(e) => {
              e.preventDefault();
              askAgent(task);
            }}
          >
            <input
              className={`mt-0 flex-1 rounded-xl border px-3 py-2.5 text-[13px] transition-all duration-200 focus:outline-none focus:ring-2 ${isDarkTheme ? 'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-teal-500 focus:bg-slate-900 focus:ring-teal-500/20' : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-teal-500/20'}`}
              placeholder={surface === "site" ? "Ask Veil to act on this page\u2026" : "Ask Veil to act in this meeting\u2026"}
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 disabled:opacity-50 disabled:shadow-none ${isDarkTheme ? 'bg-teal-600 shadow-teal-900/50 hover:bg-teal-500 hover:shadow-md' : 'bg-teal-600 shadow-teal-600/20 hover:bg-teal-700 hover:shadow-md hover:shadow-teal-600/30'}`}
            >
              <SendHorizonal size={14} />
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}

function MeetBtn({
  children,
  label,
  active,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm transition-all duration-200 ${
        active
          ? danger
            ? "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600"
            : "bg-veil-accent text-white shadow-lg shadow-veil-accent/20"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
