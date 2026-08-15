import { useState } from "react";
import {
  PackageSearch,
  PlusCircle,
  Bell,
  Sparkles,
  ShieldCheck,
  Search,
  LogIn,
  LogOut,
  UserCheck,
  QrCode
} from "lucide-react";
import { getUserTag, getUserHtmlId } from "../utils/userTag";
import { CampusCrateLogo } from "./CampusCrateLogo";

export const Navbar = ({
  currentUser,
  onUpdateUser,
  onToggleAdmin,
  onGoogleLogin,
  onOpenAuthModal,
  onLogout,
  activeTab,
  setActiveTab,
  onOpenPostModal,
  onOpenNotifications,
  notifications,
  searchQuery,
  setSearchQuery,
  onOpenQRGenerator
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (editName.trim() && editEmail.trim()) {
      onUpdateUser(editName.trim(), editEmail.trim());
      setIsEditingProfile(false);
    }
  };
  return <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {
    /* Logo & Brand */
  }
          <div className="flex items-center cursor-pointer group" onClick={() => setActiveTab("all")}>
            <CampusCrateLogo className="h-10 hover:opacity-95 transition-opacity" />
          </div>

          {
    /* Search Input Bar */
  }
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search by item, campus location, color, brand..."
    className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
  />
          </div>

          {
    /* Center Navigation Tabs */
  }
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
    onClick={() => setActiveTab("all")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${activeTab === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"}`}
  >
              All Items
            </button>
            <button
    onClick={() => setActiveTab("lost")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${activeTab === "lost" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"}`}
  >
              Lost
            </button>
            <button
    onClick={() => setActiveTab("found")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${activeTab === "found" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"}`}
  >
              Found
            </button>
            <button
    onClick={() => setActiveTab("matches")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${activeTab === "matches" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"}`}
  >
              <Sparkles className="w-3.5 h-3.5" /> AI Matches
            </button>
            <button
    onClick={() => setActiveTab("claims")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${activeTab === "claims" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"}`}
  >
              Claims
            </button>
            {currentUser.role === "admin" && <button
    onClick={() => setActiveTab("admin")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-slate-700/40 ${activeTab === "admin" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"}`}
  >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </button>}
          </nav>

          {
    /* Right Action Controls */
  }
          <div className="flex items-center gap-3">

            {
    /* Post Item CTA Button */
  }
            <button
    onClick={onOpenPostModal}
    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
  >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* My Personal QR Recovery Tag Button */}
            {currentUser.authenticated && (
              <button
                onClick={() => onOpenQRGenerator && onOpenQRGenerator(currentUser)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold transition-all shadow-2xs"
                title={`Generate Separate QR Recovery Tag for ${getUserTag(currentUser)}`}
              >
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">My QR Tag</span>
              </button>
            )}

            {
    /* Minimal Auth & User Profile Control on Far Right */
  }
            <div>
              {!currentUser.authenticated ? <button
    onClick={() => onOpenAuthModal ? onOpenAuthModal() : onGoogleLogin()}
    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
    title="Log In to CampusCrate"
  >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button> : <div className="flex items-center gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                  {
    /* User Profile / Options Trigger */
  }
                  <div className="relative">
                    <button
                      id={getUserHtmlId(currentUser)}
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="flex items-center gap-1.5 px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-xs transition-all shadow-2xs"
                      title={`User ID Tag: ${getUserTag(currentUser)}`}
                    >
                      <img
                        src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                        alt={currentUser.name}
                        className="w-5 h-5 rounded-full object-cover border border-slate-300 shrink-0"
                      />
                      <span className="font-semibold text-slate-800 max-w-[100px] truncate">
                        {currentUser.name}
                      </span>
                      <span className="px-1.5 py-0.2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-mono font-bold rounded">
                        {getUserTag(currentUser)}
                      </span>
                      {currentUser.role === "admin" && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-900 text-white uppercase">
                          Admin
                        </span>
                      )}
                    </button>

                    {
    /* User Profile Dropdown */
  }
                    {showRoleDropdown && <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs space-y-3">
                        {isEditingProfile ? <form onSubmit={handleSaveProfile} className="space-y-2.5">
                            <p className="font-bold text-slate-900 border-b border-slate-100 pb-1.5">Edit Profile Info</p>
                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Your Name</label>
                              <input
    type="text"
    value={editName}
    onChange={(e) => setEditName(e.target.value)}
    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="Full Name"
    required
  />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Campus Email</label>
                              <input
    type="email"
    value={editEmail}
    onChange={(e) => setEditEmail(e.target.value)}
    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
    placeholder="email@university.edu"
    required
  />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
    type="button"
    onClick={() => setIsEditingProfile(false)}
    className="px-2.5 py-1 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
  >
                                Cancel
                              </button>
                              <button
    type="submit"
    className="px-3 py-1 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
  >
                                Save
                              </button>
                            </div>
                          </form> : <>
                            <div className="border-b border-slate-100 pb-2.5 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                                  <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-[10px] rounded">
                                    {getUserTag(currentUser)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setEditName(currentUser.name);
                                    setEditEmail(currentUser.email);
                                    setIsEditingProfile(true);
                                  }}
                                  className="text-[11px] text-indigo-600 font-semibold hover:underline"
                                >
                                  Edit
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-500">{currentUser.email || "Campus Account"}</p>
                              {currentUser.institute && <div className="pt-1 flex items-center gap-1.5 text-[11px] text-indigo-700 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                  <span className="truncate">{currentUser.institute}</span>
                                </div>}
                            </div>

                            <div className="pt-1 space-y-1.5">
                              <button
                                onClick={() => {
                                  if (onOpenQRGenerator) onOpenQRGenerator(currentUser);
                                  setShowRoleDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 flex items-center justify-between text-indigo-900 font-semibold transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <QrCode className="w-4 h-4 text-indigo-600" />
                                  <span>My QR Recovery Tag</span>
                                </div>
                                <span className="px-1.5 py-0.5 bg-indigo-600 text-white font-mono font-bold text-[10px] rounded">
                                  {getUserTag(currentUser)}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  onToggleAdmin();
                                  setShowRoleDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-700 font-semibold transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-slate-800" />
                                  <span>Admin Governance Access</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentUser.role === "admin" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                                  {currentUser.role === "admin" ? "ENABLED" : "OFF"}
                                </span>
                              </button>

                              <button
    onClick={() => {
      if (onLogout) onLogout();
      setShowRoleDropdown(false);
    }}
    className="w-full text-left px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-between text-rose-800 font-semibold transition-colors"
  >
                                <div className="flex items-center gap-2">
                                  <LogOut className="w-4 h-4 text-rose-600" />
                                  <span>Log Out</span>
                                </div>
                              </button>
                            </div>
                          </>}
                      </div>}
                  </div>

                  {
    /* Dedicated Logout Button */
  }
                  <button
    onClick={() => {
      if (onLogout) onLogout();
      setShowRoleDropdown(false);
    }}
    className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 text-xs font-semibold rounded-lg transition-all shadow-2xs"
    title="Log Out"
  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>}
            </div>

          </div>

        </div>

        {
    /* Mobile Navigation Bar */
  }
        <div className="flex lg:hidden items-center justify-between p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 my-2 text-xs overflow-x-auto gap-1.5 shadow-2xs">
          <button
    onClick={() => setActiveTab("all")}
    className={`flex-1 min-w-[64px] px-4 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${activeTab === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"}`}
  >
            All
          </button>
          <button
    onClick={() => setActiveTab("lost")}
    className={`flex-1 min-w-[64px] px-4 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${activeTab === "lost" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"}`}
  >
            Lost
          </button>
          <button
    onClick={() => setActiveTab("found")}
    className={`flex-1 min-w-[64px] px-4 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${activeTab === "found" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"}`}
  >
            Found
          </button>
          <button
    onClick={() => setActiveTab("matches")}
    className={`flex-1 min-w-[80px] px-4 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap flex items-center justify-center gap-1 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${activeTab === "matches" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"}`}
  >
            <Sparkles className="w-3.5 h-3.5" /> Matches
          </button>
          <button
    onClick={() => setActiveTab("claims")}
    className={`flex-1 min-w-[64px] px-4 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${activeTab === "claims" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"}`}
  >
            Claims
          </button>
          {currentUser.role === "admin" && <button
    onClick={() => setActiveTab("admin")}
    className={`flex-1 min-w-[64px] px-4 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-slate-700/40 ${activeTab === "admin" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"}`}
  >
              Admin
            </button>}
        </div>

      </div>
    </header>;
};
