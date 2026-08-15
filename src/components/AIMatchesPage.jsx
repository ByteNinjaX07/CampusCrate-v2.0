import { useState } from "react";
import { Sparkles, PackageSearch, RefreshCw, ArrowRight, Zap, CheckCircle2, MapPin, Tag } from "lucide-react";
import { ItemCard } from "./ItemCard";

export const AIMatchesPage = ({
  items = [],
  currentUser,
  loading,
  searchQuery,
  onRefresh,
  onSelectItem,
  onOpenMatch,
  onOpenClaim,
  onOpenQR,
  onReport
}) => {
  const [selectedTargetItem, setSelectedTargetItem] = useState(items[0] || null);

  const filteredItems = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchTag = item.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLoc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-800/40 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Gemini Multimodal AI Matching Radar</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
            Campus AI Match Radar
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Our Gemini AI algorithm computes 4-dimensional confidence scores across photo visual embeddings, title/description semantics, precise campus location proximity, and timeline overlap. Select any item below to run instant cross-match analysis.
          </p>
        </div>
      </div>

      {/* Quick AI Match Launcher Bar */}
      {items.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Interactive Quick Match Radar Simulator
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Pick any target item to test Gemini cross-matching:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenMatch(item)}
                className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
              >
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                />
                <div className="truncate flex-1">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                      item.type === "lost" ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {item.type}
                  </span>
                  <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate mt-0.5">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-rose-400" /> {item.location}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalog Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Active Listings Ready for Cross-Match Comparison ({filteredItems.length})</span>
          </h2>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-900 border border-slate-800 rounded-xl transition-colors"
          title="Reload items"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 mx-auto border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading AI match catalog...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-xl space-y-3">
          <PackageSearch className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Items Available for AI Matching</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Once items are logged into the database, you can select any item to run Gemini AI matching analysis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
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
