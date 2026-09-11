import React, { useState, useEffect } from "react";
import logoColorLight from "@/imports/logo_color-light_transparent.svg";
import svgPaths from "@/imports/Homepage/svg-ylshnye6o6";

export function Menu2SvgrepoCom() {
  return (
    <div
      className="relative shrink-0 size-[32px]"
      data-name="menu-2_svgrepo.com"
    >
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="32"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
        width="32"
      >
        <g id="menu-2_svgrepo.com">
          <path
            d={svgPaths.p2bff2600}
            id="Vector"
            stroke="#210901"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.92"
          />
          <path
            d={svgPaths.p23bb17c0}
            id="Vector_2"
            stroke="#210901"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.92"
          />
          <path
            d={svgPaths.p2a7f8af0}
            id="Vector_3"
            stroke="#210901"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.92"
          />
          <path
            d={svgPaths.p5ce4600}
            id="Vector_4"
            stroke="#210901"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.92"
          />
        </g>
      </svg>
    </div>
  );
}

export function MenuToggleBtn({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      data-name="button"
      className="bg-white content-stretch drop-shadow-[4px_4px_0px_#fbb222] flex items-center justify-center p-[8px] relative rounded-[16px] shrink-0 size-[56px] cursor-pointer hover:drop-shadow-none transition-[filter] duration-150"
      aria-label="Open Menu"
      role="button"
    >
      <div
        aria-hidden
        className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[16px]"
      />
      <Menu2SvgrepoCom />
    </div>
  );
}

export default function SiteNavbar({
  onNavigateHome,
  onOpenMenu,
}: {
  onNavigateHome?: () => void;
  onOpenMenu?: () => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos =
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsScrolled(scrollPos > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    document.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header
      className={`gz-header-nav fixed top-0 left-0 right-0 w-full max-w-full flex items-center justify-between z-[100] box-border ${
        isScrolled ? "gz-header-scrolled" : "gz-header-top"
      }`}
      style={{
        backgroundColor: isScrolled ? "rgba(38, 16, 61, 0.96)" : "transparent",
        backdropFilter: isScrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(16px)" : "none",
        boxShadow: isScrolled
          ? "0 4px 24px rgba(0, 0, 0, 0.45)"
          : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(215, 247, 65, 0.15)"
          : "1px solid transparent",
        transition:
          "background-color 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease, box-shadow 0.3s ease, border-bottom 0.3s ease",
      }}
    >
      <div
        className="h-[60px] relative shrink-0 w-[151.938px] flex items-center cursor-pointer select-none"
        onClick={onNavigateHome}
      >
        <img
          src={logoColorLight}
          alt="GenZs for Christ"
          className="h-full w-auto max-w-full object-contain"
        />
      </div>

      <MenuToggleBtn onClick={onOpenMenu} />
    </header>
  );
}