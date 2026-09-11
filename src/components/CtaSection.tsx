import React from "react";
import { ArrowRight } from "lucide-react";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";
import NeoButton from "@/components/ui/NeoButton";

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
        <section className="bg-transparent w-full py-18 sm:py-20 px-6 sm:px-12 lg:px-20 overflow-x-hidden">
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
                        <NeoButton
                            variant="primary"
                            size="lg"
                            onClick={onNavigateContact}
                            icon={<ArrowRight size={20} />}
                        >
                            {primaryButtonText}
                        </NeoButton>

                        <NeoButton
                            variant="lime"
                            size="lg"
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {secondaryButtonText}
                        </NeoButton>
                    </div>
                </div>
            </div>
        </section>
    );
}
