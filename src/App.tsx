import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, ChevronDown } from "lucide-react";

const INVITATION = {
  couple: {
    bride: "ජනනි",
    groom: "හසුන්",
    brideFull: "ජනනි කරුණාරත්න",
    groomFull: "හසුන් පරගොඩ ලියනගේ",
  },
  date: {
    displayNumeric: "10 . 12 . 2026",
    displayLong: "2026 දෙසැම්බර් මස 10 වන දින",
    countdownTarget: "2026-12-10T09:30:00+05:30",
  },
  time: {
    ceremonyStart: "පෙ.ව. 9:30",
    ceremonyEnd: "ප.ව. 4:00",
    welcome: "උදෑසන 8:00",
  },
  venue: {
    name: "The Golden Crown Ballroom",
    hotel: "Heritage Hotel",
    city: "Anuradhapura",
    mapQuery: "Heritage Hotel, Anuradhapura",
    googleMapsLink: "https://maps.app.goo.gl/EXhT4sxjjX6SBCRp6",
  },
  rsvpContacts: [
    "W. M. S. Karunarathne - 071 419 4178",
    "P. L. Chandrasena - 071 487 8852",
  ],
} as const;

const backgroundMusic = "/Sihilel_Wu_Sihineka-Pravegaya_Movie___Bathiya_And_Santhush_Sarigama_lk.mp3";
const googleScriptUrl =
  "https://script.google.com/macros/s/AKfycbwxIzEgbWhN1mIGbFiI4YIKGqa4S5dylwrDaNkoMZVkUzEmhES9QVqDm2YIgXo3sepF/exec";

const publicImagePath = (fileName: string) => `/images/${fileName.replaceAll(" ", "%20")}`;
const preImagePath = (fileName: string) => `/pre/${fileName.replaceAll(" ", "%20")}`;

const PRE_IMAGES = [
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.13.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34 (1).jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.34.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.19.35.jpeg"),
  preImagePath("WhatsApp Image 2026-05-14 at 00.20.09.jpeg"),
];

const HERO_BACKGROUND_IMAGE = PRE_IMAGES[4];
const COUPLE_IMAGES = ["/c1.jpeg", "/c2.jpeg"];
const THEME_WATERMARK_IMAGE = "/Gemini_Generated_Image_bu4x6cbu4x6cbu4x.jpg";

function FloatingPetals() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      rotation: number;
      duration: number;
      delay: number;
      color: string;
      drift: number;
    }>
  >([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#d4af37", "#f2df96", "#8f7322", "#b5932f", "#fdf8e6"];
    const petalCount = isMobile ? 10 : 18;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 7 + 7,
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_10px_rgba(110,87,20,0.3)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CountdownTimer({ isDark = false, lang = "si" }: { isDark?: boolean, lang?: "si" | "en" }) {
  const targetDate = new Date(INVITATION.date.countdownTarget).getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: lang === "si" ? "දින" : "Days", value: days },
    { label: lang === "si" ? "පැය" : "Hours", value: hours },
    { label: lang === "si" ? "මිනිත්තු" : "Mins", value: minutes },
    { label: lang === "si" ? "තත්පර" : "Secs", value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          <div
            className={`relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 group-hover:-translate-y-3 ${isDark ? "bg-[#8f7322] " : "bg-white "
              }`}
          >
            <div
              className={`absolute inset-1.5 sm:inset-2 md:inset-3 ] rounded-t-full pointer-events-none ${isDark ? "" : ""
                }`}
            />

            <span
              className={`font-numeric text-2xl sm:text-3xl md:text-5xl leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110 ${isDark ? "text-white" : "text-[#8f7322]"
                }`}
            >
              {Math.max(0, stat.value).toString().padStart(2, "0")}
            </span>

            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span
                className={`text-[5px] sm:text-[6px] md:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap ${isDark
                  ? "bg-white/10 text-white "
                  : "bg-stone-50 text-stone-500 "
                  }`}
              >
                {stat.label}
              </span>
            </div>

            <div
              className={`absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 ${isDark ? "bg-white/40" : "bg-[#d4af37]"
                }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Gallery({ lang = "si" }: { lang?: "si" | "en" }) {
  const marqueeImages = [...PRE_IMAGES, ...PRE_IMAGES, ...PRE_IMAGES];

  return (
    <section className="relative py-14 md:py-40 bg-transparent overflow-hidden">
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-10 md:mb-16 px-6"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[#1b4332] font-bold tracking-[0.8em] text-sm md:text-base opacity-40 uppercase">
              Captured Moments
            </span>
            <div className="h-px w-16 bg-[#e6c555]/30" />
          </div>
          <h2 className="text-5xl md:text-8xl bg-gradient-to-r from-[#b5932f] via-[#8f7322] to-[#b5932f] bg-clip-text text-transparent italic leading-none">
            සුන්දර මතක
          </h2>
          <p className="text-[#8f7322]/70 text-sm md:text-base tracking-[0.3em] font-medium max-w-2xl mx-auto pt-2 leading-loose">
            අපගේ ආදර කතාවේ සුන්දරතම මොහොතක් ඔබ සමඟ බෙදා ගැනීමට අප සතුටින් බලා සිටිමු.
          </p>
        </motion.div>

        <div className="relative flex overflow-x-hidden w-full py-4 mask-gradient">
          <motion.div
            className="flex gap-6 md:gap-10 pr-6 md:pr-10 shrink-0"
            animate={{
              x: [0, "-33.33%"],
            }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity,
            }}
          >
            {marqueeImages.map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative w-[280px] h-[380px] md:w-[350px] md:h-[480px] shrink-0 overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(143,115,34,0.15)] group"
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-4 rounded-[2rem] z-20 pointer-events-none group-hover:inset-6 transition-all duration-700" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function WeddingInvitation() {
  const [lang, setLang] = useState<'si' | 'en'>('si');
  const [hasStarted, setHasStarted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);
  const [isPlayingIntroVideo, setIsPlayingIntroVideo] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get("to");

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    guests: "1",
  });

  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  const submitToGoogleSheet = async (payload: Record<string, string>) => {
    if (!googleScriptUrl) {
      throw new Error("Google Script URL tl ilid ke;");
    }

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      body: new URLSearchParams(payload),
    });

    if (!response.ok) {
      throw new Error("b,a,Su id¾:l fkdùh");
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setRsvpStatus("error");
      return;
    }

    setRsvpStatus("sending");

    try {
      await submitToGoogleSheet({
        action: "rsvp",
        name: rsvpForm.name.trim(),
        guests: rsvpForm.guests,
        dietaryNotes: "",
      });

      setRsvpStatus("success");
      setRsvpForm({ name: "", guests: "1" });
    } catch {
      setRsvpStatus("error");
    }
  };



  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isOpened && !isPlaying && !hasAttemptedAutoplay && audioRef.current) {
      setHasAttemptedAutoplay(true);

      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          const playOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  window.removeEventListener("click", playOnInteraction);
                })
                .catch(() => { });
            }
          };

          window.addEventListener("click", playOnInteraction);
        });
    }
  }, [isOpened, isPlaying, hasAttemptedAutoplay]);

  useEffect(() => {
    if (introVideoRef.current && !hasStarted) {
      introVideoRef.current.play().catch((err) => {
        console.log("Intro video autoplay failed:", err);
      });
    }
  }, [hasStarted]);

  return (
    <main
      className={`dl-manel-bold h-[100dvh] w-full bg-[#E8E0CF] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden flex items-center justify-center"
        } relative scroll-smooth`}
    >
      <FloatingPetals />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="intro-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            className="fixed inset-0 z-[100] overflow-hidden bg-[#F1EBDD] flex items-center justify-center"
          >
            {isPlayingIntroVideo ? (
              <div className="fixed inset-0 z-[150] bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={introVideoRef}
                  playsInline
                  preload="auto"
                  autoPlay
                  muted
                  className="w-full h-full object-cover z-50 absolute inset-0 opacity-80"
                  onEnded={() => {
                    setIsOpened(true);
                    if (audioRef.current && !isPlaying) {
                      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play failed:", err));
                    }
                  }}
                  onError={(e) => { console.error("Video error:", e); setIsOpened(true); }}
                >
                  <source src="/gemini_generated_video_4c130e0c.mp4" type="video/mp4" />
                </video>

              </div>
            ) : (
              <>
                <div className="absolute inset-0 z-[1]" style={{ backgroundColor: "#F1EBDD", backgroundImage: 'url("/Ornate%20Countryside%20Parchment%20Frame.png")', backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} />
                
                <div className="pointer-events-none absolute inset-0 overflow-hidden z-[2]" style={{ opacity: 0.16 }}>
                  <div className="absolute top-1/2 right-0 h-[250vw] w-[250vw] -translate-y-1/2 translate-x-1/2 md:right-auto md:left-1/2 md:h-[min(200vw,1200px)] md:w-[min(200vw,1200px)] md:-translate-x-1/2">
                    <motion.div 
                      style={{ width: "100%", height: "100%" }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    >
                      <div aria-hidden="true" style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url(/Gemini_Generated_Image_e4kwdre4kwdre4kw-removebg-preview.png)", maskImage: "url(/Gemini_Generated_Image_e4kwdre4kwdre4kw-removebg-preview.png)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
                    </motion.div>
                  </div>
                </div>

                <button
                  onClick={toggleMusic}
                  aria-label="Toggle music"
                  title="Toggle music"
                  className="absolute right-4 top-4 z-[110] grid h-11 w-11 place-items-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 active:scale-90 sm:right-6 sm:top-6"
                  style={{
                    background: "linear-gradient(135deg, rgb(122, 31, 26), rgb(92, 20, 15))",
                    color: "rgb(232, 216, 164)",
                    border: "1px solid rgba(92, 20, 15, 0.55)",
                    boxShadow: "rgba(142, 116, 39, 0.6) 0px 14px 28px -14px"
                  }}
                >
                  <span className="relative grid place-items-center">
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music2 h-5 w-5">
                        <circle cx="8" cy="18" r="4"></circle><path d="M12 18V2l7 4"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music2 h-5 w-5">
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                        <circle cx="8" cy="18" r="4"></circle><path d="M12 18V2l7 4"></path>
                      </svg>
                    )}
                    <span aria-hidden="true" className="absolute inset-[-8px] rounded-full" style={{ border: "1px solid rgba(232, 216, 164, 0.55)", transform: "scale(1.06328)" }}></span>
                  </span>
                                </button>



                <div className="relative z-[105] flex flex-col items-center px-8 text-center" style={{ transform: "translateY(-4px)" }}>
                  <div>
                    <div aria-hidden="true" style={{ width: "min(56vw,260px)", height: "min(20vw,94px)", background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url('/image-removebg-preview (4).png')", maskImage: "url('/image-removebg-preview (4).png')", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
                  </div>
                  
                  <p className="mt-7" aria-label="සාදර ඇරයුමයි !">
                    <span aria-hidden="true" className={lang === "si" ? "font-sinhala-name" : "font-english-title tracking-wide"} style={{ fontVariantLigatures: "none", color: "#8C6420", fontSize: "clamp(1.7rem,7vw,2.8rem)", lineHeight: 1.2 }}>{lang === 'si' ? 'සාදර ඇරයුමයි' : 'You\'re Invited'}</span>
                    <span aria-hidden="true" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, color: "#8C6420", fontSize: "clamp(1.7rem,7vw,2.8rem)", lineHeight: 1.2 }}>{lang === 'si' ? ' !' : '!'}</span>
                  </p>

                  <p className="mt-4" aria-hidden="true" style={{ fontSize: "clamp(1.4rem,5.5vw,2.1rem)", display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <span className={lang === "si" ? "font-sinhala-name" : "font-english-title tracking-wide"} style={{ fontVariantLigatures: "none", color: "#B98A2F" }}>{lang === 'si' ? 'ජනනි' : 'Janani'}</span>
                    <span style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#8C6420", fontWeight: 700 }}>{lang === 'si' ? 'සහ' : 'and'}</span>
                    <span className={lang === "si" ? "font-sinhala-name" : "font-english-title tracking-wide"} style={{ fontVariantLigatures: "none", color: "#B98A2F" }}>{lang === 'si' ? 'හසුන්' : 'Hasun'}</span>
                  </p>

                  <button 
                    type="button" 
                    onClick={() => {
                      setHasStarted(true);
                      setIsPlayingIntroVideo(true);
                      if (audioRef.current && !isPlaying) {
                        audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play failed:", err));
                      }
                    }}
                    className="mt-9 inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-1.5 text-[1.05rem] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95" 
                    style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 600, color: "#FDF8EC", background: "linear-gradient(135deg, #B98A2F, #8C6420)", boxShadow: "0 12px 24px -12px rgba(120,86,30,0.7)" }}
                  >
                    {lang === 'si' ? 'ආරාධනය විවෘත කරන්න' : 'Open Invitation'}
                                    </button>

                  <div className="flex items-center gap-0.5 rounded-full p-1 mt-6" role="group" aria-label="Invitation language" style={{ background: "rgba(255, 253, 246, 0.9)", border: "1px solid rgba(185, 138, 47, 0.45)", boxShadow: "0 10px 24px -12px rgba(120,86,30,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                    <button onClick={() => setLang('si')} type="button" aria-pressed={lang === 'si'} className="rounded-full px-3 py-1 text-[0.78rem] font-semibold transition-colors" style={lang === 'si' ? { fontFamily: `${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, background: "linear-gradient(135deg, #B98A2F, #8C6420)", color: "#FDF8EC" } : { fontFamily: `${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, background: "transparent", color: "#8C6420" }}>සිං</button>
                    <button onClick={() => setLang('en')} type="button" aria-pressed={lang === 'en'} className="rounded-full px-3 py-1 text-[0.78rem] font-semibold transition-colors" style={lang === 'en' ? { fontFamily: "'Montserrat', sans-serif", background: "linear-gradient(135deg, #B98A2F, #8C6420)", color: "#FDF8EC" } : { fontFamily: "'Montserrat', sans-serif", background: "transparent", color: "#8C6420" }}>EN</button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
            style={{ background: 'url("/Gemini_Generated_Image_axw9l3axw9l3axw9.jpg") center/cover fixed no-repeat' }}
          >
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[15]" style={{ backgroundImage: `url("${THEME_WATERMARK_IMAGE}")`, backgroundSize: "cover", backgroundPosition: "62% center", backgroundRepeat: "no-repeat", opacity: 0.16, mixBlendMode: "multiply" }}></div>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setLang(l => l === 'si' ? 'en' : 'si')}
              className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-4 py-3 rounded-full shadow-lg text-[#8f7322] hover:bg-emerald-50 transition-colors font-bold tracking-widest text-[11px]"
            >
              {lang === 'si' ? 'EN' : 'සිංහල'}
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-[#8f7322] hover:bg-emerald-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[11px] tracking-widest font-bold">{lang === 'si' ? 'වසා දමන්න' : 'Close'}</div>
              </div>
            </motion.button>

            <section id="hero" className="relative overflow-hidden pb-0 bg-[#F1EBDD]">
              <div className="pointer-events-none relative mx-auto flex justify-center" aria-hidden="true">
                <div style={{ width: "min(72vw, 520px)", height: "min(72vw, 520px)", marginTop: "calc(-0.5 * min(72vw, 520px))", animation: "spin-slow 40s linear infinite" }}>
                  <div aria-hidden="true" style={{ width: "100%", height: "100%", opacity: 0.9, background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url(/Gemini_Generated_Image_e4kwdre4kwdre4kw-removebg-preview.png)", maskImage: "url(/Gemini_Generated_Image_e4kwdre4kwdre4kw-removebg-preview.png)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
                </div>
              </div>
              
              <div className="relative mx-auto max-w-2xl px-6 text-center sm:px-8 pb-12 z-10 mt-6">
                <div>
                  <h1 aria-label="සාදර ඇරයුමයි !" className="-mt-1" style={{ fontSize: "clamp(2.1rem,8.5vw,3.4rem)", lineHeight: 1.25, backgroundImage: "linear-gradient(170deg, #D8B45F 0%, #B98A2F 45%, #8C6420 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                    <span aria-hidden="true" className={lang === "si" ? "font-sinhala-name" : "font-english-title tracking-wide"} style={{ fontVariantLigatures: "none" }}>{lang === 'si' ? 'සාදර ඇරයුමයි' : 'You\'re Invited'}</span>
                    <span aria-hidden="true" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif", fontWeight: 600 }}> !</span>
                  </h1>
                </div>
                
                <div className="mt-7 grid grid-cols-2 gap-5 sm:gap-10">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[0.95rem] leading-[1.8] sm:text-base text-[#5A4A33] whitespace-pre-line text-center" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      {lang === 'si' ? `කරුණාරත්න මහතා සහ
                      මහත්මිය
                      යන දෙපළගේ
                      ආදරණීය දියණිය` : `Loving daughter of
                      Mr. & Mrs.
                      Karunarathna`}
                    </p>
                    <p className="mt-auto" aria-label={lang === 'si' ? INVITATION.couple.brideFull : 'Janani Karunarathna'}>
                      <span aria-hidden="true" className={lang === "si" ? "font-sinhala-name whitespace-nowrap" : "font-english-title tracking-wide whitespace-nowrap"} style={{ fontVariantLigatures: "none", color: "#8C6420", fontSize: "clamp(1.4rem,4.2vw,2rem)", lineHeight: 1.15 }}>
                        {lang === 'si' ? 'ජනනි' : 'Janani'}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[0.95rem] leading-[1.8] sm:text-base text-[#5A4A33] whitespace-pre-line text-center" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                      {lang === 'si' ? `පරගොඩ ලියනගේ මහතා සහ
                      මහත්මිය
                      යන දෙපළගේ
                      ආදරණීය පුත්‍රයා` : `Loving son of
                      Mr. & Mrs.
                      Paragoda Liyanage`}
                    </p>
                    <p className="mt-auto" aria-label={lang === 'si' ? INVITATION.couple.groomFull : 'Hasun Paragoda Liyanage'}>
                      <span aria-hidden="true" className={lang === "si" ? "font-sinhala-name block text-center" : "font-english-title tracking-wide block text-center"} style={{ fontVariantLigatures: "none", color: "#8C6420", fontSize: "clamp(1.4rem,4.2vw,2rem)", lineHeight: 1.15 }}>
                        {lang === 'si' ? 'හසුන්' : 'Hasun'}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="relative mx-auto mt-7 w-[min(84%,440px)]">
                  <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "150%", height: "128%", zIndex: 0, background: "radial-gradient(60% 58% at 50% 46%, rgba(252, 248, 238, 0.96) 0%, rgba(252, 248, 238, 0.85) 38%, rgba(252, 248, 238, 0.5) 62%, rgba(252, 248, 238, 0) 82%)" }}></div>
                  <div aria-hidden="true" className="pointer-events-none absolute bottom-[8%] left-1/2 -translate-x-1/2" style={{ width: "62%", height: "9%", zIndex: 1, borderRadius: "50%", background: "radial-gradient(50% 50% at 50% 50%, rgba(140, 100, 32, 0.22) 0%, rgba(140, 100, 32, 0) 70%)", filter: "blur(4px)" }}></div>
                  <img src="/ChatGPT%20Image%20Sep%2023,%202026,%2002_48_11%20AM.png" alt={lang === 'si' ? 'ජනනි සහ හසුන්' : 'Janani & Hasun'} loading="eager" draggable="false" className="relative z-[2] w-full select-none rounded-[2rem] object-cover" />
                </div>
                
                <p className="mx-auto mt-6 max-w-[36ch] text-[1.02rem] leading-[1.9] text-[#5A4A33]" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                  {lang === 'si' ? 'චාරිත්‍රානුකූලව අතිනත ගැනීමේ ප්‍රීතිය නිමිත්තෙන්' : 'On the joyous occasion of their marriage'}
                </p>
                
                <div className="mt-4">
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: "#8C6420", fontSize: "clamp(1.3rem,3.4vw,1.8rem)", letterSpacing: "0.18em" }}>
                    2026
                  </div>
                  <div className="mx-auto mt-1.5 flex max-w-md items-center justify-center gap-4 sm:gap-6">
                    <span className="flex-1 py-1.5 text-center text-[#5A4A33] font-bold" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif", fontSize: "clamp(1.05rem,2.8vw,1.3rem)", borderTop: "1.5px solid rgba(140, 100, 32, 0.85)", borderBottom: "1.5px solid rgba(140, 100, 32, 0.85)" }}>
                      {lang === 'si' ? 'දෙසැම්බර්' : 'December'}
                    </span>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, color: "#8C6420", fontSize: "clamp(3rem,10vw,4.4rem)", lineHeight: 0.95 }}>
                      10
                    </span>
                    <span className="flex-1 py-1.5 text-center text-[#5A4A33] font-bold" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif", fontSize: "clamp(1.05rem,2.8vw,1.3rem)", borderTop: "1.5px solid rgba(140, 100, 32, 0.85)", borderBottom: "1.5px solid rgba(140, 100, 32, 0.85)" }}>
                      {lang === 'si' ? 'බ්‍රහස්පතින්දා' : 'Thursday'}
                    </span>
                  </div>
                  <div className="mt-2.5 text-[1rem] text-[#5A4A33]" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                    {lang === 'si' ? 'උදෑසන 8:00 සිට හවස 4:00 දක්වා' : 'From 8:00 AM until 4:00 PM'}
                  </div>
                  <p className="mt-1 text-[0.92rem]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#8A7A60" }}>
                    {lang === 'si' ? `(පෝරුවේ චාරිත්‍ර ${INVITATION.time.ceremonyStart} ට)` : `(Poruwa Ceremony at 9:30 A.M.)`}
                  </p>
                </div>
                
                <div className="mt-6 flex flex-col items-center gap-1.5">
                  <p className="font-bold text-[#5A4A33]" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif", fontSize: "clamp(1.1rem,3vw,1.35rem)" }}>
                    {INVITATION.venue.name}
                  </p>
                  <p className="font-bold text-[#5A4A33]" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif", fontSize: "clamp(1rem,2.6vw,1.15rem)" }}>
                    {INVITATION.venue.hotel}
                  </p>
                  <p className="max-w-[40ch] text-[1rem] leading-[1.85] text-[#5A4A33]" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                    {lang === 'si' ? 'හෝටල් පරිශ්‍රයේ දී පැවැත්වෙන මංගල උත්සවයට' : 'to the wedding reception held at the hotel premises'}
                  </p>
                  <p className="max-w-[40ch] text-[1rem] leading-[1.85] text-[#5A4A33]" style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}>
                    {lang === 'si' ? 'ඔබට අපි ගෞරවයෙන් ආරාධනා කරන්නෙමු.' : 'We respectfully invite you.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="relative w-full bg-[#F1EBDD] pt-12 md:pt-16 pb-16 flex flex-col items-center overflow-hidden border-t border-[#8C6420]/10">
              <div className="relative mx-auto max-w-2xl text-center z-10 px-6 w-full">
                <span className="mb-2 block text-[0.66rem] uppercase tracking-[0.34em]" style={{ fontFamily: "'Montserrat', sans-serif", color: "#B98A2F" }}>
                  Countdown
                </span>
                
                <h2 style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, color: "#8C6420", fontSize: "clamp(1.6rem,4vw,2.3rem)" }}>
                  {lang === 'si' ? 'අපේ සුබ දවස උදා වීමට...' : 'Until our special day...'}
                </h2>
                
                <div aria-hidden="true" className="mt-3" style={{ width: "120px", aspectRatio: "2100 / 756", margin: "0 auto", background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url(/lotus-mandala/lotus-flourish.svg)", maskImage: "url(/lotus-mandala/lotus-flourish.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
                
                <div className="mt-2 mb-8 w-full flex justify-center">
                  <CountdownTimer isDark={false} lang={lang} />
                </div>
                
                <p className="mt-8 text-[0.95rem] font-bold" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#8A7A60" }}>
                  {lang === 'si' ? '2026 දෙසැම්බර් 10 බ්‍රහස්පතින්දා' : 'Thursday, December 10, 2026'}
                </p>
              </div>
            </section>

            <section id="moments" className="relative z-10 w-full overflow-hidden bg-[#F1EBDD] px-6 py-16 sm:px-7 sm:py-24 border-t border-[#8C6420]/10">
              <div className="mb-10 text-center sm:mb-14">
                <span className="mb-2 block text-[0.66rem] uppercase" style={{ color: "#B98A2F", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.34em" }}>
                  Our Moments
                </span>
                <h2 className="leading-tight" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, color: "#8C6420", fontSize: "clamp(1.7rem,4.2vw,2.6rem)" }}>
                  {lang === 'si' ? 'අපේ සුන්දර මතක' : 'Our Moments'}
                </h2>
                <div aria-hidden="true" className="mt-3" style={{ width: "120px", aspectRatio: "2100 / 756", margin: "0 auto", background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url(/lotus-mandala/lotus-flourish.svg)", maskImage: "url(/lotus-mandala/lotus-flourish.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
              </div>

              <div className="mx-auto grid max-w-2xl grid-cols-2 items-start gap-4 sm:gap-8">
                {COUPLE_IMAGES.map((src, i) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: i * 0.2 }}
                    className={i === 1 ? "mt-10 sm:mt-16" : ""}
                  >
                    <div className="p-1.5 sm:p-2" style={{ background: "#FCF8EE", border: "1px solid rgba(185, 138, 47, 0.45)", borderRadius: "999px 999px 18px 18px", boxShadow: "0 22px 44px -28px rgba(120,86,30,0.55)" }}>
                      <div className="overflow-hidden" style={{ aspectRatio: "3 / 4", borderRadius: "999px 999px 12px 12px", border: "1px solid rgba(216, 180, 95, 0.7)" }}>
                        <img src={src} alt={lang === 'si' ? 'ජනනි සහ හසුන්' : 'Janani & Hasun'} loading="lazy" draggable="false" className="h-full w-full select-none object-cover" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="mx-auto mt-10 max-w-[36ch] text-center text-[1.02rem] leading-[1.9] text-[#5A4A33] sm:mt-14" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif` }}>
                {lang === 'si' ? 'එකට ගෙවූ සෑම මොහොතක්ම අපට වටිනා මතකයකි.' : 'Every moment spent together is a memory we treasure.'}
              </p>
            </section>

            <section id="events" className="relative mx-auto w-full px-6 py-16 sm:px-7 sm:py-24"
              style={{
                backgroundImage: 'url("/vintage_paper.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
              <div className="mb-10 text-center sm:mb-14">
                <span className="mb-2 block text-[0.66rem] uppercase" style={{ color: "#B98A2F", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.34em" }}>
                  Event Details
                </span>
                <h2 className="leading-tight" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, color: "#8C6420", fontSize: "clamp(1.7rem,4.2vw,2.6rem)" }}>
                  {lang === 'si' ? 'උත්සව විස්තර' : 'Event Details'}
                </h2>
                <div aria-hidden="true" className="mt-3" style={{ width: "120px", aspectRatio: "2100 / 756", margin: "0 auto", background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url(/lotus-mandala/lotus-flourish.svg)", maskImage: "url(/lotus-mandala/lotus-flourish.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
              </div>
              
              <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-5 sm:gap-8 relative z-10">
                <div className="group flex w-full flex-col items-center gap-2 px-8 pb-10 pt-12 text-center sm:w-[calc((100%-2rem)/2)]" style={{ background: "rgb(252, 248, 238)", border: "1px solid rgba(185, 138, 47, 0.35)", borderRadius: "999px 999px 18px 18px", boxShadow: "rgba(120, 86, 30, 0.45) 0px 16px 36px -26px" }}>
                  <span className="mb-1 grid h-16 w-16 place-items-center rounded-full transition-transform duration-300 group-hover:scale-110" style={{ background: "linear-gradient(150deg, #D8B45F, #B98A2F 55%, #8C6420)", color: "#FDF8EC", boxShadow: "0 10px 20px -10px rgba(120,86,30,0.7)" }}>
                    <MapPin className="w-7 h-7 text-[#FDF8EC]" />
                  </span>
                  <h3 style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, color: "#8C6420", fontSize: "clamp(1.15rem,3vw,1.4rem)", lineHeight: 1.3 }}>
                    {lang === 'si' ? 'මංගල උත්සවය සහ පෝරුවේ චාරිත්‍රය' : 'Wedding Reception & Poruwa Ceremony'}
                  </h3>
                  <div style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#5A4A33", fontSize: "clamp(0.98rem,2.4vw,1.08rem)" }}>
                    {INVITATION.venue.name} – {INVITATION.venue.hotel}
                  </div>
                  <span className="my-1.5 h-px w-10" style={{ background: "#D8B45F" }} aria-hidden="true"></span>
                  <p className="text-[0.95rem] leading-[1.8]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#8A7A60" }}>
                    {lang === 'si' ? 'පෝරුවේ චාරිත්‍රය:' : 'Poruwa Ceremony:'} {lang === 'si' ? INVITATION.time.ceremonyStart : '9:30 A.M.'} {lang === 'si' ? 'ට' : ''}
                  </p>
                </div>
              </div>
              
              <div className="mx-auto mt-12 max-w-md space-y-4 relative z-10">
                <div className="relative">
                  <div className="rounded-2xl overflow-hidden" style={{ background: "#FCF8EE", border: "1px solid rgba(185, 138, 47, 0.4)", boxShadow: "0 18px 38px -28px rgba(140, 100, 32, 0.35)" }}>
                    <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Janani+and+Hasun&dates=20261210T023000Z/20261210T103000Z&details=Join+us+to+celebrate+the+wedding+of+Janani+and+Hasun!&location=The+Golden+Crown+Ballroom,+Heritage+Hotel,+Anuradhapura,+Sri+Lanka" target="_blank" rel="noopener noreferrer" className="w-full flex items-center text-left transition-colors hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 gap-4 px-4 sm:px-5 py-4">
                      <span className="flex-shrink-0 rounded-full flex items-center justify-center transition-colors w-10 h-10" style={{ background: "linear-gradient(135deg, #B98A2F, #8C6420)" }}>
                        <Calendar className="w-5 h-5 text-[#FDF8EC]" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block leading-tight text-lg" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#8C6420" }}>{lang === 'si' ? 'දිනය සුරකින්න' : 'Save the Date'}</span>
                        <span className="block text-xs mt-0.5" style={{ color: "rgba(90, 74, 51, 0.65)" }}>{lang === 'si' ? 'ඔබගේ දින දර්ශනයට එක් කරන්න' : 'Add to your calendar'}</span>
                      </span>
                      <span className="flex-shrink-0 rounded-full flex items-center justify-center w-8 h-8" style={{ backgroundColor: "rgba(140, 100, 32, 0.06)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-4 h-4" style={{ color: "rgb(140, 100, 32)" }}><path d="m9 18 6-6-6-6"></path></svg>
                      </span>
                    </a>
                  </div>
                </div>

                <div className="relative">
                  <div className="rounded-2xl overflow-hidden" style={{ background: "#FCF8EE", border: "1px solid rgba(185, 138, 47, 0.4)", boxShadow: "0 18px 38px -28px rgba(140, 100, 32, 0.35)" }}>
                    <a href={INVITATION.venue.googleMapsLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center text-left transition-colors hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 gap-4 px-4 sm:px-5 py-4">
                      <span className="flex-shrink-0 rounded-full flex items-center justify-center transition-colors w-10 h-10" style={{ background: "linear-gradient(135deg, #B98A2F, #8C6420)" }}>
                        <MapPin className="w-5 h-5 text-[#FDF8EC]" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block leading-tight text-lg" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#8C6420" }}>Google Maps</span>
                        <span className="block text-xs mt-0.5" style={{ color: "rgba(90, 74, 51, 0.65)" }}>{lang === 'si' ? 'ස්ථානය සොයා ගන්න' : 'Find the location'}</span>
                      </span>
                      <span className="flex-shrink-0 rounded-full flex items-center justify-center w-8 h-8" style={{ backgroundColor: "rgba(140, 100, 32, 0.06)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-4 h-4" style={{ color: "rgb(140, 100, 32)" }}><path d="m9 18 6-6-6-6"></path></svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section id="venue" className="mx-auto max-w-5xl px-6 py-9 sm:px-7 sm:py-12 relative z-10 w-full"
              style={{
                backgroundImage: 'url("/vintage_paper.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
              <div className="mb-10 text-center sm:mb-14">
                <span className="mb-2 block text-[0.66rem] uppercase" style={{ color: "#B98A2F", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.34em" }}>Location</span>
                <h2 className="leading-tight" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, color: "#8C6420", fontSize: "clamp(1.7rem,4.2vw,2.6rem)" }}>{lang === 'si' ? 'උත්සව ස්ථානය' : 'Venue Location'}</h2>
                <div aria-hidden="true" className="mt-3" style={{ width: "120px", aspectRatio: "2100 / 756", margin: "0 auto", background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url(/lotus-mandala/lotus-flourish.svg)", maskImage: "url(/lotus-mandala/lotus-flourish.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
              </div>
              <div className="flex flex-col gap-12 sm:gap-16">
                <div className="grid items-stretch gap-5 sm:gap-8 md:grid-cols-[0.85fr_1.15fr]">
                  <div className="flex flex-col justify-center">
                    <div className="flex flex-col items-center gap-3 px-8 py-9 text-center" style={{ background: "#FCF8EE", border: "1px solid rgba(185, 138, 47, 0.35)", borderRadius: "26px 26px 18px 18px", boxShadow: "0 16px 36px -26px rgba(120,86,30,0.45)" }}>
                      <img src="/Gemini_Generated_Image_q2pohsq2pohsq2po.jpg" alt="The Golden Crown Ballroom" loading="lazy" draggable="false" className="mb-2 w-full max-w-[440px] select-none rounded-[14px]" style={{ opacity: 0.95 }} />
                      <div className="flex flex-col gap-1">
                        <span className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif", color: "#B98A2F" }}>Venue</span>
                        <h3 style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, color: "#8C6420", fontSize: "1.2rem", lineHeight: 1.35 }}>The Golden Crown Ballroom</h3>
                        <p className="text-[0.95rem]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#8A7A60" }}>{INVITATION.venue.hotel}, {INVITATION.venue.city}, Sri Lanka.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="relative min-h-[300px] flex-1 overflow-hidden" style={{ borderRadius: "18px", border: "1px solid rgba(185, 138, 47, 0.4)", boxShadow: "0 28px 56px -34px rgba(120,86,30,0.5)" }}>
                      <iframe title="Map of The Golden Crown Ballroom" src={`https://maps.google.com/maps?q=${encodeURIComponent(INVITATION.venue.mapQuery)}&z=14&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" style={{ filter: "grayscale(0.2) saturate(0.9)" }}></iframe>
                    </div>
                    <a href={INVITATION.venue.googleMapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 self-center rounded-full px-7 py-3 text-[0.95rem] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 600, background: "linear-gradient(135deg, #B98A2F, #8C6420)", color: "#FDF8EC", boxShadow: "0 14px 26px -14px rgba(120,86,30,0.7)" }}>
                      <MapPin className="h-4 w-4" /> {lang === 'si' ? 'සිතියමෙන් බලන්න' : 'View on Map'}
                    </a>
                  </div>
                </div>
              </div>
            </section>


            <section id="rsvp" className="px-6 py-9 sm:px-7 sm:py-12 relative z-10 w-full" style={{ background: "rgba(237, 223, 184, 0.4)" }}>
              <div className="mx-auto max-w-xl text-center">
                <span className="mb-2 block text-[0.66rem] uppercase" style={{ color: "#B98A2F", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.34em" }}>RSVP</span>
                <h2 style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, color: "#8C6420", fontSize: "clamp(1.6rem,4vw,2.3rem)" }}>{lang === 'si' ? 'පැමිණීම දන්වන්න' : 'RSVP'}</h2>
                <div aria-hidden="true" className="mt-3" style={{ width: "120px", aspectRatio: "2100 / 756", margin: "0 auto", background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url(/lotus-mandala/lotus-flourish.svg)", maskImage: "url(/lotus-mandala/lotus-flourish.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
                
                <p className="mx-auto mb-2 mt-5 max-w-[44ch] leading-[1.85]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#8A7A60" }}>
                  {lang === 'si' ? 'ඔබගේ පැමිණීම අපට මහත් සතුටකි. කරුණාකර කලින් දන්වන්න.' : 'Your presence is our greatest joy. Please let us know in advance.'}
                </p>
                <p className="mb-9 text-[0.95rem]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 600, color: "#8C6420" }}>
                  {lang === 'si' ? 'කරුණාකර ඔබගේ පැමිණීම තහවුරු කරන්න' : 'Kindly confirm your attendance'}
                </p>
                
                <form onSubmit={handleRsvpSubmit} className="rounded-[120px_120px_22px_22px] px-6 pb-10 pt-16 text-left sm:px-12 sm:pt-20" style={{ background: "#FCF8EE", border: "1px solid rgba(185, 138, 47, 0.4)", boxShadow: "0 30px 60px -40px rgba(120,86,30,0.45)" }}>
                  <div className="mb-5 flex flex-col gap-1.5">
                    <label htmlFor="lm-name" className="text-[0.9rem]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 600, color: "#8C6420" }}>{lang === 'si' ? 'සම්පූර්ණ නම' : 'Full Name'}</label>
                    <input 
                      id="lm-name" 
                      type="text" 
                      required 
                      placeholder={lang === "si" ? "ඔබගේ නම" : "Your Name"} 
                      className="w-full px-4 py-3 focus:outline-none" 
                      style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, background: "#FCF8EE", border: "1px solid rgba(185, 138, 47, 0.45)", borderRadius: "10px", color: "#5A4A33" }} 
                      value={rsvpForm.name}
                      onChange={(e) => {
                        setRsvpStatus("idle");
                        setRsvpForm((prev) => ({ ...prev, name: e.target.value }));
                      }}
                    />
                  </div>
                  
                  <div className="mb-5">
                    <p className="mb-2.5 text-[0.9rem]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 600, color: "#8C6420" }}>{lang === 'si' ? 'සහභාගි වෙනවාද?' : 'Are you attending?'}</p>
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => {
                          setRsvpStatus("idle");
                          setRsvpForm((prev) => ({ ...prev, guests: "1" }));
                        }}
                        className="flex-1 px-3 py-3.5 text-center transition-colors" 
                        style={{ 
                          borderRadius: "10px", 
                          border: "1px solid rgba(185, 138, 47, 0.45)", 
                          background: rsvpForm.guests !== "0" ? "linear-gradient(135deg, #B98A2F, #8C6420)" : "transparent",
                          color: rsvpForm.guests !== "0" ? "#FDF8EC" : "#8A7A60",
                          fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, 
                          fontWeight: 600 
                        }}>
                        {lang === 'si' ? 'සතුටින් සහභාගි වෙමි' : 'Joyfully Attending'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setRsvpStatus("idle");
                          setRsvpForm((prev) => ({ ...prev, guests: "0" }));
                        }}
                        className="flex-1 px-3 py-3.5 text-center transition-colors" 
                        style={{ 
                          borderRadius: "10px", 
                          border: "1px solid rgba(185, 138, 47, 0.45)", 
                          background: rsvpForm.guests === "0" ? "linear-gradient(135deg, #B98A2F, #8C6420)" : "transparent",
                          color: rsvpForm.guests === "0" ? "#FDF8EC" : "#8A7A60",
                          fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, 
                          fontWeight: 600 
                        }}>
                        {lang === 'si' ? 'සහභාගි විය නොහැක' : 'Unable to Attend'}
                      </button>
                    </div>
                  </div>
                  
                  {rsvpForm.guests !== "0" && (
                    <div className="mb-5">
                      <p className="mb-2.5 text-[0.9rem]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 600, color: "#8C6420" }}>{lang === 'si' ? 'පැමිණෙන ගණන' : 'Number of Guests'}</p>
                      <div className="flex items-center justify-center gap-6">
                        <button 
                          type="button" 
                          onClick={() => {
                            setRsvpForm(prev => {
                              const current = parseInt(prev.guests) || 1;
                              return { ...prev, guests: Math.max(1, current - 1).toString() };
                            });
                          }}
                          className="grid h-11 w-11 place-items-center rounded-full text-xl transition-all hover:opacity-80 active:scale-90" 
                          style={{ background: "rgba(185, 138, 47, 0.12)", color: "#8C6420", border: "1px solid rgba(185, 138, 47, 0.5)" }} 
                          aria-label="Decrease guest count">
                          -
                        </button>
                        <span className="leading-none" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#8C6420", fontSize: "2.6rem", minWidth: "3rem", textAlign: "center" }}>
                          {parseInt(rsvpForm.guests) || 1}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setRsvpForm(prev => {
                              const current = parseInt(prev.guests) || 1;
                              return { ...prev, guests: (current + 1).toString() };
                            });
                          }}
                          className="grid h-11 w-11 place-items-center rounded-full text-xl transition-all hover:opacity-80 active:scale-90" 
                          style={{ background: "rgba(185, 138, 47, 0.12)", color: "#8C6420", border: "1px solid rgba(185, 138, 47, 0.5)" }} 
                          aria-label="Increase guest count">
                          +
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {(rsvpStatus === "success" || rsvpStatus === "error") && (
                    <p className={`text-xs text-center font-semibold mb-4 ${rsvpStatus === "success" ? "text-emerald-600" : "text-red-500"}`}>
                      {rsvpStatus === "success"
                        ? lang === "si" ? "ඔබගේ පැමිණීම තහවුරු කිරීම සාර්ථකව යවා ඇත." : "Your RSVP has been sent successfully."
                        : lang === "si" ? "කරුණාකර ඔබගේ නම ඇතුළත් කර නැවත උත්සාහ කරන්න." : "Please enter your name and try again."}
                    </p>
                  )}
                  
                  <button type="submit" disabled={rsvpStatus === "sending"} className="inline-flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[1.02rem] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, fontWeight: 700, background: "linear-gradient(135deg, #B98A2F, #8C6420)", color: "#FDF8EC", boxShadow: "0 14px 30px -12px rgba(120,86,30,0.6)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send h-4 w-4" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                    {rsvpStatus === "sending" ? (lang === "si" ? "යවමින්..." : "Sending...") : (lang === "si" ? "පිළිතුර යවන්න" : "Send RSVP")}
                  </button>
                </form>
              </div>
            </section>

            <section id="thank-you" className="relative z-10 w-full overflow-hidden px-6 py-16 sm:px-7 sm:py-24 bg-[#F1EBDD]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: `url("${THEME_WATERMARK_IMAGE}")`, backgroundSize: "cover", backgroundPosition: "62% center", backgroundRepeat: "no-repeat", opacity: 0.32 }}></div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 50%, rgba(252, 248, 238, 0.92) 0%, rgba(252, 248, 238, 0.7) 55%, rgba(241, 235, 221, 0.35) 100%)" }}></div>
              <div className="relative mx-auto max-w-xl text-center">
                <span className="mb-2 block text-[0.66rem] uppercase" style={{ color: "#B98A2F", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.34em" }}>Thank You</span>
                <h2 style={{ fontSize: "clamp(2rem,7vw,3rem)", lineHeight: 1.3, color: "#8C6420" }}>
                  <span className={lang === "si" ? "font-sinhala-name" : "font-english-title tracking-wide"} style={{ fontVariantLigatures: "none" }}>{lang === 'si' ? 'ස්තුතියි' : 'Thank You'}</span>
                </h2>
                <div aria-hidden="true" className="mt-3" style={{ width: "120px", aspectRatio: "2100 / 756", margin: "0 auto", background: "linear-gradient(180deg, #D8B45F 0%, #B98A2F 55%, #8C6420 100%)", WebkitMaskImage: "url(/lotus-mandala/lotus-flourish.svg)", maskImage: "url(/lotus-mandala/lotus-flourish.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
                <p className="mx-auto mt-6 max-w-[42ch] text-[1.02rem] leading-[1.9] text-[#5A4A33]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif` }}>
                  {lang === 'si' ? 'අපගේ ජීවිතයේ සුන්දරම දිනය ඔබගේ පැමිණීමෙන් සහ ආශිර්වාදයෙන් තවත් අර්ථවත් වනු ඇත. ඔබගේ ආදරයට සහ සුබ පැතුම්වලට අපගේ හෘදයාංගම ස්තුතිය.' : 'Your presence and blessings will make the most beautiful day of our lives even more meaningful. Our heartfelt thanks for your love and good wishes.'}
                </p>
                <p className="mt-5">
                  <span className={lang === "si" ? "font-sinhala-name" : "font-english-title tracking-wide"} style={{ fontVariantLigatures: "none", color: "#8C6420", fontSize: "clamp(1.4rem,4.2vw,2rem)", lineHeight: 1.15 }}>
                    {lang === 'si' ? 'ජනනි සහ හසුන්' : 'Janani & Hasun'}
                  </span>
                </p>
              </div>
            </section>

            <section id="footer" className="relative overflow-hidden w-full">
              <div className="relative px-6 py-9 text-center sm:py-12" style={{ background: "linear-gradient(180deg, #8C6420 0%, #6E4D16 100%)", color: "#F8F1DC" }}>
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" aria-hidden="true">
                  <div style={{ width: "420px", height: "420px", transform: "rotate(258.188deg)" }}>
                    <div aria-hidden="true" style={{ width: "100%", height: "100%", background: "#F8F1DC", WebkitMaskImage: "url(/Gemini_Generated_Image_e4kwdre4kwdre4kw-removebg-preview.png)", maskImage: "url(/Gemini_Generated_Image_e4kwdre4kwdre4kw-removebg-preview.png)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-[0.7rem] uppercase tracking-[0.4em]" style={{ fontFamily: "'Montserrat', sans-serif", opacity: 0.85 }}>Save the date</div>
                  <div className="my-3.5" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500, fontSize: "clamp(2.4rem,9vw,5rem)", lineHeight: 1, letterSpacing: "0.04em" }}>
                    10 . 12 . 26
                  </div>
                  <div className="mb-6 text-[1.05rem] leading-[1.85]" style={{ fontFamily: `'Noto Sans Sinhala', ${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#EDDFB8" }}>
                    {lang === 'si' ? 'ආදරයෙන්, දෙපවුලේ ආරාධනයයි' : 'With love, from both families'}
                  </div>
                  
                  <div className="mb-8 flex flex-col items-center gap-1 text-[1rem]" style={{ fontFamily: `${lang === 'en' ? "'Cormorant Garamond'" : "'Abhaya Libre'"}, serif`, color: "#EDDFB8" }}>
                    <div className="font-bold uppercase tracking-widest text-[0.75rem] mb-1" style={{ fontFamily: "'Montserrat', sans-serif", opacity: 0.85 }}>Contact</div>
                    <div>W. M. S. Karunarathne - 071 419 4178</div>
                    <div>P. L. Chandrasena - 071 487 8852</div>
                  </div>

                  <div className="relative mx-auto mb-7" style={{ width: "150px", height: "54px" }}>
                    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: "130px", height: "130px", borderRadius: "50%", background: "radial-gradient(50% 50%, rgba(251, 241, 212, 0.55) 0%, rgba(251, 241, 212, 0) 70%)", transform: "scale(1.0466)" }}></div>
                    <div aria-hidden="true" style={{ position: "relative", width: "150px", height: "54px", opacity: 0.95, background: "#EDDFB8", WebkitMaskImage: "url(/lotus-mandala/lotus-flourish.svg)", maskImage: "url(/lotus-mandala/lotus-flourish.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }}></div>
                  </div>
                  
                  <div className="mt-14 opacity-80 transition-opacity hover:opacity-100">
                    <p className="text-[#D4AF37] text-[0.7rem] sm:text-xs font-sans tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Want a beautiful wedding website like this? Create yours with <a target="_blank" rel="noreferrer" className="text-white hover:text-[#D4AF37] underline transition-colors" href="https://wa.me/94707819074">invitemint</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundMusic} loop />

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-[60] bg-white text-[#87937a] p-3 rounded-full shadow-lg hover:bg-[#87937a]/10 transition-colors"
      >
        <div className="flex flex-col items-center">
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </div>
      </motion.button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .dl-manel-bold,
            .dl-manel-bold * {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            span.font-sinhala-name {
              font-family: 'nimsara' !important;
            }

            input,
            textarea,
            button {
              font-family: 'Abhaya Libre', Arial, sans-serif !important;
            }

            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }

            .animate-spin-slow {
              animation: spin-slow linear infinite;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #ccbaa233;
            }

            ::-webkit-scrollbar-thumb {
              background: #87937a66;
              border-radius: 10px;
            }
          `,
        }}
      />
    </main>
  );
}
