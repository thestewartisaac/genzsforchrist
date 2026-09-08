import React, { useState, useEffect } from "react";
import {
  supabase,
  isSupabaseConfigured,
  fetchContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  fetchDonations,
  fetchAdminStats,
  ContactMessage,
  DonationRecord,
  AdminStats,
} from "@/lib/supabaseClient";
import {
  ShieldCheck,
  Mail,
  Heart,
  FileEdit,
  LogOut,
  Search,
  Eye,
  Trash2,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  KeyRound,
  Lock,
  Send,
  X,
} from "lucide-react";

interface AdminPortalProps {
  onNavigateHome: () => void;
}

export default function AdminPortal({ onNavigateHome }: AdminPortalProps) {
  // ── Auth State ─────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  // ── Dashboard Data State ───────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"inquiries" | "donations">("inquiries");
  const [stats, setStats] = useState<AdminStats>({
    totalMessages: 0,
    newMessages: 0,
    totalDonationsAmount: 0,
    successfulDonationsCount: 0,
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // ── Filters & Modals ───────────────────────────────────────────────────────
  const [messageSearch, setMessageSearch] = useState<string>("");
  const [messageStatusFilter, setMessageStatusFilter] = useState<"all" | "new" | "read" | "replied">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [donationSearch, setDonationSearch] = useState<string>("");

  // ── Check Auth on Mount ────────────────────────────────────────────────────
  useEffect(() => {
    checkCurrentAuth();

    // Listen to Supabase auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setCurrentUserEmail(session.user.email || "admin@genzsforchrist.org");
      } else {
        const localAuth = localStorage.getItem("gzc_admin_auth");
        if (localAuth === "true") {
          setIsAuthenticated(true);
          setCurrentUserEmail("local-admin@genzsforchrist.org");
        } else {
          setIsAuthenticated(false);
          setCurrentUserEmail("");
        }
      }
      setAuthLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // ── Load Data when Authenticated ───────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const checkCurrentAuth = async () => {
    setAuthLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUserEmail(session.user.email || "admin@genzsforchrist.org");
          setAuthLoading(false);
          return;
        }
      }

      // Check local session fallback
      const localAuth = localStorage.getItem("gzc_admin_auth");
      if (localAuth === "true") {
        setIsAuthenticated(true);
        setCurrentUserEmail("local-admin@genzsforchrist.org");
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.warn("Auth check error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingAuth(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.trim(),
          password: loginPassword,
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setIsAuthenticated(true);
          setCurrentUserEmail(data.session.user.email || loginEmail);
          setIsSubmittingAuth(false);
          return;
        }
      }

      // Local / Offline fallback mode credentials check
      if (
        (loginEmail.trim().toLowerCase() === "admin@genzsforchrist.org" || loginEmail.trim().toLowerCase() === "contact@genzsforchrist.org") &&
        loginPassword.length >= 6
      ) {
        localStorage.setItem("gzc_admin_auth", "true");
        setIsAuthenticated(true);
        setCurrentUserEmail(loginEmail);
      } else {
        throw new Error("Invalid email or password. Try again.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to log in.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Error signing out:", err);
    }
    localStorage.removeItem("gzc_admin_auth");
    setIsAuthenticated(false);
    setCurrentUserEmail("");
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [statsData, msgsData, donsData] = await Promise.all([
        fetchAdminStats(),
        fetchContactMessages(),
        fetchDonations(),
      ]);

      setStats(statsData);
      setMessages(msgsData);
      setDonations(donsData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "new" | "read" | "replied") => {
    const success = await updateContactMessageStatus(id, newStatus);
    if (success) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      const updatedStats = await fetchAdminStats();
      setStats(updatedStats);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    const success = await deleteContactMessage(id);
    if (success) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      const updatedStats = await fetchAdminStats();
      setStats(updatedStats);
    }
  };

  // Filtered messages
  const filteredMessages = messages.filter((msg) => {
    const matchesStatus =
      messageStatusFilter === "all" ? true : msg.status === messageStatusFilter;
    const query = messageSearch.toLowerCase();
    const senderName = msg.name || "";
    const matchesSearch =
      !messageSearch ||
      senderName.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Filtered donations
  const filteredDonations = donations.filter((don) => {
    const query = donationSearch.toLowerCase();
    const donorName = don.donor_name || (don as any).donorName || "";
    const donorEmail = don.donor_email || (don as any).donorEmail || "";
    return (
      !donationSearch ||
      don.reference.toLowerCase().includes(query) ||
      donorName.toLowerCase().includes(query) ||
      donorEmail.toLowerCase().includes(query)
    );
  });

  // ── 1. LOADING SCREEN ───────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen gz-grid-bg flex items-center justify-center p-6 text-[#210901]">
        <div className="bg-white p-8 rounded-[24px] border-2 border-[#210901] shadow-[6px_6px_0px_#210901] flex items-center gap-4">
          <RefreshCw className="animate-spin text-[#e62129]" size={28} />
          <span className="font-bold text-lg">Verifying session...</span>
        </div>
      </div>
    );
  }

  // ── 2. LOGIN SCREEN (UNAUTHENTICATED) ──────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gz-grid-bg flex flex-col justify-between py-12 px-6 font-['Instrument_Sans',sans-serif] text-[#210901]">
        {/* Top bar */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between mb-8">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 font-bold text-sm bg-white px-4 py-2 rounded-[12px] border-2 border-[#210901] shadow-[2px_2px_0px_#210901] hover:bg-[#fff4ef] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Main Website</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="max-w-md w-full mx-auto bg-white rounded-[28px] border-2 border-[#210901] shadow-[8px_8px_0px_#210901] p-8 sm:p-10 relative">
          <div className="size-16 rounded-[18px] bg-[#d7f741] border-2 border-[#210901] flex items-center justify-center mb-6 shadow-[3px_3px_0px_#210901]">
            <ShieldCheck size={32} className="text-[#210901]" />
          </div>

          <h1
            className="text-[32px] sm:text-[38px] leading-tight text-[#210901] m-0 mb-2"
            style={{ fontFamily: "'Gasoek One', sans-serif" }}
          >
            Admin Portal
          </h1>
          <p className="text-sm text-[#210901]/75 mb-6">
            Sign in to manage contact inquiries, view donation logs, and edit content via Tina CMS.
          </p>

          {loginError && (
            <div className="mb-6 p-4 rounded-[14px] bg-[#fee2e2] border-2 border-[#ef4444] text-[#991b1b] text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider block mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#210901]/50" />
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[#faf8f5] border-2 border-[#210901] text-sm text-[#210901] focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#210901]/50" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-[#faf8f5] border-2 border-[#210901] text-sm text-[#210901] focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full mt-4 py-3.5 px-6 rounded-[14px] bg-[#210901] hover:bg-[#341205] text-white font-bold text-base shadow-[4px_4px_0px_#fbb222] transition-transform active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmittingAuth ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Sign In to Admin</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-[#210901]/50 font-medium">
          © GenZs for Christ, 2026
        </div>
      </div>
    );
  }

  // ── 3. AUTHENTICATED ADMIN DASHBOARD ─────────────────────────────────────────
  return (
    <div className="min-h-screen gz-grid-bg font-['Instrument_Sans',sans-serif] text-[#210901] flex flex-col selection:bg-[#d7f741]">
      {/* ── Top Navigation Bar ── */}
      <header className="w-full bg-[#210901] text-white border-b-2 border-[#210901] sticky top-0 z-30 px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-[10px] bg-[#d7f741] border border-white/20 flex items-center justify-center text-[#210901] font-black text-lg">
            GZ
          </div>
          <div>
            <h1
              className="text-lg sm:text-xl text-white leading-none m-0 uppercase tracking-tight"
              style={{ fontFamily: "'Gasoek One', sans-serif" }}
            >
              GZC Admin
            </h1>
            <span className="text-[11px] text-white/60 font-mono">
              {currentUserEmail}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Direct Link to Tina CMS */}
          <a
            href="/admin/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#fbb222] text-[#210901] font-bold text-xs border border-black shadow-[2px_2px_0px_#fff] hover:bg-[#faaa0e] transition-colors"
          >
            <FileEdit size={14} />
            <span>Open Tina CMS</span>
            <ExternalLink size={12} />
          </a>

          {/* Return to Site */}
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Website</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-8 space-y-8">
        {/* ── Stats Overview Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Inquiries */}
          <div className="bg-white rounded-[22px] border-2 border-[#210901] shadow-[5px_5px_0px_#210901] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider">
                Total Inquiries
              </span>
              <div className="size-10 rounded-[12px] bg-[#fff4ef] border border-[#210901] flex items-center justify-center text-[#e62129]">
                <Mail size={20} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black">{stats.totalMessages}</span>
              {stats.newMessages > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[#ef4444] text-white text-xs font-bold animate-pulse">
                  {stats.newMessages} New
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Donations */}
          <div className="bg-white rounded-[22px] border-2 border-[#210901] shadow-[5px_5px_0px_#210901] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider">
                Donation Gifts
              </span>
              <div className="size-10 rounded-[12px] bg-[#d7f741] border border-[#210901] flex items-center justify-center text-[#210901]">
                <Heart size={20} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black">{donations.length}</span>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                {stats.successfulDonationsCount} Verified
              </span>
            </div>
          </div>

          {/* Card 3: Total Funds Raised */}
          <div className="bg-white rounded-[22px] border-2 border-[#210901] shadow-[5px_5px_0px_#210901] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider">
                Funds Raised (NGN)
              </span>
              <div className="size-10 rounded-[12px] bg-[#fbb222] border border-[#210901] flex items-center justify-center text-[#210901]">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-[#210901]">
                ₦{stats.totalDonationsAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Card 4: Tina CMS Gateway */}
          <div className="bg-[#00434a] text-white rounded-[22px] border-2 border-[#210901] shadow-[5px_5px_0px_#210901] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-[#d7f741] tracking-wider">
                Content Management
              </span>
              <div className="size-10 rounded-[12px] bg-white/10 border border-white/20 flex items-center justify-center text-[#d7f741]">
                <FileEdit size={20} />
              </div>
            </div>
            <div>
              <a
                href="/admin/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#d7f741] hover:underline"
              >
                <span>Edit Site with Tina CMS</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* ── Tabs Navigation & Refresh ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#210901]/20 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`px-5 py-2.5 rounded-[14px] font-bold text-sm border-2 border-[#210901] transition-all cursor-pointer ${activeTab === "inquiries"
                ? "bg-[#d7f741] text-[#210901] shadow-[3px_3px_0px_#210901]"
                : "bg-white text-[#210901]/70 hover:bg-[#fff4ef]"
                }`}
            >
              Contact Inquiries ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab("donations")}
              className={`px-5 py-2.5 rounded-[14px] font-bold text-sm border-2 border-[#210901] transition-all cursor-pointer ${activeTab === "donations"
                ? "bg-[#d7f741] text-[#210901] shadow-[3px_3px_0px_#210901]"
                : "bg-white text-[#210901]/70 hover:bg-[#fff4ef]"
                }`}
            >
              Donation Logs ({donations.length})
            </button>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loadingData}
            className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white hover:bg-[#faf8f5] text-[#210901] font-bold text-xs border border-[#210901] shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loadingData ? "animate-spin" : ""} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* ── TAB 1: CONTACT INQUIRIES ─────────────────────────────────────── */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-[20px] border-2 border-[#210901] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-[4px_4px_0px_#210901]">
              {/* Search input */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#210901]/50" />
                <input
                  type="text"
                  placeholder="Search sender name, email, or message keyword..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-[12px] bg-[#faf8f5] border border-[#210901] text-sm text-[#210901] focus:outline-none focus:bg-white"
                />
              </div>

              {/* Status Filter buttons */}
              <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 md:pb-0">
                {(["all", "new", "read", "replied"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMessageStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-[10px] text-xs font-bold capitalize border border-[#210901] cursor-pointer transition-colors ${messageStatusFilter === st
                      ? "bg-[#210901] text-white"
                      : "bg-white text-[#210901] hover:bg-[#faf8f5]"
                      }`}
                  >
                    {st === "new" ? "unread / new" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-[24px] border-2 border-[#210901] shadow-[6px_6px_0px_#210901] overflow-hidden">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center text-[#210901]/60">
                  <Mail size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="font-bold text-base m-0">No inquiries found matching criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#faf8f5] border-b-2 border-[#210901] text-xs font-bold uppercase tracking-wider text-[#210901]/70">
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Sender</th>
                        <th className="p-4">Message Preview</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#210901]/10 text-sm font-medium">
                      {filteredMessages.map((msg) => {
                        const name = msg.name || "Unknown";
                        return (
                          <tr
                            key={msg.id}
                            className={`hover:bg-[#fff4ef]/40 transition-colors ${msg.status === "new" ? "bg-[#fffbeb]/60 font-semibold" : ""
                              }`}
                          >
                            <td className="p-4 pl-6 whitespace-nowrap text-xs text-[#210901]/70 font-mono">
                              {new Date(msg.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-[#210901]">{name}</div>
                              <div className="text-xs text-[#210901]/60">{msg.email}</div>
                            </td>
                            <td className="p-4 max-w-xs truncate text-xs text-[#210901]/80">{msg.message}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${msg.status === "new"
                                  ? "bg-[#fee2e2] text-[#991b1b] border border-[#ef4444]"
                                  : msg.status === "replied"
                                    ? "bg-[#dcfce7] text-[#166534] border border-[#22c55e]"
                                    : "bg-[#f3f4f6] text-[#4b5563] border border-[#9ca3af]"
                                  }`}
                              >
                                {msg.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedMessage(msg)}
                                  title="View Message"
                                  className="p-2 rounded-[8px] bg-white hover:bg-[#d7f741] text-[#210901] border border-[#210901] shadow-sm cursor-pointer transition-colors"
                                >
                                  <Eye size={16} />
                                </button>
                                <a
                                  href={`mailto:${msg.email}?subject=Re: Inquiry from ${encodeURIComponent(
                                    name
                                  )}&body=Hi ${encodeURIComponent(name)},%0D%0A%0D%0A`}
                                  onClick={() => handleStatusChange(msg.id, "replied")}
                                  title="Reply via Email"
                                  className="p-2 rounded-[8px] bg-white hover:bg-[#fbb222] text-[#210901] border border-[#210901] shadow-sm cursor-pointer transition-colors"
                                >
                                  <Send size={16} />
                                </a>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  title="Delete Message"
                                  className="p-2 rounded-[8px] bg-white hover:bg-[#ef4444] hover:text-white text-[#ef4444] border border-[#210901] shadow-sm cursor-pointer transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: DONATION LOGS ─────────────────────────────────────────── */}
        {activeTab === "donations" && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="bg-white rounded-[20px] border-2 border-[#210901] p-4 flex items-center justify-between gap-4 shadow-[4px_4px_0px_#210901]">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#210901]/50" />
                <input
                  type="text"
                  placeholder="Search reference (GZC-...), donor name, or email..."
                  value={donationSearch}
                  onChange={(e) => setDonationSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-[12px] bg-[#faf8f5] border border-[#210901] text-sm text-[#210901] focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Donations Table */}
            <div className="bg-white rounded-[24px] border-2 border-[#210901] shadow-[6px_6px_0px_#210901] overflow-hidden">
              {filteredDonations.length === 0 ? (
                <div className="p-12 text-center text-[#210901]/60">
                  <Heart size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="font-bold text-base m-0">No donations recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#faf8f5] border-b-2 border-[#210901] text-xs font-bold uppercase tracking-wider text-[#210901]/70">
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Reference</th>
                        <th className="p-4">Donor</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4 pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#210901]/10 text-sm font-medium">
                      {filteredDonations.map((don) => {
                        const donorName = don.donor_name || (don as any).donorName || "Kind Partner";
                        const donorEmail = don.donor_email || (don as any).donorEmail || "—";
                        return (
                          <tr key={don.id} className="hover:bg-[#fff4ef]/40 transition-colors">
                            <td className="p-4 pl-6 whitespace-nowrap text-xs text-[#210901]/70 font-mono">
                              {new Date(don.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="p-4 font-mono text-xs font-bold text-[#210901]">
                              {don.reference}
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-[#210901]">{donorName}</div>
                              <div className="text-xs text-[#210901]/60">{donorEmail}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap font-bold text-base text-[#210901]">
                              ₦{Number(don.amount).toLocaleString()}
                            </td>
                            <td className="p-4 pr-6 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${don.status === "success"
                                  ? "bg-[#dcfce7] text-[#166534] border border-[#22c55e]"
                                  : don.status === "failed"
                                    ? "bg-[#fee2e2] text-[#991b1b] border border-[#ef4444]"
                                    : "bg-[#fffbeb] text-[#92400e] border border-[#f59e0b]"
                                  }`}
                              >
                                {don.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── View Inquiries Detail Modal ── */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] border-2 border-[#210901] shadow-[10px_10px_0px_#210901] p-6 sm:p-8 max-w-xl w-full relative animate-in fade-in zoom-in duration-200 space-y-6">
            <div className="flex items-center justify-between border-b border-[#210901]/10 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-[#210901]/60 tracking-wider block">
                  Inquiry Details
                </span>
                <h3 className="text-xl font-bold text-[#210901] m-0">
                  Message from {selectedMessage.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-[#210901]/60 hover:text-[#210901] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sender Meta */}
            <div className="bg-[#faf8f5] rounded-[16px] p-4 border border-[#210901]/20 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-[#210901]/70">From:</span>
                <span className="font-bold text-[#210901]">
                  {selectedMessage.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#210901]/70">Email:</span>
                <a href={`mailto:${selectedMessage.email}`} className="font-bold text-[#e62129] hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div className="flex justify-between">
                  <span className="font-semibold text-[#210901]/70">Phone:</span>
                  <span className="font-mono text-[#210901]">{selectedMessage.phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-semibold text-[#210901]/70">Received:</span>
                <span className="text-xs text-[#210901]/70 font-mono">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-bold uppercase text-[#210901]/70 tracking-wider block mb-2">
                Message Content
              </label>
              <div className="p-4 rounded-[16px] bg-[#fff4ef] border border-[#210901]/20 text-[#210901] text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-medium">
                {selectedMessage.message}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {/* Status Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, "read")}
                  className={`px-3 py-1.5 rounded-[10px] text-xs font-bold border border-[#210901] cursor-pointer ${selectedMessage.status === "read" ? "bg-[#210901] text-white" : "bg-white text-[#210901]"
                    }`}
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, "replied")}
                  className={`px-3 py-1.5 rounded-[10px] text-xs font-bold border border-[#210901] cursor-pointer ${selectedMessage.status === "replied" ? "bg-[#210901] text-white" : "bg-white text-[#210901]"
                    }`}
                >
                  Mark Replied
                </button>
              </div>

              {/* Reply via mailto */}
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Inquiry from ${encodeURIComponent(
                  selectedMessage.name
                )}&body=Hi ${encodeURIComponent(
                  selectedMessage.name
                )},%0D%0A%0D%0A`}
                onClick={() => handleStatusChange(selectedMessage.id, "replied")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[#210901] text-white font-bold text-xs shadow-[2px_2px_0px_#fbb222] hover:bg-[#341205] transition-colors"
              >
                <Send size={14} />
                <span>Reply to Sender</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
