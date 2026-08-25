import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";
import Footer from "@/imports/Footer/index";
import efeImg from "@/people/efe.JPG";
import ruthImg from "@/people/ruth.jpeg";
import tochukwuImg from "@/people/tochukwu.jpg";
import svgPaths from "@/imports/Homepage/svg-ylshnye6o6";
import { imgGroup, imgGroup1 } from "@/imports/Homepage/svg-r6r8i";
import faithIcon from "@/imports/Aboutpage/faith.svg";
import empowermentIcon from "@/imports/Aboutpage/empowerment.svg";
import integrityIcon from "@/imports/Aboutpage/integrity.svg";
import communityIcon from "@/imports/Aboutpage/community.svg";
import compassionIcon from "@/imports/Aboutpage/compassion.svg";
import growthIcon from "@/imports/Aboutpage/growth.svg";
import { ArrowRight, UserPlus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Exact Eye Component from Homepage ─────────────────────────────────────
function EyeGroup() {
  return (
    <div
      className="absolute inset-[0.26%_0.02%_0.18%_0.02%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.02px_-0.127px] mask-size-[97.481px_48.464px]"
      style={{ maskImage: `url("${imgGroup}")` }}
      data-name="Group"
    >
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="48.249"
        preserveAspectRatio="none"
        viewBox="0 0 97.4411 48.249"
        width="97.4411"
      >
        <g id="Group">
          <path
            clipRule="evenodd"
            d={svgPaths.p22f76840}
            fill="#FEFEFE"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function EyeClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <EyeGroup />
    </div>
  );
}

function EyeGroup3() {
  return (
    <div className="absolute contents inset-0">
      <EyeClipPathGroup />
      <div className="absolute inset-[7.28%_3.52%_7.22%_3.52%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="41.4331" preserveAspectRatio="none" viewBox="0 0 90.6212 41.4331" width="90.6212">
          <path clipRule="evenodd" d={svgPaths.p38593fe0} fill="#DE389B" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[22.92%_3.52%_22.83%_3.52%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="26.291" preserveAspectRatio="none" viewBox="0 0 90.6212 26.291" width="90.6212">
          <path clipRule="evenodd" d={svgPaths.p3e438380} fill="#FEFEFE" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[22.91%_28.53%_22.85%_28.53%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="26.2887" preserveAspectRatio="none" viewBox="0 0 41.8507 26.2887" width="41.8507">
          <path clipRule="evenodd" d={svgPaths.p22fcdf0} fill="black" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[22.92%_35.01%_22.83%_35.01%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="26.292" preserveAspectRatio="none" viewBox="0 0 29.2327 26.292" width="29.2327">
          <path clipRule="evenodd" d={svgPaths.p39bb8000} fill="#FED807" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[23.59%_34.51%_61.58%_56.77%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="7.18794" preserveAspectRatio="none" viewBox="0 0 8.50136 7.18794" width="8.50136">
          <path clipRule="evenodd" d={svgPaths.p3ea1a380} fill="#FEFEFE" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[66.42%_57.55%_24.08%_37.65%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="4.60579" preserveAspectRatio="none" viewBox="0 0 4.67751 4.60579" width="4.67751">
          <path clipRule="evenodd" d={svgPaths.p310f9080} fill="#FEFEFE" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Eye() {
  return (
    <div className="h-[48.464px] relative shrink-0 w-[97.481px]" data-name="eye">
      <EyeGroup3 />
    </div>
  );
}

// ── Exact Target Component from Homepage ──────────────────────────────────
function TargetGroup2() {
  return (
    <div
      className="absolute inset-[0.25%_0.14%_0.4%_0.14%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.13px_-0.169px] mask-size-[95.362px_68.331px]"
      style={{ maskImage: `url("${imgGroup1}")` }}
      data-name="Group"
    >
      <svg className="absolute block inset-0 size-full" fill="none" height="67.8851" preserveAspectRatio="none" viewBox="0 0 95.1028 67.8851" width="95.1028">
        <g id="Group">
          <path d={svgPaths.p1f160730} fill="white" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function TargetClipPathGroup1() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <TargetGroup2 />
    </div>
  );
}

function TargetGroup5() {
  return (
    <div className="absolute contents inset-0">
      <TargetClipPathGroup1 />
      <div className="absolute inset-[5.96%_4.22%_6.12%_4.23%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="60.08" preserveAspectRatio="none" viewBox="0 0 87.3075 60.08" width="87.3075">
          <path d={svgPaths.p3d1ce880} fill="black" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[7.48%_8.92%_7.64%_34.51%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="57.998" preserveAspectRatio="none" viewBox="0 0 53.9425 57.998" width="53.9425">
          <path d={svgPaths.p30d35700} fill="#FF4BB6" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[20.12%_18.66%_20.78%_42.05%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="40.3802" preserveAspectRatio="none" viewBox="0 0 37.4765 40.3802" width="37.4765">
          <path d={svgPaths.p19e68f00} fill="white" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[12.65%_38.6%_48.06%_5.47%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" height="26.8481" preserveAspectRatio="none" viewBox="0 0 53.3359 26.8481" width="53.3359">
          <path d={svgPaths.p1b12ef70} fill="#806BFF" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Target() {
  return (
    <div className="h-[68.331px] relative shrink-0 w-[95.362px]" data-name="target">
      <TargetGroup5 />
    </div>
  );
}

const CORE_VALUES = [
  {
    num: "01",
    name: "Faith",
    desc: "Bold trust in God's promises and an unrelenting pursuit of Christ in every season of life.",
    icon: faithIcon,
    bgColor: "bg-[#26103d]",
    shadow: "shadow-[10px_10px_0px_0px_#fbb222]",
    titleColor: "text-[#fbb222]",
  },
  {
    num: "02",
    name: "Empowerment",
    desc: "Equipping young believers to lead boldly, impact every sphere of influence, and fulfill their God-given destiny.",
    icon: empowermentIcon,
    bgColor: "bg-[#00434a]",
    shadow: "shadow-[10px_10px_0px_0px_#d7f741]",
    titleColor: "text-[#d7f741]",
  },
  {
    num: "03",
    name: "Integrity",
    desc: "Walking in uncompromising honesty, moral purity, and biblical truth both in public and private.",
    icon: integrityIcon,
    bgColor: "bg-[#3a0ca3]",
    shadow: "shadow-[10px_10px_0px_0px_#ffade3]",
    titleColor: "text-[#ffade3]",
  },
  {
    num: "04",
    name: "Community",
    desc: "Building a genuine, loving family where Generation Z belongs, is discipled, and grows together.",
    icon: communityIcon,
    bgColor: "bg-[#1e1b4b]",
    shadow: "shadow-[10px_10px_0px_0px_#82b8ff]",
    titleColor: "text-[#82b8ff]",
  },
  {
    num: "05",
    name: "Compassion",
    desc: "Demonstrating Christ's unconditional love through practical acts of humanitarian service, empathy, and hope.",
    icon: compassionIcon,
    bgColor: "bg-[#4b001a]",
    shadow: "shadow-[10px_10px_0px_0px_#ff7f00]",
    titleColor: "text-[#ff7f00]",
  },
  {
    num: "06",
    name: "Holistic growth",
    desc: "Nurturing spiritual, intellectual, emotional, and physical maturity to raise well-rounded kingdom ambassadors.",
    icon: growthIcon,
    bgColor: "bg-[#0d3b38]",
    shadow: "shadow-[10px_10px_0px_0px_#d7f741]",
    titleColor: "text-[#d7f741]",
  },
];

const GENESIS_MILESTONES = [
  {
    id: "milestone-1",
    date: "Sep 4, 2023",
    title: "The vision was birthed",
    text: "The vision for Gen Z’s for Christ was birthed on 4 September 2023. Efe Eruemulor, our founder, was lying down reflecting on a Bible study club she had intended to start but had completely forgotten about. But the Holy Spirit interrupted her thoughts with something far greater: an assignment to build a community, start a movement, and change the narrative of Generation Z.",
  },
  {
    id: "milestone-2",
    date: "The Name",
    title: "Gen Z’s for Christ",
    text: "When she asked the Lord what this movement should be called, the answer was immediate: Gen Z’s for Christ. A name that perfectly captures the heart of raising a generation that boldly identifies with Jesus.",
  },
  {
    id: "milestone-3",
    date: "Sep 11, 2023",
    title: "Stepping out in obedience",
    text: "Initially, the plan was to wait for the new year. But the Holy Spirit instructed her not to delay. In bold obedience, just one week after the vision was given, Gen Z’s for Christ was officially birthed.",
  },
  {
    id: "milestone-4",
    date: "Today",
    title: "A global movement",
    text: "What began as a quiet encounter has grown into a global movement. Through prayer, discipleship, and evangelism, God is raising a generation that refuses the world's expectations and is transformed by His truth.",
  },
];

const LEADERSHIP_MEMBERS = [
  {
    name: "Ruth Alkali",
    role: "Global Coordinator",
    image: ruthImg,
    shadowColor: "shadow-[8px_8px_0px_0px_#5C59ED]",
  },
  {
    name: "Tochukwu Emmanuel Ndukauba",
    role: "Operations",
    image: tochukwuImg,
    shadowColor: "shadow-[8px_8px_0px_0px_#1b7a42]",
  },
];

const TEAM_PLACEHOLDERS = [
  {
    role: "Prayer & Intercession",
    dept: "Spiritual Growth & Altar Ministry",
    desc: "Guiding weekly intercessory chains and anchoring the movement in continuous prayer.",
  },
  {
    role: "Community & Discipleship",
    dept: "City Hubs & Campus Outreach",
    desc: "Connecting digital members to local cell gatherings and personal discipleship cohorts.",
  },
  {
    role: "Media & Creative Arts",
    dept: "Digital Storytelling & Production",
    desc: "Crafting impactful visual media, worship moments, and cultural kingdom messaging.",
  },
];

interface AboutPageProps {
  onNavigateContact?: () => void;
}

export default function AboutPage({ onNavigateContact }: AboutPageProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // ── Scroll-driven timeline line animation ─────────────────────────────────
  useEffect(() => {
    const timeline = timelineRef.current;
    const lineFill = lineFillRef.current;
    if (!timeline || !lineFill) return;

    const st = ScrollTrigger.create({
      trigger: timeline,
      start: "top 60%",
      end: "bottom 70%",
      scrub: 0.2,
      onUpdate: (self) => {
        if (lineFill) {
          lineFill.style.height = `${Math.min(100, Math.max(0, self.progress * 100))}%`;
        }
      },
    });

    const milestoneTriggers = GENESIS_MILESTONES.map((_, index) => {
      const el = document.getElementById(`genesis-item-${index}`);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onEnter: () => setActiveIdx(index),
        onEnterBack: () => setActiveIdx(index),
      });
    });

    return () => {
      st.kill();
      milestoneTriggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <div className="bg-white text-[#210901] min-h-screen w-full flex flex-col font-['Instrument_Sans',sans-serif]">
      {/* ── 1. Hero Section (45% of view height) ─────────────────────────── */}
      <section
        data-name="ContactHero"
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

        <div className="relative z-[3] max-w-3xl mx-auto flex flex-col items-center gap-4">
          <h1
            className="font-['Gasoek_One',sans-serif] text-[40px] sm:text-[56px] md:text-[72px] text-white leading-[0.95] tracking-tight uppercase m-0"
            style={{ fontFamily: "'Gasoek One', sans-serif" }}
          >
            About Us
          </h1>
        </div>
      </section>

      {/* ── 2. Mission & Vision Statements (Exact Homepage Card Style) ───── */}
      <section className="bg-white w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1312px] mx-auto">
          {/* Section Heading & Subtitle */}
          <div className="text-center max-w-[960px] mx-auto mb-14 sm:mb-18 flex flex-col gap-4">
            <h2
              className="font-['Gasoek_One',sans-serif] text-[32px] sm:text-[40px] md:text-[42px] text-[#210901] leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif" }}
            >
              We Refuse to Conform. We Choose to Be Transformed.
            </h2>
            <p
              className="font-['Instrument_Sans:Medium',sans-serif] font-medium text-[19px] sm:text-[23px] text-[#210901]/80 max-w-[800px] mx-auto leading-relaxed"
              style={{ fontVariationSettings: '"wdth" 100' }}
            >
              We aren't just another youth group. We are a generation stepping out of the world’s narrative and into God’s calling. We are Gen Z’s for Christ.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">

            {/* Vision Card (Exact Homepage Style with Functional Eye) */}
            <div className="bg-[#26103d] content-stretch flex flex-col gap-[36px] items-center justify-center overflow-clip py-[64px] sm:py-[80px] lg:py-[96px] px-[40px] sm:px-[56px] lg:px-[64px] relative rounded-[16px] shadow-[10px_10px_0px_0px_#fbb222] shrink-0 w-full min-h-[464px]">
              <div className="content-stretch flex flex-col gap-[36px] items-center relative shrink-0 w-full">
                <Eye />
                <div className="font-['Instrument_Serif:Regular',sans-serif] text-[#fbb222] text-[52px] sm:text-[64px] text-center leading-none not-italic">
                  Vision
                </div>
              </div>
              <p
                className="font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[1.2] text-[20px] sm:text-[24px] text-center text-white w-full"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                To awaken and equip Generation Z to live for Christ,
                transforming the narrative from who the world says we
                are to who God has called us to be.
              </p>
            </div>

            {/* Mission Card (Exact Homepage Style with Functional Target) */}
            <div className="bg-[#00434a] content-stretch flex flex-col gap-[36px] items-center justify-center overflow-clip py-[64px] sm:py-[80px] lg:py-[96px] px-[40px] sm:px-[56px] lg:px-[64px] relative rounded-[16px] shadow-[10px_10px_0px_0px_#d7f741] shrink-0 w-full min-h-[464px]">
              <div className="content-stretch flex flex-col gap-[36px] items-center relative shrink-0 w-full">
                <Target />
                <div className="font-['Instrument_Serif:Regular',sans-serif] text-[#d7f741] text-[52px] sm:text-[64px] text-center leading-none not-italic">
                  Mission
                </div>
              </div>
              <p
                className="font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[1.2] text-[20px] sm:text-[24px] text-center text-white w-full"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                To ignite a Christ centered revival through
                discipleship, prayer, the word and evangelism, raising
                bold witnesses for Christ in every sphere of influence
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Core Values (Same Card Design as Mission & Vision Cards) ──── */}
      <section className="bg-[#faf8f5] w-full py-16 sm:py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1312px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2
              className="font-['Gasoek_One',sans-serif] text-[36px] sm:text-[48px] text-[#210901] leading-tight mb-2"
              style={{ fontFamily: "'Gasoek One', sans-serif" }}
            >
              Our core values
            </h2>
            <p className="font-['Instrument_Serif:Regular',sans-serif] text-[24px] sm:text-[28px] text-[#4b001a]">
              The bedrock principles guiding everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {CORE_VALUES.map((val) => (
              <div
                key={val.num}
                className={`${val.bgColor} ${val.shadow} content-stretch flex flex-col gap-[36px] items-center justify-center overflow-clip py-[64px] sm:py-[80px] lg:py-[88px] px-[36px] sm:px-[48px] relative rounded-[16px] shrink-0 w-full min-h-[464px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all`}
              >
                {/* Header: Sticker Icon + Title in Instrument Serif */}
                <div className="content-stretch flex flex-col gap-[36px] items-center relative shrink-0 w-full">
                  <div className="h-[68px] flex items-center justify-center relative shrink-0">
                    <img
                      src={val.icon}
                      alt={val.name}
                      className="h-full w-auto max-h-[68px] object-contain drop-shadow-md"
                    />
                  </div>

                  <div className={`font-['Instrument_Serif:Regular',sans-serif] ${val.titleColor} text-[52px] sm:text-[64px] text-center leading-none not-italic`}>
                    {val.name}
                  </div>
                </div>

                {/* Description in Instrument Sans */}
                <p
                  className="font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[1.2] text-[20px] sm:text-[24px] text-center text-white w-full"
                  style={{ fontVariationSettings: '"wdth" 100' }}
                >
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. The Genesis (Interactive Timeline with Animated Scroll Line) ── */}
      <section className="bg-white w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1240px] mx-auto">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
            <h2
              className="font-['Gasoek_One',sans-serif] text-[40px] sm:text-[56px] text-[#210901] leading-tight mb-3"
              style={{ fontFamily: "'Gasoek One', sans-serif" }}
            >
              The Genesis
            </h2>
            <p className="font-['Instrument_Serif:Regular',sans-serif] text-[24px] sm:text-[30px] text-[#4b001a]">
              How one moment of obedience started a global movement.
            </p>
          </div>

          {/* Timeline Container */}
          <div ref={timelineRef} className="relative max-w-[1040px] mx-auto">

            {/* Continuous Vertical Timeline Track (Desktop Centered / Mobile Left) */}
            <div className="hidden md:block absolute left-[38%] top-0 bottom-0 w-[2px] bg-[#210901]/15 -translate-x-1/2 pointer-events-none">
              <div
                ref={lineFillRef}
                className="w-full bg-[#1b7a42] origin-top transition-all duration-75"
                style={{ height: "0%" }}
              />
            </div>

            {/* Mobile Vertical Track */}
            <div className="md:hidden absolute left-[20px] top-0 bottom-0 w-[2px] bg-[#210901]/15 pointer-events-none">
              <div
                className="w-full bg-[#1b7a42] origin-top transition-all duration-75"
                style={{ height: `${((activeIdx + 1) / GENESIS_MILESTONES.length) * 100}%` }}
              />
            </div>

            {/* Timeline Rows */}
            <div className="flex flex-col gap-28 sm:gap-40">
              {GENESIS_MILESTONES.map((item, idx) => {
                const isActive = activeIdx >= idx;
                return (
                  <div
                    key={item.id}
                    id={`genesis-item-${idx}`}
                    className="relative flex flex-col md:flex-row items-start min-h-[240px] sm:min-h-[300px]"
                  >
                    {/* Desktop Left Column: Sticky Date + Leader Line + Centered Dot */}
                    <div className="hidden md:flex w-[38%] pr-0 items-start justify-end relative">
                      <div className="sticky top-[200px] flex items-center justify-end gap-5 py-1 w-full relative">
                        <span
                          className={`font-['Instrument_Serif:Regular',sans-serif] text-[40px] lg:text-[52px] leading-none transition-colors duration-300 ${isActive ? "text-[#1b7a42]" : "text-[#210901]/40"
                            }`}
                        >
                          {item.date}
                        </span>

                        {/* Horizontal Leader Line */}
                        <span
                          className={`w-10 lg:w-16 h-[2px] transition-colors duration-300 block shrink-0 ${isActive ? "bg-[#1b7a42]" : "bg-[#210901]/20"
                            }`}
                        />

                        {/* Pixel-Perfect Timeline Node Dot (Centered at the end of leader line on vertical track) */}
                        <div
                          className={`absolute -right-[10px] top-1/2 -translate-y-1/2 size-5 rounded-full border-4 border-white transition-all duration-300 shadow-sm z-20 ${isActive
                            ? "bg-[#1b7a42] scale-110 ring-4 ring-[#1b7a42]/20"
                            : "bg-[#210901]/30 scale-95"
                            }`}
                        />
                      </div>
                    </div>

                    {/* Desktop Right Column: Story Content */}
                    <div className="hidden md:block w-[62%] pl-10 lg:pl-16 pt-0">
                      <div className="sticky top-[200px]">
                        <h3 className="font-['Instrument_Serif:Regular',sans-serif] text-[42px] lg:text-[54px] text-[#1b7a42] leading-[1.05] mb-4">
                          {item.title}
                        </h3>

                        <p className="font-['Instrument_Sans',sans-serif] font-normal text-[18px] lg:text-[20px] text-[#210901]/85 leading-relaxed max-w-[560px]">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    {/* ── Mobile Layout (< 768px) ── */}
                    <div className="md:hidden flex flex-col pl-12 relative w-full">
                      {/* Mobile Node Dot */}
                      <div
                        className={`absolute left-[11px] top-2 size-5 rounded-full border-4 border-white transition-all duration-300 z-10 ${isActive ? "bg-[#1b7a42] scale-110" : "bg-[#210901]/30"
                          }`}
                      />

                      <span className="font-['Instrument_Serif:Regular',sans-serif] text-[36px] text-[#1b7a42] leading-none mb-2">
                        {item.date}
                      </span>

                      <h3 className="font-['Instrument_Serif:Regular',sans-serif] text-[30px] text-[#210901] leading-tight mb-3">
                        {item.title}
                      </h3>

                      <p className="font-['Instrument_Sans',sans-serif] font-normal text-[16px] text-[#210901]/80 leading-relaxed">
                        {item.text}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. Leadership & Team Section ─────────────────────────────────── */}
      <section className="bg-[#faf8f5] w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2
              className="font-['Gasoek_One',sans-serif] text-[36px] sm:text-[48px] text-[#210901] leading-tight mb-2"
              style={{ fontFamily: "'Gasoek One', sans-serif" }}
            >
              Meet the leadership
            </h2>
            <p className="font-['Instrument_Serif:Regular',sans-serif] text-[24px] sm:text-[28px] text-[#4b001a]">
              Dedicated kingdom stewards passionately serving Generation Z.
            </p>
          </div>

          {/* Founder Feature Card */}
          <div className="bg-white border border-[#210901] rounded-[24px] p-6 sm:p-10 shadow-[8px_8px_0px_0px_#fbb222] mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Founder Image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-[20px] overflow-hidden border border-[#210901] bg-[#07070f] aspect-[4/5] max-h-[460px] mx-auto shadow-sm">
                  <img
                    src={efeImg}
                    alt="Efe Eruemulor — Founder of Gen Zs for Christ"
                    className="size-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Founder Info */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <h3
                  className="font-['Gasoek_One',sans-serif] text-[36px] sm:text-[44px] text-[#210901] leading-tight"
                  style={{ fontFamily: "'Gasoek One', sans-serif" }}
                >
                  Efe Eruemulor
                </h3>

                <p className="font-['Instrument_Serif:Regular',sans-serif] text-[22px] text-[#4b001a]">
                  Founder, Gen Z's for Christ
                </p>

                <p className="text-[#210901]/80 text-[17px] sm:text-[18px] leading-relaxed">
                  Called by God in September 2023 with a divine mandate to transform the narrative of Generation Z, Efe leads the movement with passion, biblical conviction, and deep faith. Her heart is to see young people rooted in Christ, raised in truth, and equipped to ignite revival across nations.
                </p>
              </div>
            </div>
          </div>

          {/* Key Leadership Members (Ruth Alkali & Tochukwu Emmanuel Ndukauba) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {LEADERSHIP_MEMBERS.map((leader, i) => (
              <div
                key={i}
                className={`bg-white border border-[#210901] rounded-[24px] p-6 sm:p-8 ${leader.shadowColor} flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]`}
              >
                {/* Member Photo */}
                <div className="relative rounded-[18px] overflow-hidden border border-[#210901] bg-[#07070f] size-62 sm:size-40 shrink-0 shadow-sm">
                  <img
                    src={leader.image}
                    alt={`${leader.name} — ${leader.role}`}
                    className="size-full object-cover object-top"
                  />
                </div>

                {/* Member Details */}
                <div className="flex flex-col gap-2 text-center sm:text-left flex-1 justify-center">
                  <h4
                    className="font-['Gasoek_One',sans-serif] text-[24px] sm:text-[28px] text-[#210901] leading-tight m-0"
                    style={{ fontFamily: "'Gasoek One', sans-serif" }}
                  >
                    {leader.name}
                  </h4>

                  <p className="font-['Instrument_Serif:Regular',sans-serif] text-[22px] sm:text-[24px] text-[#4b001a] leading-snug m-0">
                    {leader.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Call To Action Banner ─────────────────────────────────────── */}
      <section className="bg-white w-full py-16 sm:py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1240px] mx-auto bg-[#5C59ED] border border-[#210901] rounded-[28px] p-8 sm:p-14 text-center relative overflow-hidden shadow-[8px_8px_0px_0px_#D7F741]">
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-4">
            <h2
              className="font-['Gasoek_One',sans-serif] text-[36px] sm:text-[48px] text-white leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif" }}
            >
              Be part of the revival
            </h2>

            <p className="text-white/90 text-[18px] sm:text-[20px] leading-relaxed">
              Whether you want to join a community hub, volunteer, partner, or connect with our leadership, we would love to hear from you.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <button
                type="button"
                onClick={onNavigateContact}
                className="bg-white content-stretch drop-shadow-[4px_4px_0px_#fbb222] flex gap-[8px] h-[56px] items-center justify-center px-[32px] py-[16px] relative rounded-[16px] shrink-0 cursor-pointer"
                data-name="button"
              >
                <div
                  aria-hidden
                  className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[16px]"
                />
                <div className="flex flex-col font-['Instrument_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#210901] text-[20px] text-center whitespace-nowrap">
                  <p className="leading-[0.9]">Get in touch</p>
                </div>
                <div className="overflow-clip relative shrink-0 size-[24px]">
                  <ArrowRight size={20} />
                </div>
              </button>

              <a
                href="https://instagram.com/genzsforchrist"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D7F741] content-stretch drop-shadow-[4px_4px_0px_#210901] flex gap-[8px] h-[56px] items-center justify-center px-[32px] py-[16px] relative rounded-[16px] shrink-0 cursor-pointer"
                data-name="button"
              >
                <div
                  aria-hidden
                  className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[16px]"
                />
                <div className="flex flex-col font-['Instrument_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#210901] text-[20px] text-center whitespace-nowrap">
                  <p className="leading-[0.9]">Follow on Instagram</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Footer (Exact same Footer as Homepage & Contact) ─────────── */}
      <Footer />
    </div>
  );
}
