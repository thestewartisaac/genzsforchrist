import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "primary-inverted"
  | "lime"
  | "secondary"
  | "secondary-amber"
  | "tertiary"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg";

export interface NeoButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
  "aria-label"?: string;
}

export default function NeoButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  onClick,
  href,
  target,
  rel,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  fullWidth = false,
  "aria-label": ariaLabel,
}: NeoButtonProps) {
  // ── 1. Variant Styling ─────────────────────────────────────────────────────
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        // Solid Dark Ink with Amber Drop Shadow
        return "bg-[#210901] text-white border-[#210901] drop-shadow-[4px_4px_0px_#fbb222] hover:drop-shadow-none";

      case "primary-inverted":
        // White on Dark Hero with Amber Drop Shadow
        return "bg-white text-[#210901] border-black drop-shadow-[4px_4px_0px_#fbb222] hover:drop-shadow-none";

      case "lime":
        // Neon Lime with Dark Neo-Brutalist Shadow
        return "bg-[#d7f741] text-[#210901] border-black drop-shadow-[4px_4px_0px_#210901] hover:drop-shadow-none";

      case "secondary":
        // Clean White with Dark Neo-Brutalist Shadow
        return "bg-white text-[#210901] border-black drop-shadow-[4px_4px_0px_#210901] hover:drop-shadow-none";

      case "secondary-amber":
        // Dark ink with Amber shadow
        return "bg-[#210901] text-white border-[#fbb222] drop-shadow-[4px_4px_0px_#fbb222] hover:drop-shadow-none";

      case "tertiary":
        // Outline / Ghost style with light surface
        return "bg-[#fff4ef] text-[#210901] border-[#210901] drop-shadow-[2px_2px_0px_#210901] hover:drop-shadow-none";

      case "destructive":
        // Red with Dark Shadow
        return "bg-[#e62129] text-white border-black drop-shadow-[4px_4px_0px_#210901] hover:drop-shadow-none";

      default:
        return "bg-[#210901] text-white border-[#210901] drop-shadow-[4px_4px_0px_#fbb222] hover:drop-shadow-none";
    }
  };

  // ── 2. Size Dimensions ─────────────────────────────────────────────────────
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-[42px] px-[18px] py-[8px] text-[14px] sm:text-[15px] rounded-[12px] gap-[6px]";
      case "lg":
        return "h-[56px] px-[32px] py-[16px] text-[19px] sm:text-[20px] rounded-[16px] gap-[10px]";
      case "md":
      default:
        return "h-[50px] px-[24px] py-[12px] text-[16px] sm:text-[17px] rounded-[16px] gap-[8px]";
    }
  };

  // ── 3. Base & Interaction Classes (No translate animations, just hover drop-shadow removal) ──
  const baseClasses = `
    group relative shrink-0 cursor-pointer font-['Instrument_Sans',sans-serif] font-semibold
    inline-flex items-center justify-center border-2 border-solid
    transition-[filter] duration-150 ease-out select-none
    disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : "w-auto"}
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${className}
  `.replace(/\s+/g, " ").trim();

  // ── 4. Inner Content ───────────────────────────────────────────────────────
  const content = (
    <>
      {loading ? (
        <Loader2 className="animate-spin size-4 shrink-0" />
      ) : (
        icon && iconPosition === "left" && (
          <span className="shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )
      )}

      <span className="leading-[0.9] text-inherit whitespace-nowrap">
        {children}
      </span>

      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0 flex items-center justify-center">
          {icon}
        </span>
      )}
    </>
  );

  // ── 5. Polymorphic Render (Anchor vs Button) ───────────────────────────────
  if (href && !disabled) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? rel || "noopener noreferrer" : rel}
        onClick={onClick}
        className={baseClasses}
        data-name="button"
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      data-name="button"
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
