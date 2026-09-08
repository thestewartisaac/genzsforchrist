import { logPendingDonation, updateDonationStatus } from "./supabaseClient";

// ── Paystack Global Type Definition ─────────────────────────────────────────
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref: string;
        metadata?: Record<string, any>;
        channels?: string[];
        callback: (response: { reference: string; status: string; message?: string }) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

export const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_live_5575f907b2a8dc2ef1489bb0418ecb5322b71551";

/**
 * Ensures the official Paystack inline script is loaded in the DOM
 */
export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.PaystackPop) {
      resolve(true);
      return;
    }
    const existingScript = document.getElementById("paystack-inline-js") as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(Boolean(window.PaystackPop)));
      setTimeout(() => resolve(Boolean(window.PaystackPop)), 1500);
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.PaystackPop));
    script.onerror = () => {
      console.error("Failed to load Paystack Inline JS script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface InitiatePaymentOptions {
  email: string;
  amount: number; // in NGN (Naira)
  donorName?: string;
  publicKey?: string;
  onSuccess: (donationDetails: { reference: string; amount: number; name: string }) => void;
  onClose?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Initiates Paystack payment flow with Supabase logging and error boundaries
 */
export async function initiatePaystackDonation(options: InitiatePaymentOptions): Promise<void> {
  const isLoaded = await loadPaystackScript();
  if (!isLoaded || !window.PaystackPop) {
    const err = new Error("Payment gateway could not be loaded. Please check your internet connection.");
    options.onError?.(err);
    throw err;
  }

  const keyToUse = (options.publicKey || PAYSTACK_PUBLIC_KEY || "").trim();
  if (!keyToUse) {
    const err = new Error("Paystack Public Key is missing.");
    options.onError?.(err);
    throw err;
  }

  const reference = `GZC-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  const donorName = options.donorName?.trim() || "Kind Partner";
  const amountInKobo = Math.round(options.amount * 100);

  // 1. Log pending donation in Supabase backend
  try {
    await logPendingDonation({
      reference,
      donorName,
      donorEmail: options.email,
      amount: options.amount,
      currency: "NGN",
    });
  } catch (err) {
    console.warn("Could not pre-log donation to Supabase:", err);
  }

  // 2. Open Paystack Inline Gateway
  try {
    const handler = window.PaystackPop.setup({
      key: keyToUse,
      email: options.email.trim(),
      amount: amountInKobo,
      currency: "NGN",
      ref: reference,
      metadata: {
        custom_fields: [
          {
            display_name: "Donor Name",
            variable_name: "donor_name",
            value: donorName,
          },
          {
            display_name: "Organization",
            variable_name: "organization",
            value: "Gen Zs for Christ Humanitarian Foundation",
          },
        ],
      },
      callback: async (response) => {
        // 3. Log success status in Supabase backend
        try {
          await updateDonationStatus(reference, "success", response);
        } catch (updateErr) {
          console.warn("Could not update donation status in Supabase:", updateErr);
        }

        options.onSuccess({
          reference: response.reference || reference,
          amount: options.amount,
          name: donorName,
        });
      },
      onClose: async () => {
        options.onClose?.();
      },
    });

    if (handler && typeof handler.openIframe === "function") {
      handler.openIframe();
    } else {
      throw new Error("Unable to open Paystack payment window.");
    }
  } catch (err: any) {
    options.onError?.(err);
    throw err;
  }
}
