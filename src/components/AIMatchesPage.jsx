import { Sparkles, PackageSearch, RefreshCw } from "lucide-react";
import { ItemCard } from "./ItemCard";
export const AIMatchesPage = ({
  items,
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
  const filteredItems = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLoc && !matchTag) return false;
    }
    return true;
  });
  return <div className="space-y-6">
      {
    /* Page Header Banner */
  }
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Gemini AI Intelligent Match Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            AI Match Radar
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            Click <strong className="text-indigo-300 font-bold">"AI Match Radar"</strong> on any listed item below. Gemini AI compares item photo attributes, lost/found descriptions, exact campus timestamps, and locations to compute percentage similarity match confidence scores.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Active Listings Ready for AI Comparison</span>
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold">
            {filteredItems.length}
          </span>
        </div>

        <button
    onClick={onRefresh}
    className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
    title="Reload items"
  >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading AI match catalog...</p>
        </div> : filteredItems.length === 0 ? <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-3">
          <PackageSearch className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Items to Run AI Matches</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Once items are logged into the database, you can select any item to run Gemini AI matching analysis.
          </p>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => <ItemCard
    key={item.id}
    item={item}
    currentUser={currentUser}
    onSelect={onSelectItem}
    onOpenMatch={onOpenMatch}
    onOpenClaim={onOpenClaim}
    onOpenQR={onOpenQR}
    onReport={onReport}
  />)}
        </div>}
    </div>;
};
