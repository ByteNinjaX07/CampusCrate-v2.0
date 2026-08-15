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
  Clock
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
    setUsers(users.map((u) => u.id === userId ? { ...u, blocked: !u.blocked } : u));
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">

      {
    /* Admin Title Header */
  }
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950 flex items-center gap-2">
              Campus Governance & Moderation Portal
            </h1>
            <p className="text-xs text-slate-500">Moderator Control Panel • AI Spam Detection & Claims Safety</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
    onClick={async () => {
      try {
        const res = await fetch("/api/items/cleanup-expired", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ daysThreshold: 30 })
        });
        const result = await res.json();
        alert(`30-Day Inactivity Scan Complete!

- Expired items: ${result.expiredCount}
- Archived items: ${result.archivedCount}
- Remaining Active items: ${result.activeItems}`);
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }}
    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
    title="Scan items older than 30 days and mark them as expired to prevent feed clutter"
  >
            <Clock className="w-3.5 h-3.5" />
            <span>Run 30-Day Expire Scan</span>
          </button>

          <button
    onClick={fetchData}
    className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
  >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {
    /* Metrics Grid */
  }
      {stats && <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Total Lost Items</span>
            <p className="text-2xl font-bold text-rose-600">{stats.totalLost}</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Total Found Items</span>
            <p className="text-2xl font-bold text-emerald-600">{stats.totalFound}</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Reclaim Success Rate</span>
            <p className="text-2xl font-bold text-indigo-600">{stats.matchRate}%</p>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Pending Flags / Claims</span>
            <p className="text-2xl font-bold text-amber-600">{stats.pendingReports + stats.pendingClaims}</p>
          </div>
        </div>}

      {
    /* Tab Navigation */
  }
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
    onClick={() => setActiveTab("reports")}
    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === "reports" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Flagged Items & Reports ({reports.length})</span>
        </button>

        <button
    onClick={() => setActiveTab("items")}
    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === "items" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
          <FileText className="w-3.5 h-3.5" />
          <span>All Listings ({items.length})</span>
        </button>

        <button
    onClick={() => setActiveTab("users")}
    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === "users" ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
  >
          <UserX className="w-3.5 h-3.5" />
          <span>User Accounts & Safety</span>
        </button>
      </div>

      {
    /* Tab Content */
  }
      {activeTab === "reports" && <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950">Pending Moderation Reports</h3>

          {reports.length === 0 ? <p className="text-xs text-slate-500 py-6 text-center">No reported posts at this time. All campus posts look clean!</p> : <div className="space-y-3">
              {reports.map((rep) => <div key={rep.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                        {rep.reason}
                      </span>
                      <span className="font-bold text-slate-900">{rep.itemTitle}</span>
                    </div>
                    <p className="text-slate-700">{rep.details}</p>
                    <p className="text-[11px] text-slate-500">Reported by {rep.reporterName} on {new Date(rep.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
    onClick={() => onDeleteItem(rep.itemId)}
    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-colors"
  >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Item
                    </button>
                  </div>
                </div>)}
            </div>}
        </div>}

      {activeTab === "items" && <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950">All Active & Historical Listings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-950">{item.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.type === "lost" ? "text-rose-700 bg-rose-50 border border-rose-200" : "text-emerald-700 bg-emerald-50 border border-emerald-200"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{item.category}</td>
                    <td className="p-3 text-slate-700">{item.location}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
    onClick={() => onDeleteItem(item.id)}
    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
    title="Delete listing"
  >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}

      {activeTab === "users" && <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-950">Campus Identity & Account Moderation</h3>
              <p className="text-xs text-slate-500 mt-0.5">Filter fake accounts, verify official .ac.in / .edu student emails, and manage security blocks.</p>
            </div>
            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Identity Protection Active
            </span>
          </div>

          <div className="space-y-3">
            {users.map((u) => {
    const isEdu = u.email.toLowerCase().endsWith(".ac.in") || u.email.toLowerCase().endsWith(".edu");
    return <div key={u.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-950 text-sm">{u.name}</span>
                      <span
                        id={getUserHtmlId(u)}
                        className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-bold text-[11px] rounded-md shadow-2xs flex items-center gap-1"
                        title={`User ID Tag: ${getUserTag(u)}`}
                      >
                        <UserCheck className="w-3 h-3 text-indigo-600" />
                        {getUserTag(u)}
                      </span>
                      {isEdu ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified Campus Email (.ac.in/.edu)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200">
                          Personal Email / Unverified ID
                        </span>
                      )}
                      {u.blocked && <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                          BLOCKED FAKE/SPAM ACCOUNT
                        </span>}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>Email: <strong className="text-slate-700">{u.email}</strong></span>
                      <span>•</span>
                      <span>Registered: {u.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
      onClick={() => handleToggleBlock(u.id)}
      className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1 shadow-sm transition-colors ${u.blocked ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"}`}
    >
                      {u.blocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      <span>{u.blocked ? "Unblock Account" : "Block Suspicious User"}</span>
                    </button>
                  </div>
                </div>;
  })}
          </div>
        </div>}

    </div>;
};
