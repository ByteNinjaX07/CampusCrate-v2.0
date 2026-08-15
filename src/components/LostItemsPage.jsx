import { useState } from "react";
import {
  PackageSearch,
  AlertCircle,
  PlusCircle,
  RefreshCw,
  Filter,
  LayoutGrid,
  List,
  ArrowUpDown,
  MapPin,
  Sparkles,
  QrCode
} from "lucide-react";
import { ItemCard } from "./ItemCard";

const CATEGORIES = [
  "all",
  "Electronics",
  "Keys & Cards",
  "Bags & Backpacks",
  "Clothing & Accessories",
  "Books & Notebooks",
  "Other"
];

export const LostItemsPage = ({
  items = [],
  currentUser,
  loading,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenPostLost,
  onRefresh,
  onSelectItem,
  onOpenMatch,
  onOpenClaim,
  onOpenQR,
  onReport
}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const lostItems = items
    .filter((item) => {
      if (item.type !== "lost") return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchLoc && !matchTag) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border border-rose-900/40 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Dedicated Campus Lost Items Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            Lost Belongings on Campus
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Browse items reported missing across campus halls, libraries, and facilities. If you lost an item, submit a detailed report so our AI engine can auto-match it when someone finds it.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPostLost}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-950/60 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Report Missing Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1 uppercase">
            <Filter className="w-3.5 h-3.5 text-rose-400" /> Filter:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/50"
                  : "bg-slate-950/70 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {cat === "all" ? "All Lost" : cat}
            </button>
          ))}
        </div>

        {/* Sort & Views */}
        <div className="flex items-center gap-3 justify-between md:justify-end flex-wrap">
          <span className="text-xs font-bold bg-rose-500/20 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-xl">
            {lostItems.length} Lost Listed
          </span>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900">Newest</option>
              <option value="oldest" className="bg-slate-900">Oldest</option>
              <option value="title" className="bg-slate-900">Title</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Grid, Table or Empty */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 mx-auto border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading lost items...</p>
        </div>
      ) : lostItems.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-xl space-y-3">
          <PackageSearch className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No lost items match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Have you lost something? Submit a report now to let the campus community assist you.
          </p>
          <button
            onClick={onOpenPostLost}
            className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            + Report Lost Item
          </button>
        </div>
      ) : viewMode === "list" ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Campus Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lostItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-100 line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-300">{item.category}</td>
                    <td className="py-3 px-4 font-medium text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        {item.location}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onOpenMatch(item)}
                          className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 transition-colors"
                          title="Run AI Match"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenQR(item)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                          title="QR Tag"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lostItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              currentUser={currentUser}
              onSelect={onSelectItem}
              onOpenMatch={onOpenMatch}
              onOpenClaim={onOpenClaim}
              onOpenQR={onOpenQR}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </div>
  );
};
