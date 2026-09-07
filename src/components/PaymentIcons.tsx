import React from "react";
import { ShieldCheck } from "lucide-react";
import { Mastercard, Visa } from "react-svg-credit-card-payment-icons/icons/flat-rounded";

/**
 * Official Paystack Mark (4 horizontal rounded cyan bars + wordmark)
 */
export function PaystackLogo({ className = "h-4 w-auto shrink-0" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 112 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Paystack"
    >
      {/* 4 horizontal rounded cyan bars */}
      <rect x="0" y="2" width="16" height="3.4" rx="1.7" fill="#00C3F7" />
      <rect x="0" y="8" width="22" height="3.4" rx="1.7" fill="#00C3F7" />
      <rect x="0" y="14" width="13" height="3.4" rx="1.7" fill="#00C3F7" />
      <rect x="0" y="20" width="18" height="3.4" rx="1.7" fill="#00C3F7" />
      {/* Wordmark */}
      <text
        x="28"
        y="18"
        fontFamily="'Instrument Sans', system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="800"
        fill="#011B33"
        letterSpacing="-0.4"
      >
        paystack
      </text>
    </svg>
  );
}

/**
 * Paystack Security Badge with Shield and Verification Notice
 * "Secured by" and Paystack logo on a single line
 */
export function PaystackSecurityBadge({ className = "" }: { className?: string } = {}) {
  return (
    <div className={`inline-flex flex-row items-center gap-2 bg-[#f0f9ff] border border-[#00C3F7]/30 px-3 py-1.5 rounded-[10px] shadow-sm shrink-0 whitespace-nowrap ${className}`.trim()}>
      <ShieldCheck size={16} className="text-[#0AA5DB] shrink-0" />
      <div className="flex flex-row items-center gap-1.5 text-xs text-[#011B33] font-medium leading-none whitespace-nowrap">
        <span className="text-[11px] text-[#011B33]/75 font-semibold uppercase tracking-wider whitespace-nowrap">
          Secured by
        </span>
        <PaystackLogo className="h-3.5 w-auto shrink-0" />
      </div>
    </div>
  );
}

/**
 * Mastercard Logo from react-svg-credit-card-payment-icons (Fixed, not hoverable)
 */
export function MastercardLogo({ width = 38 }: { width?: number }) {
  return <Mastercard width={width} />;
}

/**
 * Visa Logo from react-svg-credit-card-payment-icons (Fixed, not hoverable)
 */
export function VisaLogo({ width = 38 }: { width?: number }) {
  return <Visa width={width} />;
}

/**
 * Verve Logo Badge (Fixed, not hoverable)
 */
export function VerveLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <div
      className="inline-flex items-center justify-center bg-white border border-[#210901]/15 rounded-[6px] shadow-sm px-2 py-0.5"
      title="Verve"
    >
      <svg
        viewBox="0 0 46 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="11.5" cy="11" r="5" fill="#004B87" />
        <path
          d="M6 15.8C8 17 10.7 17.2 13.2 16.3C16.8 15 18.9 11.8 19.6 8.3C19.9 6.7 19.6 5.8 19 5.4C18.1 4.8 16.6 5.1 14.8 5.9C12.5 6.9 10.8 8.8 9.7 11.2C8.6 13.3 7.3 15 6 15.8Z"
          fill="#E31B23"
        />
        <text
          x="21"
          y="14.5"
          fontFamily="'Instrument Sans', system-ui, sans-serif"
          fontSize="11.5"
          fontWeight="800"
          fontStyle="italic"
          fill="#004B87"
          letterSpacing="-0.4"
        >
          verve
        </text>
      </svg>
    </div>
  );
}

/**
 * Apple Pay Badge (Fixed, not hoverable)
 */
export function ApplePayLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <div
      className="inline-flex items-center justify-center bg-black border border-black rounded-[6px] shadow-sm px-2 py-0.5"
      title="Apple Pay"
    >
      <svg
        viewBox="0 0 46 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Apple Leaf */}
        <path
          d="M12.8 6.2C13.4 5.4 13.8 4.3 13.6 3.2C12.7 3.3 11.6 3.9 11 4.7C10.5 5.3 10.1 6.4 10.3 7.5C11.3 7.6 12.3 7 12.8 6.2Z"
          fill="#FFFFFF"
        />
        {/* Apple Body */}
        <path
          d="M13.6 10.7C13.6 9.1 14.8 8.3 14.9 8.2C14.2 7.2 13 7 12.6 7C11.5 6.9 10.6 7.6 10.1 7.6C9.6 7.6 8.7 7 7.9 7C6.7 7 5.7 7.7 5.1 8.6C3.9 10.7 4.8 13.8 6 15.5C6.6 16.4 7.3 17.3 8.2 17.3C9.1 17.3 9.5 16.7 10.6 16.7C11.7 16.7 12 17.3 13 17.3C14 17.3 14.7 16.4 15.3 15.5C16 14.5 16.3 13.5 16.4 13.4C16.3 13.3 13.6 12.3 13.6 10.7Z"
          fill="#FFFFFF"
        />
        {/* Pay Wordmark */}
        <text
          x="19"
          y="15.2"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="12"
          fontWeight="600"
          fill="#FFFFFF"
          letterSpacing="-0.2"
        >
          Pay
        </text>
      </svg>
    </div>
  );
}

/**
 * Google Pay Badge (Fixed, not hoverable)
 */
export function GooglePayLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <div
      className="inline-flex items-center justify-center bg-white border border-[#210901]/15 rounded-[6px] shadow-sm px-2 py-0.5"
      title="Google Pay"
    >
      <svg
        viewBox="0 0 50 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Google 'G' in 4 official colors */}
        <g transform="translate(6, 4.5) scale(0.6)">
          <path
            d="M20.6 10.5C20.6 9.8 20.5 9.1 20.4 8.5H10.5V12.6H16.2C15.9 14 15.1 15.2 13.8 16V18.9H17.3C19.3 17 20.6 14.2 20.6 10.5Z"
            fill="#4285F4"
          />
          <path
            d="M10.5 21C13.4 21 15.8 20 17.4 18.5L14 15.6C13.1 16.2 11.9 16.6 10.5 16.6C7.7 16.6 5.3 14.7 4.5 12.2H0.9V15.2C2.7 18.7 6.4 21 10.5 21Z"
            fill="#34A853"
          />
          <path
            d="M4.5 12.2C4.3 11.5 4.2 10.7 4.2 9.9C4.2 9.1 4.3 8.3 4.5 7.6V4.6H0.9C0.3 5.9 0 7.4 0 9.9C0 12.4 0.3 13.9 0.9 15.2L4.5 12.2Z"
            fill="#FBBC05"
          />
          <path
            d="M10.5 3.3C12.1 3.3 13.5 3.9 14.6 4.9L17.7 1.8C15.8 0.7 13.4 0 10.5 0C6.4 0 2.7 2.3 0.9 5.8L4.5 8.8C5.3 6.3 7.7 3.3 10.5 3.3Z"
            fill="#EA4335"
          />
        </g>
        {/* Pay Wordmark */}
        <text
          x="23"
          y="15.2"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="12"
          fontWeight="600"
          fill="#5F6368"
          letterSpacing="-0.2"
        >
          Pay
        </text>
      </svg>
    </div>
  );
}

/**
 * Accepted Payment Methods Row (Fixed, non-hoverable)
 */
export function AcceptedPaymentLogos({ className = "" }: { className?: string } = {}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      <div className="shrink-0 drop-shadow-sm flex items-center pointer-events-none select-none" title="Mastercard">
        <Mastercard width={38} />
      </div>
      <div className="shrink-0 drop-shadow-sm flex items-center pointer-events-none select-none" title="Visa">
        <Visa width={38} />
      </div>
      <div className="shrink-0 flex items-center pointer-events-none select-none" title="Verve">
        <VerveLogo className="h-[24.35px] w-auto" />
      </div>
      <div className="shrink-0 flex items-center pointer-events-none select-none" title="Apple Pay">
        <ApplePayLogo className="h-[24.35px] w-auto" />
      </div>
      <div className="shrink-0 flex items-center pointer-events-none select-none" title="Google Pay">
        <GooglePayLogo className="h-[24.35px] w-auto" />
      </div>
    </div>
  );
}
