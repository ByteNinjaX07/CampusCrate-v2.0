import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { AllItemsPage } from "./components/AllItemsPage";
import { LostItemsPage } from "./components/LostItemsPage";
import { FoundItemsPage } from "./components/FoundItemsPage";
import { AIMatchesPage } from "./components/AIMatchesPage";
import { ClaimsPage } from "./components/ClaimsPage";
import { ItemDetailModal } from "./components/ItemDetailModal";
import { PostItemModal } from "./components/PostItemModal";
import { AIMatchModal } from "./components/AIMatchModal";
import { ClaimModal } from "./components/ClaimModal";
import { MessagingDrawer } from "./components/MessagingDrawer";
import { QRCodeModal } from "./components/QRCodeModal";
import { NotificationDrawer } from "./components/NotificationDrawer";
import { ReportModal } from "./components/ReportModal";
import { AuthModal } from "./components/AuthModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { PackageSearch } from "lucide-react";
export default function App() {
  const [currentUser, setCurrentUser] = useState({
    id: "guest-user",
    name: "Guest User",
    email: "",
    authenticated: false,
    role: "student_loser",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    blocked: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    activePosts: 0,
    matchRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postModalType, setPostModalType] = useState("lost");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPostType, setPendingPostType] = useState(null);
  const [itemForMatch, setItemForMatch] = useState(null);
  const [itemForClaim, setItemForClaim] = useState(null);
  const [activeClaimForMessaging, setActiveClaimForMessaging] = useState(null);
  const [itemForQR, setItemForQR] = useState(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [itemForReport, setItemForReport] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("campuscrate_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved user:", e);
      }
    }
  }, []);
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchClaims = async () => {
    try {
      const res = await fetch(`/api/claims?userId=${currentUser.id}`);
      const data = await res.json();
      setClaims(data);
    } catch (err) {
      console.error("Failed to load claims:", err);
    }
  };
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${currentUser.id}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats({
        totalLost: data.totalLost,
        totalFound: data.totalFound,
        activePosts: data.activePosts,
        matchRate: data.matchRate
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };
  useEffect(() => {
    fetchItems();
    fetchClaims();
    fetchNotifications();
    fetchStats();
  }, [currentUser]);
  const handleUpdateUser = (name, email) => {
    setCurrentUser((prev) => ({ ...prev, name, email }));
  };
  const handleLogout = () => {
    localStorage.removeItem("campuscrate_user");
    setCurrentUser({
      id: "guest-user",
      name: "Guest User",
      email: "",
      authenticated: false,
      role: "student_loser",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      blocked: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
  };
  const handleToggleAdmin = () => {
    setCurrentUser((prev) => ({
      ...prev,
      role: prev.role === "admin" ? "student_loser" : "admin"
    }));
  };
  useEffect(() => {
    const handleMessage = (event) => {
      const origin = event.origin;
      if (!origin.endsWith(".run.app") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
        return;
      }
      if (event.data?.type === "OAUTH_AUTH_SUCCESS" && event.data?.user) {
        const uEmail = event.data.user.email || "";
        const isEduDomain = uEmail.toLowerCase().endsWith(".ac.in") || uEmail.toLowerCase().endsWith(".edu") || uEmail.toLowerCase().endsWith(".edu.in") || uEmail.toLowerCase().endsWith(".res.in");
        const authedUser = {
          ...event.data.user,
          authenticated: true,
          authProvider: "google",
          isDomainVerified: isEduDomain,
          verificationStatus: isEduDomain ? "verified_edu" : "unverified"
        };
        setCurrentUser(authedUser);
        localStorage.setItem("campuscrate_user", JSON.stringify(authedUser));
        if (pendingPostType) {
          setPostModalType(pendingPostType);
          setShowPostModal(true);
          setPendingPostType(null);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [pendingPostType]);
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch("/api/auth/url");
      if (!response.ok) {
        throw new Error("Failed to fetch authentication URL");
      }
      const { url } = await response.json();
      const popup = window.open(url, "google_oauth_popup", "width=520,height=680");
      if (!popup) {
        alert("Please allow popups for this browser window to complete Google Sign-In.");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      alert("Unable to initiate Google Auth flow.");
    }
  };
  const handleOpenPostModal = (type) => {
    if (!currentUser.authenticated) {
      setPendingPostType(type);
      setShowAuthModal(true);
    } else {
      setPostModalType(type);
      setShowPostModal(true);
    }
  };
  const handleLoginSuccess = (user) => {
    const authedUser = { ...user, authenticated: true };
    setCurrentUser(authedUser);
    localStorage.setItem("campuscrate_user", JSON.stringify(authedUser));
    setShowAuthModal(false);
    if (pendingPostType) {
      setPostModalType(pendingPostType);
      setShowPostModal(true);
      setPendingPostType(null);
    }
  };
  const handleItemPosted = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
    fetchStats();
    setItemForMatch(newItem);
  };
  const handleClaimSubmitted = (newClaim) => {
    setClaims((prev) => [newClaim, ...prev]);
    setActiveClaimForMessaging(newClaim);
  };
  const handleClaimStatusChange = async (claimId, status) => {
    try {
      const res = await fetch(`/api/claims/${claimId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updatedClaim = await res.json();
        setClaims((prev) => prev.map((c) => c.id === claimId ? updatedClaim : c));
        if (activeClaimForMessaging?.id === claimId) {
          setActiveClaimForMessaging(updatedClaim);
        }
        fetchItems();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to update claim status:", err);
    }
  };
  const handleDeleteItem = async (itemId) => {
    try {
      await fetch(`/api/items/${itemId}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      fetchStats();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };
  const handleMarkNotificationsRead = async () => {
    await fetch("/api/notifications/read", { method: "POST" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  return <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">

      {
    /* Main App Navigation */
  }
      <Navbar
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onToggleAdmin={handleToggleAdmin}
        onGoogleLogin={handleGoogleLogin}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => handleOpenPostModal("lost")}
        onOpenNotifications={() => setShowNotificationsDrawer(true)}
        notifications={notifications}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenQRGenerator={() => setShowQRGenerator(true)}
      />

      {
    /* Main Page Layout */
  }
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {
    /* View Switcher: Distinct React Page Component for Each Tab */
  }
        {activeTab === "all" && <AllItemsPage
    items={items}
    currentUser={currentUser}
    loading={loading}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    stats={stats}
    onOpenPostLost={() => handleOpenPostModal("lost")}
    onOpenPostFound={() => handleOpenPostModal("found")}
    onOpenQRGenerator={() => setShowQRGenerator(true)}
    onRefresh={fetchItems}
    onSelectItem={setSelectedItemForDetail}
    onOpenMatch={setItemForMatch}
    onOpenClaim={setItemForClaim}
    onOpenQR={setItemForQR}
    onReport={setItemForReport}
  />}

        {activeTab === "lost" && <LostItemsPage
    items={items}
    currentUser={currentUser}
    loading={loading}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    onOpenPostLost={() => handleOpenPostModal("lost")}
    onRefresh={fetchItems}
    onSelectItem={setSelectedItemForDetail}
    onOpenMatch={setItemForMatch}
    onOpenClaim={setItemForClaim}
    onOpenQR={setItemForQR}
    onReport={setItemForReport}
  />}

        {activeTab === "found" && <FoundItemsPage
    items={items}
    currentUser={currentUser}
    loading={loading}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    onOpenPostFound={() => handleOpenPostModal("found")}
    onRefresh={fetchItems}
    onSelectItem={setSelectedItemForDetail}
    onOpenMatch={setItemForMatch}
    onOpenClaim={setItemForClaim}
    onOpenQR={setItemForQR}
    onReport={setItemForReport}
  />}

        {activeTab === "matches" && <AIMatchesPage
    items={items}
    currentUser={currentUser}
    loading={loading}
    searchQuery={searchQuery}
    onRefresh={fetchItems}
    onSelectItem={setSelectedItemForDetail}
    onOpenMatch={setItemForMatch}
    onOpenClaim={setItemForClaim}
    onOpenQR={setItemForQR}
    onReport={setItemForReport}
  />}

        {activeTab === "claims" && <ClaimsPage
    claims={claims}
    onOpenThreadChat={setActiveClaimForMessaging}
  />}

        {activeTab === "admin" && <AdminDashboard currentUser={currentUser} onDeleteItem={handleDeleteItem} />}

      </main>

      {
    /* Footer */
  }
      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PackageSearch className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">CampusCrate AI</span>
            <span>• College Lost & Found System</span>
          </div>
          <p>© 2026 CampusCrate • Powered by Google Gemini 3.6 Flash</p>
        </div>
      </footer>

      {
    /* --- ACTIVE MODAL LAYERS --- */
  }

      {
    /* Mandatory Auth Modal */
  }
      <AuthModal
    isOpen={showAuthModal}
    onClose={() => setShowAuthModal(false)}
    onLoginSuccess={handleLoginSuccess}
    onGoogleLoginPopup={handleGoogleLogin}
    reasonMessage="Google or Campus Email authentication is mandatory before reporting lost or found items on campus."
  />

      {
    /* Post Modal */
  }
      {showPostModal && <PostItemModal
    initialType={postModalType}
    currentUser={currentUser}
    onClose={() => setShowPostModal(false)}
    onItemPosted={handleItemPosted}
    onRequireAuth={() => setShowAuthModal(true)}
  />}

      {
    /* Item Detail Modal */
  }
      {selectedItemForDetail && <ItemDetailModal
    item={selectedItemForDetail}
    currentUser={currentUser}
    claims={claims}
    onClose={() => setSelectedItemForDetail(null)}
    onOpenMatch={setItemForMatch}
    onOpenClaim={setItemForClaim}
    onOpenQR={setItemForQR}
    onReport={setItemForReport}
    onOpenThreadChat={setActiveClaimForMessaging}
  />}

      {
    /* Gemini AI Match Modal */
  }
      {itemForMatch && <AIMatchModal
    item={itemForMatch}
    currentUser={currentUser}
    onClose={() => setItemForMatch(null)}
    onInitiateClaim={setItemForClaim}
  />}

      {
    /* Claim Form Modal */
  }
      {itemForClaim && <ClaimModal
    item={itemForClaim}
    currentUser={currentUser}
    onClose={() => setItemForClaim(null)}
    onClaimSubmitted={handleClaimSubmitted}
  />}

      {
    /* Thread Chat Messaging Drawer */
  }
      {activeClaimForMessaging && <MessagingDrawer
    claim={activeClaimForMessaging}
    currentUser={currentUser}
    onClose={() => setActiveClaimForMessaging(null)}
    onStatusChange={handleClaimStatusChange}
  />}

      {
    /* Printable QR Code Modal */
  }
      {(itemForQR || showQRGenerator) && <QRCodeModal
    item={itemForQR}
    currentUser={currentUser}
    onClose={() => {
      setItemForQR(null);
      setShowQRGenerator(false);
    }}
  />}

      {
    /* Notifications Drawer */
  }
      {showNotificationsDrawer && <NotificationDrawer
    notifications={notifications}
    onClose={() => setShowNotificationsDrawer(false)}
    onMarkRead={handleMarkNotificationsRead}
    onOpenMatchForId={(itemId) => {
      const found = items.find((i) => i.id === itemId);
      if (found) setItemForMatch(found);
    }}
  />}

      {
    /* Report Modal */
  }
      {itemForReport && <ReportModal
    item={itemForReport}
    currentUser={currentUser}
    onClose={() => setItemForReport(null)}
    onReportSubmitted={() => {
      fetchItems();
    }}
  />}

    </div>;
}
