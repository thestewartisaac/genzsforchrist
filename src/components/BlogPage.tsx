import React, { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  Send,
  Filter,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);
import HeroAnimatedBackground from "@/components/HeroAnimatedBackground";
import Footer from "@/imports/Footer/index";
import CtaSection from "@/app/components/CtaSection";
import BlogDetailPage from "@/components/BlogDetailPage";
import {
  BlogPost,
  BLOG_CATEGORIES,
  getBlogPosts,
  getFeaturedBlogPost,
  resolveBlogImage,
} from "@/lib/blogContent";

// ── Reusable Neo-Brutalist Button Component matching the site design ──
function NeoButton({
  children,
  onClick,
  variant = "white-black",
  size = "md",
  icon,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "white-amber" | "white-black" | "lime-black" | "black-amber";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
}) {
  const getShadow = () => {
    switch (variant) {
      case "white-amber":
        return "bg-white drop-shadow-[4px_4px_0px_#fbb222] text-[#210901]";
      case "lime-black":
        return "bg-[#d7f741] drop-shadow-[4px_4px_0px_#210901] text-[#210901]";
      case "black-amber":
        return "bg-[#210901] drop-shadow-[4px_4px_0px_#fbb222] text-white";
      case "white-black":
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
      case "white-black":
      default:
        return "border-black group-hover:border-[#fbb222]";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-[42px] sm:h-[44px] px-[18px] sm:px-[20px] py-[8px] text-[14px] sm:text-[15px]";
      case "lg":
        return "h-[50px] sm:h-[54px] px-[26px] sm:px-[30px] py-[12px] sm:py-[14px] text-[16px] sm:text-[18px]";
      case "md":
      default:
        return "h-[46px] sm:h-[48px] px-[22px] sm:px-[24px] py-[10px] sm:py-[12px] text-[15px] sm:text-[16px]";
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      data-name="button"
      className={`group content-stretch flex gap-[8px] items-center justify-center relative rounded-[16px] shrink-0 cursor-pointer ${getSizeClasses()} ${getShadow()} ${className}`}
    >
      <div
        aria-hidden
        className={`absolute border ${getBorderColor()} border-solid inset-0 pointer-events-none rounded-[16px] transition-colors duration-150`}
      />
      <div className="flex flex-col font-['Instrument_Sans',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-inherit text-center whitespace-nowrap">
        <p className="leading-[0.9] m-0">{children}</p>
      </div>
      {icon && (
        <div className="overflow-clip relative shrink-0 size-[18px] sm:size-[20px] flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1">
          {icon}
        </div>
      )}
    </button>
  );
}

export default function BlogPage({
  selectedSlug,
  onNavigateContact,
}: {
  selectedSlug?: string;
  onNavigateContact?: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePostSlug, setActivePostSlug] = useState<string | undefined>(selectedSlug);

  // Sync internal slug state when URL prop changes (e.g. browser back / forward)
  useEffect(() => {
    setActivePostSlug(selectedSlug);
  }, [selectedSlug]);

  // If a slug is provided via prop or state, show the full article reader
  const currentSlug = selectedSlug || activePostSlug;
  if (currentSlug) {
    return (
      <BlogDetailPage
        slug={currentSlug}
        onBack={() => {
          setActivePostSlug(undefined);
          window.history.pushState(null, "", "/blog");
          window.dispatchEvent(new PopStateEvent("popstate"));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onNavigateContact={onNavigateContact}
        onSelectPost={(newSlug) => {
          setActivePostSlug(newSlug);
          window.history.pushState(null, "", `/blog/${newSlug}`);
          window.dispatchEvent(new PopStateEvent("popstate"));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  const allPosts = getBlogPosts();
  const featuredPost = getFeaturedBlogPost();

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "all" || post.category === activeCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [allPosts, activeCategory, searchQuery]);

  const handleSelectPost = (slug: string) => {
    setActivePostSlug(slug);
    window.history.pushState(null, "", `/blog/${slug}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      gsap.from(".gz-blog-hero-content", {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
      });

      // 2. Filter Nav Bar Entrance
      gsap.from(".gz-blog-filter-bar", {
        opacity: 0,
        y: -16,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.2,
      });

      // 3. Featured Card Reveal
      const featuredCard = container.querySelector(".gz-blog-featured-card");
      if (featuredCard) {
        gsap.from(featuredCard, {
          opacity: 0,
          scale: 0.96,
          y: 36,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: featuredCard,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // 4. Articles Grid Stagger Reveal
      const articleCards = container.querySelectorAll(".gz-blog-article-card");
      if (articleCards.length > 0) {
        gsap.from(articleCards, {
          opacity: 0,
          y: 36,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".gz-blog-articles-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [activeCategory, searchQuery]);

  return (
    <div ref={containerRef} className="gz-grid-bg text-[#210901] min-h-screen w-full flex flex-col font-['Instrument_Sans',sans-serif] selection:bg-[#d7f741] selection:text-[#210901] overflow-x-hidden">
      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section
        data-name="BlogHero"
        className="relative overflow-clip w-full flex flex-col items-center justify-center px-6 text-center shrink-0 min-h-[50vh] sm:min-h-[56vh] py-20 sm:py-24"
      >
        <HeroAnimatedBackground />

        <div className="gz-blog-hero-content max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Main Title */}
          <h1
            className="text-[44px] sm:text-[68px] md:text-[84px] text-white leading-[0.95] tracking-tight m-0 font-normal text-shadow-[8px_8px_0px_#210901]"
            style={{ fontFamily: "'Gasoek One', sans-serif" }}
          >
            TRUTH IN THE NOISE.
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/90 font-medium text-[19px] sm:text-[23px] md:text-[25px] max-w-3xl leading-relaxed m-0 text-center mx-auto"
            style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
          >
            Raw, unfiltered perspectives on faith, discipleship, mental wholeness, and walking with
            Jesus in a digital generation.
          </p>
        </div>
      </section>

      {/* ── 2. Search & Category Filter Navigation Bar ──────────────────────── */}
      <section className="gz-blog-filter-bar w-full py-6 px-6 sm:px-12 lg:px-20 sticky top-0 z-30">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {BLOG_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-[14px] text-xs sm:text-sm font-bold tracking-wide transition-all border-2 border-[#210901] cursor-pointer shrink-0 ${isActive
                    ? "bg-[#210901] text-white shadow-[3px_3px_0px_#fbb222] scale-[1.02]"
                    : "bg-white text-[#210901] hover:bg-[#fff4ef] shadow-[2px_2px_0px_#210901]"
                    }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 mb-auto">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#210901]/50 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search articles or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-white border-2 border-[#210901] text-sm text-[#210901] placeholder-[#210901]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#fbb222] shadow-[2px_2px_0px_#210901]"
            />
          </div>
        </div>
      </section>

      {/* ── 3. Featured Hero Story (Visible when viewing All and no search) ─── */}
      {featuredPost && activeCategory === "all" && !searchQuery && (
        <section className="w-full py-12 sm:py-16 px-6 sm:px-12 lg:px-20 bg-transparent">
          <div className="max-w-[1240px] mx-auto">
            <div
              onClick={() => handleSelectPost(featuredPost.slug)}
              className="gz-blog-featured-card bg-[#26103d] text-white rounded-[32px] border-2 border-[#210901] shadow-[8px_8px_0px_0px_#210901] hover:-translate-y-1.5 transition-transform duration-300 ease-out overflow-hidden grid grid-cols-1 lg:grid-cols-12 cursor-pointer group"
            >
              {/* Featured Cover Photo */}
              <div className="lg:col-span-7 h-[300px] sm:h-[420px] lg:h-full overflow-hidden relative border-b-2 lg:border-b-0 lg:border-r-2 border-[#210901]">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#d7f741] text-[#210901] border-2 border-[#210901] shadow-[3px_3px_0px_#210901] inline-flex items-center gap-1.5">
                    <Sparkles size={14} />
                    <span>Featured Story</span>
                  </span>
                </div>
              </div>

              {/* Featured Content Details */}
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold text-white/70">
                    <span className="text-[#fbb222] font-bold">
                      {featuredPost.categoryLabel}
                    </span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                    <span>•</span>
                    <span>{featuredPost.dateFormatted}</span>
                  </div>

                  <h2
                    className="text-[32px] sm:text-[42px] text-[#ffede5] font-bold leading-tight group-hover:text-[#fbb222] transition-colors"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {featuredPost.title}
                  </h2>

                  <p className="text-white/85 text-base sm:text-lg leading-relaxed line-clamp-4 m-0">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.authorAvatar || resolveBlogImage()}
                      alt={featuredPost.authorName}
                      className="size-10 rounded-full border border-white/30 object-cover bg-[#fbb222]"
                    />
                    <div className="text-left">
                      <p className="text-sm font-bold text-white leading-tight m-0">
                        {featuredPost.authorName}
                      </p>
                      <p className="text-xs text-white/60 m-0">
                        {featuredPost.authorRole}
                      </p>
                    </div>
                  </div>

                  <NeoButton
                    variant="white-amber"
                    size="lg"
                    icon={<ArrowRight size={20} />}
                    className="w-full sm:w-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPost(featuredPost.slug);
                    }}
                  >
                    Read Article
                  </NeoButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Main Articles Grid ───────────────────────────────────────────── */}
      <section className="w-full py-12 sm:py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <h3
              className="text-[28px] sm:text-[36px] text-[#210901] font-normal leading-tight m-0"
              style={{ fontFamily: "'Gasoek One', sans-serif" }}
            >
              {activeCategory === "all" ? "Latest Articles" : `Stories in ${BLOG_CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
            </h3>
            <span className="text-sm font-semibold text-[#210901]/60">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? "story" : "stories"}
            </span>
          </div>

          {/* Empty Search / Filter State */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-[28px] border-2 border-[#210901] p-12 text-center max-w-lg mx-auto shadow-[6px_6px_0px_#210901] space-y-4">
              <div className="size-16 rounded-full bg-[#fff4ef] border-2 border-[#210901] flex items-center justify-center mx-auto text-[#210901]">
                <BookOpen size={28} />
              </div>
              <h4
                className="text-2xl font-bold text-[#210901] m-0"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                No Stories Found
              </h4>
              <p className="text-sm text-[#210901]/75 m-0">
                We couldn't find any articles matching your search query. Try searching with different
                keywords or reset filters.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="px-5 py-2.5 rounded-[12px] bg-[#d7f741] text-[#210901] font-bold text-sm border-2 border-[#210901] shadow-[3px_3px_0px_#210901] cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="gz-blog-articles-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.slug}
                  onClick={() => handleSelectPost(post.slug)}
                  className="gz-blog-article-card bg-white rounded-[24px] border-2 border-[#210901] shadow-[8px_8px_0px_0px_#210901] hover:-translate-y-1.5 transition-transform duration-300 ease-out overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                  {/* Card Image */}
                  <div>
                    <div className="h-[220px] w-full overflow-hidden border-b-2 border-[#210901] bg-[#26103d] relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-[#210901] shadow-[2px_2px_0px_#210901] ${post.categoryBadgeBg} ${post.categoryBadgeText}`}
                        >
                          {post.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[#210901]/60 font-semibold">
                        <span>{post.dateFormatted}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h4
                        className="text-[24px] sm:text-[26px] text-[#210901] font-bold leading-tight group-hover:text-[#26103d] transition-colors line-clamp-2 m-0"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        {post.title}
                      </h4>

                      <p className="text-sm sm:text-base text-[#210901]/75 line-clamp-3 leading-relaxed m-0 font-normal">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-[#210901]/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={post.authorAvatar || resolveBlogImage()}
                          alt={post.authorName}
                          className="size-8 rounded-full border border-[#210901] object-cover bg-[#fbb222] shrink-0"
                        />
                        <span className="text-xs font-bold text-[#210901] truncate">
                          {post.authorName}
                        </span>
                      </div>

                      <NeoButton
                        variant="white-black"
                        size="sm"
                        icon={<ArrowRight size={16} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPost(post.slug);
                        }}
                      >
                        Read More
                      </NeoButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Bottom CTA & Global Footer ───────────────────────────────────── */}
      <CtaSection
        onNavigateContact={onNavigateContact}
        title="Got a faith-inspiring article or story to share?"
        subtitle="Articles and stories that edify, inspire and draw young people closer to God are welcome. We'll review and if approved, we'd love to feature it on our blog."
        primaryButtonText="Submit Your Post"
        secondaryButtonText="Join the Community"
      />
      <Footer />
    </div>
  );
}
