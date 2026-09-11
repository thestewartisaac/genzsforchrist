import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Send,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronUp,
} from "lucide-react";
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";
import Footer from "@/imports/Footer/index";
import CtaSection from "@/app/components/CtaSection";
import NeoButton from "@/components/ui/NeoButton";
import NotFoundPage from "@/components/NotFoundPage";
import {
  BlogPost,
  getBlogPostBySlug,
  getBlogPosts,
  resolveBlogImage,
} from "@/lib/blogContent";

gsap.registerPlugin(ScrollTrigger);

export default function BlogDetailPage({
  slug,
  onBack,
  onNavigateContact,
  onSelectPost,
}: {
  slug: string;
  onBack: () => void;
  onNavigateContact?: () => void;
  onSelectPost?: (slug: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const post = getBlogPostBySlug(slug);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Track reading progress and back-to-top visibility ───────────────────
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setReadingProgress(progress);
        setShowScrollTop(currentScroll > 400);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const container = containerRef.current;
    if (!container || !post) return;

    const ctx = gsap.context(() => {
      // 1. Article Header Entrance
      gsap.from(".gz-detail-article-header", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });

      // 2. Cover image reveal
      gsap.from(".gz-detail-cover-image", {
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform",
      });

      // 3. Main article body reveal
      gsap.from(".gz-detail-article-body", {
        opacity: 0,
        y: 36,
        duration: 0.85,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".gz-detail-article-body",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 4. Telegram callout pop-in
      const callout = container.querySelector(".gz-detail-callout");
      if (callout) {
        gsap.from(callout, {
          opacity: 0,
          scale: 0.96,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: callout,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // 5. Related articles grid cards stagger
      const relatedCards = container.querySelectorAll(".gz-detail-related-card");
      if (relatedCards.length > 0) {
        gsap.from(relatedCards, {
          opacity: 0,
          y: 32,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".gz-detail-related-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [slug, post]);

  if (!post) {
    return (
      <NotFoundPage
        title="Story Not Found"
        subtitle="The article or testimony you're looking for doesn't exist."
        description="This story may have been relocated, archived, or is being drafted by our editorial team. You can explore all our other published stories below."
        backLabel="Browse All Stories"
        onBack={onBack}
        onNavigateHome={() => {
          window.history.pushState(null, "", "/");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        onNavigateEvents={() => {
          window.history.pushState(null, "", "/events");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        onNavigateBlog={onBack}
        onNavigateAbout={() => {
          window.history.pushState(null, "", "/about");
          window.dispatchEvent(new PopStateEvent("popstate"));
        }}
        onNavigateContact={onNavigateContact}
      />
    );
  }

  // Get 3 related articles (excluding the active one)
  const relatedPosts = getBlogPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" via @genzsforchrist`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(articleUrl)}`, "_blank");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`Check out this story from Gen Zs for Christ: ${post.title}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${text}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${post.title}*\n${post.excerpt}\n\nRead here: ${articleUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // Render markdown-like multi-line text into styled JSX
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ").trim();
        if (text) {
          elements.push(
            <p
              key={`p-${elements.length}`}
              className="text-[18px] sm:text-[20px] text-[#210901]/90 leading-relaxed font-normal my-5"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              {parseInlineMarkdown(text)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        flushParagraph();
        continue;
      }

      // Section Headings: ###
      if (line.startsWith("### ")) {
        flushParagraph();
        elements.push(
          <h3
            key={`h3-${elements.length}`}
            className="text-[28px] sm:text-[36px] text-[#210901] leading-tight font-bold mt-10 mb-4"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {line.replace("### ", "")}
          </h3>
        );
        continue;
      }

      // Subheadings: ##
      if (line.startsWith("## ")) {
        flushParagraph();
        elements.push(
          <h2
            key={`h2-${elements.length}`}
            className="text-[32px] sm:text-[42px] text-[#210901] leading-tight font-normal mt-12 mb-4"
            style={{ fontFamily: "'Gasoek One', sans-serif" }}
          >
            {line.replace("## ", "")}
          </h2>
        );
        continue;
      }

      // Blockquotes: >
      if (line.startsWith("> ")) {
        flushParagraph();
        elements.push(
          <blockquote
            key={`quote-${elements.length}`}
            className="my-8 p-6 sm:p-8 bg-[#fff4ef] border-l-4 border-[#210901] rounded-r-[20px] shadow-[4px_4px_0px_#fbb222]"
          >
            <p
              className="text-[22px] sm:text-[26px] text-[#210901] italic font-medium leading-snug m-0"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {line.replace("> ", "").replace(/^"|"$/g, "")}
            </p>
          </blockquote>
        );
        continue;
      }

      // Bullet points: 1. or - or *
      if (/^(\d+\.|\-|\*)\s/.test(line)) {
        flushParagraph();
        const bulletText = line.replace(/^(\d+\.|\-|\*)\s/, "");
        elements.push(
          <div
            key={`bullet-${elements.length}`}
            className="flex items-start gap-3 my-3 pl-2"
          >
            <span className="size-2.5 rounded-full bg-[#fbb222] border border-[#210901] shrink-0 mt-2.5" />
            <p
              className="text-[18px] sm:text-[19px] text-[#210901]/90 leading-relaxed m-0"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              {parseInlineMarkdown(bulletText)}
            </p>
          </div>
        );
        continue;
      }

      currentParagraph.push(line);
    }

    flushParagraph();
    return elements;
  };

  // Inline formatting for **bold** and *italic*
  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-[#210901]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={index} className="italic text-[#210901]">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div ref={containerRef} className="gz-grid-bg text-[#210901] min-h-screen w-full flex flex-col font-['Instrument_Sans',sans-serif] selection:bg-[#d7f741] selection:text-[#210901] overflow-x-hidden">
      {/* ── Reading Progress Indicator Bar ── */}
      <div
        className="fixed top-0 left-0 right-0 h-[4px] bg-transparent z-[150] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#d7f741] transition-all duration-75 ease-out"
          style={{
            width: `${readingProgress}%`,
            boxShadow: "0 0 10px #d7f741, 0 0 16px rgba(215,247,65,0.8)",
          }}
        />
      </div>

      {/* ── 1. Breadcrumb & Back Bar ───────────────────────────────────────── */}
      <div className="w-full bg-[#26103d] text-white py-4 px-6 sm:px-12 lg:px-20 border-b-2 border-[#210901] relative z-20">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-white/90 hover:text-[#d7f741] transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Back to All Articles</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 font-semibold">
            <span>The Journal</span>
            <span>•</span>
            <span className="text-[#fbb222]">{post.categoryLabel}</span>
          </div>
        </div>
      </div>

      {/* ── 2. Article Header ────────────────────────────────────────────────── */}
      <header className="gz-detail-article-header w-full pt-12 sm:pt-16 pb-10 px-6 sm:px-12 lg:px-20 bg-transparent border-b-2 border-[#210901]">
        <div className="max-w-[1000px] mx-auto space-y-6">
          {/* Category & Read Time Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#210901] shadow-[2px_2px_0px_#210901] ${post.categoryBadgeBg} ${post.categoryBadgeText}`}
            >
              {post.categoryLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#faf8f5] text-[#210901]/80 border border-[#210901]/20">
              <Clock size={13} className="text-[#210901]/60" />
              {post.readTime}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#faf8f5] text-[#210901]/80 border border-[#210901]/20">
              <Calendar size={13} className="text-[#210901]/60" />
              {post.dateFormatted}
            </span>
          </div>

          {/* Article Main Headline */}
          <h1
            className="text-[34px] sm:text-[50px] md:text-[62px] text-[#210901] leading-[1.08] font-bold m-0"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {post.title}
          </h1>

          {/* Subtitle / Excerpt Hook */}
          {post.subtitle && (
            <p
              className="text-[19px] sm:text-[23px] text-[#210901]/80 leading-snug font-normal max-w-3xl m-0"
              style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
            >
              {post.subtitle}
            </p>
          )}

          {/* Author Bar & Social Share Buttons */}
          <div className="pt-4 border-t border-[#210901]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Author details */}
            <div className="flex items-center gap-3.5">
              <img
                src={post.authorAvatar || resolveBlogImage()}
                alt={post.authorName}
                className="size-12 rounded-full border-2 border-[#210901] object-cover shadow-[2px_2px_0px_#210901] bg-[#fbb222]"
              />
              <div>
                <h4 className="text-base font-bold text-[#210901] leading-tight m-0">
                  {post.authorName}
                </h4>
                <p className="text-xs text-[#210901]/60 font-medium m-0">
                  {post.authorRole || "Gen Zs for Christ Contributor"}
                </p>
              </div>
            </div>

            {/* Sharing buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#210901]/60 mr-1 hidden md:inline">
                Share:
              </span>
              <button
                onClick={handleShareTelegram}
                title="Share on Telegram"
                data-name="button"
                className="size-9 rounded-[10px] bg-white border border-[#210901] drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none hover:bg-[#faf8f5] flex items-center justify-center text-[#210901] cursor-pointer transition-[filter] duration-150"
              >
                <Send size={15} />
              </button>
              <button
                onClick={handleShareWhatsApp}
                title="Share on WhatsApp"
                data-name="button"
                className="size-9 rounded-[10px] bg-white border border-[#210901] drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none hover:bg-[#faf8f5] flex items-center justify-center text-[#210901] cursor-pointer transition-[filter] duration-150"
              >
                <Share2 size={15} />
              </button>
              <button
                onClick={handleShareTwitter}
                title="Share on X / Twitter"
                data-name="button"
                className="size-9 rounded-[10px] bg-white border border-[#210901] drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none hover:bg-[#faf8f5] flex items-center justify-center text-[#210901] cursor-pointer transition-[filter] duration-150"
              >
                <span className="font-bold text-xs">𝕏</span>
              </button>
              <button
                onClick={handleCopy}
                title="Copy Link"
                data-name="button"
                className="px-3 h-9 rounded-[10px] bg-[#d7f741] border border-[#210901] drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none hover:bg-[#cbe838] flex items-center gap-1.5 text-xs font-bold text-[#210901] cursor-pointer transition-[filter] duration-150"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-800" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <ExternalLink size={13} />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── 3. Featured Cover Image ────────────────────────────────────────── */}
      <section className="w-full py-8 sm:py-12 px-6 sm:px-12 lg:px-20 bg-transparent">
        <div className="max-w-[1000px] mx-auto">
          <div className="gz-detail-cover-image w-full h-[320px] sm:h-[460px] md:h-[540px] rounded-[24px] sm:rounded-[32px] border-2 border-[#210901] shadow-[8px_8px_0px_0px_#210901] overflow-hidden bg-[#26103d] relative">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── 4. Main Article Body ────────────────────────────────────────────── */}
      <article className="gz-detail-article-body w-full pb-16 sm:pb-24 px-6 sm:px-12 lg:px-20 bg-transparent">
        <div className="max-w-[800px] mx-auto bg-white border-2 border-[#210901] rounded-[28px] p-8 sm:p-14 shadow-[8px_8px_0px_0px_#210901]">
          {renderFormattedContent(post.content)}

          {/* Topic Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-8 mt-10 border-t border-[#210901]/10 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#210901]/60 mr-1">
                Topics:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-[#faf8f5] text-[#210901] border border-[#210901]/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Invitation to Midnight Altar Callout */}
          <div className="gz-detail-callout mt-12 bg-[#26103d] text-white rounded-[20px] border-2 border-[#210901] p-6 sm:p-8 relative overflow-hidden shadow-[6px_6px_0px_#fbb222]">
            <div className="relative z-10 space-y-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#d7f741] text-[#210901] border border-[#210901] inline-block">
                Join the Movement
              </span>
              <h3
                className="text-[26px] sm:text-[32px] text-[#fbb222] font-bold leading-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Experience Revival For Yourself
              </h3>
              <p className="text-white/85 text-base sm:text-lg leading-relaxed m-0">
                We meet every night at 9:00 PM WAT on Telegram for prayer, worship, and discipleship.
                Don't just read about revival—step into it.
              </p>
              <div className="pt-2">
                <NeoButton
                  href="https://t.me/genzsforchrist"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="lime"
                  icon={<Send size={16} />}
                >
                  Join Our Telegram Altar
                </NeoButton>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ── 5. Related Articles ──────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="w-full py-16 sm:py-20 px-6 sm:px-12 lg:px-20 bg-transparent border-t-2 border-[#210901]">
          <div className="max-w-[1200px] mx-auto space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-[32px] sm:text-[44px] text-[#210901] leading-tight m-0 font-normal"
                  style={{ fontFamily: "'Gasoek One', sans-serif" }}
                >
                  More From the Journal
                </h2>
                <p className="text-base sm:text-lg text-[#210901]/70 m-0">
                  Keep exploring stories of faith, discipleship, and transformation.
                </p>
              </div>

              <NeoButton
                onClick={onBack}
                variant="secondary"
                size="sm"
                icon={<ArrowRight size={16} />}
                className="hidden sm:inline-flex"
              >
                View All Articles
              </NeoButton>
            </div>

            <div className="gz-detail-related-grid grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedPosts.map((rPost) => (
                <div
                  key={rPost.slug}
                  onClick={() => {
                    if (onSelectPost) onSelectPost(rPost.slug);
                    else {
                      window.history.pushState(null, "", `/blog/${rPost.slug}`);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }
                  }}
                  className="gz-detail-related-card bg-white rounded-[24px] border-2 border-[#210901] shadow-[8px_8px_0px_0px_#210901] hover:-translate-y-1.5 transition-transform duration-300 ease-out overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                  <div className="h-[200px] w-full overflow-hidden border-b-2 border-[#210901] bg-[#26103d] relative">
                    <img
                      src={rPost.coverImage}
                      alt={rPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-[#210901] shadow-[2px_2px_0px_#210901] ${rPost.categoryBadgeBg} ${rPost.categoryBadgeText}`}
                      >
                        {rPost.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#210901]/60 font-semibold">
                        <span>{rPost.dateFormatted}</span>
                        <span>•</span>
                        <span>{rPost.readTime}</span>
                      </div>
                      <h3
                        className="text-[22px] sm:text-[24px] text-[#210901] font-bold leading-snug group-hover:text-[#26103d] transition-colors line-clamp-2 m-0"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        {rPost.title}
                      </h3>
                      <p className="text-sm text-[#210901]/75 line-clamp-3 leading-relaxed m-0 font-normal">
                        {rPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#210901]/10 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[#210901]/70">
                        {rPost.authorName}
                      </span>
                      <NeoButton
                        variant="secondary"
                        size="sm"
                        icon={<ArrowRight size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectPost) onSelectPost(rPost.slug);
                          else {
                            window.history.pushState(null, "", `/blog/${rPost.slug}`);
                            window.dispatchEvent(new PopStateEvent("popstate"));
                          }
                        }}
                      >
                        Read More
                      </NeoButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. Bottom CTA & Global Footer ───────────────────────────────────── */}
      <CtaSection
        onNavigateContact={onNavigateContact}
        title="Ready to Step Into the Fire?"
        subtitle="Join our community of unashamed believers and walk in intimacy, power, and purpose."
        primaryButtonText="Join the Community"
        secondaryButtonText="Follow Our Journey"
      />
      <Footer />

      {/* ── Floating Scroll To Top Button ── */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-name="button"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-[16px] bg-[#210901] text-white border-2 border-white/20 shadow-[4px_4px_0px_#d7f741] hover:shadow-none hover:bg-[#26103d] transition-all cursor-pointer flex items-center justify-center animate-in fade-in zoom-in duration-200"
          title="Back to Top"
          aria-label="Scroll to top of article"
        >
          <ChevronUp size={22} className="text-[#d7f741]" />
        </button>
      )}
    </div>
  );
}
