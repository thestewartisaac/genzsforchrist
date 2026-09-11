import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  ExternalLink,
  X,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";
import Footer from "@/imports/Footer/index";
import ZenithLogo from "@/imports/Zenith_Bank_Logo.svg";
import groceries from "@/imports/groceries.svg";
import book from "@/imports/book.svg"
import medical from "@/imports/medic.svg"
import { PaystackSecurityBadge, AcceptedPaymentLogos } from "@/components/PaymentIcons";
import NeoButton from "@/components/ui/NeoButton";

// High-resolution field photos
import imgHumanitarianHero from "@/imports/Homepage/1d49bcef55f2ac1e7412fa22bcceb6d4b41953a6.png";
import imgOutreach1 from "@/imports/Homepage/5a58b780d0d9b93164f071a91b87b98716d31737.png";
import imgOutreach2 from "@/imports/Homepage/62c881e484a773c554732bdd3a21d7feea1dd996.png";
import imgOutreach3 from "@/imports/Homepage/3486655db75152df5483c1fb8bc7cc9bd4d5b749.png";
import imgOutreach4 from "@/imports/Homepage/ee341b9f360edf170fcd9e64ea7bbdd2baed5316.png";

import { initiatePaystackDonation } from "@/lib/paystackService";

export default function FoundationPage({
  onNavigateContact,
}: {
  onNavigateContact?: () => void;
}) {
  // Manual bank transfer info
  const BANK_DETAILS = {
    accountName: "Gen Zs for Christ Humanitarian Foundation",
    accountNumber: "1313377445",
    bankName: "Zenith Bank",
  };

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [manualKeyInput, setManualKeyInput] = useState<string>("");
  const [lastDonation, setLastDonation] = useState<{ amount: number; name: string } | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // ── Keyboard shortcuts: ESC closes modals and lightbox ──────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activePhoto) setActivePhoto(null);
        if (showKeyModal) setShowKeyModal(false);
        if (showSuccessModal) setShowSuccessModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, showKeyModal, showSuccessModal]);

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const getEffectiveAmount = (): number => {
    if (customAmount && Number(customAmount) > 0) {
      return Number(customAmount);
    }
    return selectedAmount;
  };

  const triggerDonation = async (keyToUse?: string) => {
    const finalAmount = getEffectiveAmount();
    setIsProcessing(true);

    try {
      await initiatePaystackDonation({
        email: donorEmail.trim(),
        amount: finalAmount,
        donorName: donorName.trim() || "Kind Partner",
        publicKey: keyToUse,
        onSuccess: (donation) => {
          setIsProcessing(false);
          setLastDonation({
            amount: donation.amount,
            name: donation.name,
          });
          setShowSuccessModal(true);
        },
        onClose: () => {
          setIsProcessing(false);
        },
        onError: (err) => {
          setIsProcessing(false);
          alert(err.message || "Payment could not be completed.");
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      const msg = err?.message || "";
      if (msg.includes("Public Key is missing") || msg.includes("pk_")) {
        setShowKeyModal(true);
      } else {
        alert(msg || "Could not launch Paystack checkout.");
      }
    }
  };

  const handleDonateNow = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = getEffectiveAmount();

    if (!donorEmail || !donorEmail.includes("@")) {
      alert("Please enter a valid email address for your payment receipt.");
      return;
    }

    if (finalAmount < 100) {
      alert("Please enter a donation amount of at least ₦100.");
      return;
    }

    const envKey = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "").trim();
    const localKey = (localStorage.getItem("paystack_public_key") || "").trim();
    const keyToUse = envKey || localKey;

    if (!keyToUse || !keyToUse.startsWith("pk_")) {
      setShowKeyModal(true);
      return;
    }

    await triggerDonation(keyToUse);
  };

  const handleSaveKeyAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualKeyInput.trim();
    if (!trimmed.startsWith("pk_")) {
      alert("Notice: Please enter your Paystack Public Key starting with 'pk_live_' or 'pk_test_'. (Secret keys starting with 'sk_' are not allowed on the frontend).");
      return;
    }
    localStorage.setItem("paystack_public_key", trimmed);
    setShowKeyModal(false);
    await triggerDonation(trimmed);
  };

  const scrollToGive = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("partner-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const galleryImages = [
    { src: imgHumanitarianHero, caption: "Community Food Drive & Prayer Altar" },
    { src: imgOutreach1, caption: "Hands-on Relief Distribution to Families" },
    { src: imgOutreach2, caption: "Youth Discipleship & Practical Fellowship" },
    { src: imgOutreach3, caption: "City Gathering & Essential Welfare Care" },
    { src: imgOutreach4, caption: "Joy and Hope Restored in Our Streets" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Hero Content Entrance
      gsap.from(".gz-foundation-hero-content", {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
      });

      // 2. The Core Mandate
      gsap.from(".gz-mandate-header", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gz-mandate-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".gz-mandate-pillar", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gz-mandate-pillars",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 3. Impact Areas Cards
      gsap.from(".gz-impact-header", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gz-impact-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".gz-impact-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-impact-cards",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      // 4. Impact Gallery Header
      gsap.from(".gz-gallery-header", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gz-gallery-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 5. Partner (Give Block) Split Reveal
      gsap.from(".gz-partner-header", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gz-partner-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".gz-partner-paystack", {
        opacity: 0,
        x: -36,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-partner-grid",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".gz-partner-bank", {
        opacity: 0,
        x: 36,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-partner-grid",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 6. Volunteer Call to Action
      gsap.from(".gz-volunteer-box", {
        opacity: 0,
        scale: 0.95,
        y: 36,
        duration: 0.9,
        ease: "back.out(1.4)",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-volunteer-box",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="gz-grid-bg text-[#210901] min-h-screen w-full flex flex-col font-['Instrument_Sans',sans-serif] selection:bg-[#d7f741] selection:text-[#210901] overflow-x-hidden">
      {/* CSS Animations for Marquees */}
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 95s linear infinite;
          will-change: transform;
        }
        .animate-marquee-track:hover {
          animation-play-state: paused;
        }
        .animate-gallery-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 45s linear infinite;
          will-change: transform;
        }
        .animate-gallery-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-track,
          .animate-gallery-track {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── 1. The Hero (The Hook) — Full-Bleed High-Contrast Photo Hero ──── */}
      <section
        data-name="FoundationHero"
        className="relative overflow-clip w-full flex flex-col items-center justify-center px-6 text-center shrink-0 min-h-[68vh] sm:min-h-[72vh] py-20 sm:py-28"
      >
        {/* Full-bleed slightly darkened hands-on outreach photo background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={imgHumanitarianHero}
            alt="Hands-on outreach background"
            className="w-full h-full object-cover opacity-25 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07070f]/95 via-[#07070f]/85 to-[#07070f]" />
        </div>

        {/* Signature Glowing Ambient Radial Highlights */}
        <HeroAnimatedBackground />

        {/* Hero Content (No Badges) */}
        <div className="gz-foundation-hero-content relative z-[3] max-w-5xl mx-auto flex flex-col items-center gap-5">
          {/* H1 (Massive Display Font) */}
          <h1
            className="font-['Gasoek_One',sans-serif] text-[40px] sm:text-[62px] md:text-[76px] lg:text-[88px] text-white leading-[0.98] tracking-tight uppercase m-0 max-w-5xl text-center"
            style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
          >
            The Gospel is Lived, Not Just Preached.
          </h1>

          {/* Subheadline */}
          <p
            className="text-white/90 font-medium text-[19px] sm:text-[23px] md:text-[25px] max-w-3xl leading-relaxed m-0 text-center"
            style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
          >
            Welcome to the Gen Z’s for Christ Humanitarian Foundation—the outreach and compassion
            arm of our movement.
          </p>

          {/* CTA Button: Partner With Us */}
          <div className="pt-4">
            <NeoButton
              onClick={scrollToGive}
              variant="primary"
              size="lg"
              icon={<ArrowRight size={20} />}
            >
              Partner With Us
            </NeoButton>
          </div>
        </div>
      </section>

      {/* ── 2. The Core Mandate (Why We Serve) ──────────────────────────────── */}
      <section className="w-full py-18 sm:py-26 px-6 sm:px-12 lg:px-20 bg-[#d7f741] text-[#210901] relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto relative z-10">
          {/* Header */}
          <div className="gz-mandate-header mb-6">
            <h2
              className="text-[44px] sm:text-[60px] md:text-[72px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Love in Action.
            </h2>
          </div>

          {/* Large Legible Body Copy */}
          <p
            className="text-[22px] sm:text-[28px] md:text-[32px] font-medium text-[#210901] leading-snug max-w-5xl my-8 sm:my-10"
            style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
          >
            We believe that the Gospel is not only meant to be preached but also lived out by
            meeting the needs of individuals and communities. We don't just talk about change; we
            step into the streets to demonstrate the love of Christ through practical acts of
            service.
          </p>

          {/* 3-Column Clean Text Layout (Core Pillars) */}
          <div className="gz-mandate-pillars grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-10 border-t-2 border-[#210901]/30">
            <div className="gz-mandate-pillar">
              <h3
                className="text-[32px] sm:text-[38px] text-[#210901] leading-tight mb-2 font-bold"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Compassion
              </h3>
              <p className="text-lg sm:text-xl text-[#210901]/85 font-medium leading-relaxed m-0">
                Seeing the need and stepping in to help.
              </p>
            </div>

            <div className="gz-mandate-pillar">
              <h3
                className="text-[32px] sm:text-[38px] text-[#210901] leading-tight mb-2 font-bold"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Dignity
              </h3>
              <p className="text-lg sm:text-xl text-[#210901]/85 font-medium leading-relaxed m-0">
                Treating every individual with the respect and love of Christ.
              </p>
            </div>

            <div className="gz-mandate-pillar">
              <h3
                className="text-[32px] sm:text-[38px] text-[#210901] leading-tight mb-2 font-bold"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Hope
              </h3>
              <p className="text-lg sm:text-xl text-[#210901]/85 font-medium leading-relaxed m-0">
                Pointing the world to Jesus through our hands and feet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Impact Areas (What We Do) ────────────────────────────────────── */}
      <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 bg-transparent">
        <div className="max-w-[1240px] mx-auto">
          {/* Section Header */}
          <div className="gz-impact-header text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2
              className="text-[38px] sm:text-[52px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              How We Are Changing the Narrative
            </h2>
          </div>

          {/* Staggered Brutalist Cards */}
          <div className="gz-impact-cards grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Card 1: Community Relief */}
            <div className="gz-impact-card bg-[#00434a] text-white rounded-[24px] border-2 border-[#210901] shadow-[8px_8px_0px_0px_#210901] overflow-hidden flex flex-col">
              <div className="h-[250px] w-full overflow-hidden border-b-2 border-[#210901] relative bg-[#26103d]">
                <img
                  src={imgHumanitarianHero}
                  alt="Community Relief"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <img src={groceries} alt="" width={60} height={60} className="mb-3" />
                  <h3
                    className="text-[32px] sm:text-[36px] text-[#d7f741] leading-tight mb-2.5"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    Community Relief
                  </h3>
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed m-0">
                    Providing essential supplies, food, and resources to underserved communities
                    and individuals facing hardship.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Educational Outreach (Staggered) */}
            <div className="gz-impact-card bg-[#fbb222] text-[#210901] rounded-[24px] border-2 border-[#210901] shadow-[8px_8px_0px_0px_#210901] overflow-hidden flex flex-col md:translate-y-8">
              <div className="h-[250px] w-full overflow-hidden border-b-2 border-[#210901] relative bg-[#16052b]">
                <img
                  src={imgOutreach2}
                  alt="Educational Outreach"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <img src={book} alt="" width={60} height={60} className="mb-3" />
                  <h3
                    className="text-[32px] sm:text-[36px] text-[#210901] leading-tight mb-2.5"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    Educational Outreach
                  </h3>
                  <p className="text-[#210901]/90 text-base sm:text-lg leading-relaxed m-0 font-medium">
                    Empowering the next generation through mentorship, school supplies, and support
                    to ensure no young mind is left behind.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Health & Wellness */}
            <div className="gz-impact-card bg-[#00CEE7] text-white rounded-[24px] border-2 border-[#210901] shadow-[8px_8px_0px_0px_#210901] overflow-hidden flex flex-col">
              <div className="h-[250px] w-full overflow-hidden border-b-2 border-[#210901] relative bg-[#26103d]">
                <img
                  src={imgOutreach3}
                  alt="Health & Wellness"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <img src={medical} alt="" width={60} height={60} className="mb-3" />
                  <h3
                    className="text-[32px] sm:text-[36px] text-[#19154A] leading-tight mb-2.5"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    Health & Wellness
                  </h3>
                  <p className="text-black/95 text-base sm:text-lg leading-relaxed m-0">
                    Promoting holistic well-being by facilitating medical outreaches, hygiene
                    education, and care packages for the vulnerable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. The Impact Gallery (Dynamic Horizontal Scrolling Marquee) ──── */}
      <section className="w-full py-20 sm:py-28 bg-[#fff4ef] relative overflow-hidden">
        <div className="gz-gallery-header max-w-[1240px] mx-auto px-6 sm:px-12 lg:px-20 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {/* Floating Badge Over Gallery */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#fbb222] text-[#210901] border-2 border-[#210901] shadow-[3px_3px_0px_#210901] font-bold text-xs sm:text-sm uppercase tracking-wider -rotate-2 mb-2">
              Real People. Real Impact.
            </div>
            <h2
              className="text-[34px] sm:text-[46px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              The Impact Gallery
            </h2>
          </div>
          <p className="text-sm font-semibold text-[#210901]/60 uppercase tracking-wider">
            Hover to pause • Click to enlarge
          </p>
        </div>

        {/* Dynamic Infinite-Scrolling Horizontal Marquee */}
        <div className="w-full overflow-hidden py-4">
          <div className="animate-gallery-track flex gap-6 px-4">
            {[...galleryImages, ...galleryImages].map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActivePhoto(img.src)}
                className="w-[280px] sm:w-[340px] h-[240px] sm:h-[280px] rounded-[20px] overflow-hidden shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative bg-[#07070f]"
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Partner With the Vision (Give Block) ──────────────────────────── */}
      <section
        id="partner-section"
        className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 bg-transparent scroll-mt-12"
      >
        <div className="max-w-[1240px] mx-auto bg-[#F3D9FF] border-2 border-[#210901] rounded-[32px] p-8 sm:p-12 md:p-16 shadow-[10px_10px_0px_0px_#210901]">
          {/* Header */}
          <div className="gz-partner-header text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2
              className="text-[38px] sm:text-[54px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
            >
              Build the Legacy. Partner With Us.
            </h2>
            <p
              className="text-[18px] sm:text-[22px] text-[#210901]/85 mt-4 leading-relaxed font-normal m-0"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              Your generosity helps make this mission possible. Every donation directly supports our
              charitable initiatives, outreach programs, and evangelism efforts. Together, we are
              raising a generation for Christ and changing the narrative—one life at a time.
            </p>
          </div>

          {/* Split-Screen Payment Layout */}
          <div className="gz-partner-grid grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Option A: Instant Secure Payment (Powered by Paystack) — 7 Columns */}
            <div className="gz-partner-paystack lg:col-span-7 bg-white rounded-[24px] border-2 border-[#210901] p-6 sm:p-8 md:p-10 shadow-[6px_6px_0px_#210901] flex flex-col justify-between">
              <form onSubmit={handleDonateNow} className="flex flex-col gap-6">
                <div>
                  <h3
                    className="text-[30px] sm:text-[36px] text-[#210901] leading-tight mb-1 font-bold"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    Instant Secure Payment
                  </h3>
                  <p className="text-sm sm:text-base text-[#210901]/75 m-0">
                    Give securely via card, USSD, or direct bank debit.
                  </p>
                </div>

                {/* Amount Tiers */}
                <div>
                  <label className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider block mb-2.5">
                    Select Donation Amount (NGN)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[2000, 5000, 10000, 25000, 50000, 100000].map((amt) => {
                      const isSelected = selectedAmount === amt && !customAmount;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount("");
                          }}
                          data-name="button"
                          className={`py-3 px-1.5 rounded-[12px] border-2 border-[#210901] text-xs sm:text-sm font-bold cursor-pointer text-center transition-[filter] duration-150 ${isSelected
                            ? "bg-[#d7f741] text-[#210901] drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none"
                            : "bg-[#fff4ef] text-[#210901] hover:bg-[#fce5d9]"
                            }`}
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider block">
                      Or Enter Custom Amount (₦)
                    </label>
                    {customAmount && Number(customAmount) > 0 && (
                      <span className="text-[11px] font-extrabold text-[#00434a] bg-[#d7f741] px-2.5 py-0.5 rounded-full border border-[#210901] shadow-[1px_1px_0px_#210901] animate-in fade-in duration-150">
                        Preview: ₦{Number(customAmount).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#210901]/60">
                      ₦
                    </span>
                    <input
                      type="number"
                      min="100"
                      placeholder="e.g. 15000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[#faf8f5] border-2 border-[#210901] text-[#210901] font-bold text-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#fbb222]"
                    />
                  </div>
                </div>

                {/* Donor Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider block mb-1.5">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-4 py-3 rounded-[12px] bg-[#faf8f5] border-2 border-[#210901] text-[#210901] text-base focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider block mb-1.5">
                      Your Email (For Receipt) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="youremail@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-[12px] bg-[#faf8f5] border-2 border-[#210901] text-[#210901] text-base focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                {/* Primary CTA Button: Donate Now */}
                <div className="pt-2">
                  <NeoButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isProcessing}
                    icon={<ArrowRight size={20} />}
                  >
                    {isProcessing
                      ? "Opening Paystack..."
                      : `Donate Now (₦${getEffectiveAmount().toLocaleString()})`}
                  </NeoButton>
                </div>

                {/* Paystack Security Badge & Accepted Payment Cards */}
                <div className="pt-3 border-t border-[#210901]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex flex-col items-start gap-1">
                    <PaystackSecurityBadge />
                    <span className="text-[11px] text-[#210901]/60 font-medium pl-1">
                      SSL encrypted
                    </span>
                  </div>

                  <AcceptedPaymentLogos className="mb-auto" />
                </div>
              </form>
            </div>

            {/* Option B: Manual Bank Transfer — 5 Columns */}
            <div className="gz-partner-bank lg:col-span-5 bg-white rounded-[24px] border-2 border-[#210901] p-6 sm:p-8 shadow-[6px_6px_0px_#210901] flex flex-col justify-between h-[max-content]">
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-[28px] sm:text-[34px] text-[#210901] leading-tight mb-1 font-bold"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    Bank Transfer
                  </h3>
                  <p className="text-sm text-[#210901]/75 m-0">
                    Prefer to do a transfer? Use the account details below.
                  </p>
                </div>

                {/* Account Details Box */}
                <div className="bg-[#faf8f5] rounded-[20px] border-2 border-[#210901] p-5 sm:p-6 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#210901]/60 tracking-wider block mb-1">
                      Bank
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-[#210901] flex items-center gap-2">
                      <img src={ZenithLogo} alt="Zenith Bank Logo" className="w-8 h-8" />{BANK_DETAILS.bankName}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#210901]/60 tracking-wider block mb-1">
                      Account Name
                    </span>
                    <div className="text-lg sm:text-xl font-bold text-[#210901] leading-snug">
                      {BANK_DETAILS.accountName}
                    </div>
                  </div>

                  {/* Account Number with Exact Copy Design from ContactPage */}
                  <div>
                    <span className="text-[11px] font-bold uppercase text-[#210901]/60 tracking-wider block mb-1">
                      Account Number
                    </span>
                    <div className="bg-white rounded-[16px] p-3.5 sm:p-4 flex items-center justify-between gap-3 border border-[#210901]/30">
                      <span className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-[#210901]">
                        {BANK_DETAILS.accountNumber}
                      </span>

                      {/* Copy Button matching ContactPage */}
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        data-name="button"
                        className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white hover:bg-[#fbb222] text-[#210901] border border-[#210901] cursor-pointer shrink-0 drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none transition-[filter] duration-150 flex items-center gap-1.5"
                        title="Copy Account Number"
                        aria-label="Copy Account Number"
                      >
                        {copiedAccount ? (
                          <>
                            <Check size={16} className="text-green-600" />
                            <span className="text-xs font-bold uppercase">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span className="text-xs font-bold uppercase">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Volunteer Call to Action with -10deg Scrolling Marquee ───────── */}
      <section className="w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 bg-[#fbb222] relative overflow-hidden">
        {/* Slanted Animated Marquee Background (-10 degrees) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-col justify-center -rotate-[10deg] scale-125 select-none overflow-hidden">
          <div className="animate-marquee-track">
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
          </div>
          <div className="animate-marquee-track" style={{ animationDirection: "reverse" }}>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
          </div>
          <div className="animate-marquee-track">
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
          </div>
          <div className="animate-marquee-track" style={{ animationDirection: "reverse" }}>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
          </div>
          <div className="animate-marquee-track">
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
          </div>
          <div className="animate-marquee-track" style={{ animationDirection: "reverse" }}>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
          </div>
          <div className="animate-marquee-track">
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
            <span className="font-['Gasoek_One',sans-serif] text-[70px] sm:text-[110px] text-[#210901] tracking-wider leading-none mr-8">
              SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US • SERVE WITH US •
            </span>
          </div>
        </div>

        {/* Solid Call-Out Box Layered on Top */}
        <div className="gz-volunteer-box max-w-[800px] mx-auto bg-white rounded-[28px] border-2 border-[#210901] shadow-[10px_10px_0px_0px_#210901] p-8 sm:p-14 text-center relative z-10 flex flex-col items-center gap-4">
          <h2
            className="text-[38px] sm:text-[52px] text-[#210901] leading-tight m-0"
            style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
          >
            Be the Hands and Feet.
          </h2>

          <p
            className="text-[18px] sm:text-[22px] text-[#210901]/85 leading-relaxed max-w-2xl font-normal m-0"
            style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
          >
            You don't need a platform to make an impact—you just need a willing heart. Join our
            volunteer team and help us serve our cities.
          </p>

          {/* Primary CTA Button: Join the Outreach Team */}
          <div className="pt-3">
            <NeoButton
              href="https://t.me/genzsforchrist"
              target="_blank"
              rel="noopener noreferrer"
              variant="lime"
              size="lg"
              icon={<ExternalLink size={20} />}
            >
              Join the Outreach Team
            </NeoButton>
          </div>
        </div>
      </section>

      {/* ── 7. Global Footer (Same as Homepage) ──────────────────────────────── */}
      <Footer />

      {/* ── Lightbox for Gallery Photos ── */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-[20px] overflow-hidden border-2 border-white shadow-2xl">
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 size-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X size={20} />
            </button>
            <img
              src={activePhoto}
              alt="Expanded Outreach Moment"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}

      {/* ── Paystack Public Key Configuration Modal ── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] border-2 border-[#210901] shadow-[10px_10px_0px_#210901] p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 p-2 text-[#210901]/60 hover:text-[#210901] cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="size-14 rounded-full bg-[#fbb222] border-2 border-[#210901] flex items-center justify-center mb-5 shadow-[3px_3px_0px_#210901]">
              <CreditCard size={26} className="text-[#210901]" />
            </div>

            <h3
              className="text-[28px] text-[#210901] leading-tight mb-2 font-bold"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Enter Paystack Public Key
            </h3>

            <p className="text-sm text-[#210901]/80 leading-relaxed mb-4">
              Paystack frontend requires your <strong>Public Key</strong> (starts with{" "}
              <code className="bg-[#fff4ef] px-1 py-0.5 rounded font-mono text-xs text-[#e62129] font-bold">
                pk_live_...
              </code>{" "}
              or{" "}
              <code className="bg-[#fff4ef] px-1 py-0.5 rounded font-mono text-xs text-[#e62129] font-bold">
                pk_test_...
              </code>
              ).
              <br />
              <span className="text-xs text-[#210901]/60 mt-1 block">
                (Note: Secret keys starting with <code className="font-mono">sk_</code> cannot be used in browser checkouts).
              </span>
            </p>

            <form onSubmit={handleSaveKeyAndPay} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider block mb-1.5">
                  Paystack Live or Test Public Key
                </label>
                <input
                  type="text"
                  required
                  placeholder="pk_live_... or pk_test_..."
                  value={manualKeyInput}
                  onChange={(e) => setManualKeyInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-[12px] bg-[#faf8f5] border-2 border-[#210901] font-mono text-sm text-[#210901] focus:outline-none focus:bg-white"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <NeoButton
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                >
                  Save & Launch Paystack
                </NeoButton>

                <a
                  href="https://dashboard.paystack.com/#/settings/developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#e62129] hover:underline"
                >
                  <span>Find your key on Paystack Dashboard</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Donation Success Modal ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] border-2 border-[#210901] shadow-[10px_10px_0px_#210901] p-8 max-w-md w-full text-center relative animate-in fade-in zoom-in duration-200">
            <div className="size-16 rounded-full bg-[#d7f741] border-2 border-[#210901] flex items-center justify-center mx-auto mb-5 shadow-[4px_4px_0px_#210901]">
              <Heart size={32} className="text-[#e62129] fill-[#e62129]" />
            </div>

            <h3
              className="text-[32px] text-[#210901] leading-tight mb-2 font-bold"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Thank You for Your Generosity!
            </h3>

            <p className="text-base text-[#210901]/80 leading-relaxed mb-6">
              Thank you, <strong className="text-[#210901]">{lastDonation?.name}</strong>. Your
              gift of{" "}
              <strong className="text-[#e62129]">
                ₦{lastDonation?.amount?.toLocaleString()}
              </strong>{" "}
              directly touches lives, fuels our charitable outreaches, and brings hope to our cities.
            </p>

            <div className="p-4 rounded-[16px] bg-[#fff4ef] border border-[#210901] text-xs text-[#210901]/80 mb-6">
              A receipt has been recorded. You can also save our Zenith Bank account details for
              recurring gifts.
            </div>

            <NeoButton
              onClick={() => setShowSuccessModal(false)}
              variant="lime"
              size="md"
              fullWidth
            >
              Done & Return
            </NeoButton>
          </div>
        </div>
      )}
    </div>
  );
}
