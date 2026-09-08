import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ── Supabase Environment Variables ──────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"
);

// Single production Supabase client instance
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// ── TypeScript Types ────────────────────────────────────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface DonationRecord {
  id: string;
  reference: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "abandoned";
  channel?: string;
  paystack_response?: any;
  created_at: string;
  updated_at?: string;
}

export interface AdminStats {
  totalMessages: number;
  newMessages: number;
  totalDonationsAmount: number;
  successfulDonationsCount: number;
}

// ── Contact Form Service ────────────────────────────────────────────────────
export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<{ success: boolean; data?: ContactMessage; error?: string }> {
  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || null,
    message: data.message.trim(),
    status: "new" as const,
  };

  try {
    const { data: inserted, error } = await supabase
      .from("contact_messages")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Supabase contact submit error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: inserted as ContactMessage };
  } catch (err: any) {
    console.error("Supabase connection error:", err?.message);
    return { success: false, error: err?.message || "Database connection error" };
  }
}

// ── Donation Service (Paystack Integration) ─────────────────────────────────
export async function logPendingDonation(data: {
  reference: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency?: string;
}): Promise<{ success: boolean; record?: DonationRecord; error?: string }> {
  const payload = {
    reference: data.reference,
    donor_name: data.donorName.trim() || "Kind Partner",
    donor_email: data.donorEmail.trim(),
    amount: data.amount,
    currency: data.currency || "NGN",
    status: "pending" as const,
  };

  try {
    const { data: inserted, error } = await supabase
      .from("donations")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Supabase log pending donation error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, record: inserted as DonationRecord };
  } catch (err: any) {
    console.error("Supabase pending donation connection error:", err);
    return { success: false, error: err?.message };
  }
}

export async function updateDonationStatus(
  reference: string,
  status: "success" | "failed" | "abandoned",
  paystackResponse?: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("donations")
      .update({
        status,
        paystack_response: paystackResponse || null,
        updated_at: new Date().toISOString(),
      })
      .eq("reference", reference);

    if (error) {
      console.error("Supabase update donation status error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Supabase update donation connection error:", err);
    return { success: false, error: err?.message };
  }
}

// ── Admin Data Services (Real Database Queries) ─────────────────────────────
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch contact messages error:", error.message);
      return [];
    }

    return (data || []) as ContactMessage[];
  } catch (err) {
    console.error("Supabase fetch contact messages connection error:", err);
    return [];
  }
}

export async function updateContactMessageStatus(
  id: string,
  status: "new" | "read" | "replied" | "archived",
  notes?: string
): Promise<boolean> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) updateData.admin_notes = notes;

    const { error } = await supabase
      .from("contact_messages")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Supabase update message status error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Supabase update message connection error:", err);
    return false;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete message error:", error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Supabase delete message connection error:", err);
    return false;
  }
}

export async function fetchDonations(): Promise<DonationRecord[]> {
  try {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch donations error:", error.message);
      return [];
    }

    return (data || []) as DonationRecord[];
  } catch (err) {
    console.error("Supabase fetch donations connection error:", err);
    return [];
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const [messages, donations] = await Promise.all([
      fetchContactMessages(),
      fetchDonations(),
    ]);

    const newMessages = messages.filter((m) => m.status === "new").length;
    const successfulDonations = donations.filter((d) => d.status === "success");
    const totalDonationsAmount = successfulDonations.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0
    );

    return {
      totalMessages: messages.length,
      newMessages,
      totalDonationsAmount,
      successfulDonationsCount: successfulDonations.length,
    };
  } catch (err) {
    console.error("Supabase fetch admin stats error:", err);
    return {
      totalMessages: 0,
      newMessages: 0,
      totalDonationsAmount: 0,
      successfulDonationsCount: 0,
    };
  }
}
