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
  X,
} from "lucide-react";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";

gsap.registerPlugin(ScrollTrigger);
import Footer from "@/imports/Footer/index";
import CtaSection from "@/components/CtaSection";
import EventDetailPage from "@/components/EventDetailPage";
import NotFoundPage from "@/components/NotFoundPage";
import NeoButton from "@/components/ui/NeoButton";
import {
  ActivityItem,
  getEventsFromContent,
  getGalleryFromContent,
  getEventStatusBadge,
  resolveCardColors,
} from "@/lib/eventsContent";

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
          {/* Logo if present (e.g. The Secret Place) */}
          {item.logo && (
            <div className="h-[52px] sm:h-[64px] w-auto max-w-[220px] mb-2 flex items-center">
              <img
                src={item.logo}
                alt={item.title}
                className="h-full w-auto object-contain"
              />
            </div>
          )}

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
            variant="primary"
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
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

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

  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "ongoing" | "past">("all");
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
          y: 28,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          delay: 0.05,
          clearProps: "all",
        });
      }

      // 2. Section Headers
      container.querySelectorAll<HTMLElement>("section > div > div.text-center").forEach((header) => {
        gsap.from(header, {
          y: 24,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: header,
            start: "top 95%",
            once: true,
            fastScrollEnd: true,
          },
        });
      });

      // 3. Event Cards Stagger (per section)
      container.querySelectorAll<HTMLElement>("section").forEach((sec) => {
        const cards = sec.querySelectorAll<HTMLElement>('[data-name="event-card"]');
        if (cards.length > 0) {
          gsap.from(cards, {
            opacity: 0,
            y: 24,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            clearProps: "all",
            scrollTrigger: {
              trigger: cards[0].parentElement || sec,
              start: "top 95%",
              once: true,
              fastScrollEnd: true,
            },
          });
        }
      });

      // 4. Community Gallery Photos Stagger
      const galleryItems = container.querySelectorAll<HTMLElement>('[data-name="gallery-item"]');
      if (galleryItems.length > 0) {
        gsap.from(galleryItems, {
          opacity: 0,
          scale: 0.94,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.04,
          clearProps: "all",
          scrollTrigger: {
            trigger: galleryItems[0].parentElement,
            start: "top 95%",
            once: true,
            fastScrollEnd: true,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [activeEvent, allEvents]);

  const handleReadMore = (event: ActivityItem) => {
    setActiveEvent(event);
    window.history.pushState(null, "", `/events/${event.id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleBackToAllEvents = () => {
    setActiveEvent(null);
    window.history.pushState(null, "", "/events");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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

      {/* ── 2. Filter Navigation Bar ── */}
      <section className="gz-events-filter-bar w-full py-5 px-6 sm:px-12 lg:px-20 sticky top-0 z-30">
        <div className="max-w-[1312px] mx-auto flex items-center justify-between gap-4 overflow-x-auto pb-1">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Events", count: allEvents.length },
              { id: "upcoming", label: "Upcoming", count: upcomingEvents.length },
              { id: "ongoing", label: "Activities", count: ongoingEvents.length },
              { id: "past", label: "Past Events", count: pastEvents.length },
            ].map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  data-name="button"
                  className={`px-4 py-2 rounded-[14px] text-xs sm:text-sm font-bold tracking-wide border-2 border-[#210901] cursor-pointer shrink-0 inline-flex items-center gap-2 transition-[filter] duration-150 ${isActive
                    ? "bg-[#210901] text-white drop-shadow-[3px_3px_0px_#fbb222] hover:drop-shadow-none"
                    : "bg-white text-[#210901] hover:bg-[#fff4ef] drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none"
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${isActive
                      ? "bg-[#d7f741] text-[#210901]"
                      : "bg-[#210901]/10 text-[#210901]"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. SECTION 1: UPCOMING EVENTS ───────────────── */}
      {(activeFilter === "all" || activeFilter === "upcoming") && (
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
      )}

      {/* ── 4. SECTION 2: Activities ────────────── */}
      {(activeFilter === "all" || activeFilter === "ongoing") && (
        <section className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-[#FFEDE5]">
          <div className="max-w-[1312px] mx-auto">
            {/* Section Heading */}
            <div className="text-center max-w-[960px] mx-auto mb-14 sm:mb-18 flex flex-col gap-3">
              <h2
                className="text-[36px] sm:text-[48px] text-[#210901] leading-tight m-0"
                style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
              >
                Activities
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
      )}

      {/* ── 5. SECTION 3: PAST EVENTS ───────────────────── */}
      {(activeFilter === "all" || activeFilter === "past") && (
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
      )}

      {/* ── 6. SECTION 4: PHOTO GALLERY (No border rings) ─────────────────── */}
      <section className="w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20 bg-[#FDE4FF]">
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
                onClick={() => setSelectedPhoto(photo)}
                className="rounded-[20px] overflow-hidden h-[380px] sm:h-[480px] lg:h-[450px] group relative cursor-pointer"
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

      {/* ── Lightbox for Gallery Photos (Fullscreen Zoom) ── */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer"
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 size-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 border border-white/30 cursor-pointer shadow-lg"
            aria-label="Close fullscreen view"
          >
            <X size={24} />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[95vw] max-h-[92vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-200"
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="w-auto h-auto max-w-full max-h-[92vh] object-contain rounded-[16px] shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* ── 7. Unified CTA Section & Footer ── */}
      <CtaSection onNavigateContact={onNavigateContact} />
      <Footer />
    </div>
  );
}
