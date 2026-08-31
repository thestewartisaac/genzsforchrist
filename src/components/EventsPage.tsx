import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Sparkles,
  Share2,
  Check,
  Video,
  X,
  Radio,
  BookOpen,
  Send,
  Download,
  ExternalLink,
} from "lucide-react";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";
import Footer from "@/imports/Footer/index";
import CtaSection from "@/app/components/CtaSection";

// Reusing image assets from Homepage & What We Do
import imgSecretPlaceLogo from "@/imports/Homepage/2ce99f59ffd657ef0bb367464fc2ecb9136f1918.png";
import imgWhatWeDoSecretPlace from "@/imports/Homepage/f5348df6f5df01c615d6da6ff80c656b0f3abad1.png";
import imgWhatWeDoDaily from "@/imports/Homepage/8cfb78f68128e08761f1d331859ac14bf6168641.png";
import imgHumanitarian from "@/imports/Homepage/1d49bcef55f2ac1e7412fa22bcceb6d4b41953a6.png";
import imgCarousel1 from "@/imports/Homepage/62c881e484a773c554732bdd3a21d7feea1dd996.png";
import imgCarousel2 from "@/imports/Homepage/ee341b9f360edf170fcd9e64ea7bbdd2baed5316.png";
import imgCarousel3 from "@/imports/Homepage/3486655db75152df5483c1fb8bc7cc9bd4d5b749.png";
import imgCarousel4 from "@/imports/Homepage/5a58b780d0d9b93164f071a91b87b98716d31737.png";

gsap.registerPlugin(ScrollTrigger);

// ── Exact Reusable Neo-Brutalist Button Component (Matches Homepage & Contact) ──
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
  disabled = false,
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
  disabled?: boolean;
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

  const baseClasses = `group content-stretch flex gap-[8px] h-[52px] sm:h-[56px] items-center justify-center px-[24px] sm:px-[32px] py-[14px] sm:py-[16px] relative rounded-[16px] shrink-0 cursor-pointer disabled:opacity-50 ${getShadow()} ${className}`;

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
      disabled={disabled}
      className={baseClasses}
      data-name="button"
    >
      {content}
    </button>
  );
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  category: "daily" | "weekly" | "monthly" | "city" | "fun" | "annual";
  categoryLabel: string;
  frequency: string;
  timeStr: string;
  location: string;
  isVirtual: boolean;
  platform: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  cardBg: string;
  cardText: string;
  titleColor: string;
  shadowColor: string;
  image: string;
  description: string;
  highlights: string[];
  timezones?: { zone: string; region: string; time: string }[];
  telegramLink?: string;
  actionText: string;
}

const ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: "daily-prayers",
    title: "Daily Prayers",
    subtitle: "Staying consistent and connected with God every single day.",
    category: "daily",
    categoryLabel: "Daily Prayer",
    frequency: "Every Single Day",
    timeStr: "Nightly • 4 Timezones",
    location: "Live on Telegram Voice Channel",
    isVirtual: true,
    platform: "Telegram",
    badge: "DAILY ALTAR",
    badgeBg: "bg-[#e62129]",
    badgeText: "text-white",
    cardBg: "bg-[#26103d]",
    cardText: "text-white",
    titleColor: "text-[#fbb222]",
    shadowColor: "#fbb222",
    image: imgWhatWeDoDaily,
    description:
      "We gather every day for prayer, staying consistent and connected with God. A sacred altar where young believers unite nightly across time zones to pray, intercede, and carry His presence.",
    highlights: [
      "WAT (Nigeria & Cameroon): 9:00 PM",
      "GMT (Ghana & Sierra Leone): 8:00 PM",
      "BST (United Kingdom): 9:00 PM",
      "EAT (Kenya): 11:00 PM",
    ],
    timezones: [
      { zone: "WAT", region: "Nigeria & Cameroon", time: "9:00 PM" },
      { zone: "GMT", region: "Ghana & Sierra Leone", time: "8:00 PM" },
      { zone: "BST", region: "United Kingdom", time: "9:00 PM" },
      { zone: "EAT", region: "Kenya", time: "11:00 PM" },
    ],
    telegramLink: "https://t.me/genzsforchrist",
    actionText: "Join Daily Prayers",
  },
  {
    id: "bible-study",
    title: "Bi-Weekly Bible Study",
    subtitle: "Deep expository scripture study to grow in knowledge & faith.",
    category: "daily",
    categoryLabel: "Word Study",
    frequency: "Every Two Weeks on Friday",
    timeStr: "5:30 PM WAT",
    location: "Online on Telegram",
    isVirtual: true,
    platform: "Telegram",
    badge: "BI-WEEKLY FRIDAY",
    badgeBg: "bg-[#d7f741]",
    badgeText: "text-[#210901]",
    cardBg: "bg-[#00434a]",
    cardText: "text-white",
    titleColor: "text-[#d7f741]",
    shadowColor: "#d7f741",
    image: imgHumanitarian,
    description:
      "Every two weeks on Friday, we study the Word deeply, growing in knowledge, understanding, and faith. Practical, scripture-rich teaching breaking down biblical truth for modern Gen Z living.",
    highlights: [
      "Chapter-by-chapter scripture breakdown",
      "Interactive questions & open group dialogue",
      "Discipleship notes for personal growth",
    ],
    telegramLink: "https://t.me/genzsforchrist",
    actionText: "Join Bible Study",
  },
  {
    id: "reset-sundays",
    title: "Reset Sundays",
    subtitle: "Relax, connect, gist, and enjoy game nights for the new week.",
    category: "weekly",
    categoryLabel: "Weekly Fellowship",
    frequency: "Every Other Sunday",
    timeStr: "8:00 PM WAT",
    location: "Online on Telegram",
    isVirtual: true,
    platform: "Telegram",
    badge: "EVERY OTHER SUNDAY",
    badgeBg: "bg-[#ffade3]",
    badgeText: "text-[#210901]",
    cardBg: "bg-[#d7f741]",
    cardText: "text-[#210901]",
    titleColor: "text-[#210901]",
    shadowColor: "#210901",
    image: imgWhatWeDoSecretPlace,
    description:
      "A time to relax, connect, gist, and sometimes enjoy game nights as we refresh and prepare for the new week. Genuine, warm fellowship with brothers and sisters in Christ.",
    highlights: [
      "Relaxed hangout & open gist session",
      "Christian game nights & fun trivia",
      "Spiritual recharge before stepping into Monday",
    ],
    telegramLink: "https://t.me/genzsforchrist",
    actionText: "Join Reset Sunday",
  },
  {
    id: "chats-and-conversations",
    title: "Monthly Chats & Conversations",
    subtitle: "Real, open discussions about faith, life, and deeper topics.",
    category: "monthly",
    categoryLabel: "Open Dialogue",
    frequency: "Once Every Month",
    timeStr: "7:00 PM WAT",
    location: "Online on Telegram",
    isVirtual: true,
    platform: "Telegram",
    badge: "MONTHLY 7:00 PM",
    badgeBg: "bg-[#fbb222]",
    badgeText: "text-[#210901]",
    cardBg: "bg-[#1e1b4b]",
    cardText: "text-white",
    titleColor: "text-[#ffade3]",
    shadowColor: "#ffade3",
    image: imgCarousel1,
    description:
      "Once every month at 7:00 PM, we host real and open discussions about faith, life, and deeper topics, addressing things we don’t always talk about often in regular settings.",
    highlights: [
      "Honest talks on mental health, relationships, purity & purpose",
      "Navigating university, career pressure, and secular culture",
      "Mentorship and real answers to tough questions",
    ],
    telegramLink: "https://t.me/genzsforchrist",
    actionText: "Join Monthly Chat",
  },
  {
    id: "city-gatherings",
    title: "Monthly Physical City Gatherings",
    subtitle: "Show up, connect in person, and build a stronger local community.",
    category: "city",
    categoryLabel: "Physical Fellowship",
    frequency: "Monthly Across Cities",
    timeStr: "Announced Per City",
    location: "Physical Hubs in Lagos, Abuja, London & more",
    isVirtual: false,
    platform: "In-Person Hubs",
    badge: "PHYSICAL FELLOWSHIP",
    badgeBg: "bg-[#ff7f00]",
    badgeText: "text-[#210901]",
    cardBg: "bg-[#fff4ef]",
    cardText: "text-[#210901]",
    titleColor: "text-[#e62129]",
    shadowColor: "#210901",
    image: imgCarousel3,
    description:
      "Each city hosts a physical fellowship every month, an opportunity to show up, connect in person, break bread, and build a stronger community of passionate young believers.",
    highlights: [
      "In-person meetups in major cities worldwide",
      "Worship, shared meals, and life-giving friendship",
      "Local community and campus outreaches",
    ],
    actionText: "Connect to City Hub",
  },
  {
    id: "sports-fiesta",
    title: "Sports Fiesta",
    subtitle: "Building relationships, unity, & sharing Christ through sports.",
    category: "fun",
    categoryLabel: "Fun & Fellowship",
    frequency: "Periodic Community Events",
    timeStr: "Tournament Match Days",
    location: "Local Stadiums & Sports Arenas",
    isVirtual: false,
    platform: "In-Person Outdoor",
    badge: "FUN & FELLOWSHIP",
    badgeBg: "bg-[#d7f741]",
    badgeText: "text-[#210901]",
    cardBg: "bg-[#e62129]",
    cardText: "text-white",
    titleColor: "text-[#FED33D]",
    shadowColor: "#210901",
    image: imgCarousel2,
    description:
      "At Gen Z’s for Christ, we believe that sports are more than just games—they are a powerful platform for building relationships, fostering unity, and sharing the love of Christ through healthy competition and recreation.",
    highlights: [
      "Football, basketball, track & recreational sports",
      "Team bonding, cheer, and community atmosphere",
      "Sharing the gospel through athletic excellence",
    ],
    actionText: "Get Sports Updates",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Activities" },
  { id: "daily", label: "Daily Prayers & Bible Study" },
  { id: "weekly", label: "Weekly Events" },
  { id: "monthly", label: "Monthly Chats" },
  { id: "city", label: "Physical City Gatherings" },
  { id: "fun", label: "Sports & Fun Events" },
];

export default function EventsPage({
  onNavigateContact,
}: {
  onNavigateContact?: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalItem, setActiveModalItem] = useState<ActivityItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCity, setFormCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // GSAP animation triggers
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Safe ScrollTrigger
      gsap.fromTo(
        ".spotlight-banner-anim",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".spotlight-section",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Filter activities based on category and search query
  const filteredActivities = useMemo(() => {
    return ACTIVITIES_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.frequency.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShare = (item: ActivityItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Join us at ${item.title} (${item.subtitle}) with Gen Zs for Christ! Schedule: ${item.frequency} (${item.timeStr}).`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${shareText} Telegram Community: https://t.me/genzsforchrist`
      );
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

  const handleOpenAction = (item: ActivityItem) => {
    if (item.telegramLink) {
      window.open(item.telegramLink, "_blank", "noopener,noreferrer");
      return;
    }
    setActiveModalItem(item);
    setIsSubmitted(false);
    setFormName("");
    setFormEmail("");
    setFormCity("");
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D7F741", "#FBB222", "#FF7F00", "#FFADE3", "#5C59ED"],
      });
    }, 600);
  };

  const downloadCalendarFile = (item: ActivityItem) => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Gen Zs for Christ//Activities//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Gen Zs for Christ - ${item.title}`,
      `DESCRIPTION:${item.description.replace(/\n/g, "\\n")}\\n\\nTelegram: https://t.me/genzsforchrist`,
      `LOCATION:${item.location}`,
      "DTSTART:20260901T200000Z",
      "DTEND:20260901T213000Z",
      "RRULE:FREQ=WEEKLY",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${item.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={pageRef}
      className="bg-white text-[#210901] min-h-screen w-full flex flex-col font-['Instrument_Sans',sans-serif] selection:bg-[#d7f741] selection:text-[#210901]"
    >
      {/* ── 1. Hero Section (Matches Contact & About Page Hero Style Exactly) ── */}
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

      {/* ── 2. Telegram Community Quick Notice Bar ────────────────────────── */}
      <div className="w-full bg-[#fbb222] border-y-2 border-[#210901] py-3.5 px-6 overflow-hidden hidden md:block">
        <div className="max-w-[1312px] mx-auto flex flex-wrap items-center justify-around gap-4 sm:gap-8 text-center text-[#210901] font-bold text-xs sm:text-sm uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span>ANNUAL GATHERING: THE SECRET PLACE</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#210901]" />
          <div className="flex items-center gap-2">
            <Radio size={16} />
            <span>DAILY PRAYERS • 4 TIMEZONES</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#210901]" />
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>BI-WEEKLY BIBLE STUDY</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#210901]" />
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>MONTHLY CITY GATHERINGS</span>
          </div>
        </div>
      </div>

      {/* ── 3. Flagship Annual Gathering: THE SECRET PLACE ───────────────── */}
      <section className="spotlight-section bg-white w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1312px] mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-[960px] mx-auto mb-14 sm:mb-18 flex flex-col gap-4">
            <h2
              className="text-[32px] sm:text-[40px] md:text-[42px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Annual Gathering: The Secret Place
            </h2>
            <p
              className="font-medium text-[19px] sm:text-[23px] text-[#210901]/80 max-w-[800px] mx-auto leading-relaxed"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              Our flagship annual gathering designed to draw young people into a deeper relationship with God through worship, prayer, the Word, and the ministry of the Holy Spirit.
            </p>
          </div>

          {/* White Background Card with Secret Place Logo at Top */}
          <div className="spotlight-banner-anim bg-white border-2 border-[#210901] content-stretch flex flex-col gap-8 lg:gap-12 items-center justify-between overflow-clip p-8 sm:p-12 lg:p-16 relative rounded-[20px] shadow-[10px_10px_0px_0px_#210901] shrink-0 w-full text-[#210901]">
            {/* Top: Photo */}
            <div className="w-full flex flex-col items-center shrink-0 gap-6">
              <div className="h-[450px] w-full rounded-[14px] overflow-hidden border-2 border-[#210901] relative group">
                <img
                  src={imgWhatWeDoSecretPlace}
                  alt="The Secret Place Gathering"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#210901] text-[#d7f741] text-xs font-bold rounded-full uppercase tracking-wider">
                  Held August 1st, 2026
                </div>
              </div>
            </div>

            {/* Bottom: Full Narrative & Actions */}
            <div className="flex flex-col gap-5 flex-1 w-full">
              <div className="h-60 relative shrink-0 w-auto flex items-center justify-center lg:justify-start lg:block -my-18">
                <img
                  src={imgSecretPlaceLogo}
                  alt="The Secret Place Logo"
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>

              <p
                className="font-normal leading-relaxed text-[17px] sm:text-[20px] text-[#210901]/90"
                style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
              >
                The Secret Place is the flagship annual gathering of Gen Z’s for Christ, a life-transforming encounter designed to draw young people into a deeper relationship with God through worship, prayer, the Word, and the ministry of the Holy Spirit.
              </p>

              <p
                className="font-normal leading-relaxed text-[15px] sm:text-[18px] text-[#210901]/80"
                style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
              >
                More than just an event, The Secret Place is a call to intimacy with God, spiritual awakening, and revival. It is a place where hearts are transformed, lives are surrendered, purpose is awakened, and a generation is equipped to live boldly for Christ and influence every sphere of society.
              </p>

              <p className="text-[#210901]/75 text-sm italic border-l-2 border-[#fbb222] pl-4">
                "Held annually, The Secret Place brings together young people from different backgrounds for a powerful time of encounter, discipleship, and impartation, raising a generation that knows God, carries His presence, and advances His Kingdom."
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <NeoButton
                  href="https://youtube.com/@genzsforchrist"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="white-amber"
                  icon={<Video size={18} />}
                >
                  Watch 2026 Replays
                </NeoButton>

                <NeoButton
                  href="https://instagram.com/genzsforchrist"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="red-black"
                  icon={<ArrowRight size={18} />}
                >
                  Follow for 2027 Updates
                </NeoButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Telegram Community Banner (P.S. Feature) ──────────────────── */}
      <section className="bg-[#FFEDE5] w-full py-12 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1312px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex md:items-center gap-4 items-start">
            <div className="w-14 h-14 rounded-[16px] bg-[#0088cc] border-2 border-[#210901] flex items-center justify-center text-white shadow-[4px_4px_0px_#210901] shrink-0">
              <Send size={26} className="-ml-0.5" />
            </div>
            <div>
              <p
                className="text-[22px] sm:text-[28px] text-[#210901] leading-tight m-0"
                style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
              >
                P.S. Most Online Activities Are Held on Telegram!
              </p>
              <p
                className="text-[15px] sm:text-[18px] text-[#210901]/80 mt-1"
                style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
              >
                Join thousands of young believers for daily prayers, bi-weekly Bible study, and Reset Sundays.
              </p>
            </div>
          </div>

          <NeoButton
            href="https://t.me/genzsforchrist"
            target="_blank"
            rel="noopener noreferrer"
            variant="lime-black"
            icon={<Send size={18} />}
          >
            Join Telegram Channel
          </NeoButton>
        </div>
      </section>

      {/* ── 5. Daily Prayers Timezone Guide ───────────────────────────────── */}
      <section className="bg-[#210901] text-white w-full py-16 sm:py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1312px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className="text-[34px] sm:text-[46px] text-white leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Daily Prayers Timezones
            </h2>
            <p className="text-white/80 text-[17px] sm:text-[20px] mt-2 font-normal">
              We gather every day for prayer, staying consistent and connected with God.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-[#210901]">
            <div className="bg-white border-2 border-black rounded-[16px] p-6 shadow-[8px_8px_0px_0px_#fbb222] text-center">
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                WAT TIMEZONE
              </span>
              <p
                className="text-[38px] font-bold mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                9:00 PM
              </p>
              <p className="text-sm text-black/70">Nigeria & Cameroon</p>
            </div>

            <div className="bg-white border-2 border-black rounded-[16px] p-6 shadow-[8px_8px_0px_0px_#d7f741] text-center">
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                GMT TIMEZONE
              </span>
              <p
                className="text-[38px] font-bold mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                8:00 PM
              </p>
              <p className="text-sm text-black/70">Ghana & Sierra Leone</p>
            </div>

            <div className="bg-white border-2 border-black rounded-[16px] p-6 shadow-[8px_8px_0px_0px_#ffade3] text-center">
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                BST TIMEZONE
              </span>
              <p
                className="text-[38px] font-bold mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                9:00 PM
              </p>
              <p className="text-sm text-black/70">United Kingdom (UK)</p>
            </div>

            <div className="bg-white border-2 border-black rounded-[16px] p-6 shadow-[8px_8px_0px_0px_#ff7f00] text-center">
              <span className="text-xs font-bold uppercase tracking-wider block mb-1">
                EAT TIMEZONE
              </span>
              <p
                className="text-[38px] font-bold mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                11:00 PM
              </p>
              <p className="text-sm text-black/70">Kenya & East Africa</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Filter & Search Controls Bar ─────────────────────────────── */}
      <section className="bg-white w-full pt-8 pb-4 px-6 sm:px-12 lg:px-20 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-[1312px] mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-[12px] font-bold text-sm whitespace-nowrap transition-colors cursor-pointer border border-[#210901] ${isActive
                    ? "bg-[#210901] text-[#d7f741] shadow-[3px_3px_0px_0px_#fbb222]"
                    : "bg-white text-[#210901] hover:bg-[#fff4ef]"
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px] sm:w-72 mb-2">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#210901]/50 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities, days, times..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#210901] rounded-[12px] text-sm text-[#210901] placeholder-[#210901]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#fbb222] shadow-[2px_2px_0px_0px_#210901]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#210901]/60 hover:text-[#210901]"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 7. Activities Grid (Reusing Homepage "What We Do" Image Cards Layout) ── */}
      <section className="events-grid-section bg-white w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1312px] mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-[960px] mx-auto mb-14 sm:mb-18 flex flex-col gap-4">
            <h2
              className="text-[36px] sm:text-[48px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Our Regular Activities
            </h2>
            <p
              className="font-medium text-[19px] sm:text-[23px] text-[#210901]/80 max-w-[800px] mx-auto leading-relaxed"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              Five core ongoing rhythms keeping Generation Z anchored in Christ.
            </p>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-20 bg-[#fff4ef] rounded-[16px] border-2 border-dashed border-[#210901]/30 p-8">
              <Sparkles size={36} className="mx-auto text-[#fbb222] mb-3" />
              <h3
                className="text-2xl text-[#210901]"
                style={{ fontFamily: "'Gasoek One', sans-serif" }}
              >
                No Activities Found
              </h3>
              <p className="text-[#210901]/70 max-w-md mx-auto mt-2 text-sm">
                We couldn't find any activities matching "{searchQuery}". Try selecting "All Activities" or clearing your search.
              </p>
              <div className="mt-6 flex justify-center">
                <NeoButton
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  variant="black-amber"
                >
                  View All Activities
                </NeoButton>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {filteredActivities.map((item) => {
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col justify-between ${item.cardBg} ${item.cardText} p-6 sm:p-7 rounded-[20px] border-2 border-[#210901] overflow-hidden`}
                    style={{
                      boxShadow: `10px 10px 0px 0px ${item.shadowColor}`,
                    }}
                  >
                    <div>
                      {/* Image Header (Reusing Homepage Image Frame) */}
                      <div className="h-[200px] sm:h-[220px] w-full rounded-[12px] overflow-hidden border border-black/20 mb-5 relative group">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#210901] shadow-[2px_2px_0px_#210901] ${item.badgeBg} ${item.badgeText}`}
                          >
                            {item.badge}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleShare(item, e)}
                          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm transition-colors cursor-pointer"
                          title="Share activity link"
                        >
                          {copiedId === item.id ? (
                            <Check size={14} className="text-[#d7f741]" />
                          ) : (
                            <Share2 size={14} />
                          )}
                        </button>
                      </div>

                      {/* Title in Instrument Serif (Matches Sports Fiesta Card) */}
                      <h3
                        className={`text-[36px] sm:text-[44px] leading-[1.05] mb-2 ${item.titleColor}`}
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className="text-[17px] sm:text-[20px] font-normal opacity-95 mb-4 leading-snug"
                        style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
                      >
                        {item.subtitle}
                      </p>

                      {/* Metadata Box */}
                      <div className="flex flex-col gap-2 py-3.5 border-y border-current/15 text-[14px] sm:text-[16px] font-medium mb-4">
                        <div className="flex items-center gap-2.5">
                          <Calendar size={16} className="shrink-0 opacity-80" />
                          <span>{item.frequency}</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <Clock size={16} className="shrink-0 opacity-80" />
                          <span>{item.timeStr}</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <MapPin size={16} className="shrink-0 opacity-80" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>

                      {/* Description (Matches Sports Fiesta Secondary Text) */}
                      <p
                        className="text-[15px] sm:text-[18px] opacity-90 leading-relaxed font-normal mb-5"
                        style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
                      >
                        {item.description}
                      </p>

                      {/* Highlights */}
                      <div
                        className="space-y-2 mb-6 text-[14px] sm:text-[16px] opacity-90 leading-relaxed"
                        style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
                      >
                        {item.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[#d7f741] font-bold">•</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Button */}
                    <div className="pt-2 flex items-center gap-3">
                      <div className="flex-1">
                        <NeoButton
                          onClick={() => handleOpenAction(item)}
                          variant="white-black"
                          icon={<ArrowRight size={18} />}
                          className="w-full !h-[48px] sm:!h-[52px]"
                        >
                          {item.actionText}
                        </NeoButton>
                      </div>

                      <button
                        type="button"
                        onClick={() => downloadCalendarFile(item)}
                        className="p-3 bg-black/10 hover:bg-black/20 rounded-[14px] border border-current/20 text-inherit transition-all cursor-pointer"
                        title="Save to calendar (.ics)"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 9. Visual Photo Gallery ── */}
      <section className="bg-[#FFEDE5] w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1312px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2
              className="text-[36px] sm:text-[48px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Photo Gallery
            </h2>
          </div>

          <div className="grid grid-cols-1 grid-cols-2 gap-6 sm:gap-8">
            <div className="rounded-[20px] overflow-hidden h-[380px] sm:h-[480px] lg:h-[450px] group relative">
              <img
                src={imgWhatWeDoDaily}
                alt="Gen Zs Worshiping at Secret Place"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="rounded-[20px] overflow-hidden h-[380px] sm:h-[480px] lg:h-[450px] group relative">
              <img
                src={imgWhatWeDoSecretPlace}
                alt="Altar Encounters"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="rounded-[20px] overflow-hidden h-[380px] sm:h-[480px] lg:h-[450px] group relative">
              <img
                src={imgHumanitarian}
                alt="Humanitarian Outreach and Fellowship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="rounded-[20px] overflow-hidden h-[380px] sm:h-[480px] lg:h-[450px] group relative">
              <img
                src={imgCarousel1}
                alt="Youth Fellowship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Unified CTA Section (Exact Same as About Page & Contact Page) ── */}
      <CtaSection onNavigateContact={onNavigateContact} />

      {/* ── 11. Unified Footer (Exact Same as Homepage) ──────────────────── */}
      <Footer />

      {/* ── 12. Modal for City Hubs & In-Person Connect ───────────────────── */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-2 border-[#210901] rounded-[20px] shadow-[10px_10px_0px_#fbb222] max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              className="absolute right-5 top-5 p-2 rounded-full bg-[#fff4ef] hover:bg-[#210901] hover:text-white text-[#210901] border border-[#210901] transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {isSubmitted ? (
              <div className="text-center py-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#d7f741] border-2 border-[#210901] flex items-center justify-center shadow-[4px_4px_0px_#210901]">
                  <Check size={32} className="text-[#210901]" />
                </div>

                <h3
                  className="text-[28px] sm:text-[34px] text-[#210901] leading-tight"
                  style={{ fontFamily: "'Gasoek One', sans-serif" }}
                >
                  YOU'RE CONNECTED!
                </h3>

                <p className="text-sm text-[#210901]/80 max-w-sm">
                  We've received your request to join the <strong>{activeModalItem.title}</strong>. Our city hub leader will reach out to <strong>{formEmail}</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <NeoButton
                    href="https://t.me/genzsforchrist"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="lime-black"
                    icon={<Send size={18} />}
                    className="w-full"
                  >
                    Join Telegram Group
                  </NeoButton>

                  <NeoButton
                    onClick={() => setActiveModalItem(null)}
                    variant="white-black"
                    className="w-full"
                  >
                    Done
                  </NeoButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-xs font-bold text-[#e62129] uppercase tracking-wider">
                    LOCAL CITY COMMUNITY
                  </span>
                  <h3
                    className="text-[28px] sm:text-[34px] text-[#210901] leading-tight m-0"
                    style={{ fontFamily: "'Gasoek One', sans-serif" }}
                  >
                    {activeModalItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#210901]/70 font-medium mt-1">
                    {activeModalItem.frequency} • {activeModalItem.timeStr}
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-[#fff4ef] border border-[#210901] rounded-xl p-3.5 text-xs text-[#210901]/85 space-y-1">
                  <p className="font-bold text-[#210901]">📍 {activeModalItem.location}</p>
                  <p className="text-[11px] text-[#210901]/70">
                    Connect with other Gen Zs in your city for monthly in-person gatherings.
                  </p>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleModalSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#210901] uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Samuel Okafor"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#210901] rounded-[14px] text-sm text-[#210901] placeholder-[#210901]/40 focus:outline-none focus:ring-2 focus:ring-[#fbb222] shadow-[3px_3px_0px_#210901]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#210901] uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="samuel@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#210901] rounded-[14px] text-sm text-[#210901] placeholder-[#210901]/40 focus:outline-none focus:ring-2 focus:ring-[#fbb222] shadow-[3px_3px_0px_#210901]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#210901] uppercase mb-1">
                      Your City / State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="e.g. Lagos, Abuja, London, Ibadan..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#210901] rounded-[14px] text-sm text-[#210901] placeholder-[#210901]/40 focus:outline-none focus:ring-2 focus:ring-[#fbb222] shadow-[3px_3px_0px_#210901]"
                    />
                  </div>

                  <div className="mt-2">
                    <NeoButton
                      type="submit"
                      disabled={isSubmitting}
                      variant="lime-black"
                      icon={<ArrowRight size={18} />}
                      className="w-full"
                    >
                      {isSubmitting ? "Connecting..." : "Connect to My City Hub"}
                    </NeoButton>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
