import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Instagram, Facebook, Youtube } from "lucide-react";
import logoColorLight from "../imports/logo_color-light_transparent.svg";
import logoColorDark from "../imports/logo_color-dark_transparent.svg";
import Homepage from "../imports/Homepage/index";
import ContactPage from "../components/ContactPage";
import AboutPage from "../components/AboutPage";
import SiteNavbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const CAROUSEL_LOOP_PX = 1554;

const HERO_GRADIENT = [
  "radial-gradient(ellipse at 18% 30%, rgba(251,178,34,0.22) 0%, transparent 45%)",
  "radial-gradient(ellipse at 78% 65%, rgba(215,247,65,0.07) 0%, transparent 40%)",
  "radial-gradient(ellipse at 55% 15%, rgba(92,89,237,0.13) 0%, transparent 38%)",
  "radial-gradient(ellipse at 35% 80%, rgba(230,33,41,0.09) 0%, transparent 35%)",
  "linear-gradient(155deg, #26103d 0%, #16052b 55%, #0c051a 100%)",
].join(",");

const NAV_LINKS = [
  "Home",
  "About",
  "Events",
  "Give",
  "Contact",
];

function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.13a8.16 8.16 0 0 0 4.77 1.52V7.21a4.85 4.85 0 0 1-1-.52z" />
    </svg>
  );
}

function getInitialPage(): "home" | "contact" | "about" {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  if (hash === "#/about" || hash === "#about" || path === "/about" || path.endsWith("/about")) return "about";
  if (hash === "#/contact" || hash === "#contact" || path === "/contact" || path.endsWith("/contact")) return "contact";
  return "home";
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "contact" | "about">(getInitialPage);

  // ── Sync URL changes (both hash and popstate) ────────────────────────────
  useEffect(() => {
    const handleNavigation = () => {
      const page = getInitialPage();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", handleNavigation);
    window.addEventListener("popstate", handleNavigation);
    return () => {
      window.removeEventListener("hashchange", handleNavigation);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  const navigateTo = (page: "home" | "contact" | "about") => {
    window.location.hash =
      page === "about" ? "#/about" : page === "contact" ? "#/contact" : "#/";
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Drawer open / close animation ────────────────────────────────────────
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;
    if (!drawer || !overlay) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "block" });
      gsap.set(drawer, { display: "flex" });
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );
      gsap.fromTo(
        drawer,
        { x: "100%" },
        { x: "0%", duration: 0.45, ease: "power3.out" },
      );
      gsap.from(drawer.querySelectorAll("[data-mi]"), {
        opacity: 0,
        x: 28,
        duration: 0.5,
        stagger: 0.065,
        ease: "power3.out",
        delay: 0.2,
      });
    } else {
      document.body.style.overflow = "";
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(drawer, {
        x: "100%",
        duration: 0.35,
        ease: "power3.in",
        onComplete: () =>
          gsap.set([drawer, overlay], { display: "none" }),
      });
    }
  }, [menuOpen]);

  // ── ESC closes the menu ───────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // ── Wire the hamburger button (HomePage & ContactPage) ───────────────────
  useEffect(() => {
    const btns = document.querySelectorAll<HTMLElement>(
      '[data-name="Hero"] > div[class*="justify-between"] [class*="size-[56px]"], .gz-header-nav [class*="size-[56px]"]',
    );
    if (!btns.length) return;
    const open = () => setMenuOpen(true);
    btns.forEach((b) => b.addEventListener("click", open));
    return () => btns.forEach((b) => b.removeEventListener("click", open));
  }, [currentPage]);

  // ── Wire the Hero CTA button to Contact page ──────────────────────────────
  useEffect(() => {
    if (currentPage !== "home") return;
    const heroBtn = document.querySelector<HTMLElement>(
      '[data-name="Hero"] [data-name="button"]',
    );
    if (!heroBtn) return;
    const click = () => navigateTo("contact");
    heroBtn.addEventListener("click", click);
    return () => heroBtn.removeEventListener("click", click);
  }, [currentPage]);

  // ── Wire 'Read our story' button to About page ────────────────────────────
  useEffect(() => {
    if (currentPage !== "home") return;
    const allButtons = document.querySelectorAll<HTMLElement>('[data-name="button"]');
    let storyBtn: HTMLElement | null = null;
    allButtons.forEach((btn) => {
      if (btn.textContent?.toLowerCase().includes("read our story")) {
        storyBtn = btn;
      }
    });
    if (!storyBtn) return;
    const targetBtn = storyBtn as HTMLElement;
    const click = () => navigateTo("about");
    targetBtn.addEventListener("click", click);
    return () => targetBtn.removeEventListener("click", click);
  }, [currentPage]);

  // ── Scroll-aware sticky nav background ────────────────────────────────────
  useEffect(() => {
    const navs = document.querySelectorAll<HTMLElement>(
      '[data-name="Hero"] > div[class*="justify-between"], .gz-header-nav',
    );
    if (!navs.length) return;
    const tick = () => {
      const past = window.scrollY > 40;
      navs.forEach((nav) => {
        nav.style.background = past
          ? "rgba(22, 5, 43, 0.95)"
          : "transparent";
        nav.style.backdropFilter = past
          ? "blur(14px)"
          : "none";
        (nav.style as any).webkitBackdropFilter = past
          ? "blur(14px)"
          : "none";
        nav.style.boxShadow = past
          ? "0 4px 20px rgba(0, 0, 0, 0.35)"
          : "none";
        nav.style.borderBottom = past
          ? "1px solid rgba(215, 247, 65, 0.1)"
          : "none";
      });
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    return () => window.removeEventListener("scroll", tick);
  }, [currentPage]);

  // ── Main GSAP context ─────────────────────────────────────────────────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Hero entrance — animate Frame24's three content blocks as single units,
      // then the CTA button. Never touches the logo (Frame3/Group1).
      const heroContent = root.querySelector<HTMLElement>(
        '[data-name="Hero"] > div[class*="gap-[74px]"]',
      );
      if (heroContent) {
        const frame24 = heroContent.querySelector<HTMLElement>(
          '[class*="gap-[38px]"]',
        );
        if (frame24) {
          gsap.from(Array.from(frame24.children), {
            y: 56,
            opacity: 0,
            duration: 1.05,
            ease: "power4.out",
            stagger: 0.16,
            delay: 0.15,
          });
        }
        const btn = heroContent.querySelector(
          '[data-name="button"]',
        );
        if (btn) {
          gsap.from(btn, {
            y: 22,
            opacity: 0,
            scale: 0.92,
            duration: 0.8,
            ease: "back.out(1.6)",
            delay: 0.75,
          });
        }
      }

      // Carousel auto-scroll
      const welcomeSection = root.querySelector(
        '[data-name="Welcome section"]',
      );
      if (welcomeSection) {
        const track = welcomeSection.querySelector<HTMLElement>(
          '[class*="flex"][class*="gap-[20px]"][class*="absolute"]',
        );
        if (track) {
          gsap
            .timeline({ repeat: -1 })
            .to(track, {
              x: -CAROUSEL_LOOP_PX,
              duration: 32,
              ease: "linear",
            })
            .set(track, { x: 0 });
        }
      }

      // Section reveals
      (
        [
          {
            sel: '[data-name="Welcome section"]',
            from: { opacity: 0, y: 48 },
          },
          {
            sel: '[data-name="Humanitarian"]',
            from: { opacity: 0, y: 48 },
          },
          {
            sel: '[data-name^="MacBook Pro 14"]',
            from: { opacity: 0, y: 56 },
          },
          {
            sel: '[data-name="what we do"]',
            from: { opacity: 0, y: 48 },
          },
          {
            sel: '[data-name="Footer"]',
            from: { opacity: 0, y: 48 },
          },
        ] as Array<{ sel: string; from: gsap.TweenVars }>
      ).forEach(({ sel, from }) => {
        const el = root.querySelector(sel);
        if (!el) return;
        gsap.from(el, {
          ...from,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // Humanitarian split
      const humanSec = root.querySelector(
        '[data-name="Humanitarian"]',
      );
      if (humanSec) {
        const textCol = humanSec.querySelector(
          '[class*="w-[505px]"]',
        );
        if (textCol) {
          gsap.from(textCol.querySelectorAll(":scope > *"), {
            opacity: 0,
            x: -50,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: humanSec,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }
        const photo = humanSec.querySelector(
          '[data-name="IMG_0551 1"]',
        );
        if (photo) {
          gsap.from(photo, {
            opacity: 0,
            x: 70,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: humanSec,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }
      }

      // Vision / Mission cards
      const storyEl = root.querySelector(
        '[data-name^="MacBook Pro 14\' - 4"]',
      );
      if (storyEl) {
        gsap.from(
          storyEl.querySelectorAll('[class*="h-[464px]"]'),
          {
            opacity: 0,
            scale: 0.9,
            y: 36,
            duration: 0.8,
            ease: "back.out(1.5)",
            stagger: 0.2,
            scrollTrigger: {
              trigger: storyEl,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Activity cards
      const whatEl = root.querySelector(
        '[data-name="what we do"]',
      );
      if (whatEl) {
        gsap.from(
          whatEl.querySelectorAll('[class*="h-[597px]"]'),
          {
            opacity: 0,
            y: 32,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.15,
            clearProps: "transform",
            scrollTrigger: {
              trigger: whatEl,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        /* ═══════════════════════════════════════════════════════════════
           HERO SECTION (DESKTOP DEFAULT - 100% UNTOUCHED)
        ═══════════════════════════════════════════════════════════════ */
        [data-name="Hero"] {
          background: #16052b !important;
          height: auto !important;
          min-height: 100svh;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          position: relative !important;
          overflow: hidden !important;
          width: 100% !important;
        }

        /* Hero Background Visual Glow */
        [data-name="Recording 2026-08-11 125917 1"] {
          position: absolute !important;
          width: 100% !important;
          height: 100% !important;
          left: 0 !important;
          top: 0 !important;
          transform: none !important;
          pointer-events: none !important;
        }
        [data-name="Recording 2026-08-11 125917 1"] > div {
          position: absolute !important;
          inset: 0 !important;
        }

        /* ─── Fixed Header Bar (Frame32) ─── */
        [data-name="Hero"] > div[class*="justify-between"] {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 16px clamp(20px, 6.6vw, 100px) !important;
          box-sizing: border-box !important;
          z-index: 900 !important;
          background: transparent;
          transition: background 0.35s ease;
        }

        /* Hamburger button (Frame1) - remove inner double border */
        [data-name="Hero"] > div[class*="justify-between"] [class*="size-[56px]"] {
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: filter 0.15s ease, transform 0.15s ease;
        }
        [data-name="Hero"] > div[class*="justify-between"] [class*="size-[56px]"]:hover {
          filter: drop-shadow(0 0 0 transparent) !important;
          transform: scale(1.04);
        }

        /* ─── Hero Content Wrapper (Frame25) ─── */
        [data-name="Hero"] > div[class*="gap-[74px]"] {
          position: relative !important;
          left: auto !important;
          top: auto !important;
          width: 100% !important;
          max-width: 892px !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
          padding: clamp(72px, 6vw, 100px) clamp(20px, 3vw, 60px) clamp(32px, 3vw, 60px) !important;
          gap: 74px !important;
          flex: none;
          z-index: 5;
        }

        /* Hero Text Container (Frame24) */
        [data-name="Hero"] [class*="gap-[38px]"] {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
          width: 100% !important;
          gap: 38px !important;
        }

        /* Hero Subtitle / Tagline: "Gen Zs for Christ" (Desktop) */
        [data-name="Hero"] [class*="text-[64px]"] {
          font-family: 'Instrument Serif', serif !important;
          font-size: 64px !important;
          line-height: 1 !important;
          color: #ffffff !important;
          text-align: center !important;
          word-break: keep-all !important;
          width: 100% !important;
        }

        /* Hero Main Headline: "GOD'S OWN GENERATION" (Desktop) */
        [data-name="Hero"] [class*="text-[128px]"] {
          font-family: 'Gasoek One', sans-serif !important;
          font-size: 128px !important;
          line-height: 0.9 !important;
          color: #fff !important;
          text-align: center !important;
          word-break: keep-all !important;
          overflow-wrap: normal !important;
          width: 100% !important;
        }

        /* Hero Body Copy: "We are Gen Zs for Christ..." (Desktop) */
        [data-name="Hero"] [class*="text-[32px]"],
        [data-name="Hero"] p[class*="w-[728px]"] {
          font-family: 'Instrument Sans', sans-serif !important;
          font-size: 32px !important;
          line-height: 1.143 !important;
          color: #ffffff !important;
          text-align: center !important;
          width: 100% !important;
          max-width: 300px !important;
          margin: 0 auto !important;
        }

        /* Hero CTA Button: "Join the Community" (Desktop) */
        [data-name="Hero"] [data-name="button"] {
          cursor: pointer !important;
          transition: filter 0.15s ease, transform 0.15s ease;
          border: none !important;
        }
        [data-name="Hero"] [data-name="button"]:hover {
          filter: drop-shadow(0 0 0 transparent) !important;
          transform: translate(2px, 2px);
        }

        /* Decorative Stickers & Figures in Hero */
        [data-name="Hero"] [data-name*="Stickers"],
        [data-name="Hero"] [data-name*="Figure"],
        [data-name="Hero"] [data-name="sparkles"],
        [data-name="Hero"] [data-name="shake"] {
          pointer-events: none !important;
        }

        /* ─── Drawer styles ─── */
        .gz-nav-link {
          display: block;
          font-family: 'Gasoek One', sans-serif;
          font-size: 2.25rem; /* 36px on desktop (tastefully reduced from 56px) */
          line-height: 1.15;
          color: #fff;
          text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid rgba(215,247,65,0.1);
          transition: color 0.15s ease, padding-left 0.2s ease;
        }
        .gz-nav-link:last-child { border-bottom: none; }
        .gz-nav-link:hover { color: #d7f741; padding-left: 10px; }

        .gz-social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(255,255,255,0.08);
          color: #fff; border: none; cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .gz-social-btn:hover { background: #d7f741; color: #16052b; }

        /* CTA inside drawer */
        .gz-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #210901;
          font-family: 'Instrument Sans', sans-serif;
          font-weight: 600; font-size: 17px;
          padding: 14px 26px; border-radius: 16px;
          border: 1px solid #210901;
          filter: drop-shadow(4px 4px 0 #fbb222);
          cursor: pointer; text-decoration: none;
          transition: filter 0.15s ease;
          white-space: nowrap; align-self: flex-start;
        }

        /* ═══════════════════════════════════════════════════════════════
           TYPOGRAPHY DESIGN SYSTEM (DESKTOP DEFAULT - REM BASED)
           1rem = 16px. Desktop matches Figma 1512px canvas values.
        ═══════════════════════════════════════════════════════════════ */
        /* Massive Watermark Text (GenZs 4 Christ) */
        [class*="text-[288"], [class*="text-[289"] {
          font-family: 'Instrument Serif', serif !important;
          font-size: 18rem !important; /* 288px */
          white-space: nowrap !important;
          line-height: 0.9 !important;
        }

        /* Hero Main Headline (GOD'S OWN GENERATION) - Reduced from 8rem to 6rem */
        [data-name="Hero"] [class*="text-[128px]"] {
          font-family: 'Gasoek One', sans-serif !important;
          font-size: 6.5rem !important;
          line-height: 0.92 !important;
          color: #fff !important;
          text-align: center !important;
          word-break: break-all !important;
          overflow-wrap: normal !important;
        }

        /* Hero Serif Kicker - Reduced from 4rem to 2.25rem */
        [data-name="Hero"] [class*="text-[64px]"] {
          font-family: 'Instrument Serif', serif !important;
          font-size: 2.25rem !important; /* 36px (reduced by 1.75rem from 64px) */
          line-height: 1.05 !important;
          color: #ffffff !important;
          word-break: keep-all !important;
          text-align: center !important;
        }

        /* Major Section Headings (64px) - Non-Hero */
        [data-name="Welcome section"] [class*="text-[64px]"],
        [data-name="Humanitarian"] [class*="text-[64px]"],
        [data-name^="MacBook Pro 14' - 4"] [class*="text-[64px]"]:not([class*="font-['Instrument_Serif"]):not([class*="italic"]),
        [data-name="what we do"] [class*="text-[64px]"] {
          font-family: 'Gasoek One', sans-serif !important;
          font-size: 4rem !important; /* 64px */
          line-height: 1 !important;
          word-break: keep-all !important;
          overflow-wrap: normal !important;
        }
        /* Vision & Mission Card Headings */
        [class*="bg-[#26103d]"] [class*="text-[64px]"],
        [class*="bg-[#00434a]"] [class*="text-[64px]"],
        [data-name^="MacBook Pro 14' - 4"] [class*="font-['Instrument_Serif"] {
          font-family: 'Instrument Serif', serif !important;
          font-size: 4rem !important; /* 64px */
          line-height: 1 !important;
        }

        /* Sub-Headings / Card Titles (48px) — scoped to Homepage Figma frames only */
        [data-name="Homepage"] [class*="text-[48px]"],
        [data-name^="MacBook Pro 14'"] [class*="text-[48px]"],
        [data-name="what we do"] [class*="text-[48px]"],
        [data-name="Welcome section"] [class*="text-[48px]"],
        [data-name="Humanitarian"] [class*="text-[48px]"] {
          font-family: 'Instrument Serif', serif !important;
          font-size: 3rem !important; /* 48px */
          line-height: 1.05 !important;
          word-break: keep-all !important;
        }

        /* Hero Lead Description / Sub-Text - Reduced from 2rem to 1.125rem */
        [data-name="Hero"] [class*="text-[32px]"],
        [data-name="Hero"] p[class*="w-[728px]"] {
          font-family: 'Instrument Sans', sans-serif !important;
          font-size: 1.125rem !important; /* 18px (reduced by 1.875rem from 32px) */
          line-height: 1.55 !important;
          max-width: 44rem !important;
          margin: 0 auto !important;
          text-align: center !important;
        }

        /* Lead Descriptions / Sub-Text (32px) - Non-Hero */
        [data-name="Welcome section"] [class*="text-[32px]"],
        [data-name="Humanitarian"] [class*="text-[32px]"],
        [data-name^="MacBook Pro 14' - 4"] [class*="text-[32px]"] {
          font-family: 'Instrument Sans', sans-serif !important;
          font-size: 2rem !important; /* 32px */
          line-height: 1.25 !important;
        }

        /* Content Body / Descriptions (24px) — scoped to Homepage Figma frames only */
        [data-name="Homepage"] [class*="text-[24px]"],
        [data-name^="MacBook Pro 14'"] [class*="text-[24px]"],
        [data-name="what we do"] [class*="text-[24px]"],
        [data-name="Welcome section"] [class*="text-[24px]"],
        [data-name="Humanitarian"] [class*="text-[24px]"] {
          font-family: 'Instrument Sans', sans-serif !important;
          font-size: 1.5rem !important; /* 24px */
          line-height: 1.35 !important;
        }

        /* Buttons & Badges (20px) — scoped to Homepage Figma frames only */
        [data-name="Homepage"] [class*="text-[20px]"],
        [data-name^="MacBook Pro 14'"] [class*="text-[20px]"],
        [data-name="button"] [class*="text-[20px]"],
        [data-name="button"] [class*="text-[24px]"] {
          font-family: 'Instrument Sans', sans-serif !important;
          font-size: 1.25rem !important; /* 20px */
          font-weight: 600 !important;
          line-height: 1 !important;
        }

        /* ═══════════════════════════════════════════════════════════════
           FLUID CONTAINER WIDTHS
        ═══════════════════════════════════════════════════════════════ */
        [class*="w-[1312px]"], [class*="w-[1312.677px]"] {
          width: 100% !important; max-width: 1312px !important;
        }
        [class*="w-[1512px]"] {
          width: 100% !important; max-width: 100% !important;
          box-sizing: border-box !important;
        }
        [class*="w-[1744px]"] {
          width: 100% !important; max-width: 100% !important; overflow: hidden;
        }
        [class*="w-[728px]"], [class*="w-[730px]"],
        [class*="w-[786px]"], [class*="w-[969px]"] {
          width: 100% !important; max-width: none !important;
        }
        [data-name^="MacBook Pro 14' - 4"] [class*="w-[786px]"] {
          max-width: 786px !important;
        }

        /* ─── Hero Section (100svh Viewport Height & Centralized) ─── */
        [data-name="Homepage"] [data-name="Hero"] {
          position: relative !important;
          width: 100% !important;
          min-height: 100svh !important;
          height: 100svh !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          overflow: hidden !important;
          background-color: #07070f !important;
          padding: 5rem 2rem 2rem !important;
          box-sizing: border-box !important;
        }

        /* ─── Contact Page Hero (45% Viewport Height) ─── */
        .gz-contact-hero {
          position: relative !important;
          width: 100% !important;
          height: 45vh !important;
          min-height: 18rem !important;
          max-height: 45vh !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          overflow: hidden !important;
          background-color: #07070f !important;
          padding: 5rem 1.5rem 1.5rem !important;
          box-sizing: border-box !important;
        }
        [data-name="Homepage"] [data-name="Hero"] > div[class*="gap-[74px]"],
        [data-name="Homepage"] [data-name="Hero"] [class*="left-[310px]"] {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          right: auto !important;
          bottom: auto !important;
          margin: 0 auto !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          width: 100% !important;
          max-width: 58rem !important;
          z-index: 3 !important;
          gap: 2rem !important;
        }
        [data-name="Hero"] [class*="gap-[38px]"] {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          width: 100% !important;
          gap: 1.125rem !important;
        }
        [data-name="Hero"] [data-name="button"] {
          margin: 0 auto !important;
          align-self: center !important;
        }
        /* ─── Fixed Sticky Navbar (Desktop) ─── */
        [data-name="Hero"] > div[class*="justify-between"],
        [data-name="Hero"] [class*="left-[99.32px]"],
        .gz-header-nav {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 8rem !important; /* 128px on desktop */
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin: 0 !important;
          padding: 0 clamp(2rem, 6.5vw, 6.25rem) !important;
          box-sizing: border-box !important;
          z-index: 100 !important;
          transition: background 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease !important;
        }

        /* ─── Humanitarian ─── */
        [data-name="Humanitarian"] { height: auto !important; }
        [data-name="Humanitarian"] > div[class*="absolute"][class*="left-1/2"] {
          height: 100% !important;
        }
        [data-name="Humanitarian"] [class*="gap-[93px]"][class*="items-center"] {
          width: 100% !important;
        }
        [data-name="Humanitarian"] [class*="self-stretch"][class*="flex-row"] {
          width: 100% !important; flex: 1 1 0 !important;
        }
        [data-name="Humanitarian"] [class*="justify-between"][class*="w-[505px]"] {
          flex: 1 1 0 !important; min-width: 0 !important;
          width: auto !important; max-width: 505px !important;
        }
        [data-name="Humanitarian"] [class*="w-[681px]"] {
          min-width: 0 !important; flex: 1 1 0 !important; max-width: 681px !important;
        }

        /* ─── Cards ─── */
        [class*="w-[646px]"] {
          width: 100% !important; max-width: 646px !important;
          min-width: 0 !important; flex: 1 1 0 !important;
        }
        [data-name="what we do"] [class*="w-[425px]"],
        [data-name="what we do"] [class*="w-[422px]"] {
          min-width: 0 !important; flex: 1 1 0 !important;
        }

        /* ─── Footer ─── */
        [data-name="Footer"] [class*="w-[465px]"] {
          min-width: 0 !important; flex: 1 1 0 !important;
        }
        [data-name="Footer"] [class*="w-[491px]"] {
          min-width: 0 !important; flex-shrink: 1 !important;
        }
        [data-name="Footer"] [class*="w-[196px]"] {
          width: auto !important; flex-shrink: 0 !important;
        }

        /* ─── Section padding ─── */
        [class*="px-[100px]"] {
          padding-left: clamp(20px, 6.6vw, 100px) !important;
          padding-right: clamp(20px, 6.6vw, 100px) !important;
        }
        [class*="py-[140px]"] {
          padding-top: clamp(56px, 9.26vw, 140px) !important;
          padding-bottom: clamp(56px, 9.26vw, 140px) !important;
        }
        [class*="pt-[140px]"] { padding-top: clamp(56px, 9.26vw, 140px) !important; }
        [class*="p-[72px]"] { padding: clamp(28px, 4.76vw, 72px) !important; }

        /* ─── Card heights ─── */
        [class*="h-[464px]"] {
          height: auto !important; min-height: clamp(220px, 30vw, 464px) !important;
        }
        [class*="h-[597px]"] {
          height: auto !important; min-height: clamp(380px, 40vw, 597px) !important;
        }
        [class*="bg-[#e62129]"] > [class*="h-[298px]"] { overflow: hidden !important; }

        /* ─── Fix "what we do" cards & container layout ──────────────────
           Frame29 (parent container with heading, cards row, and CTA button):
           Centered, responsive column layout with clean gap.
           Frame18 (cards row):
           Flex row where all 3 cards stretch to equal height.
           Cards (Frame15, Frame16, Frame33):
           Auto height with internal space-between layout so contents never
           overflow or collide with the CTA button below.
        ─────────────────────────────────────────────────────────────── */

        /* Frame29 — parent container */
        [data-name="what we do"] > [class*="w-[1312px]"],
        [data-name="what we do"] > [class*="gap-[60px]"] {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          width: 100% !important;
          max-width: 1312px !important;
          margin: 0 auto !important;
          gap: clamp(32px, 4vw, 60px) !important;
          position: relative !important;
          z-index: 2 !important;
        }

        /* Frame18 — cards row */
        [data-name="what we do"] [class*="flex"][class*="gap-[20px]"][class*="items-start"],
        [data-name="what we do"] [class*="w-full"][class*="gap-[20px]"] {
          display: flex !important;
          flex-direction: row !important;
          align-items: stretch !important;
          justify-content: center !important;
          flex-wrap: nowrap !important;
          align-content: normal !important;
          width: 100% !important;
          gap: clamp(16px, 1.5vw, 24px) !important;
          position: relative !important;
          z-index: 2 !important;
        }

        /* Individual Cards (Frame15, Frame16, Frame33) */
        [data-name="what we do"] [class*="h-[597px]"] {
          flex: 1 1 0 !important;
          min-width: 0 !important;
          max-width: 425px !important;
          width: auto !important;
          height: auto !important;
          min-height: 520px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          align-self: stretch !important;
          box-sizing: border-box !important;
          position: relative !important;
          z-index: 2 !important;
        }

        /* Card images */
        [data-name="what we do"] [class*="h-[298px]"] {
          height: clamp(180px, 18vw, 298px) !important;
          width: 100% !important;
          flex-shrink: 0 !important;
          overflow: hidden !important;
          border-radius: 8px !important;
        }

        /* Card text content container (Frame14, Frame17, Frame35) */
        [data-name="what we do"] [class*="h-[597px]"] > div:last-child {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          flex: 1 1 auto !important;
        }

        /* CTA Button */
        [data-name="what we do"] [data-name="button"] {
          position: relative !important;
          z-index: 5 !important;
          flex-shrink: 0 !important;
          margin-top: 8px !important;
        }

        /* ─── Welcome section carousel ─── */
        [data-name="Welcome section"] { overflow: hidden !important; }
        [data-name="Welcome section"] [class*="h-[354px]"][class*="w-full"] {
          width: 100vw !important; overflow: hidden;
        }

        /* ═══════════════════════════════════════════════════════════════
           BUTTON INTERACTIONS
        ═══════════════════════════════════════════════════════════════ */
        [data-name="button"] { cursor: pointer; transition: filter 0.15s ease; }
        [data-name="button"]:hover { filter: drop-shadow(0 0 0 transparent) !important; }
        [data-name="button"]:active { filter: brightness(0.96); }

        [class*="h-[597px]"]:hover, [class*="h-[464px]"]:hover {
          transform: translateY(-6px);
          transition: transform 0.22s ease;
        }

        /* ═══════════════════════════════════════════════════════════════
           BREAKPOINTS
        ═══════════════════════════════════════════════════════════════ */
        @media (max-width: 900px) {
          /* Hero Header on Tablet */
          [data-name="Hero"] > div[class*="justify-between"] {
            padding: 1rem 2rem !important;
          }
          [data-name="Hero"] > div[class*="justify-between"] [class*="size-[56px]"] {
            width: 3.125rem !important;
            height: 3.125rem !important;
          }

          /* Hero Content on Tablet */
          [data-name="Hero"] > div[class*="gap-[74px]"] {
            max-width: 48rem !important;
            padding: 6.5rem 2rem 3rem !important;
            gap: 2.5rem !important;
          }
          [data-name="Hero"] [class*="gap-[38px]"] {
            gap: 1.5rem !important;
          }

          /* ─── Tablet Typography System (Rem Based) ─── */
          [class*="text-[288"], [class*="text-[289"] {
            font-size: 8rem !important; /* 128px */
          }
          [data-name="Hero"] [class*="text-[128px]"] {
            font-size: 5.5rem !important; /* 88px */
            line-height: 0.92 !important;
            text-shadow: 7px 7px 0px #210901 !important;
          }
          [class*="text-[64px]"] {
            font-size: 2.75rem !important; /* 44px */
            line-height: 1.05 !important;
          }
          [class*="text-[48px]"] {
            font-size: 2.25rem !important; /* 36px */
            line-height: 1.1 !important;
          }
          [class*="text-[32px]"],
          [data-name="Hero"] p[class*="w-[728px]"] {
            font-size: 1.5rem !important; /* 24px */
            line-height: 1.35 !important;
            max-width: 38rem !important;
          }
          [class*="text-[24px]"] {
            font-size: 1.25rem !important; /* 20px */
            line-height: 1.35 !important;
          }
          [class*="text-[20px]"],
          [data-name="button"] [class*="text-[20px]"],
          [data-name="button"] [class*="text-[24px]"] {
            font-size: 1.125rem !important; /* 18px */
          }

          /* Hero CTA Button on Tablet */
          [data-name="Hero"] [data-name="button"] {
            min-height: 3.25rem !important;
            padding: 0.875rem 2rem !important;
          }

          /* Non-stretching Stickers on Tablet */
          [data-name="Hero"] [data-name="Figure 3"] {
            position: absolute !important;
            top: -2rem !important;
            right: -2rem !important;
            left: auto !important;
            bottom: auto !important;
            width: 22rem !important;
            height: auto !important;
            aspect-ratio: 606 / 633 !important;
          }
          [data-name="Hero"] [data-name="Figure 3"] svg {
            width: 100% !important;
            height: 100% !important;
          }
          [data-name="Hero"] [data-name="Figure 5"] {
            position: absolute !important;
            bottom: 0 !important;
            right: 1.5rem !important;
            left: auto !important;
            top: auto !important;
            width: 8rem !important;
            height: auto !important;
            aspect-ratio: 196.656 / 307.591 !important;
          }
          [data-name="Hero"] [data-name="Figure 5"] svg {
            width: 100% !important;
            height: 100% !important;
          }
          [data-name="Hero"] [data-name="Stickers V35"] {
            position: absolute !important;
            left: -1.5rem !important;
            top: 14rem !important;
            width: 5.5rem !important;
            height: auto !important;
            aspect-ratio: 111 / 163.5 !important;
          }
          [data-name="Hero"] [data-name="Stickers V35"] svg {
            width: 100% !important;
            height: 100% !important;
          }
          /* Welcome Section Stickers on Tablet */
          [data-name="Welcome section"] [data-name="sparkles"] {
            position: absolute !important;
            top: 2rem !important;
            left: 2rem !important;
            width: 4rem !important;
            height: auto !important;
            aspect-ratio: 77.995 / 68.9874 !important;
            pointer-events: none !important;
          }
          [data-name="Welcome section"] [data-name="sparkles"] svg {
            width: 100% !important;
            height: 100% !important;
          }
          [data-name="Welcome section"] [class*="left-[1324px]"] {
            position: absolute !important;
            top: 1.5rem !important;
            right: 1.5rem !important;
            left: auto !important;
            width: auto !important;
            height: auto !important;
            pointer-events: none !important;
          }
          [data-name="Welcome section"] [data-name="shake"] {
            width: 8rem !important;
            height: auto !important;
            aspect-ratio: 184.471 / 162.092 !important;
            position: relative !important;
          }
          [data-name="Welcome section"] [data-name="shake"] svg {
            width: 100% !important;
            height: 100% !important;
          }

          [data-name="Humanitarian"] [class*="flex"][class*="gap-[93px]"][class*="items-center"] {
            flex-direction: column !important; gap: 40px !important;
            align-items: stretch !important;
          }
          [data-name="Humanitarian"] [class*="justify-between"][class*="w-[505px]"] {
            max-width: 100% !important; width: 100% !important;
          }
          [data-name="Humanitarian"] [class*="self-stretch"][class*="flex-row"] {
            flex-direction: column !important; align-items: stretch !important;
          }
          [data-name="Humanitarian"] [class*="w-[681px]"][class*="h-[511px]"] {
            width: 100% !important; max-width: 100% !important;
            height: clamp(240px, 32vw, 400px) !important;
          }
          [data-name="Humanitarian"] [class*="flex-col"][class*="h-full"] {
            height: auto !important; gap: 28px !important;
            justify-content: flex-start !important;
          }
          [data-name^="MacBook Pro 14' - 4"] [class*="flex"][class*="gap-[20px]"][class*="items-center"] {
            flex-direction: column !important; align-items: stretch !important;
          }
          [class*="w-[646px]"] { max-width: 100% !important; width: 100% !important; }
          [data-name="what we do"] [class*="gap-[20px]"][class*="items-start"],
          [data-name="what we do"] [class*="w-full"][class*="gap-[20px]"] {
            flex-direction: column !important;
            align-items: center !important;
            gap: 24px !important;
          }
          [data-name="what we do"] [class*="h-[597px]"] {
            width: 100% !important;
            max-width: 480px !important;
            min-height: auto !important;
            flex: none !important;
          }
          [data-name="Footer"] > div:first-child {
            flex-wrap: wrap !important; gap: 40px !important;
          }
        }

        @media (max-width: 600px) {
          /* Hero Section on Mobile (100svh & Centered) */
          [data-name="Homepage"] [data-name="Hero"] {
            min-height: 100svh !important;
            height: 100svh !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 5.5rem 1.25rem 2rem !important;
            box-sizing: border-box !important;
          }

          /* Contact Hero on Mobile (45vh) */
          .gz-contact-hero {
            height: 45vh !important;
            min-height: 16rem !important;
            max-height: 45vh !important;
            padding: 4.5rem 1rem 1rem !important;
          }

          /* ─── Fixed Sticky Navbar (Mobile) ─── */
          [data-name="Hero"] > div[class*="justify-between"],
          [data-name="Hero"] [class*="left-[99.32px]"],
          .gz-header-nav {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 4.75rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 1.25rem !important;
            box-sizing: border-box !important;
            z-index: 100 !important;
            transition: background 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease !important;
          }
          [data-name="Hero"] > div[class*="justify-between"] [class*="size-[56px]"],
          .gz-header-nav [class*="size-[56px]"] {
            width: 2.75rem !important;
            height: 2.75rem !important;
            filter: drop-shadow(3px 3px 0px #fbb222) !important;
          }
          [data-name="Hero"] > div[class*="justify-between"] [class*="w-[151.938px]"],
          .gz-header-nav [class*="w-[151.938px]"] {
            transform: scale(0.85);
            transform-origin: left center;
          }

          /* Hero Content on Mobile */
          [data-name="Hero"] > div[class*="gap-[74px]"] {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            gap: 1.75rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
          }
          [data-name="Hero"] [class*="gap-[38px]"] {
            gap: 1rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }

          /* ─── Hero Section Stickers on Mobile ─── */
          /* 1. Top-Right Lime Burst (Figure 3) */
          [data-name="Hero"] [data-name="Figure 3"] {
            position: absolute !important;
            top: -5rem !important;
            right: -5rem !important;
            left: auto !important;
            bottom: auto !important;
            width: 8rem !important;
            height: 8rem !important;
            z-index: 2 !important;
            pointer-events: none !important;
            visibility: visible !important;
            display: block !important;
          }
          [data-name="Hero"] [data-name="Figure 3"] > div {
            position: absolute !important;
            inset: 0 !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          [data-name="Hero"] [data-name="Figure 3"] svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }

          /* 2. Top-Left Pink & Purple Badge (Stickers V35) */
          [data-name="Hero"] [data-name="Stickers V35"] {
            position: absolute !important;
            top: 4.5rem !important;
            left: auto !important;
            right: -1.5rem !important;
            bottom: auto !important;
            width: 3.25rem !important;
            height: auto !important;
            z-index: 2 !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
          [data-name="Hero"] [data-name="Stickers V35"] svg {
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
          }

          /* 3. Bottom-Left Cloud/Bubble (Stickers V27) */
          [data-name="Hero"] [data-name="Stickers V41"] > div,
          [data-name="Hero"] [class*="top-[822.87px]"] {
            position: absolute !important;
            top: auto !important;
            bottom: -3rem !important;
            left: -5rem !important;
            right: auto !important;
            width: 7.5rem !important;
            height: auto !important;
            z-index: 2 !important;
            pointer-events: none !important;
          }
          [data-name="Hero"] [data-name="Stickers V27"] {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 397.931 / 247.79 !important;
          }
          [data-name="Hero"] [data-name="Stickers V27"] svg {
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
          }

          /* 4. Bottom-Right Amber Star (Figure 5) */
          [data-name="Hero"] [data-name="Figure 5"] {
            position: absolute !important;
            top: auto !important;
            bottom: 1.5rem !important;
            right: 0.5rem !important;
            left: auto !important;
            width: 4rem !important;
            height: auto !important;
            aspect-ratio: 196.656 / 307.591 !important;
            z-index: 2 !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
          [data-name="Hero"] [data-name="Figure 5"] > div,
          [data-name="Hero"] [data-name="Figure 5"] svg {
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
            inset: auto !important;
          }

          /* ─── Mobile Typography System (Rem Based) ─── */
          [class*="text-[288"], [class*="text-[289"] {
            font-size: 4rem !important; /* 64px */
          }

          /* HERO SECTION TEXTS */
          [data-name="Hero"] [class*="text-[128px]"] {
            font-size: 3.5rem !important;
            line-height: 0.9 !important;
            text-shadow: 0.35rem 0.35rem 0px #210901 !important;
            hyphens: auto !important;
            -webkit-hyphens: auto !important;
            -ms-hyphens: auto !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          [data-name="Hero"] [class*="text-[64px]"] {
            font-size: 2rem !important; /* 32px */
            line-height: 1.1 !important;
          }
          [data-name="Hero"] [class*="text-[32px]"],
          [data-name="Hero"] p[class*="w-[728px]"] {
            font-size: 1.1875rem !important; /* 19px */
            line-height: 1.45 !important;
            max-width: 100% !important;
          }

          /* NON-HERO SECTION HEADINGS (SMALLER & COMPACT ON MOBILE) */
          [data-name="Welcome section"] [class*="text-[64px]"],
          [data-name="Humanitarian"] [class*="text-[64px]"],
          [data-name^="MacBook Pro 14' - 4"] [class*="text-[64px]"]:not([class*="font-['Instrument_Serif"]):not([class*="italic"]),
          [data-name="what we do"] [class*="text-[64px]"],
          [class*="text-[64px]"]:not([data-name="Hero"] *) {
            font-size: 2rem !important; /* 26px */
            line-height: 1.15 !important;
          }

          /* Vision & Mission Card Headings on Mobile */
          [class*="bg-[#26103d]"] [class*="text-[64px]"],
          [class*="bg-[#00434a]"] [class*="text-[64px]"],
          [data-name^="MacBook Pro 14' - 4"] [class*="font-['Instrument_Serif"] {
            font-size: 1.75rem !important; /* 28px */
            line-height: 1.1 !important;
          }

          /* Sub-headings / Card Headings on Mobile (48px) */
          [class*="text-[48px]"] {
            font-size: 1.375rem !important; /* 22px */
            line-height: 1.15 !important;
          }

          /* Body Copy & Descriptions on Mobile */
          [data-name="Welcome section"] [class*="text-[32px]"],
          [data-name="Humanitarian"] [class*="text-[32px]"],
          [data-name^="MacBook Pro 14' - 4"] [class*="text-[32px]"] {
            font-size: 1.0625rem !important; /* 17px */
            line-height: 1.45 !important;
            max-width: 100% !important;
          }
          [class*="text-[24px]"] {
            font-size: 0.9375rem !important; /* 15px */
            line-height: 1.4 !important;
          }
          [class*="text-[20px]"],
          [data-name="button"] [class*="text-[20px]"],
          [data-name="button"] [class*="text-[24px]"] {
            font-size: 1rem !important; /* 16px */
          }

          /* Hero CTA Button on Mobile */
          [data-name="Hero"] [data-name="button"] {
            min-height: 3.125rem !important;
            padding: 0.875rem 1.75rem !important;
            filter: drop-shadow(3px 3px 0px #fbb222) !important;
          }

          /* Non-stretching Stickers on Mobile */
          [data-name="Hero"] [data-name="Figure 3"] {
            position: absolute !important;
            top: -2rem !important;
            right: -2rem !important;
            left: auto !important;
            bottom: auto !important;
            width: 13rem !important;
            height: auto !important;
            aspect-ratio: 606 / 633 !important;
            opacity: 0.8;
          }
          [data-name="Hero"] [data-name="Figure 3"] svg {
            width: 100% !important;
            height: 100% !important;
          }
          [data-name="Hero"] [data-name="Figure 5"] {
            position: absolute !important;
            bottom: -0.5rem !important;
            right: 0.5rem !important;
            left: auto !important;
            top: auto !important;
            width: 5.5rem !important;
            height: auto !important;
            aspect-ratio: 196.656 / 307.591 !important;
          }
          [data-name="Hero"] [data-name="Figure 5"] svg {
            width: 100% !important;
            height: 100% !important;
          }
          [data-name="Hero"] [data-name="Stickers V35"] {
            position: absolute !important;
            left: -1rem !important;
            top: 13rem !important;
            width: 4rem !important;
            height: auto !important;
            aspect-ratio: 111 / 163.5 !important;
          }
          [data-name="Hero"] [data-name="Stickers V35"] svg {
            width: 100% !important;
            height: 100% !important;
          }
          [data-name="Hero"] [data-name="Stickers V27"] {
            position: absolute !important;
            left: -1.5rem !important;
            bottom: -0.5rem !important;
            top: auto !important;
            width: 13rem !important;
            height: auto !important;
            aspect-ratio: 397.931 / 247.79 !important;
          }
          /* Welcome Section Stickers on Mobile (Proportionally Scaled, Non-Stretched) */
          [data-name="Welcome section"] [data-name="sparkles"] {
            position: absolute !important;
            top: 1.25rem !important;
            left: 1rem !important;
            width: 2.75rem !important; /* 44px */
            height: auto !important;
            aspect-ratio: 77.995 / 68.9874 !important;
            pointer-events: none !important;
          }
          [data-name="Welcome section"] [data-name="sparkles"] svg {
            width: 100% !important;
            height: 100% !important;
          }
          [data-name="Welcome section"] [class*="left-[1324px]"] {
            position: absolute !important;
            top: 1rem !important;
            right: 0.75rem !important;
            left: auto !important;
            width: auto !important;
            height: auto !important;
            pointer-events: none !important;
          }
          [data-name="Welcome section"] [data-name="shake"] {
            width: 5.25rem !important; /* 84px */
            height: auto !important;
            aspect-ratio: 184.471 / 162.092 !important;
            position: relative !important;
          }
          [data-name="Welcome section"] [data-name="shake"] svg {
            width: 100% !important;
            height: 100% !important;
          }

          /* Welcome Section Heading Width Enforcement on Mobile */
          [data-name="Welcome section"] [class*="w-[730px]"],
          [data-name="Welcome section"] [class*="text-[64px]"] {
            width: 100% !important;
            max-width: clamp(16rem, 78vw, 8rem) !important;
            margin: 0 auto !important;
            text-align: center !important;
          }

          /* ─── FAITH IN ACTION (Humanitarian) — Mobile Layout ─── */
          [data-name="Homepage"] > [data-name="Humanitarian"],
          [data-name="Humanitarian"] {
            position: relative !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            align-self: stretch !important;
            height: auto !important;
            min-height: unset !important;
            padding: 4rem 1.25rem 4.5rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2.5rem !important;
            overflow-x: hidden !important;
            background: transparent !important;
            box-sizing: border-box !important;
          }

          /* Yellow background SVG container: spans 100% screen width & 100% section height */
          [data-name="Humanitarian"] > div:first-child,
          [data-name="Humanitarian"] > div[class*="absolute"][class*="left-1/2"],
          [data-name="Humanitarian"] > div[class*="translate-x"] {
            position: absolute !important;
            inset: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            min-height: 100% !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 0 !important;
            pointer-events: none !important;
            overflow: visible !important;
          }

          /* SVG spans full screen width edge-to-edge with natural wavy edges */
          [data-name="Humanitarian"] > div:first-child svg,
          [data-name="Humanitarian"] > div[class*="absolute"][class*="left-1/2"] svg,
          [data-name="Humanitarian"] > div[class*="translate-x"] svg {
            position: absolute !important;
            inset: 0 !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: calc(100% + 300px) !important;
            height: 100% !important;
            min-width: 100% !important;
            min-height: 100% !important;
            max-width: none !important;
            max-height: none !important;
            display: block !important;
          }

          /* Frame22 (content column: text block + photo) */
          [data-name="Humanitarian"] [class*="gap-[93px]"][class*="items-center"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2.5rem !important;
            width: 100% !important;
            position: relative !important;
            z-index: 2 !important;
          }

          /* Frame21 (wrapper for text block + button) */
          [data-name="Humanitarian"] [class*="flex-row"][class*="self-stretch"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }

          /* Container for Frame20 (text) and Button */
          [data-name="Humanitarian"] [class*="justify-between"][class*="w-[505px]"],
          [data-name="Humanitarian"] [class*="h-full"][class*="items-start"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
            gap: 1.75rem !important;
            height: auto !important;
          }

          /* Frame20 (Heading + Paragraph) */
          [data-name="Humanitarian"] [class*="gap-[32px]"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
            gap: 1.25rem !important;
          }

          /* Centre align paragraph text */
          [data-name="Humanitarian"] [class*="gap-[32px]"] p,
          [data-name="Humanitarian"] [class*="text-[24px]"] {
            text-align: center !important;
            width: 100% !important;
            max-width: 32rem !important;
            margin: 0 auto !important;
          }

          /* Centre align Learn more button */
          [data-name="Humanitarian"] [data-name="button"] {
            align-self: center !important;
            margin: 0 auto !important;
            display: inline-flex !important;
            min-height: 3.125rem !important;
            padding: 0.875rem 2rem !important;
            border-radius: 1rem !important;
            filter: drop-shadow(4px 4px 0px #000000) !important;
          }

          /* Photo: centred, responsive width with proportional aspect ratio */
          [data-name="Humanitarian"] [data-name="IMG_0551 1"],
          [data-name="Humanitarian"] [class*="w-[681px]"] {
            position: relative !important;
            width: 100% !important;
            max-width: 22rem !important;
            height: auto !important;
            aspect-ratio: 681 / 511 !important;
            margin: 0 auto !important;
            align-self: center !important;
            flex-shrink: 0 !important;
            border-radius: 1rem !important;
            box-shadow: 6px 6px 0px 0px #210901 !important;
            z-index: 2 !important;
          }

          /* Heart Sticker (Figure 8) — positioned at the top right of the photo */
          [data-name="Humanitarian"] [class*="left-[1243px]"],
          [data-name="Humanitarian"] > div:has([data-name="Figure 8"]) {
            position: absolute !important;
            top: auto !important;
            bottom: clamp(16.875rem, calc((min(100vw - 2.5rem, 20rem) * 511 / 681) + 1.875rem), 20.875rem) !important;
            right: clamp(-0.5rem, calc(50% - 11.5625rem), -0.5rem) !important;
            left: auto !important;
            width: 5.25rem !important;
            height: 4.5rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            pointer-events: none !important;
            z-index: 25 !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          [data-name="Humanitarian"] [class*="left-[1243px]"] > div {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          [data-name="Humanitarian"] [data-name="Figure 8"] {
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          [data-name="Humanitarian"] [data-name="Figure 8"] > div {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: block !important;
            visibility: visible !important;
          }
          [data-name="Humanitarian"] [data-name="Figure 8"] svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            overflow: visible !important;
          }

          /* Star & Rainbow Sticker (Stickers V14 / V54) — positioned bottom left of the photo (UNTOUCHED) */
          [data-name="Humanitarian"] [data-name="Stickers V14"],
          [data-name="Humanitarian"] [data-name="Stickers V54"] {
            position: absolute !important;
            bottom: clamp(2.5rem, 5vw, 3.5rem) !important;
            left: clamp(0.75rem, calc(50% - 11rem), 3.5rem) !important;
            top: auto !important;
            right: auto !important;
            width: 6.5rem !important;
            height: auto !important;
            aspect-ratio: 245 / 164.066 !important;
            pointer-events: none !important;
            z-index: 25 !important;
          }
          [data-name="Humanitarian"] [data-name="Stickers V14"] svg,
          [data-name="Humanitarian"] [data-name="Stickers V54"] svg {
            width: 100% !important;
            height: 100% !important;
          }

          /* ─── OUR STORY SECTION — Mobile Layout ─── */
          [data-name^="MacBook Pro 14' - 4"] {
            position: relative !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            align-self: stretch !important;
            height: auto !important;
            min-height: unset !important;
            padding: 4.5rem 1.25rem 5rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2.5rem !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }

          /* Frame28 (Content Column: Header + Cards + Button) */
          [data-name^="MacBook Pro 14' - 4"] [class*="w-[1312px]"],
          [data-name^="MacBook Pro 14' - 4"] [class*="gap-[60px]"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2.5rem !important;
            width: 100% !important;
            max-width: 100% !important;
            position: relative !important;
            z-index: 2 !important;
          }

          /* Frame27 (Header + Cards) */
          [data-name^="MacBook Pro 14' - 4"] [class*="gap-[40px]"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2.5rem !important;
            width: 100% !important;
          }

          /* Frame26 (Header: Title + Paragraph) */
          [data-name^="MacBook Pro 14' - 4"] [class*="gap-[48px]"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 1.25rem !important;
            width: 100% !important;
          }

          [data-name^="MacBook Pro 14' - 4"] [class*="gap-[48px]"] p,
          [data-name^="MacBook Pro 14' - 4"] [class*="w-[786px]"] {
            text-align: center !important;
            width: 100% !important;
            max-width: 32rem !important;
            margin: 0 auto !important;
          }

          /* Frame19 (Cards Container: stack into column on mobile) */
          [data-name^="MacBook Pro 14' - 4"] [class*="gap-[20px]"][class*="items-center"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2rem !important;
            width: 100% !important;
          }

          /* Vision & Mission Cards: dynamic auto height, generous mobile padding, no text clipping */
          [data-name^="MacBook Pro 14' - 4"] [class*="bg-[#26103d]"],
          [data-name^="MacBook Pro 14' - 4"] [class*="bg-[#00434a]"] {
            width: 100% !important;
            max-width: 24rem !important;
            height: auto !important;
            min-height: unset !important;
            padding: 2.25rem 1.5rem !important;
            gap: 1.5rem !important;
            border-radius: 1rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }

          /* Card Icons & Titles (Frame9, Frame10) */
          [data-name^="MacBook Pro 14' - 4"] [class*="gap-[36px]"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.875rem !important;
            width: 100% !important;
          }

          /* Eye Icon in Vision Card */
          [data-name="eye"] {
            height: 2.5rem !important;
            width: auto !important;
            aspect-ratio: 97.481 / 48.464 !important;
            position: relative !important;
          }
          [data-name="eye"] svg {
            width: 100% !important;
            height: 100% !important;
          }

          /* Target Icon in Mission Card */
          [data-name="target"] {
            height: 3rem !important;
            width: auto !important;
            aspect-ratio: 95.362 / 68.331 !important;
            position: relative !important;
          }
          [data-name="target"] svg {
            width: 100% !important;
            height: 100% !important;
          }

          /* Card Body Text: fully visible without truncation */
          [data-name^="MacBook Pro 14' - 4"] [class*="bg-[#26103d]"] > p,
          [data-name^="MacBook Pro 14' - 4"] [class*="bg-[#00434a]"] > p {
            font-size: 1rem !important;
            line-height: 1.45 !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
          }

          /* Card CTA Button (Button2) */
          [data-name^="MacBook Pro 14' - 4"] [data-name="button"] {
            align-self: center !important;
            margin: 0 auto !important;
            display: inline-flex !important;
            min-height: 3.125rem !important;
            padding: 0.875rem 2rem !important;
            border-radius: 1rem !important;
            filter: drop-shadow(4px 4px 0px #210901) !important;
          }

          /* Top-Left Sticker (Frame 8 / Figure 6) */
          [data-name^="MacBook Pro 14' - 4"] > div[class*="left-[-134px]"],
          [data-name^="MacBook Pro 14' - 4"] > div:has([id="Figure 6"]) {
            position: absolute !important;
            top: -1.15rem !important;
            left: -3rem !important;
            right: auto !important;
            bottom: auto !important;
            width: 8rem !important;
            height: 8rem !important;
            pointer-events: none !important;
            z-index: 10 !important;
          }
          [data-name^="MacBook Pro 14' - 4"] > div[class*="left-[-134px]"] svg,
          [data-name^="MacBook Pro 14' - 4"] > div:has([id="Figure 6"]) svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }

          /* Bottom-Right Sticker (Figure 1) */
          [data-name^="MacBook Pro 14' - 4"] [data-name="Figure 1"],
          [data-name^="MacBook Pro 14' - 4"] [class*="left-[1340px]"] {
            position: absolute !important;
            bottom: -3rem !important;
            right: -2rem !important;
            left: auto !important;
            top: auto !important;
            width: 7rem !important;
            height: auto !important;
            aspect-ratio: 210.122 / 217.65 !important;
            pointer-events: none !important;
            z-index: 10 !important;
          }
          [data-name^="MacBook Pro 14' - 4"] [data-name="Figure 1"] svg,
          [data-name^="MacBook Pro 14' - 4"] [class*="left-[1340px]"] svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }

          /* ─── WHAT WE DO SECTION — Mobile Layout ─── */
          [data-name="what we do"] {
            position: relative !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            align-self: stretch !important;
            height: auto !important;
            min-height: unset !important;
            padding: 4.5rem 1.25rem 5rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2.5rem !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }

          /* Frame29 (Content Column: Header + Cards + Button) */
          [data-name="what we do"] [class*="w-[1312px]"],
          [data-name="what we do"] [class*="gap-[60px]"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 2.5rem !important;
            width: 100% !important;
            max-width: 100% !important;
            position: relative !important;
            z-index: 2 !important;
          }

          /* Section Heading ("What we do") */
          [data-name="what we do"] [class*="text-[64px]"] {
            text-align: center !important;
            margin: 0 auto !important;
          }

          /* Frame18 (Cards Stacked into Columns on Mobile) */
          [data-name="what we do"] [class*="flex"][class*="gap-[20px]"][class*="items-start"],
          [data-name="what we do"] [class*="w-full"][class*="gap-[20px]"],
          [data-name="what we do"] [class*="gap-[20px]"][class*="items-start"],
          [data-name="what we do"] [class*="gap-[20px]"] {
            display: flex !important;
            flex-direction: column !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 2rem !important;
            width: 100% !important;
          }

          /* Individual Activity Cards (Frame15, Frame16, Frame33) */
          [data-name="what we do"] [class*="h-[597px]"],
          [data-name="what we do"] [class*="w-[425px]"],
          [data-name="what we do"] [class*="w-[422px]"] {
            flex: none !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 24rem !important;
            height: auto !important;
            min-height: unset !important;
            padding: 1.25rem !important;
            gap: 1.25rem !important;
            border-radius: 1.25rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            align-self: center !important;
            box-sizing: border-box !important;
            filter: drop-shadow(6px 6px 0px #210901) !important;
          }

          /* Card Images (Frame12, Frame13, Frame34) */
          [data-name="what we do"] [class*="h-[298px]"] {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 385 / 260 !important;
            min-height: 12rem !important;
            border-radius: 0.75rem !important;
            position: relative !important;
            overflow: hidden !important;
          }

          /* Card Content (Frame14, Frame17, Frame35) */
          [data-name="what we do"] [class*="pb-[20px]"][class*="px-[20px]"] {
            padding: 0 0.5rem 0.75rem !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 0.75rem !important;
            width: 100% !important;
          }

          /* Card Titles & Paragraphs */
          [data-name="what we do"] [class*="text-[48px]"] {
            text-align: center !important;
            margin: 0 auto !important;
          }
          [data-name="what we do"] [class*="pb-[40px]"] p {
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto !important;
          }

          /* Secret Place Logo in Card 1 */
          [data-name="secret place logo 1"] {
            width: 10rem !important;
            height: auto !important;
            aspect-ratio: 195 / 94 !important;
            position: relative !important;
          }

          /* CTA Button ("See All Activities") */
          [data-name="what we do"] [data-name="button"] {
            align-self: center !important;
            margin: 0 auto !important;
            display: inline-flex !important;
            min-height: 3.125rem !important;
            padding: 0.875rem 2rem !important;
            border-radius: 1rem !important;
            filter: drop-shadow(4px 4px 0px #210901) !important;
          }

          /* Top-Left Sticker (Pink Star — Figure 6) */
          [data-name="what we do"] > div[class*="left-[-35px]"],
          [data-name="what we do"] > div:has([id="Figure 6"]) {
            position: absolute !important;
            top: 0.25rem !important;
            left: -3rem !important;
            right: auto !important;
            bottom: auto !important;
            width: 5.5rem !important;
            height: 5.5rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            pointer-events: none !important;
            z-index: 10 !important;
          }
          [data-name="what we do"] > div[class*="left-[-35px]"] svg,
          [data-name="what we do"] > div:has([id="Figure 6"]) svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }

          /* Bottom-Right Sticker (Orange/Yellow Bubble — Stickers V40 / V28) */
          [data-name="what we do"] [data-name="Stickers V40"],
          [data-name="what we do"] [data-name="Stickers V28"],
          [data-name="what we do"] [class*="left-[1075px]"] {
            position: absolute !important;
            bottom: -3rem !important;
            right: -5rem !important;
            left: auto !important;
            top: auto !important;
            width: 12rem !important;
            height: auto !important;
            aspect-ratio: 565.945 / 378.455 !important;
            pointer-events: none !important;
          }
          [data-name="what we do"] [data-name="Stickers V28"] svg,
          [data-name="what we do"] [class*="left-[1075px]"] svg {
            width: 100% !important;
            height: 100% !important;
            display: block !important;
          }
          /* ─── FOOTER SECTION — Mobile Layout ─── */
          [data-name="Footer"] {
            position: relative !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            align-self: stretch !important;
            height: auto !important;
            min-height: unset !important;
            padding: 4.5rem 1.25rem 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 2.5rem !important;
            overflow: hidden !important;
            overflow-x: hidden !important;
            box-sizing: border-box !important;
          }

          /* Top Content (Brand Column + Links Column) */
          [data-name="Footer"] > div:first-child,
          [data-name="Footer"] [class*="justify-between"][class*="w-full"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            gap: 2.25rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Brand Section (Logo + Paragraph) */
          [data-name="Footer"] [class*="w-[450px]"],
          [data-name="Footer"] [class*="w-[465px]"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            gap: 1.25rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Footer Logo: Centered */
          [data-name="Footer"] [data-name="logo"],
          [data-name="Footer"] [class*="w-[202.584px]"] {
            width: 10.5rem !important;
            height: 4.15rem !important;
            margin: 0 auto !important;
            position: relative !important;
          }

          /* Footer Paragraph: Centered with max-width */
          [data-name="Footer"] [class*="w-[450px]"] p,
          [data-name="Footer"] [class*="w-[465px]"] p {
            font-size: 0.9375rem !important;
            line-height: 1.45 !important;
            text-align: center !important;
            width: 100% !important;
            max-width: 22rem !important;
            margin: 0 auto !important;
          }

          /* Links & Socials Container */
          [data-name="Footer"] [data-name="links container"],
          [data-name="Footer"] [class*="w-[400px]"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1.75rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          /* Footer Nav: Links stacked horizontally in a row, centered */
          [data-name="Footer"] [data-name="Footer nav"] {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
          }

          [data-name="Footer"] [data-name="Footer nav"] > div,
          [data-name="Footer"] [class*="gap-[5px]"] {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1.25rem !important;
            width: 100% !important;
          }

          [data-name="Footer"] [data-name="Footer nav"] p {
            font-size: 1rem !important;
            font-weight: 500 !important;
            text-align: center !important;
            width: auto !important;
            cursor: pointer !important;
            white-space: nowrap !important;
          }

          /* Social Media Icons: Centered row */
          [data-name="Footer"] [class*="w-[196px]"] {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 1.25rem !important;
            width: auto !important;
            margin: 0 auto !important;
          }

          [data-name="Footer"] [class*="size-[32px]"],
          [data-name="Footer"] [data-name^="fa"] {
            width: 1.75rem !important;
            height: 1.75rem !important;
            flex-shrink: 0 !important;
          }

          /* Copyright & Privacy Policy: Centered */
          [data-name="Footer"] [class*="border-t"] {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            gap: 0.75rem !important;
            padding: 2rem 1rem 1rem !important;
            width: 100% !important;
            max-width: 100% !important;
            border-top: 1px solid rgba(33, 9, 1, 0.12) !important;
          }

          [data-name="Footer"] [class*="border-t"] p {
            font-size: 0.875rem !important;
            text-align: center !important;
            margin: 0 auto !important;
            white-space: normal !important;
          }

          /* Footer Bottom Watermark & Logo: Centered at bottom edge, bleeding left & right */
          [data-name="Footer"] [class*="h-[288.564px]"],
          [data-name="Footer"] [class*="w-[296.364px]"],
          [data-name="Footer"] [data-name="watermark-icon"] {
            width: 6.5rem !important;
            height: auto !important;
            aspect-ratio: 1 / 1 !important;
            margin: 0 auto !important;
          }

          [data-name="Footer"] [class*="h-[222px]"],
          [data-name="Footer"] [class*="h-[157px]"] {
            position: relative !important;
            height: clamp(3.5rem, 14vw, 7rem) !important;
            width: 100% !important;
            max-width: 100vw !important;
            overflow: visible !important;
            margin: 0 auto !important;
            display: flex !important;
            align-items: flex-end !important;
            justify-content: center !important;
          }

          [data-name="Footer"] [class*="text-[288"],
          [data-name="Footer"] [class*="text-[289"] {
            font-family: 'Instrument Serif', serif !important;
            font-size: clamp(4.5rem, 18vw, 8rem) !important;
            line-height: 0.85 !important;
            text-align: center !important;
            position: absolute !important;
            left: calc(100% + 2rem) !important;
            bottom: -0.25rem !important;
            top: auto !important;
            transform: translateX(-50%) !important;
            white-space: nowrap !important;
            width: max-content !important;
            min-width: max-content !important;
            color: #c5c5c5 !important;
            text-transform: uppercase !important;
            pointer-events: none !important;
          }
        }
      `}</style>

      {/* ── Backdrop overlay ─────────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        onClick={() => setMenuOpen(false)}
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          background: "rgba(22,5,43,0.65)",
          backdropFilter: "blur(5px)",
          zIndex: 990,
          cursor: "pointer",
        }}
      />

      {/* ── Slide-in navigation drawer ───────────────────────────────────── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          right: 0,
          height: "100dvh",
          width: "min(500px, 100vw)",
          background: "#100122",
          borderLeft: "3px solid #d7f741",
          zIndex: 1000,
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* ── Header: real logo clone + close button ── */}
        <div
          data-mi
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 32px",
            borderBottom: "1px solid rgba(215,247,65,0.12)",
          }}
        >
          {/* Official Light Transparent Logo */}
          <div style={{ display: "flex", alignItems: "center", height: "48px", width: "135px", marginLeft: "-6px" }}>
            <img
              src={logoColorLight}
              alt="GenZs for Christ"
              style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "left center" }}
            />
          </div>

          {/* Close button — matches Frame1 exactly */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
            style={{
              background: "#fff",
              border: "1px solid #210901",
              borderRadius: "16px",
              width: "52px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              filter: "drop-shadow(4px 4px 0 #fbb222)",
              flexShrink: 0,
              transition: "filter 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter =
                "drop-shadow(0 0 0 transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter =
                "drop-shadow(4px 4px 0 #fbb222)";
            }}
          >
            <X size={20} color="#210901" strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Navigation links ── */}
        <nav style={{ flex: 1, padding: "32px 32px 20px" }}>
          <p
            data-mi
            style={{
              fontFamily: "'Instrument Sans',sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "3px",
              color: "#d7f741",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Navigate
          </p>
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={
                label === "About"
                  ? "/about"
                  : label === "Contact"
                    ? "/contact"
                    : label === "Home"
                      ? "/"
                      : `${label.toLowerCase()}`
              }
              data-mi
              className="gz-nav-link"
              onClick={(e) => {
                if (label === "About") {
                  e.preventDefault();
                  navigateTo("about");
                } else if (label === "Contact") {
                  e.preventDefault();
                  navigateTo("contact");
                } else if (label === "Home") {
                  e.preventDefault();
                  navigateTo("home");
                } else {
                  setMenuOpen(false);
                }
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── Divider ── */}
        <div
          style={{
            height: "1px",
            background: "rgba(215,247,65,0.15)",
            margin: "0 32px",
          }}
        />

        {/* ── Bottom section ── */}
        <div
          style={{
            padding: "28px 32px 36px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* CTA — data-name="button" picks up the site-wide hover rule */}
          <a
            href="#/contact"
            data-mi
            data-name="button"
            className="gz-cta-btn"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("contact");
            }}
          >
            Get In Touch
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Social icons */}
          <div
            data-mi
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <a
              href="https://instagram.com/genzsforchrist"
              target="_blank"
              rel="noopener noreferrer"
              className="gz-social-btn"
              aria-label="Instagram"
            >
              <Instagram size={19} />
            </a>
            <a
              href="https://tiktok.com/@genzsforchrist"
              target="_blank"
              rel="noopener noreferrer"
              className="gz-social-btn"
              aria-label="TikTok"
            >
              <TikTokIcon size={19} />
            </a>
            <a
              href="https://facebook.com/genzsforchrist"
              target="_blank"
              rel="noopener noreferrer"
              className="gz-social-btn"
              aria-label="Facebook"
            >
              <Facebook size={19} />
            </a>
            <a
              href="https://youtube.com/@genzsforchrist"
              target="_blank"
              rel="noopener noreferrer"
              className="gz-social-btn"
              aria-label="YouTube"
            >
              <Youtube size={19} />
            </a>
          </div>

          {/* Copyright */}
          <p
            data-mi
            style={{
              fontFamily: "'Instrument Sans',sans-serif",
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.3px",
              marginTop: "4px",
            }}
          >
            © Gen Zs for Christ, 2026
          </p>
        </div>
      </div>

      {currentPage === "about" ? (
        <>
          {/* ── Persistent Floating Sticky Navbar for About Page ── */}
          <SiteNavbar
            onNavigateHome={() => navigateTo("home")}
            onOpenMenu={() => setMenuOpen(true)}
          />

          <AboutPage onNavigateContact={() => navigateTo("contact")} />
        </>
      ) : currentPage === "contact" ? (
        <>
          {/* ── Persistent Floating Sticky Navbar for Contact Page ── */}
          <SiteNavbar
            onNavigateHome={() => navigateTo("home")}
            onOpenMenu={() => setMenuOpen(true)}
          />

          <ContactPage />
        </>
      ) : (
        <div ref={rootRef} style={{ minHeight: "100svh" }}>
          <Homepage />
        </div>
      )}
    </>
  );
}