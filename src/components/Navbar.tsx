import React from "react";
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
      className="bg-white content-stretch drop-shadow-[4px_4px_0px_#fbb222] flex items-center justify-center p-[8px] relative rounded-[16px] shrink-0 size-[56px] cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:drop-shadow-[6px_6px_0px_#fbb222] active:translate-x-0 active:translate-y-0 active:drop-shadow-[2px_2px_0px_#fbb222] transition-all"
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
  return (
    <header className="gz-header-nav">
      <div
        className="h-[60px] relative shrink-0 w-[151.938px] flex items-center cursor-pointer"
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
