import React, { useEffect, useState, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Radio,
  BookOpen,
  Trophy,
} from "lucide-react";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";

gsap.registerPlugin(ScrollTrigger);
import Footer from "@/imports/Footer/index";
import CtaSection from "@/app/components/CtaSection";
import EventDetailPage from "@/components/EventDetailPage";
import NotFoundPage from "@/components/NotFoundPage";
import {
  ActivityItem,
  getEventsFromContent,
  getGalleryFromContent,
  getEventStatusBadge,
  resolveCardColors,
} from "@/lib/eventsContent";

// ── Reusable Neo-Brutalist Button Component ──
function NeoButton({
  children,
  onClick,
  href,
  target,
  rel,
  type = "button",
  variant = "white-black",
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
        return "bg-white drop-shadow-[4px_4px_0px_#210901] text-[#210901]";
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
      <div className="flex flex-col font-['Instrument_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-inherit text-[16px] sm:text-[18px] text-center whitespace-nowrap">
        <p className="leading-[0.9]">{children}</p>
      </div>
      {icon && (
        <div className="overflow-clip relative shrink-0 size-[18px] sm:size-[20px] flex items-center justify-center">
          {icon}
        </div>
      )}
    </>
  );

  const baseClasses = `group content-stretch flex gap-[8px] h-[48px] sm:h-[52px] items-center justify-center px-[22px] sm:px-[28px] py-[12px] sm:py-[14px] relative rounded-[16px] shrink-0 cursor-pointer ${getShadow()} ${className}`;

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

// ── Horizontal Event Card (Row on Large Breakpoints, Column on Mobile) ──
function BriefEventCard({
  item,
  onReadMore,
}: {
  item: ActivityItem;
  onReadMore: (event: ActivityItem) => void;
}) {
  const badge = getEventStatusBadge(item);
  const colors = resolveCardColors(
    item.cardBg,
    item.cardText,
    item.titleColor,
    item.shadowColor
  );

  return (
    <div
      data-name="event-card"
      className={`flex flex-col lg:flex-row items-stretch gap-6 lg:gap-7 ${colors.cardBg} ${colors.cardText} p-6 sm:p-7 rounded-[24px] border-2 border-[#210901] overflow-hidden hover:-translate-y-1.5 transition-transform duration-300 ease-out`}
      style={{
        boxShadow: `8px 8px 0px 0px ${colors.shadowColor}`,
      }}
    >
      {/* Left: Picture Container with Status Tag */}
      <div className="w-full lg:w-[42%] min-h-[220px] sm:min-h-[250px] lg:min-h-[250px] rounded-[16px] overflow-hidden border border-black/20 relative group shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#210901] shadow-[2px_2px_0px_#210901] ${badge.bg} ${badge.text}`}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Right: Texts and Buttons in their own Container */}
      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Title */}
          <h3
            className={`text-[32px] sm:text-[38px] lg:text-[40px] leading-[1.05] mb-2 font-bold ${colors.titleColor}`}
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {item.title}
          </h3>

          {/* Subtitle */}
          {item.subtitle && (
            <p
              className={`text-[16px] sm:text-[18px] font-normal mb-3.5 leading-snug ${colors.isDark ? "text-white/90" : "text-[#210901]/85"
                }`}
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              {item.subtitle}
            </p>
          )}

          {/* Date & Venue Metadata */}
          <div
            className={`flex flex-col gap-2.5 py-3 border-y text-[14px] sm:text-[16px] font-medium ${colors.isDark
              ? "border-white/20 text-white"
              : "border-[#210901]/15 text-[#210901]"
              }`}
          >
            <div className="flex items-start gap-2.5">
              <Calendar
                size={18}
                className={`shrink-0 mt-0.5 ${colors.titleColor.includes("#")
                  ? colors.titleColor
                  : colors.isDark
                    ? "text-[#fbb222]"
                    : "text-[#210901]"
                  }`}
              />
              <span
                className={`font-semibold ${colors.isDark ? "text-white" : "text-[#210901]"
                  }`}
              >
                {item.date}
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin
                size={18}
                className={`shrink-0 mt-0.5 ${colors.titleColor.includes("#")
                  ? colors.titleColor
                  : colors.isDark
                    ? "text-[#fbb222]"
                    : "text-[#210901]"
                  }`}
              />
              <span className={colors.isDark ? "text-white/90" : "text-[#210901]/90"}>
                {item.venue}
              </span>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <div className="pt-2 flex items-center">
          <NeoButton
            onClick={() => onReadMore(item)}
            variant={
              colors.cardBg.includes("#00434a")
                ? "lime-black"
                : colors.cardBg.includes("#26103d")
                  ? "white-amber"
                  : "white-black"
            }
            icon={<ArrowRight size={18} />}
            className="w-full sm:w-auto"
          >
            Read More
          </NeoButton>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage({
  onNavigateContact,
  selectedEventId,
}: {
  onNavigateContact?: () => void;
  selectedEventId?: string;
}) {
  // Dynamic CMS content
  const allEvents = useMemo(() => getEventsFromContent(), []);
  const gallery = useMemo(() => getGalleryFromContent(), []);

  // Selected event state for dedicated event view
  const [activeEvent, setActiveEvent] = useState<ActivityItem | null>(() => {
    if (selectedEventId) {
      return allEvents.find((e) => e.id === selectedEventId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (selectedEventId) {
      const found = allEvents.find((e) => e.id === selectedEventId);
      setActiveEvent(found || null);
    } else {
      setActiveEvent(null);
    }
  }, [selectedEventId, allEvents]);

  // Separate events into the 3 distinct sections
  const upcomingEvents = useMemo(() => {
    return allEvents.filter((item) => item.status === "upcoming");
  }, [allEvents]);

  const ongoingEvents = useMemo(() => {
    return allEvents.filter((item) => item.status === "ongoing");
  }, [allEvents]);

  const pastEvents = useMemo(() => {
    return allEvents.filter((item) => item.status === "past");
  }, [allEvents]);

  const handleReadMore = (event: ActivityItem) => {
    setActiveEvent(event);
    window.history.pushState(null, "", `/events/${event.id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAllEvents = () => {
    setActiveEvent(null);
    window.history.pushState(null, "", "/events");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If viewing a dedicated event detail page
  if (activeEvent) {
    return (
      <EventDetailPage
        event={activeEvent}
        onBack={handleBackToAllEvents}
        onNavigateContact={onNavigateContact}
      />
    );
  }

  // If an invalid event ID was passed in URL
  if (selectedEventId && !activeEvent) {
    return (
      <NotFoundPage
        title="Event Not Found"
        subtitle="We couldn't locate the gathering or event you're searching for."
        description="This event may have concluded, been rescheduled, or the link may have a typo. You can explore all our other active and upcoming gatherings below."
        backLabel="Explore All Events"
        onBack={handleBackToAllEvents}
        onNavigateHome={() => {
          window.history.pushState(null, "", "/");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        onNavigateEvents={handleBackToAllEvents}
        onNavigateBlog={() => {
          window.history.pushState(null, "", "/blog");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        onNavigateAbout={() => {
          window.history.pushState(null, "", "/about");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        onNavigateContact={onNavigateContact}
      />
    );
  }

  const containerRef = useRef<HTMLDivElement>(null);

  // ── GSAP Scroll & Entrance Animations ──────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container || activeEvent) return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      const heroContent = container.querySelector('[data-name="EventsHero"] > div');
      if (heroContent) {
        gsap.from(heroContent.children, {
          y: 44,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.1,
        });
      }

      // 2. Section Headers
      container.querySelectorAll<HTMLElement>("section > div > div.text-center").forEach((header) => {
        gsap.from(header, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // 3. Event Cards Stagger (per section)
      container.querySelectorAll<HTMLElement>("section").forEach((sec) => {
        const cards = sec.querySelectorAll<HTMLElement>('[data-name="event-card"]');
        if (cards.length > 0) {
          gsap.from(cards, {
            opacity: 0,
            y: 36,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.14,
            clearProps: "transform",
            scrollTrigger: {
              trigger: cards[0].parentElement || sec,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      // 4. Community Gallery Photos Stagger
      const galleryItems = container.querySelectorAll<HTMLElement>('[data-name="gallery-item"]');
      if (galleryItems.length > 0) {
        gsap.from(galleryItems, {
          opacity: 0,
          scale: 0.92,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "transform",
          scrollTrigger: {
            trigger: galleryItems[0].parentElement,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [activeEvent, allEvents]);

  return (
    <div
      ref={containerRef}
      className="gz-grid-bg text-[#210901] min-h-screen w-full flex flex-col font-['Instrument_Sans',sans-serif] selection:bg-[#d7f741] selection:text-[#210901]"
    >
      {/* ── 1. Hero Section ── */}
      <section
        data-name="EventsHero"
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
            className="font-['Gasoek_One',sans-serif] text-[40px] sm:text-[56px] md:text-[72px] text-white leading-[0.95] tracking-tight uppercase m-0"
            style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
          >
            Events & Activities
          </h1>
        </div>
      </section>

      {/* ── 3. SECTION 1: UPCOMING EVENTS (No border rings) ───────────────── */}
      <section className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-transparent">
        <div className="max-w-[1312px] mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-[960px] mx-auto mb-14 sm:mb-18 flex flex-col gap-3">
            <h2
              className="text-[36px] sm:text-[48px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Upcoming Events
            </h2>
            <p
              className="font-medium text-[19px] sm:text-[23px] text-[#210901]/80 max-w-[800px] mx-auto leading-relaxed"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              Mark your calendar and prepare for what God is doing next.
            </p>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-[#fff4ef] rounded-[20px] border-2 border-dashed border-[#210901]/30 p-8">
              <p className="text-[#210901]/70 text-base font-medium">
                No upcoming events announced yet. Stay tuned or join our ongoing weekly rhythms below!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {upcomingEvents.map((item) => (
                <BriefEventCard
                  key={item.id}
                  item={item}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 4. SECTION 2: ONGOING ACTIVITIES (No border rings) ────────────── */}
      <section className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-[#FFEDE5]">
        <div className="max-w-[1312px] mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-[960px] mx-auto mb-14 sm:mb-18 flex flex-col gap-3">
            <h2
              className="text-[36px] sm:text-[48px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Ongoing Activities
            </h2>
            <p
              className="font-medium text-[19px] sm:text-[23px] text-[#210901]/80 max-w-[800px] mx-auto leading-relaxed"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              Consistent spiritual rhythms and community fellowship keeping us connected every week.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {ongoingEvents.map((item) => (
              <BriefEventCard
                key={item.id}
                item={item}
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. SECTION 3: PAST EVENTS (No border rings) ───────────────────── */}
      <section className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-transparent">
        <div className="max-w-[1312px] mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-[960px] mx-auto mb-14 sm:mb-18 flex flex-col gap-3">
            <h2
              className="text-[36px] sm:text-[48px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Past Events
            </h2>
            <p
              className="font-medium text-[19px] sm:text-[23px] text-[#210901]/80 max-w-[800px] mx-auto leading-relaxed"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              Relive the encounters, worship recordings, and testimonies from our completed gatherings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {pastEvents.map((item) => (
              <BriefEventCard
                key={item.id}
                item={item}
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. SECTION 4: PHOTO GALLERY (No border rings) ─────────────────── */}
      <section className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-[#FFEDE5]">
        <div className="max-w-[1312px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2
              className="text-[36px] sm:text-[48px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              {gallery.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {gallery.photos.map((photo) => (
              <div
                key={photo.id}
                data-name="gallery-item"
                className="rounded-[20px] overflow-hidden h-[380px] sm:h-[480px] lg:h-[450px] group relative"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Unified CTA Section & Footer ── */}
      <CtaSection onNavigateContact={onNavigateContact} />
      <Footer />
    </div>
  );
}
