import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  bg: "#0B0F19",
  bgAlt: "#0F1422",
  primary: "#6366F1",
  primaryDark: "#4F46E5",
  secondary: "#22C55E",
  accent: "#F59E0B",
  text: "#E5E7EB",
  textMuted: "#6B7280",
  textFaint: "#374151",
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV_LINKS = ["About","Skills","Projects","Experience","Services","Contact"];

const SKILLS = [
  { category: "Programming", emoji: "⚙️", color: "#6366F1", items: [
    { name: "C++", level: 75 }, { name: "Python", level: 70 }, { name: "PHP", level: 65 }
  ]},
  { category: "Web Dev", emoji: "🌐", color: "#22C55E", items: [
    { name: "HTML/CSS", level: 92 }, { name: "JavaScript", level: 80 }, { name: "React", level: 62 }
  ]},
  { category: "Tools & AI", emoji: "🤖", color: "#F59E0B", items: [
    { name: "Linux", level: 65 }, { name: "Prompt Eng.", level: 88 }, { name: "AI Basics", level: 76 }
  ]},
];

const PROJECTS = [
  {
    title: "Restaurant Website",
    desc: "A visually rich restaurant platform featuring interactive menus, reservation flows, and warm editorial design crafted to captivate diners.",
    tech: ["HTML","CSS","JavaScript"],
    color: "#F97316",
    colorB: "#EF4444",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    tag: "Hospitality",
  },
  {
    title: "Freelancer Platform",
    desc: "A sleek marketplace connecting talent with opportunity — service listings, portfolio showcases, and frictionless client onboarding.",
    tech: ["HTML","CSS","JavaScript","PHP"],
    color: "#6366F1",
    colorB: "#8B5CF6",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    tag: "SaaS",
  },
  {
    title: "Real Estate Website",
    desc: "Premium property listing portal with advanced search, immersive gallery views, and inquiry forms that convert browsers into buyers.",
    tech: ["HTML","CSS","JavaScript"],
    color: "#06B6D4",
    colorB: "#3B82F6",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    tag: "PropTech",
  },
  {
    title: "Video Streaming Site",
    desc: "Netflix-inspired streaming UI with category browsing, responsive content cards, and fluid playback — built with AI-assisted design.",
    tech: ["HTML","CSS","JavaScript"],
    color: "#22C55E",
    colorB: "#10B981",
    img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    tag: "Entertainment",
  },
];

const SERVICES = [
  { title: "Web Development", desc: "Full-stack sites built with HTML, CSS, JS & PHP — blazing fast, pixel-perfect, responsive.", icon: "⚡", color: "#6366F1" },
  { title: "UI/UX Design", desc: "Interfaces that balance beauty and usability — clean layouts that guide users naturally.", icon: "✦", color: "#8B5CF6" },
  { title: "Prompt Engineering", desc: "Precision AI prompts that unlock powerful LLM outputs for real-world applications.", icon: "◈", color: "#22C55E" },
  { title: "Bug Fixing", desc: "Systematic diagnosis and resolution of frontend and backend issues — fast and precise.", icon: "◎", color: "#F59E0B" },
];

const TESTIMONIALS = [
  { name: "Arjun Sharma", role: "Startup Founder", text: "Misba delivered our restaurant website ahead of schedule. Clean code, stunning design — truly exceeded every expectation.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", initials: "AS" },
  { name: "Priya Nair", role: "Marketing Manager", text: "The real estate platform Misba built brought in 40% more leads in the first month. Phenomenal attention to detail and UX.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", initials: "PN" },
  { name: "Rahul Verma", role: "Tech Lead", text: "Sharp developer, great communicator. The prompt engineering work saved our team hours of manual iteration each week.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", initials: "RV" },
];

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: `-${Math.floor(threshold * 100)}px` });
  return [ref, inView];
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 48 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] },
});

const SectionLabel = ({ children }) => (
  <motion.span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase mb-5 px-3 py-1.5 rounded-full border"
    style={{ color: C.primary, borderColor: `${C.primary}35`, background: `${C.primary}10` }}>
    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.primary }} />
    {children}
  </motion.span>
);

/* ─────────────────────────────────────────────
   LOADER
───────────────────────────────────────────── */
function Loader({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: C.bg }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <div className="relative mb-8">
          <motion.div className="absolute -inset-6 rounded-full blur-2xl opacity-40"
            animate={{ scale: [1,1.15,1], opacity:[0.3,0.6,0.3] }} transition={{ repeat: Infinity, duration: 2 }}
            style={{ background: `radial-gradient(circle, ${C.primary}, ${C.primaryDark})` }} />
          <div className="relative text-6xl font-black tracking-tight"
            style={{ fontFamily: "'Clash Display', 'Syne', system-ui", background: `linear-gradient(135deg, ${C.primary}, #A78BFA, #22C55E)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            M·AMF
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          {[0,1,2,3,4].map(i => (
            <motion.div key={i} className="w-1 h-1 rounded-full" style={{ background: C.primary }}
              animate={{ scaleY: [1,3,1], opacity:[0.4,1,0.4] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.12 }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={scrolled ? { background: "rgba(11,15,25,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.12)" } : {}}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.span whileHover={{ scale: 1.05 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-black cursor-pointer tracking-tight"
          style={{ fontFamily: "'Syne','Clash Display',system-ui", background: `linear-gradient(90deg, ${C.primary}, #A78BFA)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          M·AMF
        </motion.span>
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
              className="text-sm font-medium transition-all duration-200 hover:text-white relative group"
              style={{ color: active === link.toLowerCase() ? "#fff" : C.textMuted }}>
              {link}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 rounded-full"
                style={{ background: `linear-gradient(90deg, ${C.primary}, #A78BFA)` }} />
            </a>
          ))}
          <motion.a href="#contact" whileHover={{ scale: 1.05, boxShadow: `0 0 24px ${C.primary}50` }} whileTap={{ scale: 0.97 }}
            className="text-sm px-5 py-2.5 rounded-full font-semibold text-white transition-all"
            style={{ background: `linear-gradient(135deg, ${C.primary}, #8B5CF6)` }}>
            Hire Me
          </motion.a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-1">
          {[0,1,2].map(i => <span key={i} className="block w-6 h-px transition-all" style={{ background: C.textMuted,
            transform: open && i===0 ? "rotate(45deg) translate(5px,5px)" : open && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
            opacity: open && i===1 ? 0 : 1 }} />)}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
            className="md:hidden px-6 pb-5 pt-2"
            style={{ background: "rgba(11,15,25,0.97)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)}
                className="block py-3 text-sm border-b" style={{ color: C.textMuted, borderColor: "rgba(255,255,255,0.05)" }}>
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20);
  };

  const words = ["Software", "Developer", "&", "AI", "Engineer"];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleMouse}>
      {/* Deep layered background */}
      <div className="absolute inset-0" style={{ background: C.bg }}>
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 40%, #6366F115, transparent), radial-gradient(ellipse 60% 80% at 80% 60%, #8B5CF615, transparent), radial-gradient(ellipse 50% 50% at 50% 50%, #22C55E08, transparent)" }} />
        {/* Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Floating orbs */}
        {[["-10%","15%","400px","500px",C.primary,"0.06","5s"],["70%","60%","300px","380px","#A78BFA","0.07","7s"],["30%","80%","250px","300px",C.secondary,"0.04","9s"]].map(([l,t,w,h,c,o,d],i) => (
          <motion.div key={i} className="absolute rounded-full blur-3xl pointer-events-none"
            style={{ left:l, top:t, width:w, height:h, background:c, opacity:o }}
            animate={{ scale:[1,1.2,1], opacity:[parseFloat(o)*0.7,parseFloat(o)*1.3,parseFloat(o)*0.7] }}
            transition={{ repeat:Infinity, duration:parseFloat(d), ease:"easeInOut" }} />
        ))}
        {/* Floating particles */}
        {Array.from({length:20}).map((_,i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full"
            style={{ left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, background: i%3===0 ? C.primary : i%3===1 ? C.secondary : "#A78BFA", opacity: 0.3 }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ repeat:Infinity, duration: 3 + Math.random()*4, delay: Math.random()*3 }} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div {...fadeUp(0.3)} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 text-sm font-medium"
          style={{ background: `${C.primary}12`, border: `1px solid ${C.primary}30`, color: "#A5B4FC" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.secondary }} />
          Available for Freelance · Open to Full-time
        </motion.div>

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4, duration:1 }}>
          <div className="overflow-hidden mb-2">
            <motion.p initial={{ y:60 }} animate={{ y:0 }} transition={{ delay:0.4, duration:0.8, ease:[0.16,1,0.3,1] }}
              className="text-sm font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: C.textMuted }}>
              Portfolio 2025
            </motion.p>
          </div>
          <div className="overflow-hidden">
            <motion.h1 initial={{ y:100 }} animate={{ y:0 }} transition={{ delay:0.5, duration:0.9, ease:[0.16,1,0.3,1] }}
              className="text-[clamp(56px,10vw,120px)] font-black leading-none mb-4 tracking-tight"
              style={{ fontFamily:"'Syne','Clash Display',system-ui" }}>
              <span style={{ background:`linear-gradient(135deg, #fff 0%, ${C.primary} 50%, #A78BFA 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Misba AMF
              </span>
            </motion.h1>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.7)} className="flex flex-wrap justify-center gap-2 mb-8">
          {words.map((w, i) => (
            <motion.span key={w} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.8 + i*0.07, duration:0.5 }}
              className="text-2xl md:text-3xl font-light" style={{ color: i===3||i===4 ? "#A78BFA" : C.text }}>
              {w}
            </motion.span>
          ))}
        </motion.div>

        <motion.p {...fadeUp(1)} className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12" style={{ color: C.textMuted }}>
          Building modern web experiences with{" "}
          <span style={{ color: C.text }}>clean, efficient code</span>{" "}
          and AI-powered solutions that make a real impact.
        </motion.p>

        <motion.div {...fadeUp(1.1)} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a href="#projects" whileHover={{ scale:1.05, boxShadow:`0 0 50px ${C.primary}60` }} whileTap={{ scale:0.97 }}
            className="px-8 py-4 rounded-full font-bold text-white text-base transition-all"
            style={{ background:`linear-gradient(135deg, ${C.primary}, #8B5CF6)`, boxShadow:`0 8px 32px ${C.primary}30` }}>
            View My Work ↓
          </motion.a>
          <motion.a href="#contact" whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
            className="px-8 py-4 rounded-full font-bold text-base transition-all"
            style={{ background:"rgba(255,255,255,0.04)", border:`1px solid rgba(99,102,241,0.3)`, color: C.text, backdropFilter:"blur(8px)" }}>
            Hire Me →
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: C.textMuted }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y:[0,8,0] }} transition={{ repeat:Infinity, duration:1.8 }}
            className="w-px h-10" style={{ background:`linear-gradient(to bottom, ${C.primary}, transparent)` }} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  const [ref, inView] = useReveal();
  const stack = ["C++","Python","JavaScript","PHP","HTML","CSS","Linux","Prompt Eng.","AI/ML"];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background:`${C.secondary}08` }} />
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity:0, x:-60 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.85, ease:[0.16,1,0.3,1] }}>
            <SectionLabel>About Me</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6" style={{ fontFamily:"'Syne',system-ui", color: C.text }}>
              Crafting digital experiences,{" "}
              <span style={{ background:`linear-gradient(90deg, ${C.primary}, #A78BFA)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                one line at a time
              </span>
            </h2>
            <p className="text-lg leading-relaxed mb-5" style={{ color: C.textMuted }}>
              I'm Misba AMF, a final-year BCA student at JMJ Degree College, Sirsi, with a deep passion for building clean, functional, and visually compelling web applications.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: "#4B5563" }}>
              Currently interning as a Prompt Engineer, I bring both technical precision and creative thinking to every project. Fluent in English, Kannada, and Hindi.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[["4+","Projects"],["1+","Year Exp."],["8+","Skills"]].map(([n,l]) => (
                <div key={l} className="text-center p-4 rounded-2xl" style={{ background:"rgba(99,102,241,0.06)", border:"1px solid rgba(99,102,241,0.12)" }}>
                  <div className="text-3xl font-black mb-1" style={{ background:`linear-gradient(135deg, ${C.primary}, #A78BFA)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{n}</div>
                  <div className="text-xs" style={{ color: C.textMuted }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {stack.map((s, i) => (
                <motion.span key={s} initial={{ opacity:0, scale:0.8 }} animate={inView ? { opacity:1, scale:1 } : {}} transition={{ delay: 0.05*i, duration:0.4 }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium cursor-default transition-all"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#9CA3AF" }}
                  whileHover={{ borderColor: C.primary, color: "#A5B4FC", background: `${C.primary}10` }}>
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:60 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.85, delay:0.15, ease:[0.16,1,0.3,1] }}>
            {/* Glassmorphism profile card */}
            <div className="relative p-8 rounded-3xl overflow-hidden" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" }}>
              {/* Gradient corners */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-2xl" style={{ background:`${C.primary}20` }} />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-2xl" style={{ background:`${C.secondary}15` }} />
              {/* Gradient border shimmer */}
              <div className="absolute inset-0 rounded-3xl opacity-40" style={{ background:`linear-gradient(135deg, ${C.primary}15, transparent 50%, ${C.secondary}10)`, pointerEvents:"none" }} />

              <div className="relative flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-4" style={{ ringColor: C.primary, boxShadow:`0 0 0 4px ${C.primary}40, 0 0 40px ${C.primary}30` }}>
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: C.secondary, boxShadow:`0 0 12px ${C.secondary}60` }}>✓</span>
                </div>

                <h3 className="text-xl font-bold mb-1" style={{ color: C.text }}>Misba AMF</h3>
                <p className="text-sm mb-6 px-3 py-1 rounded-full" style={{ background:`${C.primary}15`, color:"#A5B4FC", border:`1px solid ${C.primary}25` }}>
                  Aspiring Software Developer
                </p>

                <div className="w-full space-y-3 text-sm text-left">
                  {[["📍","Location","Sirsi, Karnataka, India"],["🎓","Education","BCA — JMJ Degree College (2022–2026)"],["🌐","Languages","English · Kannada · Hindi"],["✉️","Email","misbaamf005@gmail.com"],["📱","Phone","0591815425"]].map(([ic,label,val]) => (
                    <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}>
                      <span>{ic}</span>
                      <div>
                        <div className="text-xs mb-0.5" style={{ color: C.textMuted }}>{label}</div>
                        <div className="text-sm" style={{ color: C.text }}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────── */
function Skills() {
  const [ref, inView] = useReveal();

  return (
    <section id="skills" className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 70% 50% at 50% 50%, ${C.primary}06, transparent)` }} />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7 }} className="text-center mb-16">
          <SectionLabel>Expertise</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily:"'Syne',system-ui", color: C.text }}>Skills & Technologies</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {SKILLS.map((cat, ci) => (
            <motion.div key={cat.category}
              initial={{ opacity:0, y:50 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7, delay:ci*0.15 }}
              whileHover={{ y:-4, transition:{ duration:0.2 } }}
              className="relative p-7 rounded-3xl overflow-hidden group transition-all"
              style={{ background:"rgba(255,255,255,0.025)", border:`1px solid rgba(255,255,255,0.07)`, backdropFilter:"blur(10px)" }}>
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background:`radial-gradient(ellipse at top left, ${cat.color}12, transparent 60%)` }} />
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                style={{ background:`linear-gradient(135deg, ${cat.color}25, transparent)` }} />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background:`${cat.color}18`, border:`1px solid ${cat.color}25` }}>
                    {cat.emoji}
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: C.text }}>{cat.category}</h3>
                </div>
                <div className="space-y-5">
                  {cat.items.map((skill, si) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span style={{ color:"#D1D5DB" }}>{skill.name}</span>
                        <span className="font-mono text-xs" style={{ color: cat.color }}>{skill.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.06)" }}>
                        <motion.div initial={{ width:0 }} animate={inView ? { width:`${skill.level}%` } : {}}
                          transition={{ duration:1.2, delay:ci*0.15+si*0.1+0.4, ease:[0.16,1,0.3,1] }}
                          className="h-full rounded-full" style={{ background:`linear-gradient(90deg, ${cat.color}, ${cat.color}88)`, boxShadow:`0 0 8px ${cat.color}60` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────── */
function Projects() {
  const [ref, inView] = useReveal();
  const [hovered, setHovered] = useState(null);

  return (
    <section id="projects" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7 }} className="text-center mb-16">
          <SectionLabel>Portfolio</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily:"'Syne',system-ui", color: C.text }}>Featured Projects</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div key={project.title}
              initial={{ opacity:0, y:60 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.75, delay:i*0.12 }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
              style={{ background:"rgba(255,255,255,0.02)", border:`1px solid rgba(255,255,255,0.07)` }}
              whileHover={{ y:-6, transition:{ duration:0.3, ease:[0.16,1,0.3,1] } }}>

              {/* Gradient border glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                style={{ boxShadow:`inset 0 0 0 1px ${project.color}40, 0 0 40px ${project.color}20` }} />

              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <motion.img src={project.img} alt={project.title}
                  className="w-full h-full object-cover"
                  animate={hovered === i ? { scale:1.08 } : { scale:1 }}
                  transition={{ duration:0.6, ease:[0.16,1,0.3,1] }} />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0" style={{ background:`linear-gradient(to bottom, transparent 30%, rgba(11,15,25,0.95) 100%)` }} />
                {/* Color tint overlay */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity duration-500" style={{ background:`linear-gradient(135deg, ${project.color}, ${project.colorB})` }} />
                {/* Tag badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background:`${project.color}25`, border:`1px solid ${project.color}40`, color:project.color, backdropFilter:"blur(8px)" }}>
                  {project.tag}
                </div>
                {/* Number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background:"rgba(0,0,0,0.5)", color: C.textMuted, backdropFilter:"blur(4px)" }}>
                  {String(i+1).padStart(2,"0")}
                </div>
              </div>

              {/* Content */}
              <div className="relative p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: C.text }}>{project.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: C.textMuted }}>{project.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background:`${project.color}12`, color:project.color, border:`1px solid ${project.color}20` }}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {[["Live Demo ↗", true],["GitHub", false]].map(([label, isPrimary]) => (
                    <motion.button key={label} whileHover={{ scale:1.04, boxShadow: isPrimary ? `0 0 20px ${project.color}40` : "none" }} whileTap={{ scale:0.97 }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={isPrimary ? { background:`linear-gradient(135deg, ${project.color}, ${project.colorB})`, color:"#fff", boxShadow:`0 4px 16px ${project.color}25` } : { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color: C.textMuted }}>
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   EXPERIENCE
───────────────────────────────────────────── */
function Experience() {
  const [ref, inView] = useReveal();
  const items = [
    "Designed and refined AI prompts to generate accurate, relevant, high-quality responses across diverse use cases",
    "Analyzed and improved prompt structures to enhance model outputs and reduce inconsistencies",
    "Experimented with role prompting, context setting, and step-by-step instruction techniques",
    "Evaluated AI responses and iterated on prompt design to achieve measurably better results",
    "Collaborated on documentation of prompt experiments and maintained detailed records",
    "Built knowledge base of prompt patterns and best practices for team-wide reuse",
  ];

  return (
    <section id="experience" className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 60% 40% at 50% 50%, #8B5CF608, transparent)` }} />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7 }} className="text-center mb-16">
          <SectionLabel>Journey</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily:"'Syne',system-ui", color: C.text }}>Experience</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Timeline line */}
          <motion.div className="absolute left-6 top-8 bottom-0 w-px" initial={{ scaleY:0, originY:0 }} animate={inView ? { scaleY:1 } : {}} transition={{ duration:1.5, ease:[0.16,1,0.3,1] }}
            style={{ background:`linear-gradient(to bottom, ${C.primary}, transparent)` }} />

          <motion.div initial={{ opacity:0, x:-30 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.8, delay:0.3 }}
            className="pl-16 relative">
            {/* Timeline dot */}
            <div className="absolute left-3.5 top-6 w-5 h-5 rounded-full flex items-center justify-center" style={{ background:`linear-gradient(135deg, ${C.primary}, #8B5CF6)`, boxShadow:`0 0 20px ${C.primary}60` }}>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>

            <div className="p-7 rounded-3xl" style={{ background:"rgba(255,255,255,0.025)", border:`1px solid rgba(99,102,241,0.15)`, backdropFilter:"blur(20px)" }}>
              {/* Gradient top accent */}
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background:`linear-gradient(90deg, transparent, ${C.primary}60, transparent)` }} />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1" style={{ color: C.text }}>Prompt Engineering Intern</h3>
                  <p className="text-sm" style={{ color: C.primary }}>Remote / Online</p>
                </div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap self-start" style={{ background:`${C.secondary}15`, border:`1px solid ${C.secondary}30`, color: C.secondary }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.secondary }} />
                  2025 — Present
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {items.map((item, i) => (
                  <motion.div key={i} initial={{ opacity:0, x:-15 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ delay: 0.5+i*0.07, duration:0.5 }}
                    className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: C.textMuted }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background:`${C.primary}80` }} />
                    {item}
                  </motion.div>
                ))}
              </div>

              <div className="pt-5 border-t" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: C.textMuted }}>Key Learnings</p>
                <div className="flex flex-wrap gap-2">
                  {["LLM Architecture","Prompt Patterns","AI Optimization","Analytical Thinking","Documentation"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background:`${C.primary}12`, border:`1px solid ${C.primary}20`, color:"#A5B4FC" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
function Services() {
  const [ref, inView] = useReveal();
  return (
    <section id="services" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7 }} className="text-center mb-16">
          <SectionLabel>What I Offer</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily:"'Syne',system-ui", color: C.text }}>Services</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity:0, y:50 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.65, delay:i*0.1 }}
              whileHover={{ y:-8, transition:{ duration:0.25, ease:[0.16,1,0.3,1] } }}
              className="relative p-6 rounded-3xl group cursor-default overflow-hidden"
              style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", backdropFilter:"blur(10px)" }}>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:`radial-gradient(ellipse at top, ${s.color}10, transparent 70%)` }} />
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow:`inset 0 0 0 1px ${s.color}30` }} />
              <div className="relative">
                <motion.div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background:`${s.color}15`, border:`1px solid ${s.color}25` }}
                  whileHover={{ scale:1.1, rotate:5 }}>
                  {s.icon}
                </motion.div>
                <h3 className="font-bold mb-3" style={{ color: C.text }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
function Testimonials() {
  const [ref, inView] = useReveal();
  return (
    <section id="testimonials" className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 80% 40% at 50% 50%, ${C.primary}05, transparent)` }} />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7 }} className="text-center mb-16">
          <SectionLabel>Kind Words</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily:"'Syne',system-ui", color: C.text }}>Testimonials</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity:0, y:50 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7, delay:i*0.13 }}
              whileHover={{ y:-5, transition:{ duration:0.2 } }}
              className="relative p-7 rounded-3xl group overflow-hidden"
              style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", backdropFilter:"blur(10px)" }}>
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:`linear-gradient(135deg, ${C.primary}08, transparent)` }} />
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow:`inset 0 0 0 1px ${C.primary}25` }} />
              <div className="relative">
                <div className="text-5xl font-serif mb-4 leading-none" style={{ background:`linear-gradient(135deg, ${C.primary}, #A78BFA)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>"</div>
                <p className="text-sm leading-relaxed mb-6" style={{ color:"#9CA3AF" }}>{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full overflow-hidden ring-2" style={{ boxShadow:`0 0 0 2px ${C.primary}50` }}>
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display="none"; e.target.parentNode.style.background=`linear-gradient(135deg, ${C.primary}, #8B5CF6)`; }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: C.text }}>{t.name}</div>
                    <div className="text-xs" style={{ color: C.textMuted }}>{t.role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[...Array(5)].map((_,si) => <span key={si} className="text-sm" style={{ color: C.accent }}>★</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  const [ref, inView] = useReveal();
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name:"", email:"", message:"" });
      setTimeout(() => setStatus(null), 3500);
    }, 1200);
  };

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 60% 50% at 50% 100%, ${C.primary}08, transparent)` }} />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7 }} className="text-center mb-16">
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily:"'Syne',system-ui", color: C.text }}>Let's Build Something</h2>
          <p className="max-w-md mx-auto" style={{ color: C.textMuted }}>Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing together.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div initial={{ opacity:0, x:-40 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.8, delay:0.2 }}>
            <h3 className="text-lg font-bold mb-6" style={{ color: C.text }}>Contact Info</h3>
            <div className="space-y-3 mb-8">
              {[["✉️","Email","misbaamf005@gmail.com"],["📱","Phone","0591815425"],["📍","Location","Sirsi, Karnataka, India"],["⏰","Availability","Mon – Sat, 9AM – 6PM IST"]].map(([ic, label, val]) => (
                <motion.div key={label} whileHover={{ x:4 }} className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                  style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background:`${C.primary}15`, border:`1px solid ${C.primary}20` }}>{ic}</div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: C.textMuted }}>{label}</div>
                    <div className="text-sm font-medium" style={{ color: C.text }}>{val}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              {[["GitHub","#24292E"],["LinkedIn",C.primary]].map(([name, bg]) => (
                <motion.button key={name} whileHover={{ scale:1.05, boxShadow:`0 0 24px ${bg}50` }} whileTap={{ scale:0.97 }}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
                  style={{ background:`linear-gradient(135deg, ${bg}, ${bg}99)`, border:`1px solid ${bg}50` }}>
                  {name} ↗
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:40 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.8, delay:0.3 }}>
            <div className="p-7 rounded-3xl" style={{ background:"rgba(255,255,255,0.025)", border:`1px solid rgba(99,102,241,0.15)`, backdropFilter:"blur(20px)" }}>
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background:`linear-gradient(90deg, transparent, ${C.primary}60, transparent)` }} />
              <form onSubmit={handleSubmit} className="space-y-4">
                {[{key:"name",ph:"Your Full Name",type:"text"},{key:"email",ph:"Email Address",type:"email"}].map(f => (
                  <input key={f.key} type={f.type} placeholder={f.ph} value={form[f.key]}
                    onChange={e => setForm({...form,[f.key]:e.target.value})} required
                    className="w-full px-5 py-3.5 rounded-2xl text-sm outline-none transition-all"
                    style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color: C.text, caretColor: C.primary }}
                    onFocus={e => { e.target.style.borderColor = `${C.primary}60`; e.target.style.boxShadow = `0 0 0 3px ${C.primary}12`; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
                ))}
                <textarea placeholder="Tell me about your project or idea..." rows={5} value={form.message}
                  onChange={e => setForm({...form,message:e.target.value})} required
                  className="w-full px-5 py-3.5 rounded-2xl text-sm outline-none transition-all resize-none"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color: C.text, caretColor: C.primary }}
                  onFocus={e => { e.target.style.borderColor = `${C.primary}60`; e.target.style.boxShadow = `0 0 0 3px ${C.primary}12`; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }} />
                <motion.button type="submit" disabled={status==="sending"}
                  whileHover={{ scale:1.02, boxShadow:`0 0 40px ${C.primary}50` }} whileTap={{ scale:0.98 }}
                  className="w-full py-4 rounded-2xl font-bold text-white transition-all relative overflow-hidden"
                  style={{ background:`linear-gradient(135deg, ${C.primary}, #8B5CF6)`, boxShadow:`0 8px 32px ${C.primary}30` }}>
                  <AnimatePresence mode="wait">
                    {status === "sending" ? (
                      <motion.span key="sending" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex items-center justify-center gap-2">
                        <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.8, ease:"linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Sending...
                      </motion.span>
                    ) : status === "sent" ? (
                      <motion.span key="sent" initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} className="flex items-center justify-center gap-2">
                        <span style={{ color: C.secondary }}>✓</span> Message Sent!
                      </motion.span>
                    ) : (
                      <motion.span key="default" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                        Send Message →
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-10 relative" style={{ borderTop:"1px solid rgba(99,102,241,0.1)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background:`linear-gradient(to top, ${C.primary}04, transparent)` }} />
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-black text-lg" style={{ fontFamily:"'Syne',system-ui", background:`linear-gradient(90deg, ${C.primary}, #A78BFA)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>M·AMF</span>
        <p className="text-xs" style={{ color: C.textMuted }}>© 2025 Misba AMF · All rights reserved · Made with ♥ in Sirsi</p>
        <div className="flex gap-5">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-xs transition-colors hover:text-white" style={{ color: C.textMuted }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    if (!loading) {
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
        { threshold: 0.35 }
      );
      document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
      return () => obs.disconnect();
    }
  }, [loading]);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily:"'DM Sans','Plus Jakarta Sans',system-ui" }} className="min-h-screen overflow-x-hidden">
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <AnimatePresence>{loading && <Loader onDone={() => setLoading(false)} />}</AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.4 }}>
          <Navbar active={activeSection} />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Services />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  );
}
