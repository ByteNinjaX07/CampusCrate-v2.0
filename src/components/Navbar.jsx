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
  notifications = [],
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

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            className="flex items-center cursor-pointer group select-none"
            onClick={() => setActiveTab("all")}
          >
            <CampusCrateLogo className="h-10 hover:opacity-95 transition-opacity" />
          </div>

          {/* Search Input Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, campus location, color, brand..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-inner"
            />
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-950/50"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab("lost")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "lost"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-950/50"
                  : "text-slate-400 hover:text-rose-300 hover:bg-slate-800"
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "found"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                  : "text-slate-400 hover:text-emerald-300 hover:bg-slate-800"
              }`}
            >
              Found
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "matches"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50"
                  : "text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Matches
            </button>
            <button
              onClick={() => setActiveTab("claims")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "claims"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-950/50"
                  : "text-slate-400 hover:text-amber-300 hover:bg-slate-800"
              }`}
            >
              Claims
            </button>
            {currentUser.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "admin"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Post Item CTA Button */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-cyan-950/40 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* My Personal QR Recovery Tag Button */}
            {currentUser.authenticated && (
              <button
                onClick={() => onOpenQRGenerator && onOpenQRGenerator(currentUser)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 rounded-xl text-xs font-bold transition-all"
                title={`Generate Smart QR Recovery Tag for ${getUserTag(currentUser)}`}
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>My QR Tag</span>
              </button>
            )}

            {/* Minimal Auth & User Profile Control */}
            <div>
              {!currentUser.authenticated ? (
                <button
                  onClick={() => (onOpenAuthModal ? onOpenAuthModal() : onGoogleLogin())}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all"
                  title="Log In to CampusCrate"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>Login</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
                  {/* User Profile / Options Trigger */}
                  <div className="relative">
                    <button
                      id={getUserHtmlId(currentUser)}
                      onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                      className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs transition-all"
                      title={`User ID Tag: ${getUserTag(currentUser)}`}
                    >
                      <img
                        src={
                          currentUser.avatarUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                        }
                        alt={currentUser.name}
                        className="w-5 h-5 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <span className="font-bold text-slate-200 max-w-[90px] truncate hidden sm:inline">
                        {currentUser.name}
                      </span>
                      <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-cyan-300 text-[10px] font-mono font-bold rounded">
                        {getUserTag(currentUser)}
                      </span>
                    </button>

                    {/* User Profile Dropdown */}
                    {showRoleDropdown && (
                      <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3 text-slate-100">
                        {isEditingProfile ? (
                          <form onSubmit={handleSaveProfile} className="space-y-3">
                            <p className="font-bold text-white border-b border-slate-800 pb-2">
                              Edit Profile Info
                            </p>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                Your Name
                              </label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                                Campus Email
                              </label>
                              <input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                              />
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="px-3 py-1.5 text-slate-400 bg-slate-800 rounded-xl hover:bg-slate-700 font-medium"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-black rounded-xl hover:bg-cyan-400"
                              >
                                Save
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="border-b border-slate-800 pb-3 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-white">{currentUser.name}</p>
                                  <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-cyan-300 font-mono font-bold text-[10px] rounded">
                                    {getUserTag(currentUser)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    setEditName(currentUser.name);
                                    setEditEmail(currentUser.email);
                                    setIsEditingProfile(true);
                                  }}
                                  className="text-[11px] text-cyan-400 font-bold hover:underline"
                                >
                                  Edit
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {currentUser.email || "Campus Account"}
                              </p>
                            </div>

                            <div className="pt-1 space-y-1.5">
                              <button
                                onClick={() => {
                                  if (onOpenQRGenerator) onOpenQRGenerator(currentUser);
                                  setShowRoleDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-200 font-bold transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <QrCode className="w-4 h-4 text-cyan-400" />
                                  <span>My QR Recovery Tag</span>
                                </div>
                                <span className="px-1.5 py-0.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-[10px] rounded">
                                  {getUserTag(currentUser)}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  onToggleAdmin();
                                  setShowRoleDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 font-medium transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                  <span>Admin Mode</span>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    currentUser.role === "admin"
                                      ? "bg-indigo-600 text-white"
                                      : "bg-slate-800 text-slate-400"
                                  }`}
                                >
                                  {currentUser.role === "admin" ? "ENABLED" : "OFF"}
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  if (onLogout) onLogout();
                                  setShowRoleDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-between text-rose-300 font-bold transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <LogOut className="w-4 h-4 text-rose-400" />
                                  <span>Log Out</span>
                                </div>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden items-center justify-between p-1.5 bg-slate-900 rounded-2xl border border-slate-800 my-2 text-xs overflow-x-auto gap-1.5">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 min-w-[56px] px-3 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === "all"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("lost")}
            className={`flex-1 min-w-[56px] px-3 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === "lost"
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-400 hover:text-rose-300"
            }`}
          >
            Lost
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`flex-1 min-w-[56px] px-3 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === "found"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-emerald-300"
            }`}
          >
            Found
          </button>
          <button
            onClick={() => setActiveTab("matches")}
            className={`flex-1 min-w-[72px] px-3 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap flex items-center justify-center gap-1 transition-all ${
              activeTab === "matches"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-cyan-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Matches
          </button>
          <button
            onClick={() => setActiveTab("claims")}
            className={`flex-1 min-w-[64px] px-3 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === "claims"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-400 hover:text-amber-300"
            }`}
          >
            Claims
          </button>
          {currentUser.role === "admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 min-w-[64px] px-3 py-2 rounded-xl text-center font-bold text-xs whitespace-nowrap transition-all ${
                activeTab === "admin"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
