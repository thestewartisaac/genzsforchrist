import React from "react";
import { ArrowRight } from "lucide-react";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";

interface CtaSectionProps {
    onNavigateContact?: () => void;
    title?: string;
    subtitle?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    instagramUrl?: string;
}

export default function CtaSection({
    onNavigateContact,
    title = "Be part of the revival",
    subtitle = "Whether you want to join a community hub, volunteer, partner, or connect with our leadership, we would love to hear from you.",
    primaryButtonText = "Get in touch",
    secondaryButtonText = "Follow us on Instagram",
    instagramUrl = "https://instagram.com/genzsforchrist",
}: CtaSectionProps) {
    return (
        <section className="bg-white w-full py-18 sm:py-20 px-6 sm:px-12 lg:px-20">
            <div className="max-w-[1240px] mx-auto bg-[#07070f] border border-[#210901] rounded-[28px] p-12 sm:p-20 text-center relative overflow-hidden shadow-[8px_8px_0px_0px_#fbb222]">
                <HeroAnimatedBackground />
                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-4">
                    <h2
                        className="text-[40px] sm:text-[56px] text-white leading-tight m-0"
                        style={{ fontFamily: "'Gasoek One', sans-serif", fontWeight: 400 }}
                    >
                        {title}
                    </h2>

                    <p className="text-white/90 text-[18px] sm:text-[20px] leading-relaxed">
                        {subtitle}
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
                                <p className="leading-[0.9]">{primaryButtonText}</p>
                            </div>
                            <div className="overflow-clip relative shrink-0 size-[24px]">
                                <ArrowRight size={20} />
                            </div>
                        </button>

                        <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#fff] content-stretch drop-shadow-[4px_4px_0px_red] flex gap-[8px] h-[56px] items-center justify-center px-[32px] py-[16px] relative rounded-[16px] shrink-0 cursor-pointer"
                            data-name="button"
                        >
                            <div
                                aria-hidden
                                className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[16px]"
                            />
                            <div className="flex flex-col font-['Instrument_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#210901] text-[20px] text-center whitespace-nowrap">
                                <p className="leading-[0.9]">{secondaryButtonText}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
