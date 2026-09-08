import { createClient, SupabaseClient } from "@supabase/supabase-js";

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

// Single Supabase client instance
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
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

// ── Local Mock Fallback Helpers (Active when credentials aren't set) ────────
const LOCAL_CONTACTS_KEY = "gz_mock_contact_messages";
const LOCAL_DONATIONS_KEY = "gz_mock_donations";

function getLocalItems<T>(key: string, defaultItems: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultItems;
  } catch {
    return defaultItems;
  }
}

function setLocalItems<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
}

// Initial mock data for developer preview when Supabase env isn't provided yet
const SEED_CONTACTS: ContactMessage[] = [
  {
    id: "mock-c-1",
    name: "Emeka Okafor",
    email: "emeka.okafor@example.com",
    phone: "+234 803 123 4567",
    message: "Hello leadership! I would like to join the Lagos campus prayer altar hub. How do I get involved?",
    status: "new",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "mock-c-2",
    name: "Faith Adeyemi",
    email: "faith.adeyemi@example.com",
    phone: "+234 814 999 8877",
    message: "We would love to invite the Gen Zs for Christ worship band to minister at our upcoming youth conference in Abuja.",
    status: "read",
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

const SEED_DONATIONS: DonationRecord[] = [
  {
    id: "mock-d-1",
    reference: "GZC-1788801-92384",
    donor_name: "Chukwudi Nwosu",
    donor_email: "c.nwosu@example.com",
    amount: 50000,
    currency: "NGN",
    status: "success",
    channel: "card",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "mock-d-2",
    reference: "GZC-1788795-44102",
    donor_name: "Grace Johnson",
    donor_email: "grace.j@example.com",
    amount: 25000,
    currency: "NGN",
    status: "success",
    channel: "bank_transfer",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

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

  if (isSupabaseConfigured) {
    try {
      const { data: inserted, error } = await supabase
        .from("contact_messages")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn("Supabase insert error, falling back to local storage:", error.message);
      } else {
        return { success: true, data: inserted as ContactMessage };
      }
    } catch (err: any) {
      console.warn("Supabase connection issue:", err?.message);
    }
  }

  // Fallback / Mock store
  const mockItem: ContactMessage = {
    id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...payload,
    phone: payload.phone || undefined,
    created_at: new Date().toISOString(),
  };
  const list = getLocalItems<ContactMessage>(LOCAL_CONTACTS_KEY, SEED_CONTACTS);
  setLocalItems(LOCAL_CONTACTS_KEY, [mockItem, ...list]);
  return { success: true, data: mockItem };
}

// ── Donation Service ────────────────────────────────────────────────────────
export async function logPendingDonation(data: {
  reference: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency?: string;
}): Promise<{ success: boolean; record?: DonationRecord }> {
  const payload = {
    reference: data.reference,
    donor_name: data.donorName.trim() || "Kind Partner",
    donor_email: data.donorEmail.trim(),
    amount: data.amount,
    currency: data.currency || "NGN",
    status: "pending" as const,
  };

  if (isSupabaseConfigured) {
    try {
      const { data: inserted, error } = await supabase
        .from("donations")
        .insert([payload])
        .select()
        .single();

      if (!error && inserted) {
        return { success: true, record: inserted as DonationRecord };
      }
    } catch (err) {
      console.warn("Supabase pending donation log error:", err);
    }
  }

  const mockRecord: DonationRecord = {
    id: `d-${Date.now()}`,
    ...payload,
    created_at: new Date().toISOString(),
  };
  const list = getLocalItems<DonationRecord>(LOCAL_DONATIONS_KEY, SEED_DONATIONS);
  setLocalItems(LOCAL_DONATIONS_KEY, [mockRecord, ...list]);
  return { success: true, record: mockRecord };
}

export async function updateDonationStatus(
  reference: string,
  status: "success" | "failed" | "abandoned",
  paystackResponse?: any
): Promise<{ success: boolean }> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from("donations")
        .update({
          status,
          paystack_response: paystackResponse || null,
          updated_at: new Date().toISOString(),
        })
        .eq("reference", reference);

      if (!error) return { success: true };
    } catch (err) {
      console.warn("Supabase update donation status error:", err);
    }
  }

  // Update local fallback
  const list = getLocalItems<DonationRecord>(LOCAL_DONATIONS_KEY, SEED_DONATIONS);
  const updated = list.map((item) =>
    item.reference === reference ? { ...item, status, paystack_response: paystackResponse } : item
  );
  setLocalItems(LOCAL_DONATIONS_KEY, updated);
  return { success: true };
}

// ── Admin Data Services ─────────────────────────────────────────────────────
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as ContactMessage[];
      }
    } catch (err) {
      console.warn("Supabase fetch contact messages error:", err);
    }
  }
  return getLocalItems<ContactMessage>(LOCAL_CONTACTS_KEY, SEED_CONTACTS);
}

export async function updateContactMessageStatus(
  id: string,
  status: "new" | "read" | "replied" | "archived",
  notes?: string
): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const updateData: any = { status };
      if (notes !== undefined) updateData.admin_notes = notes;
      const { error } = await supabase
        .from("contact_messages")
        .update(updateData)
        .eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase update message status error:", err);
    }
  }

  const list = getLocalItems<ContactMessage>(LOCAL_CONTACTS_KEY, SEED_CONTACTS);
  const updated = list.map((m) => (m.id === id ? { ...m, status, admin_notes: notes ?? m.admin_notes } : m));
  setLocalItems(LOCAL_CONTACTS_KEY, updated);
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.warn("Supabase delete message error:", err);
    }
  }

  const list = getLocalItems<ContactMessage>(LOCAL_CONTACTS_KEY, SEED_CONTACTS);
  setLocalItems(LOCAL_CONTACTS_KEY, list.filter((m) => m.id !== id));
  return true;
}

export async function fetchDonations(): Promise<DonationRecord[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as DonationRecord[];
      }
    } catch (err) {
      console.warn("Supabase fetch donations error:", err);
    }
  }
  return getLocalItems<DonationRecord>(LOCAL_DONATIONS_KEY, SEED_DONATIONS);
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const [messages, donations] = await Promise.all([
    fetchContactMessages(),
    fetchDonations(),
  ]);

  const newMessages = messages.filter((m) => m.status === "new").length;
  const successfulDonations = donations.filter((d) => d.status === "success");
  const totalDonationsAmount = successfulDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return {
    totalMessages: messages.length,
    newMessages,
    totalDonationsAmount,
    successfulDonationsCount: successfulDonations.length,
  };
}
