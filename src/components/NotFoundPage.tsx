import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Home, ArrowLeft } from "lucide-react";
import Footer from "@/imports/Footer/index";
import lostSvg from "@/imports/lost.svg";
import NeoButton from "@/components/ui/NeoButton";

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
  onNavigateEvents,
  onNavigateBlog,
  onNavigateAbout,
  onNavigateContact,
}: NotFoundPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── GSAP Entrance Animations ───────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

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
            <NeoButton
              onClick={handleGoHome}
              variant="primary"
              icon={<Home size={18} className="text-[#fbb222]" />}
              iconPosition="left"
            >
              Return to Home
            </NeoButton>

            <NeoButton
              onClick={handleDefaultBack}
              variant="primary"
              icon={<ArrowLeft size={18} />}
              iconPosition="left"
            >
              {backLabel}
            </NeoButton>
          </div>

          {/* Quick Destination Navigation Pills */}
          <div className="mt-8 pt-6 border-t border-[#210901]/10 w-full max-w-[540px] flex flex-col items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#210901]/60">
              Or jump straight to:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {[
                { label: "Events & Activities", path: "/events", fn: onNavigateEvents },
                { label: "Blog & Journal", path: "/blog", fn: onNavigateBlog },
                { label: "Our Story", path: "/about", fn: onNavigateAbout },
                { label: "Foundation & Giving", path: "/foundation", fn: undefined },
                { label: "Contact Us", path: "/contact", fn: onNavigateContact },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.fn) {
                      item.fn();
                    } else {
                      window.history.pushState(null, "", item.path);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }
                  }}
                  data-name="button"
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[#210901] text-xs font-bold text-[#210901] hover:bg-[#d7f741] drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none transition-[filter] duration-150 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
