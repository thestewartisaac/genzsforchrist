import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

export const isEmailJsConfigured = Boolean(
  EMAILJS_SERVICE_ID &&
    EMAILJS_TEMPLATE_ID &&
    EMAILJS_PUBLIC_KEY &&
    EMAILJS_SERVICE_ID !== "your_service_id"
);

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  to_email?: string;
}

/**
 * Sends notification email for new contact form submissions to contact@genzsforchrist.org
 */
export async function sendContactEmail(
  payload: ContactEmailPayload
): Promise<{ success: boolean; error?: string; simulated?: boolean }> {
  const templateParams = {
    from_name: payload.name,
    from_email: payload.email,
    phone_number: payload.phone || "Not provided",
    message: payload.message,
    to_email: payload.to_email || "contact@genzsforchrist.org",
    submitted_at: new Date().toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
      dateStyle: "full",
      timeStyle: "medium",
    }),
  };

  if (!isEmailJsConfigured) {
    console.info(
      "ℹ️ [EmailJS] Keys not configured in environment variables. Email notification simulated for:",
      templateParams
    );
    return { success: true, simulated: true };
  }

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200 || response.text === "OK") {
      return { success: true };
    }
    return { success: false, error: `EmailJS status: ${response.status} - ${response.text}` };
  } catch (err: any) {
    console.error("❌ [EmailJS Error]:", err);
    return {
      success: false,
      error: err?.text || err?.message || "Failed to send email notification",
    };
  }
}
