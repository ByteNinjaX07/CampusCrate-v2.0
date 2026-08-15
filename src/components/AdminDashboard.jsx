import { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  UserX,
  UserCheck,
  RefreshCw,
  FileText,
  Clock,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { getUserTag, getUserHtmlId } from "../utils/userTag";

export const AdminDashboard = ({
  currentUser,
  onDeleteItem
}) => {
  const [reports, setReports] = useState([]);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reports");
  const [users, setUsers] = useState([
    { id: "user-alex", name: "Alex Rivera", email: "alex.r@university.edu", role: "student_loser", blocked: false, createdAt: "2026-08-01" },
    { id: "user-jordan", name: "Jordan Lee", email: "jordan.l@university.edu", role: "student_finder", blocked: false, createdAt: "2026-08-01" },
    { id: "user-spammer", name: "Crypto Bot 99", email: "spam@external-promo.com", role: "student_loser", blocked: true, createdAt: "2026-08-03" }
  ]);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportsRes, itemsRes, statsRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/items"),
        fetch("/api/stats")
      ]);
      const [reportsData, itemsData, statsData] = await Promise.all([
        reportsRes.json(),
        itemsRes.json(),
        statsRes.json()
      ]);
      setReports(reportsData);
      setItems(itemsData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleBlock = (userId) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, blocked: !u.blocked } : u)));
    setStatusMessage("User account status updated.");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleResetCatalog = async () => {
    if (!window.confirm("Reset catalog back to pristine 12 campus demo items?")) return;
    try {
      const res = await fetch("/api/admin/reset-demo", { method: "POST" });
      const data = await res.json();
      setStatusMessage(`Catalog reset: ${data.itemsCount} items reloaded.`);
      fetchData();
    } catch (err) {
      console.error("Failed to reset catalog:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100">
      {/* Admin Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              Campus Governance & Moderation
            </h1>
            <p className="text-xs text-slate-400">
              Moderator Control Panel • AI Spam Detection & Claims Verification Oversight
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetCatalog}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            title="Reset catalog back to 12 pristine demo campus items"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/items/cleanup-expired", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ daysThreshold: 30 })
                });
                const result = await res.json();
                setStatusMessage(`30-Day Expire Scan Complete: ${result.expiredCount} expired.`);
                fetchData();
              } catch (e) {
                console.error(e);
              }
            }}
            className="px-3.5 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Run Expire Scan</span>
          </button>

          <button
            onClick={fetchData}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Metrics Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-lg">
            <span className="text-xs font-bold text-slate-400">Total Lost Items</span>
            <p className="text-3xl font-black text-rose-400">{stats.totalLost}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-lg">
            <span className="text-xs font-bold text-slate-400">Total Found Items</span>
            <p className="text-3xl font-black text-emerald-400">{stats.totalFound}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-lg">
            <span className="text-xs font-bold text-slate-400">Reclaim Success Rate</span>
            <p className="text-3xl font-black text-cyan-400">{stats.matchRate}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-lg">
            <span className="text-xs font-bold text-slate-400">Pending Flags / Claims</span>
            <p className="text-3xl font-black text-amber-400">
              {stats.pendingReports + stats.pendingClaims}
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "reports"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Flagged Items & Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("items")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "items"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>All Listings ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === "users"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          }`}
        >
          <UserX className="w-3.5 h-3.5" />
          <span>User Safety ({users.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "reports" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-white">Pending Moderation Reports</h3>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
              No reported posts at this time. All campus listings look clean!
            </p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[10px]">
                        {rep.reason}
                      </span>
                      <span className="font-bold text-white">{rep.itemTitle}</span>
                    </div>
                    <p className="text-slate-300">{rep.details}</p>
                    <p className="text-[11px] text-slate-500">
                      Reported by {rep.reporterName} on{" "}
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onDeleteItem(rep.itemId)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "items" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-white">All Active & Historical Listings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-black tracking-wider">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-white">{item.title}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border ${
                          item.type === "lost"
                            ? "text-rose-300 bg-rose-500/20 border-rose-500/30"
                            : "text-emerald-300 bg-emerald-500/20 border-emerald-500/30"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{item.category}</td>
                    <td className="p-3 text-slate-300">{item.location}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">Campus Identity & Account Moderation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Filter fake accounts, verify official .ac.in / .edu student emails, and manage security blocks.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold rounded-xl flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Protection Active
            </span>
          </div>

          <div className="space-y-3">
            {users.map((u) => {
              const isEdu =
                u.email.toLowerCase().endsWith(".ac.in") ||
                u.email.toLowerCase().endsWith(".edu");
              return (
                <div
                  key={u.id}
                  className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{u.name}</span>
                      <span
                        id={getUserHtmlId(u)}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-cyan-300 font-mono font-bold text-[11px] rounded-md flex items-center gap-1"
                        title={`User ID Tag: ${getUserTag(u)}`}
                      >
                        <UserCheck className="w-3 h-3 text-cyan-400" />
                        {getUserTag(u)}
                      </span>
                      {isEdu ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Verified Campus Email (.edu / .ac.in)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                          Personal / Unverified Email
                        </span>
                      )}
                      {u.blocked && (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">
                          BLOCKED ACCOUNT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span>
                        Email: <strong className="text-slate-200">{u.email}</strong>
                      </span>
                      <span>•</span>
                      <span>Registered: {u.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={() => handleToggleBlock(u.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-md transition-colors ${
                        u.blocked
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-rose-600 hover:bg-rose-500 text-white"
                      }`}
                    >
                      {u.blocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      <span>{u.blocked ? "Unblock Account" : "Block User"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
