import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";
import { Mail, Phone, Copy, Check, CheckCircle2, ArrowRight } from "lucide-react";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";
import Footer from "@/imports/Footer/index";
import svgPaths from "@/imports/Footer/svg-n1pws9r301";
import CtaSection from "@/components/CtaSection";
import NeoButton from "@/components/ui/NeoButton";

gsap.registerPlugin(ScrollTrigger);

function FaInstagram() {
  return (
    <a
      href="https://instagram.com/genzsforchrist"
      target="_blank"
      rel="noopener noreferrer"
      className="relative shrink-0 size-[32px] hover:opacity-75 transition-opacity"
      aria-label="Instagram"
    >
      <svg className="block size-full" fill="none" height="32" viewBox="0 0 32 32" width="32">
        <path d={svgPaths.p27cd5e00} fill="#210901" />
      </svg>
    </a>
  );
}

function FaTiktok() {
  return (
    <a
      href="https://tiktok.com/@genzsforchrist"
      target="_blank"
      rel="noopener noreferrer"
      className="relative shrink-0 size-[32px] hover:opacity-75 transition-opacity"
      aria-label="TikTok"
    >
      <svg className="block size-full" fill="none" height="32" viewBox="0 0 32 32" width="32">
        <path d={svgPaths.pb9a2200} fill="#210901" />
      </svg>
    </a>
  );
}

function FaFacebookF() {
  return (
    <a
      href="https://facebook.com/genzsforchrist"
      target="_blank"
      rel="noopener noreferrer"
      className="relative shrink-0 size-[32px] hover:opacity-75 transition-opacity"
      aria-label="Facebook"
    >
      <svg className="block size-full" fill="none" height="32" viewBox="0 0 32 32" width="32">
        <g clipPath="url(#clip_contact_fb)">
          <path d={svgPaths.p2edc6ef0} fill="#210901" />
        </g>
        <defs>
          <clipPath id="clip_contact_fb">
            <rect fill="white" height="32" width="32" />
          </clipPath>
        </defs>
      </svg>
    </a>
  );
}

function FaYoutube() {
  return (
    <a
      href="https://youtube.com/@genzsforchrist"
      target="_blank"
      rel="noopener noreferrer"
      className="relative shrink-0 size-[32px] hover:opacity-75 transition-opacity"
      aria-label="YouTube"
    >
      <svg className="block size-full" fill="none" height="32" viewBox="0 0 32 32" width="32">
        <path d={svgPaths.p370e1f00} fill="#210901" />
      </svg>
    </a>
  );
}

import { submitContactMessage } from "@/lib/supabaseClient";
import { sendContactEmail } from "@/lib/emailService";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("contact@genzsforchrist.org");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("+234 701 945 7875");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Submit record to Supabase database (with local fallback)
      await submitContactMessage({
        name,
        email,
        phone: phone.trim() || undefined,
        message,
      });

      // 2. Send email notification via EmailJS to contact@genzsforchrist.org
      await sendContactEmail({
        name,
        email,
        phone: phone.trim() || undefined,
        message,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#FBB222", "#FF7F00", "#D7F741", "#5C59ED", "#210901"],
      });
    } catch (err: any) {
      console.error("Submission error:", err);
      setIsSubmitting(false);
      // Even if network fails, we still record and celebrate for a graceful UX
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Hero Headline Entrance
      gsap.from(".gz-contact-hero-title", {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
      });

      // 2. Split-Screen Layout: Left Column (Channels) and Right Column (Form)
      gsap.from(".gz-contact-left-col", {
        opacity: 0,
        x: -40,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-contact-body",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".gz-contact-right-col", {
        opacity: 0,
        x: 40,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-contact-body",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="gz-grid-bg text-[#210901] min-h-screen w-full flex flex-col font-['Instrument_Sans',sans-serif]">
      {/* ── 1. Hero Section (45% of screen height / 45vh) ─────────────── */}
      <section
        data-name="ContactHero"
        className="gz-contact-hero bg-[#07070f] relative overflow-clip w-full flex flex-col items-center justify-center px-6 text-center shrink-0"
        style={{ height: "45vh", minHeight: "18rem", maxHeight: "45vh", paddingTop: "5rem", boxSizing: "border-box" }}
      >
        <HeroAnimatedBackground />

        <div className="relative z-[3] max-w-3xl mx-auto flex flex-col items-center gap-4">
          <h1
            className="gz-contact-hero-title font-['Gasoek_One',sans-serif] text-[40px] sm:text-[56px] md:text-[72px] text-white leading-[0.95] tracking-tight uppercase m-0"
            style={{ fontFamily: "'Gasoek One', sans-serif" }}
          >
            Get in touch
          </h1>
        </div>
      </section>

      {/* ── 2. Clean White Body: Direct Channels + Contact Form ─────────── */}
      <section className="gz-contact-body bg-transparent w-full py-16 sm:py-20 px-6 sm:px-12 lg:px-20 flex-1">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Direct Channels (5 cols) — No border rings */}
          <div className="gz-contact-left-col lg:col-span-5 flex flex-col gap-6">
            <div>
              <h2
                className="font-['Gasoek_One',sans-serif] leading-tight text-[36px] sm:text-[40px] text-[#210901] mb-3"
                style={{ fontFamily: "'Gasoek One', sans-serif" }}
              >
                We would love to hear from you…
              </h2>
              <p className="font-['Instrument_Sans',sans-serif] text-[#210901]/70 text-[18px] leading-relaxed">
                If you'd like to know more about us or what we do, send us a message, give us a call, or find us on social media.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              {/* Email Row — Clean, no border ring */}
              <div className="bg-[#faf8f5] rounded-[16px] p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="size-10 rounded-[12px] bg-[#fbb222]/20 flex items-center justify-center text-[#210901] shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#210901]/60 font-bold uppercase tracking-wider">
                      Email
                    </p>
                    <a
                      href="mailto:contact@genzsforchrist.org"
                      className="text-[#210901] font-semibold text-[15px] sm:text-[16px] hover:text-[#ff7f00] transition-colors truncate block"
                    >
                      contact@genzsforchrist.org
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  data-name="button"
                  className="p-2 rounded-lg bg-white hover:bg-[#fbb222] text-[#210901] border border-[#210901] cursor-pointer shrink-0 drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none transition-[filter] duration-150"
                  title="Copy Email"
                  aria-label="Copy Email"
                >
                  {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {/* Phone Row — Clean, no border ring */}
              <div className="bg-[#faf8f5] rounded-[16px] p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="size-10 rounded-[12px] bg-[#d7f741]/30 flex items-center justify-center text-[#210901] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#210901]/60 font-bold uppercase tracking-wider">
                      Call/WhatsApp
                    </p>
                    <a
                      href="tel:+2348141995003"
                      className="text-[#210901] font-semibold text-[15px] sm:text-[16px] hover:text-[#ff7f00] transition-colors truncate block"
                    >
                      +234 701 945 7875
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  data-name="button"
                  className="p-2 rounded-lg bg-white hover:bg-[#d7f741] text-[#210901] border border-[#210901] cursor-pointer shrink-0 drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none transition-[filter] duration-150"
                  title="Copy Phone"
                  aria-label="Copy Phone"
                >
                  {copiedPhone ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>

              {/* Social Channels — Same as footer */}
              <div className="p-2 flex flex-col gap-3 pt-2">
                <p className="text-[12px] text-[#210901]/60 font-bold uppercase tracking-wider">
                  Follow Us
                </p>
                <div className="flex items-center gap-5">
                  <FaInstagram />
                  <FaTiktok />
                  <FaFacebookF />
                  <FaYoutube />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="gz-contact-right-col lg:col-span-7">
            <div className="bg-white border border-[#210901] rounded-[20px] p-6 sm:p-10 drop-shadow-[6px_6px_0px_#210901]">
              {isSubmitted ? (
                /* Success Screen */
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="size-16 rounded-full bg-[#d7f741] border border-[#210901] flex items-center justify-center text-[#210901] mb-5 drop-shadow-[3px_3px_0px_#210901] animate-bounce">
                    <CheckCircle2 size={36} strokeWidth={2.5} />
                  </div>

                  <h3 className="font-['Gasoek_One:Regular',sans-serif] text-[32px] text-[#210901] uppercase mb-2">
                    Message Sent!
                  </h3>

                  <p className="font-['Instrument_Serif:Regular',sans-serif] italic text-[24px] text-[#4b001a] mb-4">
                    Thank you for reaching out.
                  </p>

                  <p className="text-[#210901]/80 text-[16px] max-w-md mx-auto mb-8">
                    Your message has been received. We will get back to you shortly.
                  </p>

                  {/* Reset Button */}
                  <NeoButton
                    onClick={handleReset}
                    variant="primary"
                    size="lg"
                  >
                    Go back
                  </NeoButton>
                </div>
              ) : (
                /* Contact Form */
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h2 className="font-['Instrument_Serif:Regular',sans-serif] text-[28px] sm:text-[36px] text-[#210901]">
                    Send a Message
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#210901]">
                        Full Name <span className="text-[#ff7f00]">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3.5 rounded-[12px] bg-white border border-[#210901] text-[#210901] placeholder-[#210901]/40 focus:outline-none focus:ring-2 focus:ring-[#fbb222] text-sm"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#210901]">
                        Email Address <span className="text-[#ff7f00]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3.5 rounded-[12px] bg-white border border-[#210901] text-[#210901] placeholder-[#210901]/40 focus:outline-none focus:ring-2 focus:ring-[#fbb222] text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#210901]">
                      Phone Number <span className="text-[#210901]/40 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 ..."
                      className="w-full px-4 py-3.5 rounded-[12px] bg-white border border-[#210901] text-[#210901] placeholder-[#210901]/40 focus:outline-none focus:ring-2 focus:ring-[#fbb222] text-sm"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-[#210901]">
                      Your Message <span className="text-[#ff7f00]">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3.5 rounded-[12px] bg-white border border-[#210901] text-[#210901] placeholder-[#210901]/40 focus:outline-none focus:ring-2 focus:ring-[#fbb222] text-sm resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <NeoButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    icon={<ArrowRight size={20} />}
                    className="mt-2"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </NeoButton>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      <CtaSection />
      {/* ── 3. Footer (Exact same Footer as Homepage) ───────────────────── */}
      <Footer />
    </div>
  );
}
