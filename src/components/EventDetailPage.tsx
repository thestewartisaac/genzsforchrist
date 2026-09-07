import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  Send,
  ExternalLink,
  CheckCircle2,
  Video,
  Share2,
} from "lucide-react";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";
import Footer from "@/imports/Footer/index";
import CtaSection from "@/app/components/CtaSection";
import {
  ActivityItem,
  getEventStatusBadge,
} from "@/lib/eventsContent";

gsap.registerPlugin(ScrollTrigger);

// NeoButton component matching the site design
function NeoButton({
  children,
  onClick,
  href,
  target,
  rel,
  type = "button",
  variant = "white-amber",
  icon,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  variant?: "white-amber" | "white-black" | "lime-black" | "black-amber" | "red-black";
  icon?: React.ReactNode;
  className?: string;
}) {
  const getShadow = () => {
    switch (variant) {
      case "white-amber":
        return "bg-white drop-shadow-[4px_4px_0px_#fbb222] text-[#210901]";
      case "white-black":
        return "bg-white drop-shadow-[4px_4px_0px_#210901] text-[#210901]";
      case "lime-black":
        return "bg-[#d7f741] drop-shadow-[4px_4px_0px_#210901] text-[#210901]";
      case "black-amber":
        return "bg-[#210901] drop-shadow-[4px_4px_0px_#fbb222] text-white";
      case "red-black":
        return "bg-white drop-shadow-[4px_4px_0px_red] text-[#210901]";
      default:
        return "bg-white drop-shadow-[4px_4px_0px_#fbb222] text-[#210901]";
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case "black-amber":
        return "border-[#fbb222] group-hover:border-white";
      case "white-amber":
        return "border-black group-hover:border-[#fbb222]";
      case "lime-black":
        return "border-black group-hover:border-[#210901]";
      case "red-black":
        return "border-black group-hover:border-[#e62129]";
      default:
        return "border-black group-hover:border-[#fbb222]";
    }
  };

  const content = (
    <>
      <div
        aria-hidden
        className={`absolute border ${getBorderColor()} border-solid inset-0 pointer-events-none rounded-[16px] transition-colors duration-150`}
      />
      <div className="flex flex-col font-['Instrument_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-inherit text-[17px] sm:text-[20px] text-center whitespace-nowrap">
        <p className="leading-[0.9]">{children}</p>
      </div>
      {icon && (
        <div className="overflow-clip relative shrink-0 size-[20px] sm:size-[24px] flex items-center justify-center">
          {icon}
        </div>
      )}
    </>
  );

  const baseClasses = `group content-stretch flex gap-[8px] h-[52px] sm:h-[56px] items-center justify-center px-[24px] sm:px-[32px] py-[14px] sm:py-[16px] relative rounded-[16px] shrink-0 cursor-pointer ${getShadow()} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={baseClasses}
        data-name="button"
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      data-name="button"
    >
      {content}
    </button>
  );
}

export default function EventDetailPage({
  event,
  onBack,
  onNavigateContact,
}: {
  event: ActivityItem;
  onBack: () => void;
  onNavigateContact?: () => void;
}) {
  const badge = getEventStatusBadge(event);
  const [copied, setCopied] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Hero Title reveal
      gsap.from(".gz-detail-hero-title", {
        opacity: 0,
        y: 36,
        duration: 0.8,
        ease: "power3.out",
      });

      // 2. Main Event Content Split-Column Animation
      gsap.from(".gz-detail-left-col", {
        opacity: 0,
        x: -40,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-detail-content",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".gz-detail-right-col", {
        opacity: 0,
        x: 40,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-detail-content",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 3. Highlights & Timezones reveal if present
      const highlightBox = container.querySelector(".gz-detail-highlights");
      if (highlightBox) {
        gsap.from(highlightBox, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: highlightBox,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      const timezoneBox = container.querySelector(".gz-detail-timezones");
      if (timezoneBox) {
        gsap.from(timezoneBox, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: timezoneBox,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [event.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div ref={containerRef} className="gz-grid-bg text-[#210901] min-h-screen w-full flex flex-col font-['Instrument_Sans',sans-serif]">
      {/* ── 1. Hero Section ── */}
      <section
        className="gz-contact-hero bg-[#07070f] relative overflow-clip w-full flex flex-col items-center justify-center px-6 text-center shrink-0"
        style={{
          height: "45vh",
          minHeight: "18rem",
          maxHeight: "45vh",
          paddingTop: "5rem",
          boxSizing: "border-box",
        }}
      >
        <HeroAnimatedBackground />

        <div className="relative z-[3] max-w-4xl mx-auto flex flex-col items-center gap-4">
          <h1
            className="gz-detail-hero-title font-['Gasoek_One',sans-serif] text-[36px] sm:text-[52px] md:text-[64px] text-white leading-[1.02] tracking-tight uppercase m-0"
            style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
          >
            {event.title}
          </h1>
        </div>
      </section>

      {/* ── 3. Main Event Content ── */}
      <section className="gz-detail-content w-full py-12 sm:py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1312px] mx-auto flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Column: Image Banner & Metadata Card */}
          <div className="gz-detail-left-col w-full lg:w-[480px] shrink-0 flex flex-col gap-6">
            {/* Event Photo */}
            <div className="h-[320px] sm:h-[400px] w-full rounded-[20px] overflow-hidden border-2 border-[#210901] shadow-[10px_10px_0px_#210901] relative group">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#210901] shadow-[2px_2px_0px_#210901] ${badge.bg} ${badge.text}`}
                >
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Quick Metadata Box */}
            <div className="bg-[#fff4ef] border-2 border-[#210901] rounded-[20px] p-6 shadow-[8px_8px_0px_#210901] flex flex-col gap-4">
              <h3
                className="text-[24px] sm:text-[28px] text-[#210901] m-0"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Event Schedule & Venue
              </h3>

              <div className="flex flex-col gap-3 text-sm sm:text-base border-t border-[#210901]/15 pt-4">
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="shrink-0 text-[#210901] mt-0.5" />
                  <div>
                    <span className="font-bold block text-xs uppercase text-[#210901]/60">Date / Schedule</span>
                    <span className="font-medium text-[#210901]">{event.date}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={20} className="shrink-0 text-[#210901] mt-0.5" />
                  <div>
                    <span className="font-bold block text-xs uppercase text-[#210901]/60">Venue / Location</span>
                    <span className="font-medium text-[#210901]">{event.venue}</span>
                  </div>
                </div>
              </div>

              {event.actionUrl && (
                <div className="pt-2">
                  <NeoButton
                    href={event.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="lime-black"
                    icon={
                      event.actionUrl.includes("youtube") ? (
                        <Video size={18} />
                      ) : event.actionUrl.includes("t.me") ? (
                        <Send size={18} />
                      ) : (
                        <ArrowRight size={18} />
                      )
                    }
                    className="w-full"
                  >
                    {event.actionText || "Join Event"}
                  </NeoButton>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Full Narrative & Highlights */}
          <div className="gz-detail-right-col flex-1 flex flex-col gap-8">
            {event.logo && (
              <div className="h-28 w-auto max-w-[240px] flex items-center mb-2">
                <img
                  src={event.logo}
                  alt={event.title}
                  className="h-full w-auto object-contain"
                />
              </div>
            )}

            <div>
              <h2
                className="text-[38px] sm:text-[54px] text-[#210901] leading-[1.05] m-0"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {event.title}
              </h2>
              {event.subtitle && (
                <p
                  className="text-[19px] sm:text-[24px] text-[#210901]/80 mt-2 font-normal leading-snug"
                  style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
                >
                  {event.subtitle}
                </p>
              )}
            </div>

            {/* Rich Narrative */}
            <div className="prose max-w-none text-[#210901]/90 text-[17px] sm:text-[20px] leading-relaxed space-y-4">
              {(event.fullDescription || event.description)
                .split("\n\n")
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            {/* Highlights Box */}
            {event.highlights && event.highlights.length > 0 && (
              <div className="gz-detail-highlights bg-white border-2 border-[#210901] rounded-[20px] p-6 sm:p-8 shadow-[8px_8px_0px_#fbb222]">
                <h3
                  className="text-[28px] sm:text-[34px] text-[#210901] leading-tight mb-4"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  What to Expect & Key Highlights
                </h3>

                <div className="space-y-3">
                  {event.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-[16px] sm:text-[18px]">
                      <CheckCircle2 size={20} className="text-[#e62129] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Prayer Timezones Breakdown (If Applicable) */}
            {event.timezones && event.timezones.length > 0 && (
              <div className="gz-detail-timezones bg-[#210901] text-white border-2 border-[#210901] rounded-[20px] p-6 sm:p-8 shadow-[8px_8px_0px_#d7f741]">
                <h3
                  className="text-[28px] sm:text-[34px] text-[#d7f741] leading-tight mb-4"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Global Prayer Timezone Schedule
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.timezones.map((tz, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 border border-white/20 rounded-[14px] p-4 text-center"
                    >
                      <span className="text-xs font-bold text-[#fbb222] uppercase tracking-wider block mb-1">
                        {tz.zone} ({tz.region})
                      </span>
                      <p
                        className="text-[32px] font-bold text-white mb-0"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        {tz.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              {event.actionUrl && (
                <NeoButton
                  href={event.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="lime-black"
                  icon={<ExternalLink size={18} />}
                >
                  {event.actionText || "Connect to Event"}
                </NeoButton>
              )}

              <NeoButton
                onClick={onBack}
                variant="white-black"
                icon={<ArrowLeft size={18} />}
              >
                Back to All Events
              </NeoButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Unified CTA Section & Footer ── */}
      <CtaSection onNavigateContact={onNavigateContact} />
      <Footer />
    </div>
  );
}
