import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Home, ArrowLeft } from "lucide-react";
import Footer from "@/imports/Footer/index";
import lostSvg from "@/imports/lost.svg";

export interface NotFoundPageProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backLabel?: string;
  onBack?: () => void;
  onNavigateHome?: () => void;
  onNavigateEvents?: () => void;
  onNavigateBlog?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
}

export default function NotFoundPage({
  title = "We Can't Find What You're Looking For",
  subtitle = "Even when you wander off the map, you are never truly lost.",
  description = "The page or content you're trying to reach hasn't been created yet, has been relocated, or is taking a Sabbath rest. Don't worry—there is always a way back.",
  backLabel = "Go Back",
  onBack,
  onNavigateHome,
}: NotFoundPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── GSAP Entrance Animations ───────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Lost sticker pop-in
      const sticker = container.querySelector(".gz-notfound-sticker");
      if (sticker) {
        gsap.from(sticker, {
          opacity: 0,
          scale: 0.88,
          y: 24,
          duration: 0.85,
          ease: "back.out(1.4)",
          clearProps: "all",
        });
      }

      // 2. Title & description reveal
      const textBlock = container.querySelector(".gz-notfound-text");
      if (textBlock) {
        gsap.from(textBlock, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.1,
          clearProps: "all",
        });
      }

      // 3. Action buttons reveal
      const actions = container.querySelector(".gz-notfound-actions");
      if (actions) {
        gsap.from(actions, {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "power3.out",
          delay: 0.2,
          clearProps: "all",
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  const handleDefaultBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div
      ref={containerRef}
      className="gz-grid-bg text-[#210901] min-h-screen w-full flex flex-col justify-between font-['Instrument_Sans',sans-serif]"
    >
      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 sm:pt-40 pb-16 sm:pb-24">
        <div className="max-w-[760px] mx-auto w-full flex flex-col items-center text-center">
          {/* Lost Sticker */}
          <div className="gz-notfound-sticker flex items-center justify-center mb-6">
            <img
              src={lostSvg}
              alt="Lost sticker"
              className="w-full max-w-[240px] sm:max-w-[300px] h-auto object-contain drop-shadow-lg"
            />
          </div>

          {/* Heading */}
          <div className="gz-notfound-text flex flex-col items-center">
            <h2
              className="text-[32px] sm:text-[44px] text-[#210901] leading-[1.05] tracking-tight mb-3"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              {title}
            </h2>

            {/* Subtitle & Description */}
            <p
              className="text-[22px] sm:text-[28px] text-[#4b001a] leading-snug mb-4 italic"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {subtitle}
            </p>

            <p className="text-[#210901]/85 text-[16px] sm:text-[18px] leading-relaxed max-w-[580px] mx-auto mb-6">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="gz-notfound-actions flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#210901]/15 w-full max-w-[480px]">
            <button
              type="button"
              onClick={handleGoHome}
              className="cursor-pointer bg-[#210901] text-white px-6 sm:px-8 py-3.5 rounded-[14px] font-semibold text-[15px] sm:text-[16px] flex items-center justify-center gap-2.5 border border-[#210901] shadow-[4px_4px_0px_0px_#fbb222] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#fbb222] active:translate-x-0 active:translate-y-0 transition-all"
            >
              <Home size={18} className="text-[#fbb222]" />
              <span>Return to Home</span>
            </button>

            <button
              type="button"
              onClick={handleDefaultBack}
              className="cursor-pointer bg-white text-[#210901] px-5 sm:px-6 py-3.5 rounded-[14px] font-semibold text-[15px] sm:text-[16px] flex items-center justify-center gap-2 border border-[#210901] shadow-[4px_4px_0px_0px_#210901] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#210901] active:translate-x-0 active:translate-y-0 transition-all"
            >
              <ArrowLeft size={18} />
              <span>{backLabel}</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
